<template>
  <div class="Housework">
    <v-container>
      <v-row>
        <v-col cols="6">
          <v-sheet :height="windowSize.y * 0.8 ">
            <v-calendar
              color="primary"
              type="day"
            >
              <template v-slot:day-header="{ present }">
                <template
                  v-if="present"
                  class="text-center"
                >
                  Today
                </template>
              </template>

              <template v-slot:interval="{ hour }">
                <div
                  class="text-center"
                >
                  {{ hour }} o'clock
                </div>
              </template>
            </v-calendar>
          </v-sheet>
        </v-col>
        <v-col cols="6">
          <v-row v-resize="onResize" :style="style" >
            <v-col cols="12" v-for="menu in menus" v-bind:key="menu.key">
              <v-dialog v-model="menu.dialog" persistent max-width="290">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="accent"
                    block
                    height="100%"
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{menu.label}}
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="headline">{{ menu.label }}</v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field label="ひとこと" ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="menu.dialog = false">キャンセル</v-btn>
                    <v-btn color="green darken-1" text @click="menu.dialog = false">完了</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>

  export default {
    name: 'Housework',

    data: () => ({
      menus: [
        { title: 'cook', label: '料理', icon: '', dialog: false },
        { title: '', label: '洗濯', icon: 'mdi-washing-machine', dialog: false },
        { title: '', label: '掃除', icon: '', dialog: false },
        { title: '', label: 'ゴミ出し', icon: '', dialog: false },
        { title: '', label: 'etc', icon: '', dialog: false },
      ],
      windowSize: {
        x: 0,
        y: 0,
      },
    }),

    mounted () {
      this.onResize()
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