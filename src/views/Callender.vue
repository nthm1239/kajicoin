<template>
  <div class="Callender">
    <v-container>
        <v-row>
             <v-col cols="12" md="3">
              <House 
                :householdId="householdId"
                :family="family"
              />
              <CompPie :chart-data="chartData" :options="chartOptions"/>
            </v-col>
            <v-col cols="12" md="9">
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
                    <v-spacer></v-spacer>
                    <v-toolbar-title v-if="$refs.calendar">
                        {{ $refs.calendar.title }}
                    </v-toolbar-title>
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
                            :family="family"
                            @register-housework-history="reload(householdId)"
                            />
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
        </v-row>
    </v-container>
  </div>
</template>

<script>
import Firebase from './../firebase';
import House from './House.vue'
import Housework from './Housework.vue'
import CompPie from '@/components/CompPie.vue'

  export default {
    name: 'Callender',
    props: {
      user: Object,
      householdId: Number,
      houseworks: Array,
      houseworkHistory: Object,
      family: Array
    },
    data: () => ({
      focus: '',
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
      windowSize: {
        x: 0,
        y: 0,
      },
      iconSize: 0,
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
        legend: {
          display: false
        },
        title: {
          display: true,
          text: "家事の回数"
        }
      }
    }),
    computed: {
      events() {
        return Object.values(this.houseworkHistory)
      } 
    },
    mounted () {
      this.onResize()
      if(this.family != undefined){
        this.fillData(this.family)
      }
    },
    watch: {
      family: function(newFamily) {
        this.fillData(newFamily)
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
          let actorUser = this.family.filter((user) => user.id == event.actorUserId)[0]
          return actorUser ? actorUser.color.toString() : null
        } else {
          return "secondary"
        }
      },
      fillData(family) {
        let data = []
        family.forEach((member, index) => {
          data[index] = Object.keys(this.houseworkHistory).filter(key => this.houseworkHistory[key].actorUserId == member.id).length
        });

        this.chartData = {
          labels: family.map(member => member.name),
          datasets: [
            {
              backgroundColor: family.map(member => member.color),
              data: data
            }
          ]
        };
      },
      reload(householdId) {
        Firebase.reloadHouseworkHistory(householdId)
        Firebase.reloadFamily(householdId)
      }
    },
    components: {
      House,
      Housework,
      CompPie
    },
  }
</script>
