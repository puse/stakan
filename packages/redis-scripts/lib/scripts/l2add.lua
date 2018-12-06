-- Utils

local command = require "modules/command"

--

local SEED  = table.remove(ARGV, 1)

local function next_id ()
  local offset = command "HINCRBY" "journal:offset" { SEED, 1 }
  return SEED.."-"..offset
end

local insert = function (data)
  local rev = next_id()

  return command "XADD" "journal" {
    "MAXLEN", "~", 1000,
    rev,
    unpack(data)
  }
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

  if x == "bids" or x == "asks" then
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
