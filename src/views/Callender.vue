<template>
  <div class="Callender">
    <v-container>
        <v-row>
            <v-col cols="12">
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

                <v-sheet :height="windowSize.y * 0.8 ">
                    <v-calendar
                    ref="calendar"
                    v-model="focus"
                    color="primary"
                    :type="currentCallenderType"
                    :events="events"
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
                        :color="selectedEvent.color"
                        dark
                        >
                        <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                        <span v-html="selectedEvent.details"></span>
                        </v-card-text>
                        <v-card-actions>
                        <v-btn
                            text
                            color="secondary"
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

  export default {
    name: 'Callender',
    data: () => ({
      focus: '',
      currentCallenderType: 'day',
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
      iconSize: 0 
    }),

    mounted () {
      this.onResize()
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
    },
    components: {
    },
  }
</script>
