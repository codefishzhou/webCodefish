<script>
// import AppIndex from "@remote/AppIndex";

export default {
  name: "HostIndex",
  components: {
    // AppIndex,
  },
  setup() { },
  computed: {
    userData() {
      return this.$store.state.userData;
    },
    initialLoaded() {
      return this.$store.state.initialLoaded;
    },
  },
  mounted() {
    this.$store
      .dispatch("getUserData")
      .catch((err) => {
        console.log(err);
      })
      .then((message) => {
        console.log(message)
      });
  },
};
</script>

<template>
  <router-view />
</template>
