<template>
  <v-app-bar color="#fcdaad00" flat>
    <v-row>
      <v-col cols="1">
        <div
          v-if="isAdmin"
          class="d-flex justify-space-between align-center px-5"
        >
          <v-icon color="black" @click="openDrawer" large> mdi-menu </v-icon>
        </div>
      </v-col>
      <v-col cols="10" class="d-flex justify-center align-center">
        <v-toolbar-title>
          <user-title v-if="isAuth" />
        </v-toolbar-title>
      </v-col>
      <v-col cols="1"> </v-col>
    </v-row>
  </v-app-bar>
</template>

<script>
import UserTitle from "../components/UserTitle.vue";
export default {
  components: { UserTitle },
  name: "app-navbar",
  data() {
    return {
      drawer: false,
    };
  },
  computed: {
    isAuth() {
      // TODO: uncomment this after login is working.
      // return this.$store.getters.isAuth;
      return true;
    },
    isAdmin() {
      return this.$route.path.includes("admin");
    },
  },
  methods: {
    openDrawer() {
      this.$emit("toggleDrawer");
    },
    canGoBack() {
      if (
        window &&
        window.history &&
        window.history.length &&
        window.history.length > 2
      )
        return true;
      return false;
    },
    goBack() {
      if (this.canGoBack) {
        this.$router.back();
      }
    },
  },
};
</script>
