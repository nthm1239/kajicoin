<template>
  <div class="Callender">
    <v-container>
        <v-row>
            <v-col cols="9">
                <v-toolbar flat color="white">
                    <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
                        Today
                    </v-btn>
                    <v-btn fab text small color="grey darken-2" @click="prev">
                        <v-icon small>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn fab text small color="grey darken-2" @click="next">
                        <v-icon small>mdi-chevron-right</v-icon>
                    </v-btn>
                    <v-toolbar-title v-if="$refs.calendar">
                        {{ $refs.calendar.title }}
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-menu bottom right>
                        <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            outlined
                            color="grey darken-2"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <span>{{ callenderTypeToLabel[currentCallenderType] }}</span>
                            <v-icon right>mdi-menu-down</v-icon>
                        </v-btn>
                        </template>
                        <v-list>
                        <v-list-item @click="currentCallenderType = 'day'">
                            <v-list-item-title>Day</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="currentCallenderType = 'week'">
                            <v-list-item-title>Week</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="currentCallenderType = 'month'">
                            <v-list-item-title>Month</v-list-item-title>
                        </v-list-item>
                        </v-list>
                    </v-menu>
                </v-toolbar>

                <v-sheet :height="windowSize.y * 0.75 ">
                  <v-calendar
                    ref="calendar"
                    v-model="focus"
                    color="primary"
                    :type="currentCallenderType"
                    :events="events"
                    :event-color="getEventColor"
                    @click:date="showHouseworkDialog"
                    @click:event="showEvent"
                  >
                    <template v-slot:event="{ event }">
                      <v-icon>{{houseworks.find((housework) => housework.label == event.name).icon}}</v-icon>
                    </template>
                    </v-calendar>
                  <v-dialog
                    v-model="houseworkDialog" 
                    persistent 
                    max-width="290"
                    @click:outside="houseworkDialog=false"
                  >
                    <template v-slot:default>
                      <v-card>
                        <v-card-title>家事を登録({{ selectedDt.date }})</v-card-title>
                        <v-divider></v-divider>
                        <v-container>
                          <Housework 
                            :selectedDt="selectedDt.date"
                            :householdId="householdId"
                            :houseworks="houseworks"
                            :families="families"/>
                        </v-container>
                        <v-divider></v-divider>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="green darken-1" text @click="houseworkDialog=false">閉じる</v-btn>
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-dialog>
                  <v-menu
                    v-model="selectedOpen"
                    :close-on-content-click="false"
                    :activator="selectedElement"
                    offset-x
                  >
                    <v-card
                        color="grey lighten-4"
                        min-width="350px"
                        flat
                    >
                      <v-toolbar
                      :color="getEventColor(selectedEvent)"
                      dark
                      >
                      <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                      <v-spacer></v-spacer>
                      <span v-html="selectedEvent.actor"></span>
                      </v-toolbar>
                      <v-card-text>
                      <span v-html="selectedEvent.details"></span>
                      </v-card-text>
                      <v-card-actions>
                      <v-btn
                          text
                          color="primary"
                          @click="selectedOpen = false"
                      >
                          Close
                      </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-menu>
                </v-sheet>
            </v-col>
            <v-col cols="3">
              <House 
                :householdId="householdId"
                :families="families"
              />

              <CompPie :chart-data="chartData" :options="chartOptions"/>
            </v-col>
        </v-row>
    </v-container>
  </div>
</template>

<script>
import firebase from 'firebase'
import House from './House.vue'
import Housework from './Housework.vue'
import CompPie from '@/components/CompPie.vue'

  export default {
    name: 'Callender',
    props: {
      user: Object
    },
    data: () => ({
      focus: '',
      families: [],
      color: '',
      currentCallenderType: 'month',
      callenderTypeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
      },
      selectedDt: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      windowSize: {
        x: 0,
        y: 0,
      },
      iconSize: 0,
      householdId: null,
      houseworks: [],
      houseworkDialog: null,
      // ヒント：nullだと初期表示でエラーになる
      chartData: {
        labels: [],
        datasets: []
      },
      chartOptions: {
        plugins: {
          colorschemes: {
            scheme: 'tableau.Tableau20',
          },
        },
      }
    }),
    mounted () {
      this.onResize()
    },
    watch: {
      user: function(newUser) {
        if(newUser.user) {
          // 世帯IDを取得
          this.householdId = newUser.user.households.findIndex((value) => value)

          // 家事一覧を取得
          this.getHousework(this.householdId)

          // 家事履歴一覧を取得
          this.getHouseworkHistory(this.householdId)

          // 家族一覧を取得
          this.getFamily(this.householdId)
        }
      }
    },
    methods: {
      onResize () {
        this.windowSize = { x: window.innerWidth, y: window.innerHeight }
        this.iconSize = window.innerHeight * 0.1
      },
      setToday () {
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showHouseworkDialog (date) {
        this.selectedDt = date
        this.houseworkDialog = true
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => this.selectedOpen = true, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }
        nativeEvent.stopPropagation()
      },
      getEventColor (event) {
        if(event.actorUserId != null) {
          let actorUser = this.families.filter((user) => user.id == event.actorUserId)[0]
          return actorUser ? actorUser.color.toString() : null
        } else {
          return "secondary"
        }
      },
      async getFamily (householdId) {
        let ref = firebase.database().ref()
        await ref.child("household").child(householdId).child("users")
          .once('value',async (snapshot) => {
            for (let userId in snapshot.val()) {
              await ref.child("user").child(userId)
                .once('value',async (snapshotUser) => {
                  let userLocal = snapshotUser.val();
                  await ref.child("accounts").child(userLocal.accountId)
                    .once('value',async(snapshotAccount) => {
                      userLocal.account = snapshotAccount.val();
                      this.families.push(userLocal)
                    })
                  this.fillData(this.families)
              })
            }
        })
      },
      getHousework (householdId) {
        firebase.database().ref().child(`/housework/${householdId}/items`)
          .once('value',(snapshot) => {
            for (let key in snapshot.val()) {
              let menu = snapshot.val()[key]
              menu.dialog = false
              this.houseworks.push(menu)
            }
          })
      },
      getHouseworkHistory (householdId) {
        firebase.database().ref().child(`/houseworkHistory/${householdId}`)
          .once('value',(snapshot) => {
            for (let key in snapshot.val()) {
              this.events.push(snapshot.val()[key])
            }
          })
      },
      fillData(families) {
        let data = []
        this.families.forEach((member, index) => {
          data[index] = this.events.filter(housework => housework.actorUserId == member.id).length
        });

        this.chartData = {
          labels: families.map(member => member.name),
          datasets: [
            {
              label: 'Pattern1',
              backgroundColor: families.map(member => member.color),
              data: data
            }
          ]
        };
      }
    },
    components: {
      House,
      Housework,
      CompPie
    },
  }
</script>
