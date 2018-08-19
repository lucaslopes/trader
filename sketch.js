let prices = fakeAPI(numberOfCandles)
const numCandles = 80

function setup() {
  createCanvas(800, 300)

  let padding = (1 / (width / (numCandles + 1))) / numCandles * 1000
  let candleWidth = width / numCandles
}

function draw() {
  background(51)
  translate(0, height)
  scale(1, -1)

}
