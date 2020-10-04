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
                    @click:event="showEvent"
                    ></v-calendar>
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
              <House/>
              <Housework/>
            </v-col>
        </v-row>
    </v-container>
  </div>
</template>

<script>
import firebase from 'firebase'
import House from './House.vue'
import Housework from './Housework.vue'

  export default {
    name: 'Callender',
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
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      windowSize: {
        x: 0,
        y: 0,
      },
      iconSize: 0, 
      household: null
    }),

    mounted () {
      this.onResize()

      // 世帯IDを取得
      this.household = this.$store.getters.user.user.households.findIndex((value) => value)

      // 家事一覧を取得
      firebase.database().ref(`/housework/${this.household}`)
          .once('value',(snapshot) => {
              for (let key in snapshot.val()) {
                  this.events.push(snapshot.val()[key])
              }
          })

      // 家族一覧を取得
      let ref = firebase.database().ref()
      ref.child("household").child(this.household).child("users")
        .once('value',(snapshot) => {
          for (let userId in snapshot.val()) {
            ref.child("user").child(userId)
              .once('value',(snapshotUser) => {
                this.families.push(snapshotUser.val())
              })
          }
      })

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
          return this.families.filter((user) => user.id == event.actorUserId)[0].color.toString()
        } else {
          return "secondary"
        }
      },
    },
    components: {
      House,
      Housework
    },
  }
</script>
