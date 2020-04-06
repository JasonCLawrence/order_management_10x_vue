<template>
    <div>
        <input
            type="file"
            class="hide-file-picker"
            id="input-excel"
            @change="importInvoiceEl"
            ref="invoiceFile"
        />

        <h2 class="text-center">Import Orders</h2>
        <form @submit.prevent="update()">
            <div v-if="invoiceItems.length==0" class="text-center empty-dialog">
                Import invoice from spreadsheet.
                Download
                <a
                    href="/template.csv"
                    target="_blank"
                >Template</a>.
                <br />
                <br />
                <base-button type="primary" @click="importInvoice()">{{ "Import" }}</base-button>
            </div>
            <template v-else>
                <div class="row">
                    <div class="col-md-6">
                        <b>Item</b>
                    </div>
                    <div class="col-md-1">
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

                <div class="row invoice-item" v-for="(item, index) in invoiceItems" :key="index">
                    <div class="col-md-5">
                        <input
                            placeholder
                            name="name"
                            class="form-control"
                            v-model="invoiceItems[index].item"
                        />
                    </div>
                    <div class="col-md-2">
                        <input
                            placeholder
                            name="name"
                            class="form-control"
                            v-model="invoiceItems[index].quantity"
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
                            v-model="invoiceItems[index].price"
                        />
                    </div>
                    <div
                        class="col-md-2"
                    >${{currency(invoiceItems[index].price * invoiceItems[index].quantity)}}</div>
                    <div class="col-md-1">
                        <base-button block type="warning" @click="deleteInvoiceItem(index)">
                            <i class="ni ni-fat-remove"></i>
                        </base-button>
                    </div>
                </div>

                <div v-if="invoiceItems.length != 0" class="row invoice-total">
                    <div class="col-md-7"></div>
                    <div class="col-md-2 text-right">
                        <b>Total</b>
                    </div>
                    <div class="col-md-2">
                        <b>${{ currency(invoiceTotal) }}</b>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12 text-right">
                        <base-button type="warning" @click="cancel()">{{ "Cancel" }}</base-button>

                        <base-button
                            type="primary"
                            @click="completeImport()"
                            :disabled="submitting?true:false"
                        >{{ "Import" }}</base-button>
                    </div>
                </div>
            </template>
        </form>
    </div>
</template>

<script>
import api from '@/api/order'
import xlsx from 'xlsx'

//https://stackoverflow.com/questions/6463439/how-to-open-a-file-browse-dialog-using-javascript

export default {
    name: 'import-invoice-dialog',
    data() {
        return {
            invoiceItems: [
                // {
                //     item: 'Sample Item',
                //     description: '',
                //     quantity: 0,
                //     price: 0,
                // },
            ],
            submitting: false,
        }
    },
    methods: {
        update() {},
        currency(num) {
            return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
        },
        /* Task functions */
        addInvoiceItem() {
            this.invoiceItems.push({
                item: '',
                description: '',
                quantity: 0,
                price: 0,
            })
        },
        deleteInvoiceItem(index) {
            this.invoiceItems.splice(index, 1)
        },
        importInvoice() {
            this.$refs.invoiceFile.click()
        },
        importInvoiceEl(e) {
            var reader = new FileReader()
            reader.readAsArrayBuffer(e.target.files[0])
            reader.onload = e => {
                const data = new Uint8Array(reader.result)
                const wb = xlsx.read(data, { type: 'array' })

                const worksheet = wb.Sheets[wb.SheetNames[0]]

                const rows = xlsx.utils.sheet_to_json(worksheet, {
                    raw: false,
                })

                this.invoiceItems = []

                for (let row of rows) {
                    this.invoiceItems.push({
                        ...row,
                        price: row.price.replace(/,/g, ''),
                        quantity: row.quantity.replace(/,/g, ''),
                    })
                }
            }
        },
        completeImport() {
            this.$emit('importItems', this.invoiceItems)
            this.invoiceItems = []
        },
        cancel() {
            this.$emit('cancel')
        },
    },
    mounted() {
        this.invoiceItems = []
    },
    computed: {
        invoiceTotal() {
            let total = 0
            for (let item of this.invoiceItems) {
                total += item.price * item.quantity
            }

            return total
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

.invoice-item {
    margin-bottom: 10px;
}

.invoice-total {
    margin-bottom: 20px;
}

.empty-dialog {
    padding: 3em 0 3em 0;
}
</style>