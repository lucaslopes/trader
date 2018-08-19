class Candle {
  constructor(o, h, l, c, w, p) {
    this.open  = o
    this.hight = h
    this.low   = l
    this.close = c
    this.width = w
    this.padding = p
  }

  show(i) {
    stroke(200)
    let middle = this.width * i + this.width / 2
    line(middle, this.hight, middle, this.low)

    noStroke()
    this.open < this.close ? fill(87, 170, 118) : fill(212, 69, 72)
    rect(
      this.width * i + this.padding,
      this.open, this.width - 2 * this.padding,
      this.close - this.open
    )
  }
}
