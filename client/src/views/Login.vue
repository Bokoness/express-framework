<template>
  <div class="home">
    <img
      class="town-logo"
      src="../assets/town-logo.png"
      alt="קיבוץ גוש עציון"
    />
    <v-container class="form-container d-flex flex-column mt-12">
      <h2 class="text-h3">ברוכים הבאים!</h2>
      <h1 class="text-h4 text-center mt-2">צוות צח"י</h1>
      <v-row class="d-flex justify-center align-center mt-10">
        <v-col cols="12">
          <v-select
            v-model="team"
            :items="teams"
            solo
            outlined
            class="select"
            label="בחירת ישוב"
          >
          </v-select>
        </v-col>
        <v-col cols="12">
          <MyInput v-model="password" type="password" label="סיסמא" />
        </v-col>
        <v-col cols="12">
          <MyInput v-model="username" type="name" label="שמך" />
        </v-col>
        <v-col cols="8">
          <MyBtn text="כניסה" block @click="submit" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import MyInput from "../components/generics/MyInput.vue"
import MyBtn from "../components/generics/MyBtn.vue"
export default {
  name: "login-page",
  components: {
    MyInput,
    MyBtn,
  },
  data: () => {
    return {
      show: false,
      team: "",
      password: "",
      username: "",
      isAlertMessage: false,
      loading: false,
    }
  },
  computed: {
    isValidForm() {
      return !(
        this.username &&
        this.team &&
        this.password &&
        this.password.length >= 6
      )
    },
    teams() {
      return this.$store.getters.teams
    },
    events() {
      return this.$store.getters.events
    },
    rules() {
      return {
        nameRequired: (v) => !!v || "נא להזין שם מלא",
        teamRequired: (v) => !!v || "נא לבחור",
        passRequired: (v) => !!v || "נא להזין סיסמה",
        min: (v) => v.length >= 6 || "6 תווים לפחות",
      }
    },
  },
  methods: {
    async submit() {
      this.loading = true
      await this.$store.dispatch("auth/login", {
        team: this.team,
        password: this.password,
        username: this.username,
      })
      if (this.events.length) {
        this.$router.push({ name: "DashboardUser" })
      } else {
        this.$router.push({ name: "DashboardUserCold" })
      }

      this.loading = false
    },
  },
  beforeMount() {
    this.$store.dispatch("auth/teams")
  },
}
</script>
<style lang="scss" scoped>
.home {
  .town-logo {
    position: absolute;
    top: 0;
  }
}
</style>
