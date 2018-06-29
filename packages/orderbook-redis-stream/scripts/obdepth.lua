-- Constants

local KEY_ROOT = "ob"

-- Utils

local function keyfor (sub)
  return table.concat({ KEY_ROOT, KEYS[1], "agg", sub }, ":")
end

--

local function pull (side)
  local key = keyfor(side)
  return redis.call("ZRANGE", key, 0, -1, "WITHSCORES")
end

return { pull "bids", pull "asks" }
