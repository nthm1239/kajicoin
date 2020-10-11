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
            if (user) {
                let ref = firebase.database().ref()
                // ログインユーザー情報を取得
                await ref.child(`/user/${user.uid}`)
                    .once('value',(snapshot) => {
                        user.user = snapshot.val()
                })
                store.commit('onAuthStateChanged', user);
                store.commit('onUserStatusChanged', true);
            } else {
                store.commit('onAuthStateChanged', {});
                store.commit('onUserStatusChanged', false);
            }
        });
    }
};