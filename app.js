//* Requirements */

const { genTypesMap, getDateString, returnAknContent, returnPdfBody } = require('./functions')
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const PDFExtract = require('pdf.js-extract').PDFExtract
const { response } = require('express')
const pdfExtract = new PDFExtract()

async function download(docUrl) {
  const url = encodeURI(docUrl);

  const dir = path.resolve(__dirname, 'temp.pdf');

  const resp = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream',
    authorization: 'Ym9iOmJvYg=='
  });

  resp.data.pipe(fs.createWriteStream(dir));

  return new Promise((resolve, reject) => {
    resp.data.on('end', () => {
      resolve()
    })

    resp.data.on('error', err => {
      reject(err)
    })
  })
}
/*
    Σειρά:
    - Παίρνουμε το ada σαν input
    - Κάνουμε ένα get request στο https://diavgeia.gov.gr/luminapi/opendata/decisions/:ada/
    - Στο πεδίο documentUrl, έχει το link με το οποίο κατεβάζουμε το pdf της νομοθετικής πράξης.
    - Τρέχουμε την συνάρτηση returnPdfBody, και παίρνουμε το body του pdf.
    - Tρέχουμε μερικά (ή και μόνο ένα GET Request), μαζεύουμε κάποια meta data πεδία
    - Γράφουμε στο αρχείο ${ada}.akn το output της συνάρτησης returnAknContent

*/

// Ελέγχει αν έχουμε αποθηκεύσει το αρχείο, έτσι ώστε να αποφεύγουμε τα διπλότυπα.
const isDuplicate = (ada, publishDate) => {
  const fileName = ada + '_' + getDateString(publishDate) + '.akn';
  const dir = path.resolve(__dirname, 'documents');
  let returnState = false;
  // list all files in the directory
  try {
    const files = fs.readdirSync(dir);
    // files object contains all files names
    // log them on console
    files.forEach(file => {
      if (file === fileName) {
        console.log('File already exists.');
        console.log('File: ' + dir + '/' + fileName);
        returnState = true;
      }
    });
  } catch (err) {
    console.log(err);
  } finally {
    return returnState;
  }
};

//* GET REQUESTS */
const ada = process.argv[2];

console.log(ada);
axios.all([
  axios.get('https://diavgeia.gov.gr/luminapi/opendata/types'),
  axios.get(
    encodeURI('https://diavgeia.gov.gr/luminapi/opendata/decisions/' + ada)
  ),
  axios.get(
    encodeURI('https://diavgeia.gov.gr/luminapi/opendata/decisions/' + ada + '/versionlog.json')
  )
])
  .then(resps => {
    const typesMap = genTypesMap(resps[0].data.decisionTypes);
    const publishDate = new Date(resps[1].data.publishTimestamp);

    if (!(isDuplicate(resps[1].data.ada, publishDate))) {
      download(resps[1].data.documentUrl).then(() => {
        const options = {
          normalizeWhitespace: true,
        };
        pdfExtract.extract('temp.pdf', options, (err, data) => {
          if (err) return console.log(err);
          let arr = data.pages[0].content;
          axios
            .all([
              axios.get(
                encodeURI(
                  'https://diavgeia.gov.gr/luminapi/opendata/signers/' +
                    resps[1].data.signerIds[0] +
                    '.json'
                )
              ),
              axios.get(
                encodeURI(
                  'https://diavgeia.gov.gr/luminapi/opendata/organizations/' +
                    resps[1].data.organizationId +
                    '.json'
                )
              ),
            ])
            .then(response => {
              const dir = path.resolve(
                __dirname,
                'documents',
                resps[1].data.ada + '_' + getDateString(publishDate) + '.akn'
              );
              fs.writeFileSync(
                dir,
                returnAknContent(
                  typesMap,
                  resps[1].data,
                  resps[2].data.versions,
                  returnPdfBody(arr),
                  response[0].data,
                  response[1].data
                )
              );
              console.log('File: ' + dir);
            });
          fs.unlink('temp.pdf', err => {
            if (err) {
              throw err;
            }
          });
        });
      });
    }
  }).catch((error) => {
    console.log(error)
  });
