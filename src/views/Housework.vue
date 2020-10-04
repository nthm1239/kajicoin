<template>
  <div class="Housework">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-row v-resize="onResize" >
            <v-col cols="6" v-for="menu in menus" v-bind:key="menu.key">
              <v-dialog v-model="menu.dialog" persistent max-width="290">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="accent"
                    block
                    v-bind="attrs"
                    v-on="on"
                    @click="completeDt = getNowYMDhm()"
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
import '@/assets/icomoon/style.css'

  export default {
    name: 'Housework',

    data: () => ({
      actorUserId: '',
      comment: '',
      completeDt: '',
      families: [],
      menus: [
        { title: 'cook', label: '料理', icon: 'icon-kjc-cook', dialog: false },
        { title: 'washing', label: '洗濯', icon: 'icon-kjc-washing', dialog: false },
        { title: 'clean', label: '掃除', icon: 'icon-kjc-clean', dialog: false },
        { title: 'garbage remove', label: 'ゴミ出し', icon: 'icon-kjc-garbage-remove', dialog: false },
        { title: 'et cetera', label: 'etc', icon: 'icon-kjc-etcetera', dialog: false },
      ],
      windowSize: {
        x: 0,
        y: 0,
      },
      household: null
    }),

    mounted () {
      this.onResize()

      // 
      this.actorUserId = this.$store.getters.user.user.id;

      // 世帯IDを取得
      this.household = this.$store.getters.user.user.households.findIndex((value) => value)

      // 家族一覧を取得
      let ref = firebase.database().ref()
      ref.child("household").child(this.household).child("users")
        .once('value',(snapshot) => {
          for (let userId in snapshot.val()) {
            ref.child("user").child(userId)
              .once('value',(snapshotUser) => {
                let user = snapshotUser.val();
                ref.child("accounts").child(user.accountId)
                  .once('value',(snapshotAccount) => {
                    user.account = snapshotAccount.val();
                    this.families.push(user)
                  })
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
      cancel (menu) {
        this.actorUserId = this.$store.getters.user.user.id
        this.comment = ''
        this.completeDt = ''
        menu.dialog = false
      },
      register (menu) {
        firebase.database().ref(`/housework/${this.household}`).push({
          "name": menu.label,
          "details": this.comment,
          "actorUserId": this.actorUserId,
          "start": this.completeDt,
          "end": this.completeDt,
          "color": "primary",
          "timed": true
        })

        // 残高を更新
        let account = this.families[this.families.findIndex((user) => user.id === this.actorUserId)].account
        firebase.database().ref(`/accounts/${account.accountId}/balance`).set(account.balance + 10)

        this.actorUserId = this.$store.getters.user.user.id
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