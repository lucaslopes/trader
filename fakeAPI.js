function fakeAPI(n, closePrice = 1000) {
  let prices = []

  for (let i = 0; i < n; i++) {
    let values = generateValues(closePrice)
    let newPrice = createPrice(values, closePrice)
    closePrice = newPrice.close
    prices.push(newPrice)
  }

  return prices
}

function generateValues(seed) {
  let values = []

  for (let i = 0; i < 4; i++) {
    let n
    for (let j = -1; j < i; j++) {
      if (n == values[j]) {
        n = round(seed + random(-.0168, .0168) * seed)
        j = -1
      }
    }
    values[i] = n
  }

  return values
}

function createPrice(values, closePrice) {
  values.sort((a,b) => a - b)

  let dist1 = closePrice - values[1]
  let dist2 = closePrice - values[2]

  if (dist1 < 0) dist1 *= -1
  if (dist2 < 0) dist2 *= -1

  let farthest = 0
  if (dist1 > dist2) farthest = values[1]
  else farthest = values[2]

  let distance = farthest - closePrice
  if (distance < 0) [values[1], values[2]] = [values[2], values[1]]

  let price = {
    open: values[1],
    hight: values[3],
    low: values[0],
    close: values[2]
  }

  return price
}
