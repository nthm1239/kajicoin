<template>
  <div class="Wallet">
    <v-card
      class="mx-auto"
      :outlined="true"
      :loading="loading"
    >
      <v-alert v-if="errMessage" type="error">
        {{errMessage}}
      </v-alert>
      <v-card-title>{{currentUser ? currentUser.name : ''}} の ウォレット</v-card-title>
      <v-card-subtitle>{{currentUser ? currentUser.account.address : ''}}</v-card-subtitle>
      <v-divider></v-divider>

      <v-card-text>
        <v-row align="center">
          <v-col cols="3">
            <v-icon class="display-3" color="orange">mdi-alpha-k-circle</v-icon>
          </v-col>
          <v-col class="display-2" cols="9">
            {{currentKajicoin}} KJC
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import '@/assets/icomoon/style.css'
import Kajicoin from './../kajicoin';

  export default {
    name: 'Wallet',
    props: {
      currentUser: Object
    },
    data: () => ({
      loading: true,
      hiddenButton: true,
      errMessage: '',
      currentKajicoin : 0
    }),
    components: {
    },
    mounted() {
      if(this.currentUser != undefined) {
        this.getKajicoin(this.currentUser.account.address)
      }
    },
    watch: {
      currentUser: function(newCurrentUser) {
        this.getKajicoin(newCurrentUser.account.address)
      }
    },
    methods: {
      getKajicoin(address) {
        Kajicoin.getKajicoin(this.currentUser.id, address)
          .then((response) => {
            this.currentKajicoin = response.data.point
            this.loading = false
            if (this.currentUser.account.balance - this.currentKajicoin > 0) {
              this.hiddenButton = false
            } else {
              this.hiddenButton = true
            }
          })
          .catch((e) => {
            this.displayErrorWallet(e)
          });        
      },
      loadWalletAsync(address) {
        this.loading = true
        this.hiddenButton = true
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(this.getKajicoin(address))
          }, process.env.VUE_APP_KAJICOIN_API_TIMEOUT_SECONDS * 1000)
        })
      },
      displayErrorWallet(error) {
        this.loading = false
        this.hiddenButton = true
        this.errMessage = error
      }
    }
  }
</script>