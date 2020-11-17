<template>
  <div class="Member">
    <v-card>
        <v-card-title class="justify-center">
            <v-icon :color="member.color">mdi-account-circle</v-icon>
        </v-card-title>
        <v-card-title class="justify-center">
            {{ member.name }}
        </v-card-title>
        <v-card-title class="justify-center">
            {{ member.account.balance }} P
        </v-card-title>
    </v-card>
  </div>
</template>

<script>
import '@/assets/icomoon/style.css'

  export default {
    name: 'Member',
    props: {
      member: Object
    },
    data: () => ({

    }),
    components: {
    },
  }
</script>