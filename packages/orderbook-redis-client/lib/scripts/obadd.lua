local TOPIC = KEYS[1]
local SEED  = table.remove(ARGV, 1)

--

local join_by = function (split)
  return function (tbl)
    return table.concat(tbl, split)
  end
end

--

local hincr = function (key, field)
  return redis.call("HINCRBY", key, field, 1)
end

local xadd = function (key, id, data)
  -- local params = { "MAXLEN", "~", 1000 }
  return redis.call("XADD", key, id, unpack(data))
end

--

local function next_id ()
  local key = TOPIC .. ":ob:log:offset"

  local offset = redis.call("HINCRBY", key, SEED, 1)

  return join_by "-" { SEED, offset }
end

local insert = function (data)
  local key = TOPIC .. ":ob:log"

  return xadd(key, next_id(), data)
end

--

local ids = {}

-- take each 2 as { price, amount } pair

local bids = {}
local asks = {}

local i = 1
local l = #ARGV

local side = nil

while i <= l do
  local x = string.lower(ARGV[i])

  if x == 'bids' or x == 'asks' then
    side = x
    i = i + 1
  end

  local id = insert {
    "side", side,
    "price", ARGV[i],
    "amount", ARGV[i + 1]
  }

  i = i + 2

  table.insert(ids, id)
end

return ids
