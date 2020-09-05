
<template>
  <div class="signup">
    <v-container>
      <v-form>
        <v-text-field v-model="mailaddress" label="メールアドレス" required></v-text-field>
        <v-text-field v-model="password" type="password" label="パスワード" required></v-text-field>
        <v-btn @click="signUp">登録</v-btn>
      </v-form>
    </v-container>
    <v-container>
      <p>既に新しいアカウントをお持ちですか？
        <router-link to="/signin">ログイン</router-link>
      </p>
    </v-container>
  </div>
</template>

<script>
import Firebase from './../firebase';

export default {
  methods: {
    signUp: function () {
      Firebase.signup(this.mailaddress, this.password)
      this.$router.push('/signin')
    }
  }
}
</script>

