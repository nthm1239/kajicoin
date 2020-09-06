<template>
  <div class="Home">
    <v-container fluid >
      <v-row>
        <v-col cols="12">
          <v-btn
            color="accent"
            block
          >
            <v-icon>mdi-home</v-icon>
          </v-btn>
        </v-col>

        <v-col cols="4">
          <v-btn
            color="accent"
            block
          >
            <v-icon>mdi-currency-cny</v-icon>
          </v-btn>
        </v-col>

        <v-col cols="4">
          <v-btn
            color="accent"
            block
          >
            <v-icon>mdi-gift</v-icon>
          </v-btn>
        </v-col>

        <v-col cols="4">
          <v-btn
            color="accent"
            block
          >
            <v-icon>mdi-washing-machine</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>

  export default {
    name: 'Home',

    components: {
    },
  }
</script>
