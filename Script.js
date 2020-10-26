//load required modules/packages
//in console run this to add to the local repository
    //npm install fs wait async
fetch = require('node-fetch')
fs = require('fs');
await = require('await');
async = require('async');

var pokeNamesArr = ""
var url = "https://pokeapi.co/api/v2/pokemon?limit=2000" //url to the pokemon API

if(process.argv.length < 3){  //Expected third argument is name of input file
    console.log("Must include a file name");
    return -1;
} else{
    pokeNamesArr = readFile(process.argv[2]);
}

//print each Pokemon with their type to the console
printPokeTypeData(url, pokeNamesArr)

//read the input file and return an array of pokemon names.
function readFile (file){ 
    let data = (fs.readFileSync(file)
            .toString())
            .replace('\r', '')
            .split('\n');
    return data;
}
//Query the API for the urls for the individual pokemon names found in the text file
async function getPokeURLS(url,pokeNames){
    let pokeData = [];
    let response = await fetch(url).catch(e => {console.log(e)});
    let data = await response.json();
     data.results.forEach( element => { 
        pokeNames.forEach( pokeName => {
            if(element.name.toLowerCase() === pokeName.toLowerCase()) {
                pokeData.push({
                    name: pokeName,
                    url: element.url
                })
            }
        })
    })
    return  pokeData;
}

//Takes in an array of pokemon names,url objects then follows the url to return an array of
//pokemon names,type[] objects 
async function getPokeTypes(pokeData){
    let fetches = []
    let pokeTypeData = []
    let tempPokemon = {}
    //Create a unique fetch for each pokemon
    //If there are less than 20 pokemon to fetch, fetch concurrently.
    if(pokeData.length < 20){
        for(var element of pokeData){ 
            fetches.push( fetch(element.url) 
                .then(dat => {return dat.json()})
                .catch(err => {console.log(`${element.name}: not found. Error: ${err}`)}))
        }
     } else { 
        for(var element of pokeData){ 
            fetches.push(await fetch(element.url) 
                .then(dat => {return dat.json()})
                .catch(err => {console.log(`${element.name}: not found. Error: ${err}`)}))
        }
    }
    let fetchedData = await Promise.all(fetches).then(pDat => {return pDat}).catch(e => {console.log(`Error: ${e}`)})
   fetchedData.forEach(element => {
        tempPokemon = {}
        tempPokemon['name'] = element.name
        tempPokemon['type'] = [] 
        element.types.forEach(t => { //For each pokemon type
            tempPokemon['type'].push(t.type.name)
            })
        pokeTypeData.push(tempPokemon)
        })
    return pokeTypeData
}

//Depends getPokeURLS(), getPokeTypes()
// Prints off pokemon names and types
async function printPokeTypeData(url, pokeNames){ 
    let pokeTypeData = await  getPokeURLS(url, pokeNames).then(e => {
            return getPokeTypes(e)
    });
    pokeTypeData.forEach(pokemon => {
            console.log(`${pokemon.name}: ${pokemon.type.join(', ')}`)
        })
}

