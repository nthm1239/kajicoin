<template>
  <div class="HouseworkHistory">
    <v-container>
      <Wallet
        ref="Wallet"
        :currentUser="currentUser"
      />
    </v-container>
    <v-container>
      あと {{unachivedHouseworkHistoryDataResource.length * 10}} KJC 獲得できます
      <v-btn
        color="primary"
        block
        :disabled="!unachivedHouseworkHistoryDataResource.length"
        @click="putKajicoinsBulk(currentUser.account.address)"
      >
        まとめてGET
      </v-btn>
    </v-container>
    <v-container>
      {{currentUser ? currentUser.name : ''}} の 家事履歴
      <virtual-list style="height: 360px; overflow-y: auto;"
        :data-key="'key'"
        :data-sources="houseworkHistoryDataResource"
        :data-component="houseworkHistoryItemComponent"
        :extra-props="{ currentUser: currentUser, householdId: householdId, houseworks: houseworks, family: family }"
        @request-kajicoin-unit="console.log($event)"
      />
    </v-container>
  </div>
</template>

<script>
import '@/assets/icomoon/style.css'
import Wallet from './Wallet.vue'
import Kajicoin from './../kajicoin';
import Firebase from './../firebase';
import VirtualList from 'vue-virtual-scroll-list'

import HouseworkHistoryItem from './HouseworkHistoryItem'

export default {
    name: 'HouseworkHistory',
    props: {
      currentUser: Object,
      householdId: Number,
      houseworks: Array,
      houseworkHistory: Object,
      family: Array
    },
    data: () => ({
      houseworkHistoryItemComponent: HouseworkHistoryItem,
    }),
    components: {
      Wallet,
      'virtual-list': VirtualList
    },
    computed: {
      houseworkHistoryDataResource: function() {
        return Object.entries(this.houseworkHistory)
          .map(([key, value]) => ({key, value}))
          .filter((element) => this.currentUser && element.value.actorUserId == this.currentUser.id)  // 自身の家事履歴
          .reverse(); // 降順
      },
      unachivedHouseworkHistoryDataResource: function() {
        return this.houseworkHistoryDataResource
          .filter((element) => element.value.achieved != true)  // 未獲得
      }
    },
    created() {
      this.$on('request-kajicoin-unit', (key, address) => {
        this.putKajicoinUnit(key, address)
      })
    },
    mounted() {

    },
    watch: {

    },
    methods: {
      getIconColor (element) {
        if(element.actorUserId != null) {
          let actorUser = this.family.filter((user) => user.id == element.actorUserId)[0]
          return actorUser ? actorUser.color.toString() : null
        } else {
          return "secondary"
        }
      },
      putKajicoinUnit(key, address) {
        Kajicoin.putKajicoin(address, 10)
          .then(async() => {
            await this.$refs.Wallet.loadWalletAsync(address)
            this.updateHouseworkHistoryAchieved(key)
          })
          .catch((e) => {
            this.$refs.Wallet.displayErrorWallet(e)
          });  
      },
      putKajicoinsBulk(address) {
        let keys = this.unachivedHouseworkHistoryDataResource
          .map((element) => element.key)
        let ammount = keys.length * 10;
        Kajicoin.putKajicoin(address, ammount)
          .then(async() => {
            await this.$refs.Wallet.loadWalletAsync(address)
            this.updateHouseworkHistoryAchievedBulk(keys)
          })
          .catch((e) => {
            this.$refs.Wallet.displayErrorWallet(e)
          });  
      },
      async updateHouseworkHistoryAchieved(key) {
        await Firebase.updateHouseworkHistory(this.householdId, key, {"achieved" : true})
        await Firebase.reloadHouseworkHistory(this.householdId)
      },
      async updateHouseworkHistoryAchievedBulk(keys) {
        await Firebase.updateHouseworkHistoryBulk(this.householdId, keys, {"achieved" : true})
        await Firebase.reloadHouseworkHistory(this.householdId)
      }
  }
}
</script>