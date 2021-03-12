// String ada = "...";

// node myapp <ada>

//* Requirements */

const { TEXT } = require('./akn_file')
const axios = require('axios')
const fs = require('fs')
console.log('file is, ', TEXT)

//* GET REQUESTS */

let A = 0
// assign the AXN template to content
let content = TEXT

console.log('index of label is:', content.indexOf('label='))

// axios({
//   method: 'get',
//   url: 'https://test3.diavgeia.gov.gr/luminapi/opendata/types',
//   header: {
//     Accept: 'application/json',
//   },
// })
//   .then((resp) => {
//     console.log(resp.data.decisionTypes[0].label)
//     A = resp.data.decisionTypes[0].label
//     // content = `A is: ${A} ! \n`

//     //TODO

//     /**
//      * Aφού έχω πάρει την πληροφορία που θέλω από το GET Request
//      * π.χ. έχω πάρει ένα attribute με όνομα name, και το έχω αποθηκεύσει στη μεταβλητή Α
//      * κάνω ένα search το πεδίο name="BlaBla" στο string του content
//      * και όπου ΒlaBla το κάνω replace με το Α
//      *
//      * Μετά απλά γράφω το καινούργιο content στο αρχείο final.akn
//      */

//     try {
//       const data = fs.writeFileSync(
//         '/home/ktrip96/Pliroforiaka/final.akn',
//         content
//       )
//       //file written successfully
//     } catch (err) {
//       console.error(err)
//     }
//   })
//   .catch((error) => {
//     console.log(error)
//   })
