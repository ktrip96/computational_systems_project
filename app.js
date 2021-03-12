//* Requirements */

const { returnAknContent, returnPdfBody } = require('./functions')
const axios = require('axios')
const fs = require('fs')
const PDFExtract = require('pdf.js-extract').PDFExtract
const pdfExtract = new PDFExtract()

/*
    Σειρά:
    - Παίρνουμε το ada σαν input
    - Κάνουμε ένα get request στο https://diavgeia.gov.gr/luminapi/opendata/decisions/:ada/
    - Στο πεδίο documentUrl, έχει το link με το οποίο κατεβάζουμε το pdf της νομοθετικής πράξης.
    - Τρέχουμε την συνάρτηση returnPdfBody, και παίρνουμε το body του pdf.
    - Tρέχουμε μερικά (ή και μόνο ένα GET Request), μαζεύουμε κάποια meta data πεδία
    - Γράφουμε στο αρχείο ${ada}.akn το output της συνάρτησης returnAknContent

*/

const options = {
  normalizeWhitespace: true,
} /* see below */
pdfExtract.extract('file.pdf', options, (err, data) => {
  if (err) return console.log(err)
  let arr = data.pages[0].content
  console.log(returnPdfBody(arr))
})

//* GET REQUESTS */

// axios({
//   method: 'get',
//   url: 'https://test3.diavgeia.gov.gr/luminapi/opendata/types',
//   header: {
//     Accept: 'application/json',
//   },
// })
//   .then((resp) => {
//     console.log(resp.data.decisionTypes[0][target])
//     let result = resp.data.decisionTypes[0][target]
//     content = replaceBetween(content, firstIndex, finalIndex, result)
//     console.log({ newFile: content })

//     try {
//       const data = fs.writeFileSync(
//         '/home/ktrip96/computational_systems_project/final.akn',
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
