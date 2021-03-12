const returnAknContent = (object) => {
  return `<FRBRWork label=${object.label}>
            <FRBRthis value="/gr/pd/2015/1/"/>
            <FRBRuri value="/gr/pd/2015/1/"/>
            <FRBRdate date="2015-01-09" name="Publish"/>
            <FRBRdate date="2015-01-09" label="Kostas"/>
            <FRBRauthor as="#author" href="#"/>
            <FRBRcountry value="gr"/>
          </FRBRWork>`
}
// H returnPdfBody επιστρέφει ένα string με το body του pdf.

const returnPdfBody = (array) => {
  // βάλε στο string όλα τα στοιχεία που έχουν y > 301
  let string = ''
  for (let i = 0; i < array.length; i++) {
    if (array[i].y > 301) string = string + array[i].str
  }
  return string
}

module.exports = { returnAknContent, findPdfIndex }
