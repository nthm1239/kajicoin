import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    status: false,
    householdId: -1,
    houseworks: [],
    houseworkHistory: [],
    family: []
  },
  mutations: {
    onAuthStateChanged(state, payload) {
      state.user = payload.user; //firebaseが返したユーザー情報
      state.householdId = payload.householdId;
      state.houseworks = payload.houseworks;
      state.houseworkHistory = payload.houseworkHistory;
      state.family = payload.family;
    },
    onUserStatusChanged(state, status) {
      state.status = status; //ログインしてるかどうか true or false
    },
    onHouseworkHistoryStateChanged(state, payload) {
      state.houseworkHistory = payload.houseworkHistory;
    },
    onFamilyStateChanged(state, payload) {
      state.family = payload.family;
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    isSignedIn(state) {
      return state.status;
    },
    householdId(state) {
      return state.householdId;
    },
    houseworks(state) {
      return state.houseworks;
    },
    houseworkHistory(state) {
      return state.houseworkHistory;
    },
    family(state) {
      return state.family;
    }
  }
})
