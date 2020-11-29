
<template>
  <div class="signin">
    <v-container>
      <v-form>
        <v-text-field v-model="mailaddress" label="メールアドレス" required></v-text-field>
        <v-text-field v-model="password" type="password" label="パスワード" required></v-text-field>
        <v-btn @click="login">ログイン</v-btn>
      </v-form>
    </v-container>
    <v-container>
      <p>新しいアカウントを作成しますか？
        <router-link to="/signup">新規登録</router-link>
      </p>
    </v-container>
  </div>
</template>

<script>
import Firebase from './../firebase';

export default {
  methods: {
    login: function () {
      Firebase.login(this.mailaddress, this.password)
      this.$router.push('/')
    }
  }
}
</script>
