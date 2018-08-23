function nextGeneration() {
  normalizeFitness(traders);
  newTraders = generate(traders);
  traders = newTraders.slice();
}

function generate(oldTraders) {
  let newTraders = [];
  for (let i = 0; i < numTraders; i += 2) {
    let traderBTC = poolSelection(oldTraders, 'btc');
    let traderUSD = poolSelection(oldTraders, 'usd');
    newTraders[i] = crossover(traderBTC, traderUSD, i)
    newTraders[i + 1] = crossover(traderUSD, traderBTC, i + 1)
  }
  return newTraders;
}

function normalizeFitness(traders) {
  let sumBTC = 0;
  let sumUSD = 0;

  for (let i = 0; i < traders.length; i++) {
    sumBTC += traders[i].funds.btc;
    sumUSD += traders[i].funds.usd;
  }

  for (let i = 0; i < traders.length; i++) {
    traders[i].fitness.btc = traders[i].funds.btc / sumBTC;
    traders[i].fitness.usd = traders[i].funds.usd / sumUSD;
  }
}

function poolSelection(traders, coin) {
  let index = 0;
  let r = random(1);

  while (r > 0) {
    if (coin = 'usd')
      r -= traders[index].fitness.usd;
    else if (coin = 'btc')
      r -= traders[index].fitness.btc;
    index += 1;
  }

  index -= 1;
  return traders[index]
}

function crossover(a, b, index) {
  let newBrain = new NeuralNetwork(a.brain)
  newBrain.mutate(0.01)
  newBrain.weights_ho = b.brain.weights_ho.copy();
  newBrain.bias_o = b.brain.bias_o.copy();

  let newTrader = new Trader(index)
  newTrader.brain = newBrain

  newTrader.confidence = (a.confidence + b.confidence) / 2
  newTrader.risk = (a.risk + b.risk) / 2

  newTrader.funds.btc = (a.funds.btc + b.funds.btc) / 2
  newTrader.funds.usd = (a.funds.usd + b.funds.usd) / 2

  return newTrader
}

function born(a, index) {
  let newBrain = new NeuralNetwork(a.brain)
  newBrain.mutate(0.01)

  let newTrader = new Trader(index)
  newTrader.brain = newBrain

  newTrader.confidence = a.confidence
  newTrader.risk = a.risk

  // newTrader.funds.btc = a.funds.btc
  // newTrader.funds.usd = a.funds.usd

  return newTrader
}
