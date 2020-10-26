//load required modules/packages
//in console run this to add to the local repository
    //npm install node-fetch fs wait async
fetch = require('node-fetch')
fs = require('fs');
wait = require('wait');
async = require('async');


//read in a file of Pokemon names
    //each name seperated by a new line

var dataArr = [];   //put into data array with capitalization

function readFile (file) 
{
    let data = (fs.readFileSync(file).toString()).replace('\r', '').split('\n');  //read in file, convert to string, and split along line
    //if \r are being added to pokemon, remove them
    data.forEach(element => {dataArr.push(element.charAt(0).toUpperCase() + element.slice(1))})
    console.log(dataArr);
    return dataArr;
}

readFile('Pokemon.txt');// For debugging

//access pokeapi.co to get each Pokemon's type

var url = "https://pokeapi.co/api/v2/pokemon/"


async function getPokeURLS(url){
    let response = await fetch(url);
    let data = await response.json();
    data
}


//print each Pokemon with their type to the console




//final output is array of objects


//forEach...console.log
//`$[pokeName}: ${pokeType.toString()}`
