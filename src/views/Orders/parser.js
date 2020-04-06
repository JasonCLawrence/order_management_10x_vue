function parseHeaderLabels(rows) {
    // let labels = {
    //     HEADER_CUSTOMER_ID = null,
    //     HEADER_INVOICE_NO = null,
    //     HEADER_DATE = null,
    //     HEADER_TOTAL = null,
    //     HEADER_ADDRESS_1 = null,
    //     HEADER_ADDRESS_2 = null,
    //     HEADER_CITY = null,
    //     HEADER_COUNTRY = null,
    //     HEADER_ORDER_TYPE = null,
    //     HEADER_ASSIGNED_TO = null
    // }

    // header should be the first one here
    let labels = {}
    let row = rows[0]

    for (let col in row) {
        let item = row[col]
        //if (item)
        //    item = item.toLowerCase().trim();

        // switch(item) {
        //     case "invoice no.":
        //         labels.INVOICE
        //         break;
        // }

        if (item) {
            labels[item] = col
        }
    }

    return labels
}

function parseHeader(rows) {
    let labels = parseHeaderLabels(rows)
    rows.splice(0, 1) // remove header row

    results = {
        errors: [],
        items: [],
    }

    // check for all columns
    let hasOrderType = false
    if (labels.hasOwnProperty('Order Type')) hasOrderType = true

    let invoices = []
    for (let row of rows) {
        let invoice = new Invoice()
        invoice.id = row[labels['Invoice No.']]
        invoice.name = row[labels['Customer ID']]
        invoice.type = row[labels['Order Type']].toLowerCase()
        invoice.customerName = row[labels['Customer ID']]
        invoice.customerId = row[labels['Customer ID']]
        invoice.date = row[labels['Date']]
        //invoice.assignee = row[HEADER_ASSIGNED_TO]
        //invoice.salesTax = parseFormatted(row['Sales Tax'])
        invoice.total = parseFormatted(row[labels['Invoice Total']])

        let address = row[labels['Ship To Address 1']] + '\n'
        address += row[labels['Ship To Address 2']] + '\n'
        address += row[labels['Ship To City']] + '\n'
        address += row[labels['Ship To Country']]
        invoice.address = address

        invoices.push(invoice)
    }

    results.items = invoices

    return results
}

function parseDetailsLabels(rows) {
    // let labels = {
    //     DETAIL_INVOICE_NO = null,
    //     DETAIL_NAME = null,
    //     DETAIL_DESCRIPTION = null,
    //     DETAIL_QUANTITY = null,
    //     DETAIL_UNIT_PRICE = null
    // }

    // // header should be the first one here
    // let row = rows[0]

    // for (let col in row) {
    //     let item = row[col]
    //     if (item)
    //         item = item.toLowerCase();

    //     switch(item) {
    //         case "name":
    //             break;
    //     }
    // }

    let labels = {}
    let row = rows[0]

    for (let col in row) {
        let item = row[col]
        //if (item)
        //    item = item.toLowerCase().trim();

        // switch(item) {
        //     case "invoice no.":
        //         labels.INVOICE
        //         break;
        // }

        if (item) {
            labels[item] = col
        }
    }

    return labels
}

function parseDetails(rows, invoices) {
    let labels = parseDetailsLabels(rows)
    rows.splice(0, 1) // remove header row

    results = {
        errors: [],
    }

    let invoices = []
    for (let row of rows) {
        let invoiceId = row[labels['Invoice No.']]
        //console.log(invoiceId)
        if (!invoiceId) continue

        if (!invoiceMap.hasOwnProperty(invoiceId)) continue
        //console.log('invoice item valid')

        const price = row[labels['Unit Price']]
        const quantity = row[labels['Quantity']]
        let invoice = invoiceMap[invoiceId]
        //console.log(price)
        if (!this.isRowATask(row, labels)) {
            let item = new InvoiceItem()
            item.item = row[labels['Item ID']]
            item.quantity = parseFormatted(row[labels['Quantity']])
            item.price = parseFormatted(row[labels['Unit Price']])
            item.description = row[labels['Description for Sales']]

            invoice.items.push(item)
        } else {
            invoice.tasks.push(row[labels['Description for Sales']])
        }
    }

    return results
}

function isRowATask(row, labels) {
    const price = row[labels['Unit Price']]
    if (!price) return true
    if (parseFormatted(price) == 0) return true

    const quantity = row[labels['Quantity']]
    if (!quantity) return true
    if (parseFormatted(quantity) == 0) return true

    return false
}

function parseFormatted(numStr) {
    if (!numStr) return 0
    return parseFloat(numStr.replace(/,/g, '').replace(/\$/g, ''))
}
