<template>
    <div>
        <h6 class="heading-small text-muted mb-4">Tasks</h6>
        <div v-if="tasks.length == 0" class="text-center" style="margin:5em 0;">
            No tasks created as yet..
            <br />
            <br />
            <base-button type="primary" @click="addTask()">Add Your First Task</base-button>
        </div>
        <template v-else>
            <div class="row task" v-for="(item, index) in tasks" :key="index">
                <template v-if="item.deleted == false">
                    <div class="col-md-1">
                        <base-checkbox class="mb-3" v-model="tasks[index].checked"></base-checkbox>
                    </div>
                    <div class="col-md-10">
                        <input
                            placeholder="Luxury Car"
                            name="name"
                            class="form-control"
                            v-model="tasks[index].name"
                        />
                    </div>
                </template>
                <template v-else>
                    <div class="col-md-11 deleted-task">{{item.name?item.name:"empty task"}}</div>
                </template>
                <div class="col-md-1">
                    <base-button
                        v-if="item.deleted == false"
                        type="warning"
                        @click="deleteTask(index)"
                        icon="ni ni-fat-remove"
                    ></base-button>
                    <base-button
                        v-if="item.deleted == true"
                        block
                        type="success"
                        @click="restoreTask(index)"
                    >
                        <i class="ni ni-fat-add"></i>
                    </base-button>
                </div>
            </div>

            <div class="row">
                <div class="col-md-12">
                    <base-button
                        size="sm"
                        type="primary"
                        @click="addTask()"
                        :disabled="submitting?true:false"
                    >{{ "Add Task" }}</base-button>
                </div>
            </div>

            <div class="row">
                <div class="col-md-12">
                    <base-button
                        type="primary"
                        @click="updateTasks()"
                        class="float-right"
                        :disabled="submitting?true:false"
                    >{{ submitting?"Saving Changes...":"Save Changes" }}</base-button>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import api from '@/api/order'

export default {
    name: 'tasks',
    data() {
        return {
            tasks: [
                {
                    checked: true,
                    name: 'Simple item task...',
                    deleted: false,
                },
            ],
            submitting: false,
            hash: null,
        }
    },
    methods: {
        update() {},
        currency(num) {
            return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
        },
        /* Task functions */
        addTask() {
            this.tasks.push({
                checked: false,
                name: '',
                deleted: false,
            })
        },
        deleteTask(index) {
            this.tasks[index].deleted = true
        },
        restoreTask(index) {
            this.tasks[index].deleted = false
        },
        updateTasks() {
            this.submitting = true
            api.updateTasks(this.$route.params.id, this.tasks)
                .then(result => {
                    let tasks = result.data.success.data
                    this.tasks = tasks.map(x => {
                        x.checked = !!x.checked
                        x.deleted = false
                        return x
                    })

                    this.hashItems()

                    this.$swal({
                        title: 'Tasks Updated',
                        type: 'success',
                    })
                })
                .catch(error => {
                    this.$swal({
                        title: error.response.data.error.message,
                        type: 'error',
                    })
                })
                .finally(() => {
                    this.submitting = false
                })
        },
        getHash() {
            return JSON.stringify(this.tasks)
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
        api.fetchTasks(this.$route.params.id).then(result => {
            let tasks = result.data.success.data
            this.tasks = tasks.map(x => {
                x.checked = !!x.checked
                x.deleted = false
                return x
            })

            this.hashItems()
        })
    },
}
</script>

<style lang="scss" scoped>
.task {
    .form-control {
        border: 0;
        border-bottom: 2px solid rgb(202, 209, 215);
        border-radius: 0;
    }
    margin-bottom: 10px;
}

.task {
    .custom-checkbox {
        width: 100%;
        height: 100%;
    }
}
</style>