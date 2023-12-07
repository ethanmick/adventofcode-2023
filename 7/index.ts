import { readFile } from 'fs/promises'

const read = () => readFile('./input.txt', 'utf8')

type Card =
  | 'A'
  | 'K'
  | 'Q'
  | 'J'
  | 'T'
  | '9'
  | '8'
  | '7'
  | '6'
  | '5'
  | '4'
  | '3'
  | '2'

const CardValues: Record<Card, number> = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2,
}

type Bid = number
type Hand = [Card, Card, Card, Card, Card]
type Pair = {
  hand: Hand
  bid: Bid
}

enum Type {
  FiveOfAKind,
  FourOfAKind,
  FullHouse,
  ThreeOfAKind,
  TwoPair,
  OnePair,
  HighCard,
}

const getType = (hand: Hand) => {
  let type: string = '6'
  const typeFilters: Record<Type, Function> = {
    [Type.FiveOfAKind]: (hand: Hand) =>
      hand.filter((c, _, all) => all[0] == c).length == 5,
    [Type.FourOfAKind]: (hand: Hand) =>
      !!Object.values(
        hand.reduce(
          (counter, card) =>
            (counter[card] = counter[card] ? counter[card] + 1 : 1) && counter,
          {}
        )
      ).find((v) => v == 4),
    [Type.ThreeOfAKind]: (hand: Hand) =>
      !!Object.values(
        hand.reduce(
          (counter, card) =>
            (counter[card] = counter[card] ? counter[card] + 1 : 1) && counter,
          {}
        )
      ).find((v) => v == 3),
    [Type.FullHouse]: (hand: Hand) => {
      const set = new Set(
        Object.values(
          hand.reduce(
            (counter, card) =>
              (counter[card] = counter[card] ? counter[card] + 1 : 1) &&
              counter,
            {}
          )
        ).filter((v) => v == 2 || v == 3)
      )
      return set.has(2) && set.has(3)
    },
    [Type.TwoPair]: (hand: Hand) =>
      Object.values(
        hand.reduce(
          (counter, card) =>
            (counter[card] = counter[card] ? counter[card] + 1 : 1) && counter,
          {}
        )
      ).filter((v) => v == 2).length == 2,
    [Type.OnePair]: (hand: Hand) =>
      Object.values(
        hand.reduce(
          (counter, card) =>
            (counter[card] = counter[card] ? counter[card] + 1 : 1) && counter,
          {}
        )
      ).filter((v) => v == 2).length == 1,
    [Type.HighCard]: () => false,
  }

  for (const [key, test] of Object.entries(typeFilters)) {
    if (test(hand)) {
      type = key
      break
    }
  }

  return Number(type)
}

const sort = (a: Pair, b: Pair) => {
  const aT = getType(a.hand)
  const bT = getType(b.hand)
  if (aT != bT) {
    return bT - aT
  }
  // same
  for (let i = 0; i < a.hand.length; i++) {
    if (a.hand[i] != b.hand[i]) {
      return CardValues[a.hand[i]] - CardValues[b.hand[i]]
    }
  }
  return 0
}

const parse = async (): Promise<Array<Pair>> => {
  const input = (await read()).split(/\r?\n/)
  return input.map((line) => {
    const [hand, bid] = line.split(/\s+/)
    return {
      hand: hand.split('') as Hand,
      bid: Number(bid),
    }
  })
}

const main = async () => {
  const pairs = (await parse()).sort(sort)
  const money = pairs
    .map(({ bid }, i) => bid * (i + 1))
    .reduce((total, bid) => total + bid, 0)
  console.log('Result', money)
}

main()
