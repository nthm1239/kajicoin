<template>
  <div class="Housework">
    <v-container fluid >
      <v-row >
        <v-col cols="4">
          <v-btn
            color="accent"
            fab
          >
              料理
          </v-btn>
        </v-col>

        <v-col cols="4">
          <v-btn
            color="accent"
            fab
          >
              洗濯
          </v-btn>
        </v-col>

        <v-col cols="4">
          <v-btn
            color="accent"
            fab
          >
            掃除
          </v-btn>
        </v-col>

        <v-col cols="4">
          <v-btn
            color="accent"
            fab
          >
            ゴミ出し
          </v-btn>
        </v-col>

        <v-col cols="4">
          <v-btn
            color="accent"
            fab
          >
            etc
          </v-btn>
        </v-col>

      </v-row>
    </v-container>
  </div>
</template>

<script>

  export default {
    name: 'Housework',

    components: {
    },
  }
</script>