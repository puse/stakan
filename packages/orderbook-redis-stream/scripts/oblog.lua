local PREFIX = "ob:"

local TOPIC = KEYS[1]
local SEED  = table.remove(ARGV, 1)

--

local hincr = function (key, field)
  return redis.call("HINCRBY", key, field, 1)
end

local xadd = function (key, id, data)
  -- local params = { "MAXLEN", "~", 1000 }
  return redis.call("XADD", key, id, unpack(data))
end

--

local insert = function (data)
  -- kes
  local root = PREFIX .. TOPIC

  local key_log = root .. ":log"
  local key_offsets = root .. ":log:offsets"

  local offset = hincr(key_offsets, SEED)
  local id = SEED .. "-" .. offset

  return xadd(key_log, id, data)
end

--

local ids = {}

-- take each 2 as { rate, amount } pair
for i = 1, #ARGV, 2 do
  local rate = tonumber(ARGV[i])
  local amount = tonumber(ARGV[i+1])

  local side = rate < 0 and "bids" or "asks"
  local price = math.abs(rate)

  local id = insert {
    "side", side,
    "price", price,
    "amount", amount
  }

  table.insert(ids, id)
end

return ids
