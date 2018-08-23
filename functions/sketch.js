const numCandles = 1745
const numTraders = 1000
let btc

let prices  = []
let candles = []
let orders  = []
let traders = []

function preload() {
  btc = loadJSON('data/btc.json')
}

function setup() {
  createCanvas(800, 300)

  let padding = (1 / (width / (numCandles + 1))) / numCandles * 1000
  let candleWidth = width / numCandles

  // prices  = fakeAPI(numCandles)
  for (var i = 0; i < numCandles; i++)
    prices.push(btc[i])
  candles = createCandles(prices, candleWidth, padding)

  for (var i = 0; i < numTraders; i++)
    traders[i] = new Trader(i)
}

function draw() {
  background(51)
  translate(0, height)
  scale(1, -1)

  for (var i = 0; i < candles.length; i++) {
    checkOrders(candles[i])

    candles[i].show(i)
    if (i < numCandles * 2 / 3) {
      for (trader of traders) {
        let order = trader.think(candles[i])
        if (order) orders.push(order)
      }
    }
  }

  showBest()
  // noLoop()
  nextGeneration()
}
