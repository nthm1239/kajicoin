<template>
  <div class="Housework">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-row v-resize="onResize" >
            <v-col cols="6" v-for="(menu, index) in houseworks" :key="index">
              <v-dialog 
                v-model="menu.dialog" 
                persistent 
                max-width="290"
                @click:outside="menu.dialog=false"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="accent"
                    block
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>{{ menu.icon }}</v-icon>
                    {{menu.label}}
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="headline">
                    <v-icon>{{ menu.icon }}</v-icon>
                    {{ menu.label }}
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-radio-group
                            :items="families" 
                            item-text="name"
                            item-value="id"
                            v-model="actorUserId"
                            row
                            >
                            <template v-for="user in families">
                              <v-radio :key="user.id"
                                :label="user.name"
                                :value="user.id"
                              />
                            </template>
                          </v-radio-group>
                          <v-text-field label="ひとこと" v-model="comment"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="cancel(menu)">キャンセル</v-btn>
                    <v-btn color="green darken-1" text @click="registerHouseworkHistory(menu)">完了</v-btn>
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
import '@/assets/icomoon/style.css'

  export default {
    name: 'Housework',
    props: {
      selectedDt: String,
      householdId: Number,
      houseworks: Array,
      families: Array
    },
    data: () => ({
      actorUserId: '',
      comment: '',
      windowSize: {
        x: 0,
        y: 0,
      }
    }),

    mounted () {
      this.onResize()

      this.actorUserId = this.$store.getters.user.user.id;

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
        this.actorUserId = this.$store.getters.user.user.id
        this.comment = ''
        menu.dialog = false
      },
      registerHouseworkHistory (menu) {
        firebase.database().ref(`/houseworkHistory/${this.householdId}`).push({
          "name": menu.label,
          "details": this.comment,
          "actorUserId": this.actorUserId,
          "start": this.selectedDt,
          "end": this.selectedDt,
          "color": "primary",
          "timed": true
        })

        // 残高を更新
        let account = this.families[this.families.findIndex((user) => user.id === this.actorUserId)].account
        firebase.database().ref(`/accounts/${account.accountId}/balance`).set(account.balance + 10)

        this.actorUserId = this.$store.getters.user.user.id
        this.comment = ''
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