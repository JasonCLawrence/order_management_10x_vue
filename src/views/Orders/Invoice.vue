<template>
    <div>
        <h6 class="heading-small text-muted mb-4">Invoice</h6>
        <div
            v-if="invoiceItems && invoiceItems.length == 0"
            class="text-center"
            style="margin:5em 0;"
        >
            No Invoice items created as yet..
            <br />
            <br />
            <base-button type="primary" @click="addInvoiceItem()">Add Your First Invoice Item</base-button>
        </div>
        <template v-else>
            <form @submit.prevent="update()">
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
                    <template v-if="invoiceItems[index].deleted == true" class="text-strikethrough">
                        <div class="col-md-6 strike pad-12">{{ invoiceItems[index].item }}</div>
                        <div class="col-md-1 strike">{{ invoiceItems[index].quantity }}</div>
                        <div class="col-md-2 strike">{{ invoiceItems[index].price }}</div>
                        <div
                            class="col-md-2 line-total strike"
                        >${{currency(invoiceItems[index].price * invoiceItems[index].quantity)}}</div>
                        <div class="col-md-1">
                            <base-button block type="success" @click="restoreInvoiceItem(index)">
                                <i class="ni ni-fat-add"></i>
                            </base-button>
                        </div>
                    </template>
                    <template v-else>
                        <div class="col-md-6">
                            <input
                                placeholder
                                name="name"
                                class="form-control"
                                v-model="invoiceItems[index].item"
                            />
                        </div>
                        <div class="col-md-1">
                            <input
                                placeholder
                                type="number"
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
                            class="col-md-2 line-total"
                        >${{currency(invoiceItems[index].price * invoiceItems[index].quantity)}}</div>
                        <div class="col-md-1">
                            <base-button block type="warning" @click="deleteInvoiceItem(index)">
                                <i class="ni ni-fat-remove"></i>
                            </base-button>
                        </div>
                    </template>
                </div>

                <div class="row">
                    <div class="col-md-12">
                        <base-button
                            size="sm"
                            type="primary"
                            @click="addInvoiceItem()"
                            :disabled="submitting?true:false"
                        >{{ "Add Item" }}</base-button>
                    </div>
                </div>

                <div v-if="invoiceItems.length != 0" class="row invoice-total">
                    <div class="col-md-8"></div>
                    <div class="col-md-1">
                        <b>Total</b>
                    </div>
                    <div class="col-md-2">
                        <b>${{ currency(invoiceTotal) }}</b>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <base-button
                            type="primary"
                            @click="downloadInvoice()"
                            :disabled="submitting?true:false"
                        >Download</base-button>
                    </div>
                    <div class="col-md-6 text-right">
                        <base-button
                            type="primary"
                            @click="updateInvoice()"
                            :disabled="submitting?true:false"
                        >{{ submitting?"Saving Changes...":"Save Changes" }}</base-button>
                    </div>
                </div>
            </form>
        </template>
    </div>
</template>

<script>
import api from '@/api/order'
import { uuidv4 } from '@/utils'
import xlsx from 'xlsx'
import ImportInvoiceDialog from './ImportInvoiceDialog'

//https://stackoverflow.com/questions/6463439/how-to-open-a-file-browse-dialog-using-javascript

export default {
    name: 'invoice',
    components: { ImportInvoiceDialog },
    data() {
        return {
            invoiceItems: [],
            submitting: false,
            importDailogVisible: false,
            hash: null,
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
                hash: uuidv4(),
                description: '',
                quantity: 0,
                price: 0,
                deleted: false,
            })
        },
        deleteInvoiceItem(index) {
            this.invoiceItems[index].deleted = true
        },
        restoreInvoiceItem(index) {
            this.invoiceItems[index].deleted = false
        },
        downloadInvoice() {
            this.submitting = true
            api.updateInvoice(this.$route.params.id, this.invoiceItems)
                .then(result => {
                    let items = result.data.success.data
                    this.invoiceItems = items.map(x => {
                        x.deleted = false
                        return x
                    })

                    this.hashItems()

                    api.downloadInvoice(this.$route.params.id)
                })
                .finally(() => {
                    this.submitting = false
                })
        },
        updateInvoice() {
            return new Promise((resolve, reject) => {
                this.submitting = true
                api.updateInvoice(this.$route.params.id, this.invoiceItems)
                    .then(result => {
                        this.$swal({
                            title: 'Invoice Updated',
                            type: 'success',
                        })

                        let items = result.data.success.data
                        this.invoiceItems = items.map(x => {
                            x.deleted = false
                            return x
                        })

                        this.hashItems()
                        resolve()
                    })
                    .catch(error => {
                        this.$swal({
                            title: error.response.data.error.message,
                            type: 'error',
                        })
                        reject()
                    })
                    .finally(() => {
                        this.submitting = false
                    })
            })
        },
        getHash() {
            return JSON.stringify(this.invoiceItems)
        },
        hashItems() {
            this.hash = this.getHash()
        },
        hasUnsavedChanges() {
            let newHash = this.getHash()
            if (this.hash != newHash) return true
            return false
        },
    },
    mounted() {
        api.fetchInvoice(this.$route.params.id).then(result => {
            let invoiceItems = result.data.success.data
            this.invoiceItems = invoiceItems.map(x => {
                x.deleted = false
                return x
            })

            this.hashItems()
        })
    },
    computed: {
        invoiceTotal() {
            let total = 0
            for (let item of this.invoiceItems) {
                if (item.deleted) continue
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
}

.invoice-item {
    margin-bottom: 10px;
}

.pad-12 {
    padding: 12px !important;
}

.invoice-total {
    margin-bottom: 20px;
}

.line-total {
    padding: 0.5em 0;
}

.strike {
    text-decoration: line-through;
    padding: 12px 27px;
    font-weight: bold;
    color: #fa3a0e;
}
</style>
<style>
.wide-modal {
    max-width: 900px !important;
}
</style>