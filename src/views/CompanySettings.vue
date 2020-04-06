<template>
  <div>
    <base-header class="header pb-8 pt-5 pt-lg-5 d-flex" />

    <div class="container-fluid mt--7 pb-4">
      <div class="row">
        <div class="col-xl-12 order-xl-1">
          <card shadow type="secondary">
            <div slot="header" class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-8">
                  <h3 class="mb-0">Company Settings</h3>
                </div>
                <div class="col-4 text-right"></div>
              </div>
            </div>
            <template>
              <form @submit.prevent>
                <h6 class="heading-small text-muted mb-4">Basic</h6>
                <div class="pl-lg-4">
                  <div class="row">
                    <div class="col-lg-6">
                      <base-input alternative label="Name" placeholder="Name" v-model="model.name" />
                    </div>
                    <div class="w-100"></div>
                    <div class="col-lg-6">
                      <base-input
                        alternative
                        label="Email address"
                        placeholder="jesse@example.com"
                        v-model="model.email"
                      />
                    </div>
                    <div class="w-100"></div>
                  </div>
                </div>
                <hr class="my-4" />
                <!-- Address -->
                <h6 class="heading-small text-muted mb-4">Location</h6>
                <div class="pl-lg-4">
                  <div class="row">
                    <div class="col-md-12">
                      <base-input
                        alternative
                        label="Address"
                        placeholder="Address"
                        v-model="model.address"
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-4">
                      <base-input alternative label="City" placeholder="City" v-model="model.city" />
                    </div>
                    <div class="col-lg-4">
                      <div class="form-group has-label">
                        <label class="form-control-label">
                          Country
                          <!---->
                        </label>
                        <!---->
                        <country-list v-model="model.country" />
                        <!---->
                        <!---->
                      </div>
                    </div>
                    <div class="col-lg-4">
                      <base-input
                        alternative
                        label="Postal code"
                        placeholder="Postal code"
                        v-model="model.zipCode"
                      />
                    </div>
                  </div>
                </div>
                <div class="pl-lg-4">
                  <div class="row">
                    <div class="col-md-12 text-right">
                      <base-button
                        type="primary"
                        @click="updateCompany()"
                        :disabled="submitting"
                      >{{ submitting?"Saving Changes...":"Save Changes" }}</base-button>
                    </div>
                  </div>
                </div>
              </form>
            </template>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/api/company'
import CountryList from '@/views/Company/CountryList'

export default {
    name: 'company-settings',
    components: { CountryList },
    data() {
        return {
            model: {
                name: 'My Company',
                email: '',
                street: '',
                city: 'Kingston',
                country: 'Jamaica',
                zipCode: '',
                about: '',
            },
            submitting: false,
        }
    },
    mounted() {
        api.fetch().then(result => {
            let data = result.data.success.data
            this.model = data
        })
    },
    methods: {
        updateCompany() {
            this.submitting = true
            api.update(this.model)
                .then(res => {})
                .finally(res => {
                    this.submitting = false
                })
        },
    },
}
</script>
<style></style>
