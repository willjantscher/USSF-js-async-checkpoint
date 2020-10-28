//load required modules/packages
//in console run this to add to the local repository
    //type npm init to initialize project at start
    //npm install fs wait async
fetch = require('node-fetch')
fs = require('fs');
await = require('await');
async = require('async');

var pokeNamesArr = ""   //array of pokemon being read in
var url = "https://pokeapi.co/api/v2/pokemon?limit=2000" //url to the pokemon API

if(process.argv.length < 3){  //Expected third argument is name of input file
    console.log("Must include a file name");
    return -1;
} else{
    pokeNamesArr = readFile(process.argv[2]);
}

//read the input file and return an array of pokemon names.
function readFile (file){ 
    let data = (fs.readFileSync(file)   //read in file synchronously
            .toString())            //convert to string
            .replace('\r', '')      //replace '\r' with '' 
            .split('\n');   //split along new lines, each array element is a word on a line (a pokemon)
    return data;    //creates an array of pokemon from the input file
}
//Query the API for the urls for the individual pokemon names found in the text file
async function getPokeURLS(url,pokeNames){      //input pokeNames is array of desired pokemon to search for
    let pokeData = [];      //will store the name and url of each pokemon requested
    let response = await fetch(url).catch(e => {console.log(e)});   //fetch from input URL
    let data = await response.json();   //convert the data to .json
     data.results.forEach( element => {     //results object of the .json has objects with pokemon name and associated url. For each of the catalogued pokemon
        pokeNames.forEach( pokeName => {    //for each of our read in pokemon namnes
            if(element.name.toLowerCase() === pokeName.toLowerCase()) {     //if the pokemon on the site is one of our pokemon
                pokeData.push({     //push to this pokeData array (each object has name and url of pokemon)
                    name: pokeName, //from the site
                    url: element.url    //url for that pokemon
                })
            }
        })
    })
    return  pokeData;   //pokeData is an array of objects. Each object has name: pokemonName and url: pokemonUrl
}

//Takes in an array of pokemon names,url objects then follows the url to return an array of
//pokemon names,type[] objects 
async function getPokeTypes(pokeData){
    let fetches = []    //array to store the return information for the fetch of each pokemon urls
    let pokeTypeData = []   //final output array, includes objects for each pokemon that has name: pokemonName and types: pokemon types (in an array?)
    let tempPokemon = {}    //object for individual pokemon, contains name: pokemonName and type: pokemon types (in an array?)
    //Create a unique fetch for each pokemon
    //If there are less than 20 pokemon to fetch, fetch concurrently.
    if(pokeData.length < 20){   //if there are 20 pokemon or less, run together
        for(var element of pokeData){   //for each pokemon
            fetches.push( fetch(element.url)    //fetch data at that url and push to the fetches array (fetch all at the same time)
                .then(dat => {return dat.json()})   //convert to .json format
                .catch(err => {console.log(`${element.name}: not found. Error: ${err}`)}))  //if there is an error, return url not found...
        }
     } else {   //if looking for 20 or more pokemon
        for(var element of pokeData){ 
            fetches.push(await fetch(element.url)   //wait for one fetch to finish before going to next
                .then(dat => {return dat.json()})   //convert to .json
                .catch(err => {console.log(`${element.name}: not found. Error: ${err}`)}))  //catch if error
        }
    }
    //wait for all fetches to fulfill, then catch any errors
    let fetchedData = await Promise.all(fetches).then(pDat => {return pDat}).catch(e => {console.log(`Error: ${e}`)})
   fetchedData.forEach(element => { //for each object in fetchedData, 
        tempPokemon = {}    //pokemon is empty array
        tempPokemon['name'] = element.name  //name key is the name
        tempPokemon['type'] = []    //type key is an array of all types
        element.types.forEach(t => { //For each pokemon type, push type.name to the type key array
            tempPokemon['type'].push(t.type.name)
            })
        pokeTypeData.push(tempPokemon)  //push pokemon object (in desired format) to the output array
        })
    return pokeTypeData //return array full of all pokemon and their types
}

//Depends getPokeURLS(), getPokeTypes()
// Prints off pokemon names and types
async function printPokeTypeData(url, pokeNames){ 
    //first, need to wait for called functions - get all the urls for each pokemon
    let pokeTypeData = await  getPokeURLS(url, pokeNames).then(e => {
            return getPokeTypes(e)  //then, for each pokemon, fetch url data and get poketypes and convert to desired output array
    });
    pokeTypeData.forEach(pokemon => {   //for each object in our final output array
            console.log(`${pokemon.name}: ${pokemon.type.join(', ')}`)  //print to console in desired output format
        })
}


//print each Pokemon with their type to the console
printPokeTypeData(url, pokeNamesArr)