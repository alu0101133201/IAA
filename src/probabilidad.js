/**
 * @author Sergio Guerra Arencibia
 * @since 01-05-20
 * @file Este fichero implementa una función que realiza el cálculo
 * de error de la clasificación
*/

const fs = require('fs');

const firstFile = process.argv.slice(2)[0];
const secondFile = process.argv.slice(3)[0];

function testProb() {
  let firstData = fs.readFileSync(firstFile, 'utf8')
  firstData = firstData.split('\n')
  let secondData = fs.readFileSync(secondFile, 'utf8')
  secondData = secondData.split('\n')

  let matchCount = 0;
  let totalCount = 0;

  if (firstData.length !== secondData.length)
    throw "Los corpus a comparar son distintos\n";

  for (let i = 0; i < firstData.length; i++) {
    totalCount++;
    let currentFirstData = firstData[i].split(/\s+|,/);;
    let currentSecondData = secondData[i].split(/\s+|,/);
    if (currentFirstData[currentFirstData.length - 1] == currentSecondData[currentSecondData.length - 1]) {
      matchCount++;
    }
  }
  console.log("El porcentaje de acierto es de: ",( (matchCount / totalCount) * 100).toFixed(2), "%")
}
testProb()