<template>
    <div>
        <h2 class="text-center">Import Invoices</h2>
        <div class="steps row mb-4 mt-4">
            <div class="col-sm-3">
                <div :class="{'step-header':true,...calcProgressClass(1)}">1. Import Headers</div>
            </div>
            <div class="col-sm-3">
                <div :class="{'step-header':true,...calcProgressClass(2)}">2. Import Details</div>
            </div>
            <div class="col-sm-3">
                <div :class="{'step-header':true,...calcProgressClass(3)}">3. Upload</div>
            </div>
            <div class="col-sm-3">
                <div :class="{'step-header':true,...calcProgressClass(4)}">4. Complete</div>
            </div>
        </div>
        <div class="steps">
            <div class="step1" v-if="step==1">
                <div class="mt-8 mb-8 text-center" v-if="invoices.length == 0">
                    Import
                    <b>Invoice Headers</b> from spreadsheet.
                    <br />Ensure the structure of the sheet follows the
                    <a
                        href="/invoice_headers_template.csv"
                        target="_blank"
                    >Header Template</a>.
                    <br />
                    <br />
                    <base-button type="primary" @click="importInvoiceHeaders()">{{ "Import" }}</base-button>
                    <input
                        type="file"
                        class="hide-file-picker"
                        id="input-excel-header"
                        @change="importInvoiceHeadersEl"
                        ref="invoiceHeadersFile"
                    />
                </div>
                <div v-else>
                    <div class="overflow-hidden mb-3">
                        <base-button
                            class="float-right"
                            type="warning"
                            size="sm"
                            @click="clearInvoiceItems()"
                        >Clear Items</base-button>
                    </div>
                    <div style="max-height:500px;overflow-y:scroll;">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">Id</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Total</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="invoice in this.invoices" :key="invoice.id">
                                    <th scope="row">{{ invoice.id }}</th>
                                    <td>{{ invoice.name }}</td>
                                    <td>${{ currency(invoice.total) }}</td>
                                    <td>{{ invoice.type.toUpperCase() }}</td>
                                    <td style="white-space: pre-wrap">{{ invoice.address }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="mt-4">
                        <!-- <base-button type="warning" @click="closeDialog()">Cancel</base-button> -->
                        <base-button
                            class="float-right"
                            type="primary"
                            @click="goToDetailsStep()"
                        >Next</base-button>
                    </div>
                </div>
            </div>
            <div class="step2" v-if="step==2">
                <div class="mt-8 mb-8 text-center" v-if="this.detailsUploaded==false">
                    Import
                    <b>Invoice Details</b> from spreadsheet.
                    <br />Ensure the structure of the sheet follows the
                    <a
                        href="/invoice_details_template.csv"
                        target="_blank"
                    >Detail Template</a>.
                    <br />
                    <br />
                    <base-button type="primary" @click="importInvoiceDetails()">{{ "Import" }}</base-button>
                    <input
                        type="file"
                        class="hide-file-picker"
                        id="input-excel-header"
                        @change="importInvoiceDetailsEl"
                        ref="invoiceDetailsFile"
                    />
                </div>
                <div v-else class="mt-5">
                    <div class="row mb-4">
                        <div class="col-md-6">
                            <base-input disabled :value="invoices[invoiceIndex].name" />
                        </div>
                        <div class="col-md-6 text-right">
                            <base-button type="default" @click="previousInvoice()">&lt;</base-button>
                            {{ invoiceIndex + 1 }} / {{ invoices.length }}
                            <base-button type="default" @click="nextInvoice()">&gt;</base-button>
                        </div>
                    </div>
                    <div class="invoice-items-list" v-if="invoices[invoiceIndex].items.length != 0">
                        <div class="row">
                            <div class="col-md-5">
                                <b>Item</b>
                            </div>
                            <div class="col-md-2">
                                <b>Qty</b>
                            </div>
                            <div class="col-md-2">
                                <b>Price</b>
                            </div>
                            <div class="col-md-2">
                                <b>Total</b>
                            </div>
                            <div class="col-md-1"></div>
                        </div>

                        <div
                            class="row invoice-item mt-2"
                            v-for="(item, index) in invoices[invoiceIndex].items"
                            :key="index"
                        >
                            <div class="col-md-5">
                                <input
                                    placeholder
                                    name="name"
                                    class="form-control"
                                    v-model="invoices[invoiceIndex].items[index].item"
                                />
                            </div>
                            <div class="col-md-2">
                                <input
                                    placeholder
                                    name="name"
                                    class="form-control"
                                    v-model="invoices[invoiceIndex].items[index].quantity"
                                />
                            </div>
                            <div class="col-md-2">
                                <input
                                    placeholder
                                    type="number"
                                    min="0.01"
                                    max="100000"
                                    name="name"
                                    class="form-control"
                                    v-model="invoices[invoiceIndex].items[index].price"
                                />
                            </div>
                            <div
                                class="col-md-2"
                            >${{currency(invoices[invoiceIndex].items[index].price * invoices[invoiceIndex].items[index].quantity)}}</div>
                            <div class="col-md-1">
                                <base-button
                                    type="warning"
                                    @click="deleteInvoiceItem(invoiceIndex, index)"
                                >&times;</base-button>
                            </div>
                        </div>
                    </div>

                    <div
                        class="invoice-invoice-list"
                        v-if="invoices[invoiceIndex].tasks.length != 0"
                    >
                        <div class="row">
                            <div class="col-md-12">
                                <b>Tasks</b>
                            </div>
                        </div>

                        <div
                            class="row invoice-item mt-2"
                            v-for="(item, index) in invoices[invoiceIndex].tasks"
                            :key="index"
                        >
                            <div class="col-md-11">
                                <input
                                    placeholder
                                    name="name"
                                    class="form-control"
                                    v-model="invoices[invoiceIndex].tasks[index]"
                                />
                            </div>
                            <div class="col-md-1">
                                <base-button
                                    type="warning"
                                    @click="deleteInvoiceTask(invoiceIndex, index)"
                                >&times;</base-button>
                            </div>
                        </div>
                    </div>

                    <!-- <div v-if="invoiceItems.length != 0" class="row invoice-total">
                    <div class="col-md-7"></div>
                    <div class="col-md-2 text-right">
                        <b>Total</b>
                    </div>
                    <div class="col-md-2">
                        <b>${{ currency(invoiceTotal) }}</b>
                    </div>
                    </div>-->

                    <div class="row">
                        <div class="col-md-12 mt-4">
                            <base-button
                                type="primary"
                                @click="goToHeadersStep()"
                            >{{ "Previous Step" }}</base-button>
                            <base-button
                                class="float-right"
                                type="primary"
                                @click="goToUploadStep()"
                            >{{ "Next Step" }}</base-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="step3" v-if="step==3">
                <div style="max-height:500px;overflow-y:scroll;">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Name</th>
                                <th scope="col">Upload Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="invoice in this.invoices" :key="invoice.id">
                                <th scope="row">{{invoice.id}}</th>
                                <td>{{invoice.name}}</td>
                                <td
                                    class="text-uppercase"
                                    :class="[getInvoiceStatusStyle(invoice.upload_status)]"
                                >{{invoice.upload_status}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    Progress..
                    <base-progress type="success" :value="uploadProgress" />
                </div>
                <div>
                    <base-button
                        type="primary"
                        @click="goToDetailsStep()"
                        :disabled="uploading"
                    >Previous Step</base-button>
                    <base-button
                        class="float-right"
                        type="primary"
                        @click="uploadInvoices()"
                    >Upload!</base-button>
                </div>
            </div>
            <div class="step2" v-if="step==4">
                <div class="mt-6 mb-4 text-center">
                    <h1>Import Complete!</h1>
                    <br />
                    <b>Orders Uploaded</b>
                    <br />
                    <b class="text-success">{{completedUploads}}</b>
                    <br />
                    <b>Orders Failed</b>
                    <br />
                    <b class="text-warning">{{failedUploads}}</b>
                    <br />
                    <br />
                    <base-button
                        v-if="failedUploads!==0"
                        type="primary"
                        @click="goToUploadStep()"
                    >{{ "Retry" }}</base-button>
                </div>

                <div class="row">
                    <div class="col-md-12 mt-4">
                        <base-button type="primary" @click="goToUploadStep()">{{ "Previous Step" }}</base-button>
                        <base-button
                            class="float-right"
                            type="primary"
                            @click="close()"
                        >{{ "Close" }}</base-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api/order'
import flatPicker from 'vue-flatpickr-component'
import xlsx from 'xlsx'
import moment from 'moment'

//https://stackoverflow.com/questions/2998784/how-to-output-integers-with-leading-zeros-in-javascript
function pad(num, size) {
    var s = num + ''
    while (s.length < size) s = '0' + s
    return s
}

function now() {
    var dateObj = new Date()
    var month = dateObj.getUTCMonth() + 1
    var day = dateObj.getUTCDate()
    var year = dateObj.getUTCFullYear()

    const date = year + '-' + pad(month, 2) + '-' + pad(day, 2)
    //console.log(date)
    return date
}

function parseFormatted(numStr) {
    if (!numStr) return 0
    return parseFloat(numStr.replace(/,/g, '').replace(/\$/g, ''))
}

function sampleInvoice() {
    let invoice = new Invoice()
    invoice.id = '0001234213'
    invoice.name = 'Sample Invoice Item'
    invoice.date = '5/12/2019'
    invoice.salesTax = 5000
    invoice.total = 25000
    invoice.address = 'yolo'

    let item = new InvoiceItem()
    item.item = 'Sample Item'
    item.description = 'yolo'
    item.quantity = 1
    item.price = 25000
    invoice.items.push(item)

    //return invoice
    return []
}

function invoiceItems(count) {
    let invoices = []
    for (var i = 0; i < count; i++) {
        let invoice = sampleInvoice()
        invoice.id = '0012312' + i
        invoices.push(invoice)
    }
    return invoices
}

class Invoice {
    id = ''
    name = ''
    address = ''
    total = 0
    salesTax = 0
    customerId = 0
    customerName = ''
    notes = ''
    items = []
    // array of strings
    tasks = []
    // upload status, not an actual part of the model
    upload_status = 'pending'
}

class InvoiceItem {
    item = ''
    description = ''
    quantity = 0
    price = 0
}

export default {
    name: 'import-invoices-form',
    components: { flatPicker },
    props: [],
    data: () => {
        return {
            model: {},
            //invoices: [...invoiceItems(10)],
            invoices: [],
            uploading: false,
            hasErrors: false,
            step: 1, // 1, 2, 3 or 4
            // step: 2, // 1, 2 or 3
            invoiceIndex: 0, // for details page
            detailsUploaded: false,
        }
    },
    created() {
        this.model.date = now()
    },
    methods: {
        reset() {
            this.invoices = []
            this.uploading = false
            this.step = 1
            this.invoiceIndex = 0
            this.detailsUploaded = false
        },
        goToHeadersStep() {
            this.step = 1
        },
        goToDetailsStep() {
            this.step = 2
        },
        goToUploadStep() {
            this.step = 3
        },
        goToCompleteStep() {
            this.step = 4
        },
        nextInvoice() {
            if (this.invoiceIndex < this.invoices.length - 1)
                this.invoiceIndex += 1
        },
        previousInvoice() {
            if (this.invoiceIndex > 0) this.invoiceIndex -= 1
        },
        clearInvoiceItems() {
            //while (this.invoices.length > 0) this.invoices.pop()
            this.invoices = []

            this.detailsUploaded = false
            this.invoiceIndex = 0
        },
        deleteInvoiceItem(invoiceIndex, index) {
            this.invoices[invoiceIndex].items.splice(index, 1)
        },
        deleteInvoiceTask(invoiceIndex, index) {
            this.invoices[invoiceIndex].tasks.splice(index, 1)
        },
        close() {
            this.errors.clear()
            // clear steps and data
            this.reset()

            this.step = 1
            this.$emit('cancel')
        },
        create() {},
        importInvoiceHeaders() {
            this.$refs.invoiceHeadersFile.click()
        },
        importInvoiceHeadersEl(e) {
            //console.log('loading file')
            var reader = new FileReader()
            reader.readAsArrayBuffer(e.target.files[0])
            reader.onload = e => {
                const data = new Uint8Array(reader.result)
                const wb = xlsx.read(data, { type: 'array', raw: false })

                const worksheet = wb.Sheets[wb.SheetNames[0]]

                const rows = xlsx.utils.sheet_to_json(worksheet, {
                    raw: false,
                    header: 'A', // just generate plain rows
                })

                rows.splice(0, 4)
                //console.log(rows)

                const HEADER_CUSTOMER_ID = 'A'
                const HEADER_INVOICE_NO = 'B'
                const HEADER_DATE = 'D'
                const HEADER_TOTAL = 'F'
                const HEADER_ADDRESS_1 = 'H'
                const HEADER_ADDRESS_2 = 'I'
                const HEADER_CITY = 'J'
                const HEADER_COUNTRY = 'K'
                const HEADER_ORDER_TYPE = 'L'
                const HEADER_ASSIGNED_TO = 'M'

                // this.invoiceItems = []
                let invoices = []

                for (let row of rows) {
                    // console.log(row)
                    // console.log(row['Invoice/CM #'])
                    if (!row[HEADER_INVOICE_NO]) continue
                    if (row[HEADER_INVOICE_NO] == 'Total') continue

                    let invoice = new Invoice()
                    invoice.id = row[HEADER_INVOICE_NO]
                    invoice.name = row[HEADER_CUSTOMER_ID]
                    invoice.type = row[HEADER_ORDER_TYPE].toLowerCase()
                    invoice.customerName = row[HEADER_CUSTOMER_ID]
                    invoice.customerId = row[HEADER_CUSTOMER_ID]
                    invoice.schedule_at =
                        moment(row[HEADER_DATE], 'MM/DD/YY').format(
                            'YYYY-MM-DD'
                        ) + ' 11:00:00'
                    // console.log(
                    //     moment(row[HEADER_DATE], 'MM/DD/YY').format(
                    //         'YYYY-MM-DD'
                    //     ) + ' 11:00:00'
                    // )
                    invoice.assignee = row[HEADER_ASSIGNED_TO]
                    //invoice.salesTax = parseFormatted(row['Sales Tax'])
                    invoice.total = parseFormatted(row[HEADER_TOTAL])

                    let address = row[HEADER_ADDRESS_1] + '\n'
                    address += row[HEADER_ADDRESS_2] + '\n'
                    address += row[HEADER_CITY] + '\n'
                    address += row[HEADER_COUNTRY]
                    invoice.address = address

                    invoices.push(invoice)
                }

                this.invoices = invoices
                this.detailsUploaded = false
            }
        },
        importInvoiceDetails() {
            this.$refs.invoiceDetailsFile.click()
        },
        importInvoiceDetailsEl(e) {
            var reader = new FileReader()
            reader.readAsArrayBuffer(e.target.files[0])
            reader.onload = e => {
                const data = new Uint8Array(reader.result)
                const wb = xlsx.read(data, { type: 'array' })

                const worksheet = wb.Sheets[wb.SheetNames[0]]

                const rows = xlsx.utils.sheet_to_json(worksheet, {
                    raw: false,
                    header: 'A',
                })

                // create a map of invoice items
                let invoiceMap = {}
                for (let invoice of this.invoices)
                    invoiceMap[invoice.id] = invoice

                //console.log(invoiceMap)

                const DETAIL_INVOICE_NO = 'A'
                const DETAIL_NAME = 'B'
                const DETAIL_DESCRIPTION = 'C'
                const DETAIL_QUANTITY = 'G'
                const DETAIL_UNIT_PRICE = 'H'

                rows.splice(0, 4)
                //console.log(rows)
                for (let row of rows) {
                    //console.log(row)
                    let invoiceId = row[DETAIL_INVOICE_NO]
                    //console.log(invoiceId)
                    if (!invoiceId) continue

                    if (!invoiceMap.hasOwnProperty(invoiceId)) continue
                    //console.log('invoice item valid')

                    const price = row[DETAIL_UNIT_PRICE]
                    const quantity = row[DETAIL_QUANTITY]
                    let invoice = invoiceMap[invoiceId]
                    //console.log(price)
                    if (!this.isRowATask(row)) {
                        let item = new InvoiceItem()
                        item.item = row[DETAIL_NAME]
                        item.quantity = parseFormatted(row[DETAIL_QUANTITY])
                        item.price = parseFormatted(row[DETAIL_UNIT_PRICE])
                        item.description = row[DETAIL_DESCRIPTION]

                        invoice.items.push(item)
                    } else {
                        invoice.tasks.push(row[DETAIL_DESCRIPTION])
                    }
                }

                this.detailsUploaded = true
            }
        },
        isRowATask(row) {
            const DETAIL_QUANTITY = 'G'
            const DETAIL_UNIT_PRICE = 'H'

            const price = row[DETAIL_UNIT_PRICE]
            if (!price) return true
            if (parseFormatted(price) == 0) return true

            const quantity = row[DETAIL_QUANTITY]
            if (!quantity) return true
            if (parseFormatted(quantity) == 0) return true

            return false
        },
        currency(num) {
            //console.log(num)
            return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
        },
        calcProgressClass(curStep) {
            if (curStep < this.step) return { 'step-complete': true }
            if (curStep == this.step) return { 'step-active': true }
            if (curStep > this.step) return { 'step-incomplete': true }
        },
        getInvoiceStatusStyle(status) {
            if (status == 'pending') return { 'text-muted': true }
            if (status == 'complete') return { 'text-success': true }
            if (status == 'error') return { 'text-warning': true }
        },
        uploadInvoices() {
            this.uploading = true

            // reset all errors to pending
            this.invoices.map(x => {
                if (x.upload_status == 'error') x.upload_status = 'pending'
            })
            this.uploadOne()
        },
        uploadOne() {
            let nextItem = this.invoices.find(x => x.upload_status == 'pending')
            if (nextItem == undefined) {
                // no more items left to upload
                this.uploading = false
                this.goToCompleteStep()
                console.log('no more items')
                return
            }

            api.uploadInvoice(nextItem)
                .then(res => {
                    nextItem.upload_status = 'complete'
                })
                .catch(error => {
                    nextItem.upload_status = 'error'
                })
                .finally(() => {
                    // continue uploading
                    this.uploadOne()
                })
        },
    },
    mounted() {},
    computed: {
        invoiceCount() {
            return this.invoices.length
        },
        uploadProgress() {
            let uploaded = this.invoices.filter(
                x => x.upload_status == 'complete'
            ).length

            //console.log()
            return Math.round((uploaded / this.invoices.length) * 100)
        },
        completedUploads() {
            return this.invoices.filter(x => x.upload_status == 'complete')
                .length
        },
        failedUploads() {
            return this.invoices.filter(x => x.upload_status != 'complete')
                .length
        },
    },
}
</script>
<style scoped>
.hide-file-picker {
    position: fixed;
    top: -1000;
    display: none; /* probably wont work on safari*/
}

.steps {
    /* height: 300px; */
}

.step-header {
    border-radius: 4px;
    color: white;
    font-weight: bold;
    padding: 1em;
}
.step-complete {
    background: #9cc8e1;
}

.step-active {
    background: #2184bf;
}

.step-incomplete {
    background: #adadad;
}

.invoice-items-list {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 400px;
}

.invoice-item {
    margin-bottom: 10px;
}
</style>