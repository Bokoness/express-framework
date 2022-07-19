<template>
  <v-navigation-drawer class="drawer" app right v-model="openModal">
    <v-spacer class="mb-16"></v-spacer>
    <div class="item-list">
      <!-- name -->
      <span class="white--text subtitle-1 mb-4" v-text="title" />
      <!-- links -->
      <div
        :class="{ 'current-page': $route.path === item.route }"
        class="mb-3 btn-wrapper"
        v-for="(item, i) in items"
        :key="i"
      >
        <v-btn @click="$router.push(item.route)" elevation="0" class="py-6"
          >{{ item.title }}
        </v-btn>
      </div>
      <v-btn color="red" @click="logout" elevation="0" class="py-6 white--text">
        יציאה
      </v-btn>
    </div>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "app-drawer",
  props: { value: Boolean },
  data() {
    return {
      excelDialog: false,
    }
  },
  computed: {
    isAdmin() {
      return this.$route.path.includes("admin")
    },
    items() {
      if (!this.isAdmin) return []
      const buttonsData = [
        {
          title: "מסך אירועים",
          route: "/dashboard-admin",
        },
        {
          title: "ניהול אירוע בזמן אמת",
          route: "/event-admin",
        },
        {
          title: "דוחו”ת",
          route: "/todo/logistics",
        },
      ]
      // const appRoutes = this.$router.getRoutes();
      // filter unauthorized routes
      return buttonsData.filter((/*{ route: routeName }*/) => {
        // const route = appRoutes.find(({ name }) => name === routeName);
        // const routeMaxRole = route?.meta?.maxRole;
        // const userRole = this.$store.getters?.role;
        // return userRole <= routeMaxRole;
        return true
      })
    },
    title() {
      let title = ``
      title += this.$store.getters.username + " - "
      if (this.isAdmin) {
        title += `יו"ר - `
      }
      title += this.$store.getters.team
      return title
    },
    openModal: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit("input", val)
      },
    },
  },
  methods: {
    goRoute(r) {
      this.$router.push({ name: r })
      this.openModal = false
    },
    async logout() {
      await this.$store.dispatch("auth/logout", {
        toastOptions: { disabled: true },
      })
      await this.$router.push({ name: "Login" })
    },
  },
}
</script>

<style lang="scss" scoped>
.drawer {
  background-color: var(--grey-transparent) !important;

  .item-list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    padding: 0 20px;

    button {
      border-radius: 5px;
      font-size: 100%;
      font-weight: 600;
    }

    .btn-wrapper {
      padding: 3px;
    }

    .current-page {
      background: linear-gradient(
        270deg,
        var(--primary) 0%,
        var(--orange) 100%
      );
      height: fit-content;
      border-radius: 5px;
    }

    * {
      width: 100%;
    }
  }
}
</style>
