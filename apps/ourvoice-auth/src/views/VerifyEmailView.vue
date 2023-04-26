<template>
  <div></div>
</template>

<script lang="ts">
import { verifyEmail } from 'supertokens-web-js/recipe/emailverification'
import Session from 'supertokens-web-js/recipe/session'
import { defineComponent } from 'vue'

const adminURL = import.meta.env.VITE_APP_ADMIN_URL

export default defineComponent({
  data() {
    return {}
  },
  mounted() {
    this.checkForSession()
  },
  methods: {
    checkForSession: async function () {
      if (!(await Session.doesSessionExist())) {
        // since a session does not exist, we send the user to the login page.
        return window.location.assign('/signinWithEmailPassword')
      }
      this.consumeVerificationCode()
    },
    consumeVerificationCode: async function () {
      try {
        let response = await verifyEmail()
        if (response.status === 'EMAIL_VERIFICATION_INVALID_TOKEN_ERROR') {
          // This can happen if the verification code is expired or invalid.
          // You should ask the user to retry
          window.alert('Oops! Seems like the verification link expired. Please try again')
          window.location.assign('/auth/verify-email') // back to the email sending screen.
        } else {
          // email was verified successfully.
          window.location.href = adminURL
        }
      } catch (err: any) {
        if (err.isSuperTokensGeneralError === true) {
          // this may be a custom error message sent from the API by you.
          window.alert(err.message)
        } else {
          window.alert('Oops! Something went wrong.')
        }
      }
    }
  }
})
</script>
