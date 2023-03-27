<template>
  <div></div>
</template>

<script lang="ts">
import Passwordless from 'supertokens-web-js/recipe/passwordless'
import { ManageRedirectStateService } from '../utils/manage-redirect-state.service'
import { defineComponent } from 'vue'

const redirect: ManageRedirectStateService = new ManageRedirectStateService()

export default defineComponent({
  data() {
    return {}
  },
  mounted() {
    this.hasInitialMagicLinkBeenSent()
  },
  methods: {
    handleMagicLinkClicked: async function () {
      try {
        let response = await Passwordless.consumeCode()

        if (response.status === 'OK') {
          if (response.createdNewUser) {
            // user sign up success
          } else {
            // user sign in success
          }
          this.handleRedirect()
        } else {
          // this can happen if the magic link has expired or is invalid
          window.alert('Login failed. Please try again')
          window.location.assign('/signinWithoutPassword')
        }
      } catch (err: any) {
        if (err.isSuperTokensGeneralError === true) {
          // this may be a custom error message sent from the API by you.
          window.alert(err.message)
        } else {
          window.alert('Oops! Something went wrong.')
        }
      }
    },
    hasInitialMagicLinkBeenSent: async function () {
      if (!(await Passwordless.getLoginAttemptInfo())) {
        return window.location.assign('/signinWithoutPassword')
      } else {
        this.handleMagicLinkClicked()
      }
    },
    handleRedirect: function () {
      if (redirect.exists()) {
        const redirectTo = redirect.get()
        redirect.purge()
        window.location.href = redirectTo
      }
    }
  }
})
</script>
