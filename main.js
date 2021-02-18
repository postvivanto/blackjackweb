const hitB = document.getElementById('hit-button')
const standB = document.getElementById('stand-button')
const replayB = document.getElementById('replay-button')
const dScoreDiv = document.getElementById('dealerscore')
const pScoreDiv = document.getElementById('playerscore')
const dCardDiv = document.getElementById('dealercards')
const pCardDiv = document.getElementById('playercards')
const SYMBOLS = ['Spade', 'Diamond', 'Heart', 'Clover']

class Person {
  constructor (scorediv, carddiv) {
    this._hand = []
    this.score = 0
    this._scorediv = scorediv
    this._carddiv = carddiv
  }

  getCard (deckArr) {
    // if (deckArr.length === 0) { shuffle(deckArr) }
    this._hand.push(deckArr.pop())
  }

  countScore () {
    const numArr = Array.from(this._hand, x => x[0])
    let num

    numArr.sort((a, b) => { return b - a })
    for (let i = 0; i < numArr.length; i++) {
      num = numArr[i]
      num = num > 10 ? 10 : (num === 1 ? (this.score + 11 <= 21 ? 11 : 1) : num)
      this.score += num
    }
    // Update hand div
  }
}

function packCard (deckArr) {
  // A = 1, J = 11, Q = 12, K = 13
  for (let i = 1; i <= 13; i++) {
    for (let j = 0; j < 4; j++) {
      deckArr.push([i, j])
    }
  }

  return deckArr
}

function shuffle (deckArr) {
  // Durstenfeld Shuffle
  const len = deckArr.length

  for (let i = 0; i < len - 2; i++) {
    const j = Math.floor(Math.random() * (len - i) + i);

    [deckArr[i], deckArr[j]] = [deckArr[j], deckArr[i]]
  }
}

function printDeck (cardStrArr) {
  const retCardStrArr = []

  for (let i = 0; i < cardStrArr.length; i++) {
    let num = cardStrArr[i][0]

    switch (num) {
      case 1:
        num = 'Ace'
        break
      case 11:
        num = 'Jack'
        break
      case 12:
        num = 'Queen'
        break
      case 13:
        num = 'King'
        break
    }
    retCardStrArr.push(`${num} of ${SYMBOLS[cardStrArr[i][1]]}`)
  }

  return retCardStrArr
}

function delay (ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

async function playGame () {
  let deck = []
  const dCards = []
  const pCards = []
  const DELAY_TIME = 500
  let pScore, dScore

  function cntScoreAll () {
    const parr = Array.from(pCards, x => x[0])
    const darr = Array.from(dCards, x => x[0])
    let num

    pScore = 0
    dScore = 0
    parr.sort((a, b) => { return b - a })
    darr.sort((a, b) => { return b - a })
    for (let i = 0; i < parr.length; i++) {
      num = parr[i]
      num = num > 10 ? 10 : (num === 1 ? (pScore + 11 <= 21 ? 11 : 1) : num)
      pScore += num
    }
    for (let i = 0; i < darr.length; i++) {
      num = darr[i]
      num = num > 10 ? 10 : (num === 1 ? (dScore + 11 <= 21 ? 11 : 1) : num)
      dScore += num
    }
  }

  async function takeCard (person) {
    if (deck.length === 0) {
      deck = packCard([])
    }
    person.push(deck.pop())
    cntScoreAll()
    dScoreDiv.innerHTML = dScore
    pScoreDiv.innerHTML = pScore
    dCardDiv.innerHTML = printDeck(dCards)
    pCardDiv.innerHTML = printDeck(pCards)
    await delay(DELAY_TIME)
  }

  async function stand () {
    hitB.setAttribute('disabled', '')
    standB.setAttribute('disabled', '')
    let winlose

    if (pScore > 21) { winlose = 'Lose' } else {
      // dealer 17 rule
      // eslint-disable-next-line no-unmodified-loop-condition
      while (dScore < 17) { await takeCard(dCards) }
      winlose = pScore <= 21 && (pScore > dScore || dScore > 21) ? 'Win' : 'Lose'
    }
    await delay(DELAY_TIME)
    alert(`You ${winlose}!`)
    replayB.removeAttribute('disabled')
  }

  hitB.addEventListener('click', async () => {
    hitB.setAttribute('disabled', '')
    standB.setAttribute('disabled', '')
    await takeCard(pCards)
    if (parseInt(pScoreDiv.innerHTML) > 21) { stand() } else {
      hitB.removeAttribute('disabled')
      standB.removeAttribute('disabled')
    }
  })

  standB.addEventListener('click', stand)

  replayB.addEventListener('click', playGame)

  hitB.setAttribute('disabled', '')
  standB.setAttribute('disabled', '')
  replayB.setAttribute('disabled', '')
  // shuffle
  packCard(deck)
  shuffle(deck)
  // bet
  // first two cards
  await takeCard(dCards)
  await takeCard(dCards)
  await takeCard(pCards)
  await takeCard(pCards)
  // dealer open a card
  // player phase
  hitB.removeAttribute('disabled')
  standB.removeAttribute('disabled')
  // STANDDOWN
}

playGame()
