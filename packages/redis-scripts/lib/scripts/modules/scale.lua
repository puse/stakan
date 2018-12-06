local SCALING_FACTOR = 100000000

local function convert (x)
  return tonumber(x) * SCALING_FACTOR
end

local function recover (x)
  local num = tonumber(x) / SCALING_FACTOR
  return tostring(num)
end

return {
  convert = convert,
  recover = recover
}
