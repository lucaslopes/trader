function fakeAPI(n) {
  let prices = []

  let closePrice = 1000
  for (let i = 0; i < n; i++) {
    let values = generateValues(closePrice)
    let newPrice = createPrice(values)
    prices.push(newPrice)
  }

  return prices
}

function generateValues(closePrice) {
  let values = []

  for (var i = 0; i < 4; i++)
    values[i] = closePrice + Math.random(-.5, 1) * closePrice

  return values
}

function createPrice(values) {
  values.sort()

  priceUp = {
    open: values[1],
    hight: values[3],
    low: values[0],
    close: values[2]
  }

  priceDown = {
    open: values[2],
    hight: values[3],
    low: values[0],
    close: values[1]
  }

  let price = {}
  Math.random(1) > .5 ? price = priceUp : price = priceDown

  return price
}
