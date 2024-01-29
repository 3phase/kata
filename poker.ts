const allowedValues = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const allowedSuits = ['s', 'h', 'd', 'c'];

class Card {
    readonly value;
    readonly suit;

    constructor(identifier: string) {
        const value = identifier.charAt(0);
        const suit = identifier.charAt(1);

        if (!allowedValues.includes(value))
            throw new Error('Can\'t have this value');

        if (!allowedSuits.includes(suit))
            throw new Error('Can\'t have this suit');

        this.value = value;
        this.suit = suit;
    }
}

class Hand {
    score: number = 0;
    private readonly cards!: Card[];

    constructor(cards: Card[]) {
        if (cards.length !== 5)
            throw new Error('You don\'t have 5 cards');

        this.cards = cards;
        this.calculateScore();
    }

    private calculateScore(): void {
        const valueOccurrenceSet = new Map<string, number>();
        const suitOccurrenceSet = new Map<string, number>();

        this.cards.forEach((x) => {
            valueOccurrenceSet.set(x.value, (valueOccurrenceSet.get(x.value) ?? 0) + 1)
            suitOccurrenceSet.set(x.suit, (suitOccurrenceSet.get(x.suit) ?? 0) + 1)
        });

        this.score = this.determineScore(valueOccurrenceSet, suitOccurrenceSet);
    }

    private determineScore(valueOccurrenceSet: Map<string, number>, suitOccurrenceSet: Map<string, number>) {
        const uniqueValues = Array.from(valueOccurrenceSet.keys());
        const uniqueSuits = Array.from(suitOccurrenceSet.keys());

        if (uniqueValues.length === 5) {
            return uniqueSuits.length === 1 ?
                this.isFlush(uniqueValues) ? 9 : 6 :
                this.isFlush(uniqueValues) ? 5 : 1;
        }

        if (uniqueValues.length === 4) return 2;
        if (uniqueValues.length === 3) return 3; // or 4
        if (uniqueValues.length === 2) return 7; // or 8


        return 0;
    }

    private areConsecutiveValues = (a: string, b: string) => allowedValues
        .findIndex(x => x === b) - allowedValues
            .findIndex(x => x === a) === 1;


    private isFlush = (set: string[]) =>
        set.every((x, index) => index + 1 === set.length ? true : this.areConsecutiveValues(x, set[index + 1]))
}


const input = ['Qd', 'Qc', '5d', '3c', 'Ts'];
// const input = ['2d', '3d', '4d', '5d', '6d'];

const hand = new Hand(input.map((x) => new Card(x)));

console.log(hand.score);

