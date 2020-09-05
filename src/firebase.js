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
        firebase.auth().onAuthStateChanged(user => {
            user = user ? user : {};
            store.commit('onAuthStateChanged', user);
            store.commit('onUserStatusChanged', user.uid ? true : false);
        });
    }
};