const SYMBOLS = ['Spade', 'Diamond', 'Heart', 'Clover']

class Card {
  constructor (symbol, number) {
    this._symbol = symbol
    this.number = number
  }

  get symbol () {
    return SYMBOLS[this._symbol]
  }

  set symbol (index) {
    this._symbol = index
  }
}

const packCard = (arr) => {
  // i: card number, j: card symbol(index of SYMBOLS)
  for (let i = 1; i <= 13; i++) {
    for (let j = 0; j < 4; j++) {
      arr.push(new Card(j, i > 10 ? 10 : i))
    }
  }
  return arr
}

const shuffle = (arr) => {
  // Durstenfeld Shuffle
  for (let i = 0; i < arr.length - 1; i++) {
    const j = Math.random() * (arr.length - i) + i;

    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
}
