const numCandles = 80
const numTraders = 1000
let prices  = []
let candles = []
let orders  = []
let traders = []

function setup() {
  createCanvas(800, 300)

  let padding = (1 / (width / (numCandles + 1))) / numCandles * 1000
  let candleWidth = width / numCandles

  prices  = fakeAPI(numCandles)
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
}

function createCandles(prices, candleWidth, padding) {
  let lower  = Infinity
  let higher = 0

  for (let i = 0; i < prices.length; i++) {
    if (prices[i].high > higher)
      higher = prices[i].high
    if (prices[i].low < lower)
      lower = prices[i].low
  }

  let candles = []

  for (let i = 0; i < prices.length; i++) {
    let o = map(prices[i].open,  lower, higher, 0, height)
    let h = map(prices[i].high,  lower, higher, 0, height)
    let l = map(prices[i].low,   lower, higher, 0, height)
    let c = map(prices[i].close, lower, higher, 0, height)

    candles[i] = new Candle(o, h, l, c, candleWidth, padding)
  }

  return candles
}

function checkOrders(candle) {
  for (let i = orders.length - 1; i >= 0; i--) {
    let o = orders[i]

    if (o.stop > candle.low && o.stop < candle.hight) {
      confirm(o, o.stop)
      orders.splice(i, 1)
    } else if (o.profit > candle.low && o.profit < candle.hight) {
      confirm(o, o.profit)
      orders.splice(i, 1)
    }
  }
}

function confirm(order, price) {
  switch (order.type) {
    case 'buy':
      traders[order.owner].deposit('btc', order.value / price)
      break;

    case 'sell':
      traders[order.owner].deposit('usd', order.value * price)
      break;

    default:
      console.log('Not confirmed.')
  }
}

function showBest() {
  // console.log(orders);
  // console.log(traders);

  let maxBTC = 0
  let maxUSD = 0
  let maxAPO = 0

  for(trader of traders) {
    if (trader.funds.btc > maxBTC) maxBTC = trader.funds.btc
    if (trader.funds.usd > maxUSD) maxUSD = trader.funds.usd
    if (trader.apostas > maxAPO) maxAPO = trader.apostas
  }

  console.log('btc: ' + maxBTC, 'usd: ' + maxUSD);
  // console.log(maxAPO);
  // rect(width/2,0,20,height/10)
}
