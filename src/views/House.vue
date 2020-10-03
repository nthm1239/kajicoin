<template>
  <div class="House">
    <v-container>
      <v-row>
        <v-col cols="12">
            <v-data-table
                :headers="headers"
                :items="families"
                hide-default-footer
            >
            </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import firebase from 'firebase'

  export default {
    name: 'House',

    data: () => ({
      headers: [
          {
            text: '名前',
            value: 'name',
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
                this.families.push(snapshotUser.val())
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