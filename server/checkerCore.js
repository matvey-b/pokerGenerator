var debug = false; // easy way for testing
const handForTests = [
{
	"rank": "king",
	"suit": "spades" 
},
{
	"rank": "jack",
	"suit": "spades" 
},
{
	"rank": "jack",
	"suit": "spades" 
},
{
	"rank": "10",
	"suit": "spades" 
},
{
	"rank": "ace",
	"suit": "spades" 
}
];

/*const possibleRanks = ["2", "3", "4", "5", "6",
"7", "8", "9", "10", "jack", "queen", "king", "ace"];
const possibleSuits = ["hearts", "diamonds", "spades", "clubs"];
*/

//////////// Helpers for checkers ////////////
const getRanksFromHand = hand => hand.map(card => card.rank.toLowerCase());

const getSuitsFromHand = hand => hand.map(card => card.suit.toLowerCase());

const containNTimes = (rankName, ranksArray, numOfTimes) => {
	//simple error tracker
	if (ranksArray[0] === undefined) {
		console.log("containNTimes => error: Zero ranksArray");
		return false;
	}

	var result = ranksArray.reduce((acc, currName) => {
		// console.log('containNTimes: acc = ' + acc + ' currName = ' + currName);
		return acc + (currName === rankName ? 1 : 0);
	}, 0);

	return (result === numOfTimes) ? true : false;
};


////////////  Checkers //////////////
const isHighCard = (hand) => {
	// Dummy function needed for reduce in checkHand function
	return true;
};

const hasPair = (hand) => {
	// One pair, or simply a pair, is a poker hand containing two cards of the
	// same rank and three cards of three other ranks (the kickers), such as
	// 4♥ 4♠ K♠ 10♦ 5♠ ("one pair, fours" or a "pair of fours"). It ranks
	// below two pair and above high card.

	const namesOfRanks = getRanksFromHand(hand);
	return namesOfRanks.some(rank => containNTimes(rank, namesOfRanks, 2));
};

const hasTwoPairs = (hand) => {
	/*Two pair is a poker hand containing two cards of the same rank, two
	cards of another rank and one card of a third rank (the kicker), such as
	J♥ J♣ 4♣ 4♠ 9♥ ("two pair, jacks and fours" or "two pair, jacks over
	fours" or "jacks up").[18][26] It ranks below three of a kind and above
	one pair.*/

	var result = [];
	const namesOfRanks = getRanksFromHand(hand);

	namesOfRanks.forEach(rankName => {
		if (result.indexOf(rankName) === -1) {
			if (containNTimes(rankName, namesOfRanks, 2)) 
				result.push(rankName);
		}
	});

	return (result.length === 2) ? true : false;
};

const hasThree = (hand) => {
	/*Three of a kind, also known as trips or a set, is a poker hand
	containing three cards of the same rank and two cards of two other ranks
	(the kickers), such as 2♦ 2♠ 2♣ K♠ 6♥ ("three of a kind, twos" or "trip
	twos" or a "set of twos"). It ranks below a straight and above two pair.*/

	const namesOfRanks = getRanksFromHand(hand);
	return namesOfRanks.some(rank => containNTimes(rank, namesOfRanks, 3));
};

const hasStraight = (hand) => {
	/*A straight is a poker hand containing five cards of sequential rank, not
	all of the same suit, such as 7♣ 6♠ 5♠ 4♥ 3♥ (a "seven-high straight"). It
	ranks below a flush and above three of a kind.[7] As part of a straight,
	an ace can rank either above a king or below a two, depending on the rules
	of the game. Under high rules, an ace can rank either high (e.g. A♦ K♣ Q♣
	J♦ 10♠ is an ace-high straight) or low (e.g. 5♣ 4♦ 3♥ 2♥ A♠ is a five-high
	straight), but the ace cannot rank both high and low in the same hand (
	e.g. Q♠ K♠ A♣ 2♥ 3♦ is an ace-high high-card hand, not a straight).*/

	const ranksByIndices = ["ace", "2", "3", "4", "5", "6", "7", "8", "9",
	 		"10", "jack", "queen", "king"];

	const namesOfRanks = getRanksFromHand(hand);

	// getting sorted array of integers numbers from ranks for ariphmetic
	// processing in the future
	// In result all cards maps in [0..13] array of integers. 0 and 13 = 'ACE'.
	var ranksAsInt = namesOfRanks.map(rankName => 
			ranksByIndices.indexOf(rankName)).sort((a, b) => a < b ? -1 : 1);

	// if namesOfRanks has 'ACE', we need add his duplicate at the end
	// of integers array. Because 'ACE' === 0 and 13 at the same time.
	if (ranksAsInt.indexOf(0) === 0) ranksAsInt.push(13);

	// if elem5 - elem1 in sorted sequence = 4 (e.g.: 2,3,4,5,6), then it has
	// Straight.
	// if sequence has 'ACE', then we need to process 1,5 and 2,6 elements.
	// (e.g. ACE, 2, 3, 4, 5 or 10, JACK, QUEEN, KING, ACE)
	// console.log(ranksAsInt);
	if (ranksAsInt.length === 5) {
		return ((ranksAsInt[4] - ranksAsInt[0]) === 4) ? true : false;
	} else {
		return (ranksAsInt[4] - ranksAsInt[0] === 4 ||
			ranksAsInt[5] - ranksAsInt[1] === 4) ? true : false;
	}
};

const hasFlush = (hand) => {
	/*A flush is a poker hand containing five cards all of the same suit, not
	all of sequential rank, such as K♣ 10♣ 7♣ 6♣ 4♣ (a "king-high flush" or
	"king-ten-high flush").[20] It ranks below a full house and above a
	straight.*/

	const namesOfSuits = getSuitsFromHand(hand);
	const firstSuitName = namesOfSuits[0];
	return namesOfSuits.every(currSuitName => currSuitName === firstSuitName);
};

const haseFullHouse = (hand) => {
	return true;
};

const hasFour = (hand) => {
	/*Four of a kind, also known as quads, is a poker hand containing four
	cards of the same rank and one card of another rank (the kicker), such as
	9♣ 9♠ 9♦ 9♥ J♥ ("four of a kind, nines"). It ranks below a straight flush
	and above a full house.*/

	const namesOfRanks = getRanksFromHand(hand);
	return namesOfRanks.some(rank => containNTimes(rank, namesOfRanks, 4));
};

const hasStraightFlush = (hand) => {
	/*A straight flush is a poker hand containing five cards of sequential
	rank, all of the same suit, such as Q♥ J♥ 10♥ 9♥ 8♥ (a "queen-high
	straight flush").[4] It ranks below five of a kind and above four of a
	kind.[7] As part of a straight flush, an ace can rank either above a king
	or below a two, depending on the rules of the game. Under high rules, an
	ace can rank either high (e.g. A♥ K♥ Q♥ J♥ 10♥ is an ace-high straight
	flush) or low (e.g. 5♦ 4♦ 3♦ 2♦ A♦ is a five-high straight flush), but
	cannot rank both high and low in the same hand (e.g. Q♣ K♣ A♣ 2♣ 3♣ is an
	ace-high flush, not a straight flush).*/
	
	return hasStraight(hand) && hasFlush(hand);
};


const hasRoyalFlush = (hand) => {
	/*An ace-high straight flush, such as A♦ K♦ Q♦ J♦ 10♦, is commonly known
	as a royal flush or royal straight flush and is the best possible hand in
	high games when not using wild cards. A five-high straight flush, such as
	5♥ 4♥ 3♥ 2♥ A♥, is otherwise known as a steel wheel and is significant in
	ace-to-five high-low split games for being both the best low hand and
	usually the best high hand of the showdown.*/

	if (hasStraightFlush(hand)) {
		const namesOfRanks = getRanksFromHand(hand);
		return namesOfRanks.includes('10') && namesOfRanks.includes('ace');
	} else return false;

};

function checkHand(hand) {
	const allChecks = [
	{ "combinationName": "High Card", "checker": isHighCard },
	{ "combinationName": "One Pair", "checker": hasPair },
	{ "combinationName": "Two Pairs", "checker": hasTwoPairs },
	{ "combinationName": "3-of-a-Kind", "checker": hasThree },
	{ "combinationName": "Straight", "checker": hasStraight },
	{ "combinationName": "Flush", "checker": hasFlush },
	{ "combinationName": "Full House", "checker": haseFullHouse },
	{ "combinationName": "4-of-a-Kind", "checker": hasFour },
	{ "combinationName": "Straight Flush", "checker": hasStraightFlush },
	{ "combinationName": "Royal Flush", "checker": hasRoyalFlush }
	];

	if (debug) console.log(`Check on High Card => ${isHighCard(hand)}`);
	var result = allChecks.reduce((prevCheck, currCheck) => {
		if (debug) console.log(`Check on ${currCheck.combinationName} => ${currCheck.checker(hand)}`);
		return currCheck.checker(hand) ? currCheck : prevCheck;
	});

	return result.combinationName;
}

const printHand = (hand) =>{
	console.log('Printing hand...');
	hand.forEach(card => {
		const rank = card.rank[0].toUpperCase() + card.rank.slice(1);
		const suit = card.suit[0].toUpperCase() + card.suit.slice(1);
		console.log(`${rank} - ${suit}`);
	});
	console.log('==========================');
};

const testAllChecks = (hand) => {
	printHand(handForTests);
	console.log();
	console.log('Testing checker...');
	checkHand(handForTests);
	console.log('===========================');
};

if (!module.parent || debug) {
	debug = true; // if module starts directly then turn on debugging
	testAllChecks(handForTests);
}

// link on list of poker hands:
// https://en.wikipedia.org/wiki/List_of_poker_hands
// I do not use combination with a wild card
