/**
 * @author Sergio Guerra Arencibia
 * @since 01-05-20
 * @file Este fichero implementa una función que realiza un modelo de lenguaje
 * de un fichero csv
 */

const fs = require('fs');
const readline = require('readline');

const file = process.argv.slice(2)[0];
let ceboCount = {};
let noCeboCount = {};

var myInterface = readline.createInterface({
  input: fs.createReadStream(file)
});



function lenguageModel() {
  let data = fs.readFileSync('vocabulary.txt', 'utf-8')
  let vocabularyArray;
  vocabularyArray = data.split(/\s/);

  // Inicializamos los objetos contadores
  for (let i = 0; i < 4; i++)
    vocabularyArray.shift();
  for (let i = 0; i < vocabularyArray.length; i++) {
    ceboCount[vocabularyArray[i]] = 0;
    noCeboCount[vocabularyArray[i]] = 0;
  }
  ceboCount["cebo"] = 0;
  noCeboCount["nocebo"] = 0;

  //Leo las líneas de forma asíncrona mientras voy contando las palabras
  myInterface.on('line', function (line) {
    let aux = line.split(/[^A-Za-z]+/);
    aux = aux.map(v => v.toLocaleLowerCase())

    for (let i = 0; i < aux.length; i++) {
      if (aux[aux.length - 1] === 'cebo') {
        if (ceboCount[aux[i]] !== undefined) {
          ceboCount[aux[i]]++;
        }
      } else {
        if (noCeboCount[aux[i]] !== undefined)
        noCeboCount[aux[i]]++;
      }
    }
  })
}

// Cuando todo se haya contado, escribo los contadores
myInterface.on('close', function() { 
  writeResults();
})
  
function writeResults() {
  // Generamos la información a escribir
  let results = '';
  results += `numtitulares: ${ceboCount["cebo"]} ${noCeboCount["nocebo"]}\n`
  for (element of Object.getOwnPropertyNames(ceboCount)) {
    results += element + " " + ceboCount[element] + " " + noCeboCount[element] + "\n";
  }

  // Escribimos la información
  fs.writeFile('aprendizaje.txt', results, (err) => {
    if (err) throw err;
    console.log("Modelo generado")
  })
}


lenguageModel();