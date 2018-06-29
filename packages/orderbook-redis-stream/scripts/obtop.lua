-- Constants

local KEY_ROOT = "ob"

local SCALING_FACTOR = 100000000

-- Utils

local function keyfor (sub)
  return table.concat({ KEY_ROOT, KEYS[1], "agg", sub }, ":")
end

local function unscaled (x)
  local num = tonumber(x) / SCALING_FACTOR
  return tostring(num)
end

--

local function pull (side, should_reverse)
  local key = keyfor(side)

  local limits = { "LIMIT", 0, 1 }

  local arr

  if should_reverse then
    local cmd = "ZREVRANGEBYLEX"
    arr = redis.call(cmd, key, "+", "-", unpack(limits))
  else
    local cmd = "ZRANGEBYLEX"
    arr = redis.call(cmd, key, "-", "+", unpack(limits))
  end

  return arr[1]
end

local ask_price = pull("asks")

local ask_amount = redis.call(
  "ZSCORE",
  keyfor "asks",
  ask_price
)

local bid_price = pull("bids", true)

local bid_amount = redis.call(
  "ZSCORE",
  keyfor "bids",
  bid_price
)


return {
  { unscaled(bid_price), bid_amount },
  { unscaled(ask_price), ask_amount }
}
