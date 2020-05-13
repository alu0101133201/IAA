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
// Variable que almacenará en número total de cadenas del corpus cebo
let corpusCeboCount = 0;
// Variable que almacenará el número total de cadenas del corpus nocebo
let corpusNoCeboCount = 0;
// Variable que almacenará el número total de cadenas de ambos corpus
let totalNumber = 0;
// Variable que almacenará nuetro vocabulario
let vocabularyArray;

// Creamos la infterfaz para leer el fichero .csv
var myInterface = readline.createInterface({
  input: fs.createReadStream(file)
});


// Función principal que genera los modelos de lenguaje que necesitamos 
// aprendizaje.txt y aprendizajeLog.txt
function lenguageModel() {
  let data = fs.readFileSync('vocabulary.txt', 'utf-8')
  vocabularyArray = data.split(/\s/);
  vocabularyArray.push('<UNK>')

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
    totalNumber++;
    let aux = line.split(/[^A-Za-z]+/);
    aux = aux.map(v => v.toLocaleLowerCase())

    for (let i = 0; i < aux.length; i++) {
      if (aux[aux.length - 1] === 'cebo') {
        if (ceboCount[aux[i]] !== undefined) {
          corpusCeboCount++;
          ceboCount[aux[i]]++;
        }
      } else {
        if (noCeboCount[aux[i]] !== undefined)
        corpusNoCeboCount++;
        noCeboCount[aux[i]]++;
      }
    }
  })
}

// Cuando todo se haya contado, escribo los contadores
myInterface.on('close', function() { 
  // No se lo resto porque el número de palabras cebo/nocebo son el número de finales
  // de línea que existen en los corpus
  // corpusCeboCount -= ceboCount["cebo"];
  // corpusNoCeboCount -= noCeboCount["nocebo"]

  // Contamos los finales de línea en sus respectivos contadores
  ceboCount["</s>"] = ceboCount["cebo"];
  noCeboCount["</s>"] = noCeboCount["nocebo"];

  // Escribimos en los ficheros
  writeAprendizaje();
  writeAprendizajeLog();
})

// Función que escribe el fichero aprendizajeLog.txt que contiene las probabilidades
// de las palabras de los corpus en el espacio logarítmico y con suavizado laplaciano
function writeAprendizajeLog() {
  let results = '';
  results += `numtitulares: ${Math.log(ceboCount["cebo"] / totalNumber)} ${Math.log(noCeboCount["nocebo"] / totalNumber)}\n`;

  for (element of Object.getOwnPropertyNames(ceboCount)) {
    if (element !== 'cebo' && element !== 'noCebo') {
      ceboProb = (ceboCount[element] + 1) / (corpusCeboCount + vocabularyArray.length);
      noCeboProb = (noCeboCount[element] + 1) / (corpusNoCeboCount + vocabularyArray.length);
      results += element + " " + Math.log(ceboProb) + " " + Math.log(noCeboProb) + "\n";
    }
  }

  // Escribimos la información
  fs.writeFile('aprendizajeLog.txt', results, (err) => {
    if (err) throw err;
    console.log("Modelo generado")
  })
}
  
// Función que escribe el fichero aprendizaje.txt que contiene los contadores de 
// las palabras de los corpues.
function writeAprendizaje() {
  // Generamos la información a escribir
  let results = '';
  results += `numtitulares: ${ceboCount["cebo"]} ${noCeboCount["nocebo"]}\n`
  for (element of Object.getOwnPropertyNames(ceboCount)) {
    if (element !== 'cebo' && element !== 'noCebo')
      results += element + " " + ceboCount[element] + " " + noCeboCount[element] + "\n";
  }

  // Escribimos la información
  fs.writeFile('aprendizaje.txt', results, (err) => {
    if (err) throw err;
    console.log("Modelo generado")
  })
}


lenguageModel();