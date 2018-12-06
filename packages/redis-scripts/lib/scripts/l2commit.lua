-- Utils

local L = require "modules/helpers"

local scale = require "modules/scale"
local command = require "modules/command"

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

  local suffix = offset + 1
  return seed.."-"..suffix
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

local rev_x = command "GET" "data:rev"

-- parse args

local xfrom = ARGV[1] or next_rev_of(rev_x) or '0-0'
local xto   = ARGV[2] or "+"

--

local tear_down = function ()
  command "DEL" "data:bids"
  command "DEL" "data:asks"
  command "DEL" "data:rev"
end

local pull = function ()
  local res = command "XRANGE" "journal" (xfrom, xto)

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

  local push = L.insert_into(members)

  for price, amount in pairs(data) do
    push(amount, scale.convert(price))
  end

  local key = "data:"..side

  command "ZADD" (key) (members)
  command "ZREMRANGEBYSCORE" (key) ("-inf", 0)
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

command "SET" "data:rev" (rev)

return rev
