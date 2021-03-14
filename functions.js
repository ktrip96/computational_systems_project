// Αρχείο βοηθητικών συναρτήσεων

// συνάρτηση που δημιουργεί ενα map με τις αντιστοιχίσεις των
// typeId με τις περιγραφές τους
const genTypesMap = decisionTypes => {
  let typesMap = new Map();
  decisionTypes.forEach(element => {
    typesMap.set(element.uid, element.label);
  });
  return typesMap;
};

// Δημιουργεί ένα String της μορφής YYYY-MM-DD για μια δοσμένη date
const getDateString = (date) => {
  return date.getFullYear() +
    '-' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + date.getDate()).slice(-2);
};

// Συνάρτηση για την δημιουργία του κειμένου για το Akoma Ntoso αρχείο.
// Γίνεται αξιοποίηση όσων περισσότερων metadata μπορούμε να αντλήσουμε από
// το API της διαύγειας.
const returnAknContent = (typesMaps, data, history, body, signer, organization) => {
  const publishDate = new Date(data.publishTimestamp);
  const now = new Date();
    
  let akn = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<akomaNtoso xmlns="http://docs.oasis-open.org/legaldocml/ns/akn/3.0/CSD13">
    <act contains="singleVersion" name="${data.subject}">
        <meta>
            <identification source="#HB_bot">
                <FRBRWork>
                    <FRBRthis value="/gr/act/${publishDate.getFullYear()}/${
    data.ada
  }/"/>
                    <FRBRuri value="/gr/act/${publishDate.getFullYear()}/${
    data.ada
  }/"/>
                    <FRBRdate date="${getDateString(publishDate)}" name="${
    data.status
  }"/>
                    <FRBRauthor as="#author" href="#"/>
                    <FRBRcountry value="gr"/>
                </FRBRWork>
                <FRBRExpression>
                    <FRBRthis value="/gr/act/${publishDate.getFullYear()}/${
    data.ada
  }/${data.ada}_${getDateString(publishDate)}"/>
                    <FRBRuri value="/gr/act/${publishDate.getFullYear()}/${
    data.ada
  }/${data.ada}_${getDateString(publishDate)}"/>
                    <FRBRdate date="${getDateString(now)}" name="INSERT"/>
                    <FRBRauthor as="#editor" href="#HB_bot"/>
                    <FRBRlanguage language="gr"/>
                </FRBRExpression>
                <FRBRManifestation>
                    <FRBRthis value="/gr/act/${publishDate.getFullYear()}/${
    data.ada
  }/${data.ada}_${getDateString(publishDate)}.xml"/>
                    <FRBRuri value="/gr/act/${publishDate.getFullYear()}/${
    data.ada
  }/${data.ada}_${getDateString(publishDate)}.akn"/>
                    <FRBRdate date="${getDateString(
                      now
                    )}" name="PDFConversion"/>
                    <FRBRauthor as="#editor" href="#HB_bot"/>
                </FRBRManifestation>
            </identification>
            <publication date="${getDateString(publishDate)}" number="${
    data.protocolNumber
  }" name="et" showAs="${organization.label}"/>
            <classification source="#δι@υγεια"/>
            <lifecycle source="#HB_bot">
                <eventRef type="generation" date="${getDateString(
                  publishDate
                )}"/>
            </lifecycle>
            <proprietary source="#HB_bot">
                <DCTerms xmlns:ns2="http://docs.oasis-open.org/legaldocml/ns/akn/3.0/CSD13" xmlns="" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                    <docIssuerRank>${
                      signer.units[0].positionLabel
                    }</docIssuerRank>
                    <dc:description>${data.subject}</dc:description>
                    <dc:language>gr</dc:language>
                    <dc:creator>${signer.firstName} ${
    signer.lastName
  }</dc:creator>
                    <dcterms:created>${getDateString(
                      publishDate
                    )}</dcterms:created>
                    <dc:format>text/xml</dc:format>
                    <dc:type2>ACT</dc:type2>
                    <dc:type>${typesMaps.get(data.decisionTypeId)}</dc:type>
                    <docKYA/>
                    <dc:title>${data.subject}</dc:title>
                    <docProtocol/>
                    <docPol/>
                    <dc:identifier>/gr/act/${publishDate.getFullYear()}/${
    data.ada
  }/${data.ada}_${getDateString(publishDate)}}.akn</dc:identifier>
                    <dc:publisher>${organization.label}</dc:publisher>
                </DCTerms>
            </proprietary>
        </meta>
        <body eId="/gr/act/${publishDate.getFullYear()}/${
    data.ada
  }/main/" wId="/gr/act/${publishDate.getFullYear()}/${data.ada}/main/">
 `;
  akn += body;
  akn += `
  </body>
</akomaNtoso>`;
  return akn;
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

module.exports = { genTypesMap, getDateString, returnAknContent, returnPdfBody };
