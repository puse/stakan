local L = require "./helpers"

local keyfor = function (sub)
  return L.join_by ":" { KEYS[1], sub }
end

return function (cmd)
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
      local params = L.flatten(arg)
      return redis.call(cmd, key, unpack(params))
    end
  end
end
