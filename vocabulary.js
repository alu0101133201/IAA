/**
 * @author Sergio Guerra Arencibia
 * @since 01-05-20
 * @file Este fichero implementa una función que extrae el vocabulario
 * de un fichero csv
 */

const fs = require('fs');

// Elemento set que almacenará el vocabulario
const vocabulary = new Set();
const file = process.argv.slice(2)[0];
let filteredVocabulary;

 
function extractVocabulary() {
  fs.readFile(file, 'utf-8', (err, data) => {
    if (err) throw err;

    let vocabularyArray;
    vocabularyArray = data.split(/[^A-Za-z]+/);
    vocabularyArray = vocabularyArray.map(v => v.toLocaleLowerCase())
    vocabularyArray = vocabularyArray.sort();
    filteredVocabulary = new Set(vocabularyArray);
    filteredVocabulary.delete('cebo');
    filteredVocabulary.delete('nocebo');
    filteredVocabulary.delete('');
    filteredVocabulary = Array.from(filteredVocabulary);
    filteredVocabulary.unshift(`Número de palabras: ${filteredVocabulary.length}`)
    fs.writeFile('vocabulary.txt', filteredVocabulary.join('\n'), (err) => {
      if (err) throw err;
      console.log("Vocabulario extraído")
    })
  })

}

extractVocabulary();
