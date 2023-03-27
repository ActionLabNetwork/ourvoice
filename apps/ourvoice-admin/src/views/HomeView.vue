<template>
  <div
    v-if="session"
    class="container flex flex-col-reverse lg:flex-row items-center gap-12 mt-14 lg:mt-28 fill"
  >
    <div class="top-bar">
      <div class="sign-out" v-on:click="signOut">SIGN OUT</div>
    </div>
    <!-- Content -->
    <div class="flex fill flex-1 flex-col items-center lg:items-start">
      <h1 class="text-ourvoice-blue text-5xl md:text-6 lg:text-6xl text-center lg:text-left mb-6">
        <span class="text-ourvoice-red">OurVoice</span> Admin
      </h1>
      <p class="text-ourvoice-grey text-lg text-center lg:text-left mb-6">
        A safe space for employees and community members to anonymously discuss issues and concerns
        about their work environments.
      </p>
      <div class="flex justify-center flex-wrap gap-6">
        <button type="button" class="btn btn-red btn-hover">Deploy</button>
      </div>
    </div>
    <!-- Image -->
    <div class="flex justify-center flex-1 mb-10 md:mb-16 lg:mb-0 z-10">
      <img
        class="w-5/6 h-5/6 sm:w-3/4 sm:h-3/4 md:w-full md:h-full"
        src="@/assets/ourvoice_logo.svg"
        alt="OurVoice interface"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Session from 'supertokens-web-js/recipe/session'
import { EmailVerificationClaim } from 'supertokens-web-js/recipe/emailverification'

const apiPort = import.meta.env.VUE_APP_API_PORT || 3000
const apiDomain = import.meta.env.VUE_APP_API_URL || `http://localhost:${apiPort}`

const authURL = import.meta.env.VITE_APP_AUTH_URL || 'http://localhost:3020'

export default defineComponent({
  data() {
    return {
      // if session is false, we show a blank screen
      // else we render the UI
      session: false,
      userId: ''
    }
  },
  methods: {
    signOut: async function () {
      await Session.signOut()
      window.location.href = authURL
    },

    checkForSession: async function () {
      if (!(await Session.doesSessionExist())) {
        // since a session does not exist, we send the user to the login page.
        window.location.href = authURL
      }
      let validationErrors = await Session.validateClaims()

      if (validationErrors.length === 0) {
        // user has verified their email address
        const userId = await Session.getUserId()
        // this will render the UI
        this.session = true
        this.userId = userId
      } else {
        for (const err of validationErrors) {
          if (err.validatorId === EmailVerificationClaim.id) {
            // email is not verified
            window.alert('Session Information:\n' + JSON.stringify(err, null, 2))
          }
        }
      }
    },

    callAPI: async function () {
      const response = await fetch(`${apiDomain}/sessioninfo`)

      if (response.status === 401) {
        // this means that the session has expired and the
        // user needs to relogin.
        window.location.href = authURL
        return
      }

      const json = await response.json()

      window.alert('Session Information:\n' + JSON.stringify(json, null, 2))
    }
  },

  mounted() {
    // this function checks if a session exists, and if not,
    // it will redirect to the login screen.
    this.checkForSession()
  }
})
</script>

<style scoped>
.fill {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}

.top-bar {
  display: flex;
  height: 70px;
  align-items: center;
  justify-content: flex-end;
  padding-left: 75px;
  padding-right: 75px;
  width: 100%;
}

.sign-out {
  display: flex;
  width: 116px;
  height: 42px;
  background-color: black;
  border-radius: 10px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}
</style>
