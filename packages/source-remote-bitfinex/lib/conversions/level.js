const recover = triple => {
  const [price, count, amount] = triple

  const quantity = count === 0
    ? 0
    : amount

  return { price, quantity }
}

module.exports = {
  recover
}
