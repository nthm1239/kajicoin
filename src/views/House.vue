<template>
  <div class="House">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-icon>mdi-home</v-icon>
          {{household.name}}
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
            <v-data-table
                :headers="headers"
                :items="families"
                hide-default-header
                hide-default-footer
            >
              <template v-slot:[`item.name`]="{ item }">
                <v-icon :color="item.color">mdi-account</v-icon>
                {{ item.name }}
              </template>
              <template v-slot:[`item.account.balanc`]="{ item }">
                <v-icon>icon-kjc-coin</v-icon>
                {{ item.account.balance }}
              </template>
            </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import firebase from 'firebase'
import '@/assets/icomoon/style.css'

  export default {
    name: 'House',

    data: () => ({
      headers: [
          {
            text: '名前',
            value: 'name',
          },
          {
            text: '家事コイン',
            value: 'account.balance',
          }
      ],
      families: [],
      windowSize: {
        x: 0,
        y: 0,
      },
      household: null,
      householdId: null
    }),

    mounted () {
      this.onResize()

      // 世帯IDを取得
      this.householdId = this.$store.getters.user.user.households.findIndex((value) => value)

      let ref = firebase.database().ref()

      // 世帯情報を取得
      ref.child("household").child(this.householdId)
        .once('value',(snapshot) => {
            this.household = snapshot.val()
      })

      // 家族一覧を取得
      ref.child("household").child(this.householdId).child("users")
        .once('value',(snapshot) => {
          for (let userId in snapshot.val()) {
            ref.child("user").child(userId)
              .once('value',(snapshotUser) => {
                let user = snapshotUser.val();
                ref.child("accounts").child(user.accountId)
                  .once('value',(snapshotAccount) => {
                    console.log(snapshotAccount)
                    user.account = snapshotAccount.val();
                    this.families.push(user)
                  })
              })
          }
      })

    },

    computed: {
      style () {
        return 'height: ' + this.windowSize.y * 0.8 + 'px;'
      }
    },

    methods: {
      onResize () {
        this.windowSize = { x: window.innerWidth, y: window.innerHeight }
      },
    },
    components: {
    },
  }
</script>