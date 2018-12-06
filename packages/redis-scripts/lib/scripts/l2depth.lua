-- Constants

-- Utils

local command = require "modules/command"
local scale = require "modules/scale"

--

local function unscaled (x)
  local num = tonumber(x) / SCALING_FACTOR
  return tostring(num)
end

--

local function pull (side)
  local key = "data:" .. side
  local arr = command "ZRANGEBYSCORE" (key) {
    "(0", "+inf",
    "WITHSCORES"
  }

  for i = 1, #arr, 2 do
    arr[i] = scale.recover(arr[i])
  end

  return arr
end

local rev = command "GET" "data:rev"

return {
  rev,
  pull "bids",
  pull "asks",
}
