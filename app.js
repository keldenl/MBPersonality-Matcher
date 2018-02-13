"use strict"
// Global variables
let peopleList = [];
let pairingList = [];

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class Person {
    constructor(name, personality) {
        this.name = name;
        this.personality = personality;
    }

    getName() {
        return this.name;
    }

    getPersonality() {
        return this.personality;
    }
}

class Pair {
    constructor(main, pairs) {
        this.main = main;
        this.pairs = pairs;
    }

    getPairs() {
        return this.pairs;
    }
}

function importData() {
    let MBData = require('./MBPer.json');
    for (let MBClass in MBData) {
        let currClass = MBData[MBClass];

        if (MBClass == "people") {
            for (let person in currClass) {
                let psn = new Person(currClass[person].name, currClass[person].personality);
                peopleList.push(psn);
            }
        } 
        else if (MBClass == "pairings") {
            for (let pair in currClass) {
                let match = [currClass[pair].pairs[0], currClass[pair].pairs[1]];
                let prg = new Pair(currClass[pair].main, match);
                pairingList.push(prg);
            }
        }
    }
}

function findFromPair(pairInput) {
    let returnPeople = []
    for (let person in peopleList) {
        if (pairInput.includes(peopleList[person].personality)) {
            returnPeople.push([peopleList[person].name, peopleList[person].personality]);
        }
    }
    return returnPeople;
}

function printComp(name, list) {
    if (list.length > 0) {
        console.log("Below are the people compatible with you: ")
        for (let item in list) {
            console.log("  - " + list[item][0] + " (" + list[item][1] + ")");
        }
    } else {
        console.log("The system could not find anybody compatible with you.")
    }
}

function main() {
    let currList = []
    let found = false;
    rl.question("Enter your name: ", (answer) => {
        for (let person in peopleList) {
            if (peopleList[person].name.toLowerCase() == answer.toLowerCase()) { // found the perosn
                found = true;
                for (let pair in pairingList) { // check the personality pairings
                    if (pairingList[pair].main == peopleList[person].personality) { // if we're looking at this person's main personality
                        currList = findFromPair(pairingList[pair].pairs);
                        break;
                    }
                }
            }
        }
        if (found) {
            printComp(answer, currList);
        } else {
            console.log("ERROR: 404 NOT FOUND. Make sure you included your last name and didn't make any spelling mistakes.")
        }
      
        rl.close();
      });
}

importData();
main();