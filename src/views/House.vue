<template>
  <div class="House">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-icon>mdi-home</v-icon>
          {{ householdName }}
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
    props: {
      householdId: Number,
      families: Array
    },
    data: () => ({
      household: null,
      householdName: null,
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
      windowSize: {
        x: 0,
        y: 0,
      },
    }),

    mounted () {
      this.onResize()
    },

    watch: {
      householdId: function(newHouseHoldId) {
          let ref = firebase.database().ref()

          // 世帯情報を取得
          ref.child("household").child(newHouseHoldId)
              .once('value',(snapshot) => {
                  //this.household = snapshot.val()
                  this.household = snapshot.val()
                  this.householdName = this.household.name
          })
      }
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