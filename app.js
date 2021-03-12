//* Requirements */

const { TEXT } = require('./akn_file')
const axios = require('axios')
const fs = require('fs')
console.log({ oldFile: TEXT })

//* GET REQUESTS */

// assign the AXN template to content
let content = TEXT

// Η μεταβλητή target, έχει το πεδίο του content, που θέλουμε να κάνουμε update.
let target = 'label'
let targetLength = target.length

// η replaceBetween, παίρνει το αρχικό string, 2 indexes και ένα δεύτερο string
// Προσθέτει το δεύτερο string, ανάμεσα στα index του αρχικού.
// π.χ. replaceBetween("1234567", 1, 3, "yo") = 1yo34567
// console.log(replaceBetween('1234567', 1, 2, 'yo'))

const replaceBetween = (string, start, end, what) => {
  return string.slice(0, start) + what + string.slice(end)
}

// To firstIndex υπολογίζει ποιο είναι το index, των πρώτων εισαγωγικών (το + 2 μπαίνει για το =")
// και το finalIndex, των δεύτερων εισαγωγικών.

let firstIndex = content.indexOf(target) + targetLength + 2
let finalIndex = content.indexOf('"', firstIndex)

axios({
  method: 'get',
  url: 'https://test3.diavgeia.gov.gr/luminapi/opendata/types',
  header: {
    Accept: 'application/json',
  },
})
  .then((resp) => {
    console.log(resp.data.decisionTypes[0][target])
    let result = resp.data.decisionTypes[0][target]
    content = replaceBetween(content, firstIndex, finalIndex, result)
    console.log({ newFile: content })

    try {
      const data = fs.writeFileSync(
        '/home/ktrip96/computational_systems_project/final.akn',
        content
      )
      //file written successfully
    } catch (err) {
      console.error(err)
    }
  })
  .catch((error) => {
    console.log(error)
  })
