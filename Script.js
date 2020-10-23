//load required modules/packages
//in console run this to add to the local repository
    //npm install fs wait async

fs = require('fs');
wait = require('wait');
async = require('async');


//read in a file of Pokemon names
    //each name seperated by a new line

function readFile (file) 
{
    let data = (fs.readFileSync(file).toString()).replace('\r', '').split('\n');  //read in file, convert to string, and split along line
    //if \r are being added to pokemon, remove them
    //console.log(data);
}
    
readFile('Pokemon.txt');


//access pokeapi.co to get each Pokemon's type




//print each Pokemon with their type to the console




//final output is array of objects


//forEach...console.log
//`$[pokeName}: ${pokeType.toString()}`
