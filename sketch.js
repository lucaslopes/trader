const numCandles = 80
let prices  = []

function setup() {
  createCanvas(800, 300)

  let padding = (1 / (width / (numCandles + 1))) / numCandles * 1000
  let candleWidth = width / numCandles
  prices  = fakeAPI(numCandles)
}

function draw() {
  background(51)
  translate(0, height)
  scale(1, -1)

}
