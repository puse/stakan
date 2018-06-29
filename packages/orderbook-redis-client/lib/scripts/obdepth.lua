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

local function pull (side)
  local key = keyfor(side)

  local arr = redis.call("ZRANGE", key, 0, -1, "WITHSCORES")

  for i = 1, #arr, 2 do
    arr[i] = unscaled(arr[i])
  end

  return arr
end

return { pull "bids", pull "asks" }
