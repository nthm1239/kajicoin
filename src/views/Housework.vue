<template>
  <div class="Housework">
    <v-container>
      <v-row>
        <v-col cols="12">
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
                    @click="completeDt = getNowYMDhm()"
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
                          <v-text-field label="実施者" v-model="actor"></v-text-field>
                          <v-text-field label="実施日時" v-model="completeDt"></v-text-field>
                          <v-text-field label="ひとこと" v-model="comment"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="cancel(menu)">キャンセル</v-btn>
                    <v-btn color="green darken-1" text @click="register(menu)">完了</v-btn>
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
import firebase from 'firebase'

  export default {
    name: 'Housework',

    data: () => ({
      actor: '',
      comment: '',
      completeDt: '',
      menus: [
        { title: 'cook', label: '料理', icon: '', dialog: false },
        { title: 'washing', label: '洗濯', icon: 'mdi-washing-machine', dialog: false },
        { title: 'clean', label: '掃除', icon: '', dialog: false },
        { title: 'garbage remove', label: 'ゴミ出し', icon: '', dialog: false },
        { title: 'et cetera', label: 'etc', icon: '', dialog: false },
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
      cancel (menu) {
        this.actor = ''
        this.comment = ''
        this.completeDt = ''
        menu.dialog = false
      },
      register (menu) {
        console.log(menu)

        let household = "householdA"

        firebase.database().ref(`/housework/${household}`).push({
          "name": menu.label,
          "details": this.comment,
          "actor": this.actor,
          "start": this.completeDt,
          "end": this.completeDt,
          "color": "primary",
          "timed": true
        })

        this.actor = ''
        this.comment = ''
        this.completeDt = ''
        menu.dialog = false
      },
      getNowYMDhm() {
        var dt = new Date();
        var year = dt.getFullYear();
        var month = ("00" + (dt.getMonth()+1)).slice(-2);
        var day = ("00" + dt.getDate()).slice(-2);
        var hour = ("00" + dt.getHours()).slice(-2);
        var minute = ("00" + dt.getMinutes()).slice(-2);
        var result = `${year}-${month}-${day} ${hour}:${minute}`;
        return result;
      }
    },
    components: {
    },
  }
</script>