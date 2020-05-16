/**
 * @author Sergio Guerra Arencibia
 * @since 01-05-20
 * @file Este fichero implementa una función que realiza una clasificación 
 * del corpus a partir del modelo de lenguaje generado en parendizajeLog.txt
 */
const fs = require('fs');
const readline = require('readline');

const file = process.argv.slice(2)[0];
const corpusFile = process.argv.slice(3)[0];

let totalCeboProb = {};
let totalNoCeboProb = {};
let ceboProb;
let noCeboProb;

function readProb() {
  let aprendizajeLog = fs.readFileSync(file, 'utf8');
  let strings = aprendizajeLog.split(/\n/);
  let header = strings[0].split(' ');

  ceboProb = header[1];
  noCeboProb = header[2];

  for (let i = 1; i < strings.length; i++) {
    let currentData = strings[i].split(' ');
    if (currentData[0] !== ' '){
      totalCeboProb[currentData[0]] = currentData[1];
      totalNoCeboProb[currentData[0]] = currentData[2];
    }
  }
}

function readCorpus() {
  let corpus = fs.readFileSync(corpusFile, 'utf8');
  let strings = corpus.split(/\n/);
  let results = '';

  for (let i = 0; i < strings.length; i++) {
    let ceboProbability = parseFloat(ceboProb);
    let noCeboProbability = parseFloat(noCeboProb);
    let currentString = strings[i].split(' ');
    currentString = currentString.map(v => v.toLocaleLowerCase())

    for (let j = 0; j < currentString.length; j++) {
      if (totalCeboProb[currentString[j]] !== undefined){
        ceboProbability += parseFloat(totalCeboProb[currentString[j]])
        noCeboProbability += parseFloat(totalNoCeboProb[currentString[j]])
      }
    }
    results += `${strings[i].slice(0, strings[i].length - 1)} ; ${ceboProbability.toFixed(2)} , ${noCeboProbability.toFixed(2)}`
    if (ceboProbability > noCeboProbability)
      results += ' ; cebo\n'
    else 
    results += ' ; nocebo\n'
  }

  fs.writeFile('results.csv', results, (err) => {
    if (err) throw err;
    console.log("Clasificación realizada")
  })
}

function clasificar() {
  readProb();
  readCorpus();
}


clasificar();