<template>
	<v-app-bar
		flat
		app
	>
		<v-row>
			<v-col cols="3">
				<div class="d-flex justify-start">
					<v-icon
						color="red"
						@click="logout"
					>mdi-logout</v-icon>
					<v-toolbar-title>
						<div class="primary--text mx-2">{{ userName }}</div>
					</v-toolbar-title>
				</div>
			</v-col>
			<v-col
				cols="6"
				class="d-flex justify-center align-center"
			>
				<v-toolbar-title>
					<div class="primary--text">{{ $t("userAppbarTitle") }}</div>
				</v-toolbar-title>
			</v-col>
			<v-col cols="3">
				<div
					class="d-flex justify-end"
					v-if="!isHomePage"
				>
					<v-icon
						color="primary"
						@click="goHomePage"
					>mdi-arrow-left</v-icon>
				</div>
			</v-col>
		</v-row>
	</v-app-bar>
</template>

<script>
export default {
  name: "UserNavbar",
  computed: {
    userName() {
      return this.$store.getters.name
    },
    isHomePage() {
      return this.$route.name === "UserDashboard"
    },
  },
  methods: {
    goHomePage() {
      this.$router.push({ name: "UserDashboard" })
    },
    async logout() {
      this.$store.dispatch("auth/logout", {
        toastOptions: { disabled: true },
      })
    },
  },
}
</script>
