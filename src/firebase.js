import firebase from "firebase";
import store from "./store";

const config = {
    apiKey: process.env.VUE_APP_FB_API_KEY,
    authDomain: process.env.VUE_APP_FB_AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_FB_DATABASE_URL,
    projectId: process.env.VUE_APP_FB_PROJECT_ID,
    storageBucket: process.env.VUE_APP_FB_STORAGE_BUCKET_ID,
    messagingSenderId: process.env.VUE_APP_FB_MESSAGEING_SENDER_ID,
    appId: process.env.VUE_APP_FB_APP_ID
};

export default {
  init() {
      firebase.initializeApp(config);
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
  },
  signup(mailaddress, password) {
      firebase.auth().createUserWithEmailAndPassword(mailaddress, password)
  },
  login(mailaddress, password) {
      // const provider = new firebase.auth.GoogleAuthProvider();
      // firebase.auth().signInWithPopup(provider)
      firebase.auth().signInWithEmailAndPassword(mailaddress, password)
  },
  logout() {
      firebase.auth().signOut()
  },
  onAuth() {
      firebase.auth().onAuthStateChanged(async user => {
          let payload = {};
          if (user) {
              let ref = firebase.database().ref()
              // ログインユーザー情報を取得
              await ref.child(`/user/${user.uid}`)
                  .once('value',(snapshot) => {
                      user.user = snapshot.val()
              })
              payload.user = user;
              payload.householdId = user.user.households.findIndex((value) => value);
              payload.houseworks = await this.getHousework(payload.householdId);
              payload.houseworkHistory = await this.getHouseworkHistory(payload.householdId);
              payload.family = await this.getFamily(payload.householdId);
              store.commit('onAuthStateChanged', payload);
              store.commit('onUserStatusChanged', true);
          } else {
              payload.user = {};
              payload.householdId = -1;
              payload.houseworks = [];
              payload.houseworkHistory = {};
              payload.family = [];
              store.commit('onAuthStateChanged', payload);
              store.commit('onUserStatusChanged', false);
          }
      });
  },
  async getFamily(householdId) {
      let family = [];
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
                    family.push(userLocal)
                  })
            })
          }
      })
      return family
    },
    async getHousework(householdId) {
      let houseworks = [];
      await firebase.database().ref().child(`/housework/${householdId}/items`)
        .once('value',(snapshot) => {
          for (let key in snapshot.val()) {
            let menu = snapshot.val()[key]
            menu.dialog = false
            houseworks.push(menu)
          }
        })
      return houseworks;
    },
    async getHouseworkHistory(householdId) {
      let houseworkHistory = [];
      await firebase.database().ref().child(`/houseworkHistory/${householdId}`)
        .once('value',(snapshot) => {
          houseworkHistory = snapshot.val()
        })
      return houseworkHistory;
    },
    async reloadHouseworkHistory(householdId) {
        let payload = {};
        payload.houseworkHistory = await this.getHouseworkHistory(householdId);
        store.commit('onHouseworkHistoryStateChanged', payload);
    },
    async reloadFamily(householdId) {
        let payload = {};
        payload.family = await this.getFamily(householdId);
        store.commit('onFamilyStateChanged', payload);
    },
    async updateHouseworkHistory(householdId, key, payload) {
      await firebase.database().ref().child(`/houseworkHistory/${householdId}/${key}`)
        .update(payload)
    },
    async updateHouseworkHistoryBulk(householdId, keys, payload) {
      let payloadDataResource = Object.entries(payload).map(([key, value]) => ({key, value}))
      let updateObject = {}
      keys.forEach((keyElement) => {
        let key = `${keyElement}/${payloadDataResource[0].key}`
        updateObject[key] = payloadDataResource[0].value
      })
      await firebase.database().ref().child(`/houseworkHistory/${householdId}`)
        .update(updateObject)
    }
};