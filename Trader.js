class Trader {
  constructor(i) {
    this.brain = new NeuralNetwork(2, 3, 3)
    this.confidence = random(0, .5)
    this.risk  = random(.01, .1)
    this.index = i
    this.bets  = 0
    this.funds = {
      btc: 1,
      usd: 1000
    },
    this.fitness = {
      btc: 0,
      usd: 0
    }
  }

  think(candle) {
    let inputs = this.normalizeInputs(candle)
    let output = this.brain.predict(inputs)

    let profit = output[0]
    let action = output[1]
    let stop   = output[2]

    profit = map(profit, 0, 1, 0, this.risk)
    stop   = map(stop,   0, 1, 0, this.risk)

    if (action > (1 - this.confidence) && this.funds.btc > 0)
      return this.sell(candle.close, profit, stop)
    else if (action < this.confidence && this.funds.usd > 0)
      return this.buy(candle.close, profit, stop)
    else return null
  }

  normalizeInputs(candle) {
    let inputs = []

    let o = candle.open
    let c = candle.close
    let dif = c - o
    if (dif < 0) dif *= -1

    let greater = c
    if (o > greater) greater = o

    inputs[0] = dif / greater

    let extention = candle.hight - candle.low
    let dif2 = extention - dif

    inputs[1] = dif2 / extention

    return inputs
  }

  sell(price, profit, stop) {
    profit = price * (1 - stop)
    stop   = price * (1 + stop)

    let newOrder = {
      owner: this.index,
      type: 'buy',
      stop: stop,
      profit: profit,
      value: this.funds.btc * price
    }
    this.apostas++
    this.funds.btc = 0
    return newOrder

  }

  buy(price, profit, stop) {
    profit = price * (1 + stop)
    stop   = price * (1 - stop)

    let newOrder = {
      owner: this.index,
      type: 'sell',
      stop: stop,
      profit: profit,
      value: this.funds.usd / price
    }
    this.apostas++
    this.funds.usd = 0
    return newOrder
  }

  deposit(coin, value) {
    switch (coin) {
      case 'btc':
        this.funds.btc = value
        break;

      case 'usd':
        this.funds.usd = value
        break;

      default:
        console.log('Deposit error.')
    }
  }
}
