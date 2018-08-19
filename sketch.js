const numCandles = 80
let prices  = []
let candles = []

function setup() {
  createCanvas(800, 300)

  let padding = (1 / (width / (numCandles + 1))) / numCandles * 1000
  let candleWidth = width / numCandles

  prices  = fakeAPI(numCandles)
  candles = createCandles(prices, candleWidth, padding)
}

function draw() {
  background(51)
  translate(0, height)
  scale(1, -1)

  for (var i = 0; i < candles.length; i++)
    candles[i].show(i)
}

function createCandles(prices, candleWidth, padding) {
  let lower  = Infinity
  let higher = 0

  for (let i = 0; i < prices.length; i++) {
    if (prices[i].hight > higher)
      higher = prices[i].hight
    if (prices[i].low < lower)
      lower = prices[i].low
  }

  let candles = []

  for (let i = 0; i < prices.length; i++) {
    let o = map(prices[i].open,  lower, higher, 0, height)
    let h = map(prices[i].hight, lower, higher, 0, height)
    let l = map(prices[i].low,   lower, higher, 0, height)
    let c = map(prices[i].close, lower, higher, 0, height)

    candles[i] = new Candle(o, h, l, c, candleWidth, padding)
  }

  return candles
}
