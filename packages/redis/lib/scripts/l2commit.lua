-- Constants

local SCALING_FACTOR = 100000000

-- Utils

local join_by = function (split)
  return function (tbl)
    return table.concat(tbl, split)
  end
end

local insert_into = function (tbl)
  return function (...)
    for i = 1, #arg do
      table.insert(tbl, arg[i])
    end
  end
end

local is_table = function (x)
  return type(x) == "table"
end

local flatten = function (tbl)
  local out = {}

  local push = insert_into(out)

  local function f (t)
    for i = 1, #t do
      local v = t[i]
      if is_table(v) then f(v) else push(v) end
    end
  end

  f(tbl)

  return out
end

--

local function keyfor (sub)
  return join_by ":" { KEYS[1], sub }
end

local function scaled (x)
  return tonumber(x) * SCALING_FACTOR
end

-- Redis helpers

local function command (cmd)
  cmd = string.lower(cmd)

  local is_unary = false
    or cmd == "get"
    or cmd == "del"

  return function (sub)
    local key = keyfor(sub)

    if is_unary then
      return redis.call(cmd, key)
    end

    return function (...)
      local params = flatten(arg)
      return redis.call(cmd, key, unpack(params))
    end
  end
end

--

local split_rev = function (rev)
  local split = string.find(rev, "-")

  local seed = string.sub(rev, 1, split - 1)
  local offset = string.sub(rev, split + 1)

  return tonumber(seed), tonumber(offset)
end

local next_rev_of = function (rev)
  if not rev then return nil end

  local seed, offset = split_rev(rev)

  return join_by "-" { seed, offset + 1 }
end

local entry_from = function (arr)
  local entry = {}

  for i = 1, #arr, 2 do
    local k = arr[i]
    local v = arr[i + 1]

    entry[k] = v
  end

  return entry
end

-- parse env data

local rev_x = command "GET" "rev"

-- parse args

local xfrom = ARGV[1] or next_rev_of(rev_x) or '0-0'
local xto   = ARGV[2] or "+"

--

local tear_down = function ()
  command "DEL" "bids"
  command "DEL" "asks"
  command "DEL" "rev"
end

local pull = function ()
  local res = command "XRANGE" "log" (xfrom, xto)

  if not res then
    return nil, nil
  end

  local revs = {}
  local entries = {}

  for _, v in pairs(res) do
    revs[#revs + 1]       = v[1]["ok"]
    entries[#entries + 1] = entry_from(v[2])
  end

  return entries, revs
end

local commit = function (side, data)
  -- if empty for a side
  if next(data) == nil then return nil end

  local members = {}

  local push = insert_into(members)

  for price, amount in pairs(data) do
    push(amount, scaled(price))
  end

  command "ZADD" (side) (members)
  command "ZREMRANGEBYSCORE" (side) ("-inf", 0)
end

--

local entries, revs = pull()

if not entries then
  return nil
end

-- Mess

local rev_prev = rev_x

local nth = nil

for i, r in pairs(revs) do
  local seed, offset = split_rev(r)

  if not rev_prev and offset == 1 then
    nth = i
    rev_prev = r
  elseif rev_prev then
    local seed_prev, offset_prev = split_rev(rev_prev)

    local is_next = r == next_rev_of(rev_prev)
    local is_next_seed = seed > seed_prev and offset == 1

    if is_next then
      if not nth then nth = i end
      rev_prev = r
    elseif is_next_seed then
      nth = i
      rev_prev = r
      tear_down()
    end
  end
end

--

if not nth then return nil end

--

local bids = {}
local asks = {}

for i = nth, #entries do
  local entry = entries[i]

  if entry.side == "bids" then
    bids[entry.price] = entry.amount
  else
    asks[entry.price] = entry.amount
  end
end

commit("bids", bids)
commit("asks", asks)

--

local rev = revs[#revs]

command "SET" "rev" (rev)

return rev
