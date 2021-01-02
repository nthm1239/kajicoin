<template>
  <div class="Member">
    <v-card
      class="mx-auto"
      outlined
    >
      <v-list-item>
        <v-list-item-avatar
          tile
        >
          <v-icon class="display-2" :color="member.color">mdi-account-circle</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="justify-center">
            {{ member.name }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
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