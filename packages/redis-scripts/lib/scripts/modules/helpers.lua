local L = {}

L.insert_into = function (tbl)
  return function (...)
    for i = 1, #arg do
      table.insert(tbl, arg[i])
    end
  end
end

L.is_table = function (x)
  return type(x) == "table"
end

L.flatten = function (tbl)
  local out = {}
  local push = L.insert_into(out)

  local function f (t)
    for i = 1, #t do
      local v = t[i]
      if L.is_table(v) then f(v) else push(v) end
    end
  end

  f(tbl)

  return out
end

L.join_by = function (split)
  return function (tbl)
    return table.concat(tbl, split)
  end
end

return L

