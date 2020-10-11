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
        <v-col cols="6" v-for="member in families" :key="member">
          <Member :member="member"/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import firebase from 'firebase'
import '@/assets/icomoon/style.css'
import Member from './Member.vue'

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
      Member
    },
  }
</script>