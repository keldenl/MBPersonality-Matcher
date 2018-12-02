"use strict"
// Global variables
let peopleList = [];
let pairingList = [];
let descList = [];
const perTraits = [["E", "I"], ["S", "N"], ["T", "F"], ["J", "P"]];


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
        else if (MBClass == "desc") {
            for (let desc in currClass) {
                descList.push(currClass[desc]);
            }
        }
    }
}

function findFromPair(pairInput) {
    let returnPeople = []
    for (let person in peopleList) {
        if (pairInput.includes(peopleList[person].personality)) {
            returnPeople.push(peopleList[person]);
        }
    }
    return returnPeople;
}

function printComp(list) {
    for (let item in list) {
        console.log("  - " + list[item].getName() + " (" + list[item].getPersonality() + ")");
    }
}

function generateSimilar(per) {
    if (!per) return [];

    var returnPer = [];
    for (var i = 0; i < per.length; i++) {
        var currT = per.charAt(i);
        var newTArr = perTraits[i];
        var newT;
        for (var t of newTArr) {
            if (t != currT) {
                newT = t;
            }
        }
        var regex = new RegExp(currT);
        var newPer = per.replace(regex, newT)
        returnPer.push(newPer);
    }

    return returnPer;
}

function listPer(per) {
    var returnList = [];

    for (let person in peopleList) {
        var currPer = peopleList[person].getPersonality();
        if (per == currPer) returnList.push(peopleList[person]);
    }

    return returnList;
}


function main() {
    let user;
    let userFound = false;
    rl.question("Enter your name: ", (answer) => {
        // find the user in the database
        for (let person in peopleList) {
            if (peopleList[person].getName().toLowerCase() == answer.toLowerCase()) { // found the person
                user = peopleList[person];
                userFound = true;
            }
        }
        // If user is in databse, find compatibility and similarities
        if (userFound) {
            let compList = []
            for (let pair in pairingList) { // check the personality pairings
                if (pairingList[pair].main == user.getPersonality()) { // if we're looking at this person's main personality
                    compList = findFromPair(pairingList[pair].pairs);
                    break;
                }
            }
            console.log("Welcome back, " + user.getName() + "(" + user.getPersonality() + ")!" + "\n");

            if (compList.length > 0) {
                console.log("MATCH MAKER");
                console.log("=========================================");
                console.log("Below are the people compatible with you: ")
                printComp(compList);
            } else  {
                console.log("Could not find anybody compatible with you.")
            }

            var simPerList = generateSimilar(user.getPersonality());
            console.log("\n PEOPLE SIMILAR TO YOU");
            console.log("=========================================");
            for (var i = 0; i < simPerList.length; i++) {
                if (listPer(simPerList[i]).length > 0) {
                    console.log(simPerList[i]); // similar personality combo
                    console.log(descList[i]);
                    printComp(listPer(simPerList[i])); // list of people
                    console.log("\n");
                }
            }

        } else {
            console.log("USER NOT FOUND. Make sure you included your last name and didn't make any spelling mistakes.")
        }
        rl.close();
      });
}

importData();
main();
