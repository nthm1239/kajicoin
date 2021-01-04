<template>
  <v-list-item>
    <v-list-item-avatar>
      <v-icon :color="getIconColor(source.value)">{{houseworks.find((housework) => housework.label == source.value.name).icon}}</v-icon>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title v-text="source.value.start"></v-list-item-title>
      <v-list-item-subtitle v-text="source.value.details"></v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-action  v-if="currentUser && (source.value.actorUserId == currentUser.id)">
      <v-btn
        color="primary"
        block
        :disabled="source.value.achieved"
        @click="requestKajicoinUnit(source.key, currentUser.account.address)">
        GET
      </v-btn>
    </v-list-item-action>
  </v-list-item>

</template>

<script>
  export default {
    name: 'item-component',
    props: {
      index: { // index of current item
        type: Number
      },
      source: { // here is: {uid: 'unique_1', text: 'abc'}
        type: Object,
        default () {
          return {}
        }
      },
      currentUser: Object,
      householdId: Number,
      houseworks: Array,
      family: Array
    },
    methods: {
      getIconColor (element) {
        if(element.actorUserId != null) {
          let actorUser = this.family.filter((user) => user.id == element.actorUserId)[0]
          return actorUser ? actorUser.color.toString() : null
        } else {
          return "secondary"
        }
      },
      requestKajicoinUnit(key, address) {
        // 家事コインの要求
        this.dispatch('HouseworkHistory', 'request-kajicoin-unit', key, address)
      },
      dispatch (componentName, eventName, ...rest) {
        let parent = this.$parent || this.$root
        let name = parent.$options.name

        while (parent && (!name || name !== componentName)) {
          parent = parent.$parent
          if (parent) {
            name = parent.$options.name
          }
        }
        if (parent) {
          parent.$emit.apply(parent, [eventName].concat(rest))
        }
      }
    }
  }
</script>