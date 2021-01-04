<template>
  <v-app id="inspire">
    <v-app-bar
      app
      color="primary"
      dark
    >
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
      <v-toolbar-title>Kajicoin</v-toolbar-title>
      <v-btn
        to='/'
        icon
      >
        <v-icon>mdi-calendar</v-icon>
      </v-btn>
      <v-btn
        to='/houseworkHistory'
        icon
      >
        <v-icon>mdi-wallet</v-icon>
      </v-btn>

      <v-spacer></v-spacer>
      <v-menu offset-y v-if="this.userStatus">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            dark
            v-bind="attrs"
            v-on="on"
            text
          >
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item>
            {{ user.user.name }}
          </v-list-item>
          <v-list-item>
            {{ user.email }}
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item link>
            <v-list-item-content class="title" @click="signOut" v-if="this.userStatus">
              ログアウト
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>          
    </v-app-bar>

    <!-- <v-navigation-drawer
      v-if="this.userStatus"
      v-model="drawer"
      app
    >

      <v-list dense>
        <v-list-item link to='/'>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to='/about'>
          <v-list-item-action>
            <v-icon>mdi-email</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

    </v-navigation-drawer> -->


    <v-main>
      <v-container
        fluid
      >
      <router-view 
        :user="user"
        :householdId="householdId"
        :houseworks="houseworks"
        :houseworkHistory="houseworkHistory"
        :family="family"
        :currentUser="family.find((member)=>member.id == user.uid)"
      >
      </router-view>
      </v-container>
    </v-main>
    <v-footer
      color="primary"
      app
    >
      <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import Firebase from './firebase';

  export default {
    props: {
      source: String,
    },
    created: function() {
      Firebase.onAuth();
    },
    data: () => ({
      drawer: null
    }),
    computed: {
      user() {
        return this.$store.getters.user;
      },
      householdId() {
        return this.$store.getters.householdId;
      },
      houseworks() {
        return this.$store.getters.houseworks;
      },
      houseworkHistory() {
        return this.$store.getters.houseworkHistory;
      },
      family() {
        return this.$store.getters.family;
      },
      userStatus() {
        // ログインするとtrue
        return this.$store.getters.isSignedIn;
      }
    },
    methods: {
      signOut: function () {
        Firebase.logout();
      }
    }  
  }
</script>