local get = function (key)
  return redis.call("GET", key)
end

local set = function (key, val)
  return redis.call("SET", key, val)
end

local xrange = function (key, from, to)
  from = from or "0-0"
  to = to or "+"
  return redis.call("XRANGE", key, from, to)
end

local zadd = function (key, ...)
  return redis.call("ZADD", key, unpack(arg))
end

--

local prefixed = function (sub)
  local PREFIX = "ob"
  local TOPIC  = KEYS[1]

  return table.concat({ PREFIX, TOPIC, sub }, ":")
end

local split_rev = function (rev)
  local split = string.find(rev, "-")

  local seed = string.sub(rev, 1, split - 1)
  local offset = string.sub(rev, split + 1)

  return tonumber(seed), tonumber(offset)
end

local next_rev_of = function (rev)
  if not rev then return nil end

  local seed, offset = split_rev(rev)
  return table.concat({ seed, offset + 1 }, '-')
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

--

local rev_x = get(prefixed "agg:rev")

local tear_down = function ()
  local keys = {
    prefixed "agg:bids",
    prefixed "agg:asks",
    prefixed "agg:rev"
  }

  return redis.call("DEL", unpack(keys))
end

local pull = function ()
  redis.debug(rev_x)

  local from = ARGV[1] or next_rev_of(rev_x) or '0-0'
  local to   = ARGV[2]

  local res = xrange(prefixed "log", from, to)

  local revs = {}
  local entries = {}

  for _, v in pairs(res) do
    revs[#revs + 1]       = v[1]["ok"]
    entries[#entries + 1] = entry_from(v[2])
  end

  return entries, revs
end


local commit = function (entry)
  local key = prefixed("agg:" .. entry.side)
  return zadd(key, entry.amount, entry.price)
end

local touch = function (rev)
  return set(prefixed "agg:rev", rev)
end

--

local entries, revs = pull()

local rev_prev = rev_x

local nth = nil

for i, r in pairs(revs) do
  local seed, offset = split_rev(r)

  if rev_prev then
    local seed_prev, offset_prev = split_rev(rev_prev)

    local is_next = r == next_rev_of(rev_prev)
    local is_next_seed = seed > seed_prev and offset == 1

    redis.debug(rev_prev, r, is_next)

    if is_next then
      if not nth then nth = i end
      rev_prev = r
    elseif is_next_seed then
      nth = i
      rev_prev = r
      tear_down()
    else

    end
  else
    if offset == 1 then
      nth = i
      rev_prev = r
    end
  end
end

if nth then
  for i = nth, #entries do
    commit(entries[i])
  end

  local rev = revs[#revs]

  set(prefixed "agg:rev", rev)

  return rev
else
  return redis.error_reply("Inconsistent revs")
end
