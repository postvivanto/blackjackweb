const SYMBOLS = ['Spade', 'Diamond', 'Heart', 'Clover']

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

function cntScore (cardArr) {
  const carr = [...cardArr]
  let score = 0

  carr.sort((a, b) => { return b[0] - a[0] })
  for (let i = 0; i < carr.length; i++) {
    let num = carr[i][0]

    num = num > 10 ? 10 : (num === 1 ? (score + 11 <= 21 ? 11 : 1) : num)
    score += num
  }

  return score
}

function hit (deckArr) {
  if (deckArr.length === 0) {
    deckArr = packCard([])
  }

  return deckArr.pop()
}

function printDeck (cardStrArr) {
  function cardStr (card) {
    let num = card[0]

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

    return `${num} of ${SYMBOLS[card[1]]}`
  }

  const retCardStrArr = []

  for (let i = 0; i < cardStrArr.length; i++) {
    retCardStrArr.push(cardStr(cardStrArr[i]))
  }

  return retCardStrArr
}

function delay (ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

async function playGame () {
  const deck = []
  const dCards = []
  const pCards = []
  const hitB = document.getElementById('hit-button')
  const standB = document.getElementById('stand-button')
  const replayB = document.getElementById('replay-button')
  const dScoreDiv = document.getElementById('dealerscore')
  const pScoreDiv = document.getElementById('playerscore')
  const dCardDiv = document.getElementById('dealercards')
  const pCardDiv = document.getElementById('playercards')
  const DELAY_TIME = 1000
  let pScore, dScore

  function cntScoreAll () {
    const parr = [...pCards[0]]
    const darr = [...dCards[0]]

    pScore = 0
    dScore = 0

    parr.sort((a, b) => { return b - a })
    darr.sort((a, b) => { return b - a })
    for (let i = 0; i < parr.length; i++) {
      let num = parr[i]

      num = num > 10 ? 10 : (num === 1 ? (pScore + 11 <= 21 ? 11 : 1) : num)
      pScore += num
    }
    for (let i = 0; i < darr.length; i++) {
      let num = darr[i]

      num = num > 10 ? 10 : (num === 1 ? (dScore + 11 <= 21 ? 11 : 1) : num)
      dScore += num
    }
  }

  async function takeCard (person) {
    person.push(hit(deck))
    // cntScoreAll()
    dScoreDiv.innerHTML = cntScore(dCards)
    pScoreDiv.innerHTML = cntScore(pCards)
    dCardDiv.innerHTML = printDeck(dCards)
    pCardDiv.innerHTML = printDeck(pCards)
    await delay(DELAY_TIME)
  }

  async function stand () {
    hitB.setAttribute('disabled', '')
    standB.setAttribute('disabled', '')
    // dealer 17 rule
    while (cntScore(dCards) < 17) { await takeCard(dCards) }
    const playerwin = pScore <= 21 && (pScore > dScore || dScore > 21)
    const winlose = playerwin ? 'Win' : 'Lose'

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
  await takeCard(pCards)
  await takeCard(dCards)
  await takeCard(pCards)
  // dealer open a card
  // player phase
  hitB.removeAttribute('disabled')
  standB.removeAttribute('disabled')
  // STANDDOWN
}

playGame()
