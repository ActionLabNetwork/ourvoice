<template>
  <div class="auth-container">
    <div class="auth-form-container">
      <div v-if="error" class="error-container">
        <div class="error-message">{{ errorMessage }}</div>
      </div>
      <div v-if="mode === 'emailpassword'" class="auth-form-content-container">
        <div v-if="isSignIn" class="form-title">Sign In</div>
        <div v-else class="form-title">Sign Up</div>
        <div class="sign-in-up-text-container">
          <span v-if="isSignIn"
            >Not yet registered?
            <span class="clickable-text" v-on:click="goToSignUp">Sign Up</span></span
          >
          <span v-else
            >Already have an account?
            <span class="clickable-text" v-on:click="goToSignIn">Sign In</span></span
          >
        </div>
        <div class="divider-container">
          <div class="divider" />
        </div>

        <form autocomplete="on" novalidate @submit="onSubmitPressed">
          <div class="input-section-container" :class="emailError ? 'error' : ''">
            <div class="input-label">Email</div>
            <div class="input-container">
              <div class="input-wrapper" :class="emailError ? 'error' : ''">
                <input
                  v-model="email"
                  autocomplete="email"
                  class="input"
                  type="email"
                  name="email"
                  placeholder="Email address"
                />
              </div>
            </div>
            <div v-if="emailError" class="input-error">
              {{ `${emailError}` }}
            </div>
          </div>

          <div class="input-section-container" :class="passwordError ? 'error' : ''">
            <div class="input-label">Password</div>
            <div class="input-container">
              <div class="input-wrapper" :class="passwordError ? 'error' : ''">
                <input
                  v-model="password"
                  autocomplete="current-password"
                  class="input"
                  type="password"
                  name="password"
                  placeholder="Password"
                />
              </div>
            </div>
            <div v-if="passwordError" class="input-error">
              {{ `${passwordError}` }}
            </div>
          </div>

          <div class="input-section-container">
            <div v-if="isSignIn">
              <button type="submit" class="button">SIGN IN</button>
            </div>
            <div v-else>
              <button type="submit" class="button">SIGN UP</button>
            </div>
          </div>
        </form>
      </div>
      <div v-else class="auth-form-content-container">
        <div class="form-title">Sign In or Sign Up</div>

        <form autocomplete="on" novalidate @submit="onSubmitPressed">
          <div class="input-section-container" :class="emailError ? 'error' : ''">
            <div class="input-label">Email</div>
            <div class="input-container">
              <div class="input-wrapper" :class="emailError ? 'error' : ''">
                <input
                  v-model="email"
                  autocomplete="email"
                  class="input"
                  type="email"
                  name="email"
                  placeholder="Email address"
                />
              </div>
            </div>
            <div v-if="emailError" class="input-error">
              {{ `${emailError}` }}
            </div>
          </div>

          <div class="input-section-container">
            <button type="submit" class="button">CONTINUE</button>
          </div>
        </form>
      </div>
      <div v-if="isSignIn && mode === 'emailpassword'">
        <router-link :to="{ path: `/auth/reset-password` }"> Forgot Password? </router-link>
      </div>
      <div style="margin-bottom: 10px" />
    </div>
  </div>
</template>

<script lang="ts">
import EmailPassword from 'supertokens-web-js/recipe/emailpassword'
import Passwordless from 'supertokens-web-js/recipe/passwordless'
import Session from 'supertokens-web-js/recipe/session'
import { sendVerificationEmail } from 'supertokens-web-js/recipe/emailverification'

import { ManageRedirectStateService } from '../utils/manage-redirect-state.service'
import { defineComponent } from 'vue'

// const websitePort = import.meta.env.VUE_APP_WEB_PORT || 3000
// const websiteDomain = import.meta.env.VUE_APP_WEB_URL || `http://localhost:${websitePort}`

const redirect: ManageRedirectStateService = new ManageRedirectStateService()
const organisation = import.meta.env.VITE_APP_ORG

export default defineComponent({
  props: ['mode'],
  data() {
    return {
      // we allow the user to switch between sign in and sign up view
      isSignIn: true,

      // this will store the email and password entered by the user.
      email: '',
      password: '',

      // any generic error states
      error: false,
      errorMessage: 'Something went wrong',

      // any error states specific to the input fields.
      emailError: '',
      passwordError: ''
    }
  },

  mounted() {
    const params = new URLSearchParams(window.location.search)

    if (params.has('error')) {
      this.errorMessage = 'Something went wrong'
      this.error = true
    }
    // this redirects the user to the HomeView.vue component if a session
    // already exists.
    this.checkForSession()
  },

  methods: {
    goToSignUp() {
      this.isSignIn = false
    },
    goToSignIn() {
      this.isSignIn = true
    },
    signIn: async function () {
      const response = await EmailPassword.signIn({
        formFields: [
          {
            id: 'email',
            value: this.email
          },
          {
            id: 'password',
            value: this.password
          }
        ]
      })

      if (response.status === 'WRONG_CREDENTIALS_ERROR') {
        // the input email / password combination did not match,
        // so we show an appropriate error message to the user
        this.errorMessage = 'Invalid credentials'
        this.error = true
        return
      }

      if (response.status === 'FIELD_ERROR') {
        response.formFields.forEach((item) => {
          if (item.id === 'email') {
            // this means that something was wrong with the entered email.
            // probably that it's not a valid email (from a syntax point of view)
            this.emailError = item.error
          } else if (item.id === 'password') {
            this.passwordError = item.error
          }
        })
        return
      }

      // login is successful, and we redirect the user to the home page.
      // Note that session cookies are added automatically and nothing needs to be
      // done here about them.
      this.handleRedirect()
    },
    validateEmail(email: string) {
      return email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    },
    signUp: async function () {
      const response = await EmailPassword.signUp({
        formFields: [
          {
            id: 'email',
            value: this.email
          },
          {
            id: 'password',
            value: this.password
          }
        ]
      })

      if (response.status === 'FIELD_ERROR') {
        response.formFields.forEach((item) => {
          if (item.id === 'email') {
            // this means that something was wrong with the entered email.
            // probably that it's not a valid email (from a syntax point of view)
            this.emailError = item.error
          } else if (item.id === 'password') {
            // this means that something was wrong with the entered password.
            // probably it doesn't meet the password validation criteria on the backend.
            this.passwordError = item.error
          }
        })
        return
      }

      // signup is successful, and we redirect the user to the home page.
      // Note that session cookies are added automatically and nothing needs to be
      // done here about them.
      // window.location.assign('/')
      // this.handleRedirect()
      this.sendVerificationEmail()
    },

    sendVerificationEmail: async function () {
      try {
        let response = await sendVerificationEmail()
        if (response.status === 'EMAIL_ALREADY_VERIFIED_ERROR') {
          // This can happen if the info about email verification in the session was outdated.
          // Redirect the user to the home page
          this.handleRedirect()
        } else {
          // email was sent successfully.
          window.alert('Please check your email and click the link in it')
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

    sendMagicLink: async function () {
      if (this.email.substring(this.email.lastIndexOf('@') + 1) !== organisation) {
        window.alert('Organisation does not match')
        return
      }
      try {
        await Passwordless.createCode({
          email: this.email
        })
        // Magic link sent successfully.
        window.alert('Please check your email for the magic link')
      } catch (err: any) {
        if (err.isSuperTokensGeneralError === true) {
          // this may be a custom error message sent from the API by you,
          // or if the input email / phone number is not valid.
          window.alert(err.message)
        } else {
          window.alert('Oops! Something went wrong.')
        }
      }
    },
    onSubmitPressed: function (e: Event) {
      e.preventDefault()
      // we reset the error states in case the user has fixed the input errors
      this.error = false
      this.emailError = ''
      this.passwordError = ''

      if (this.mode === 'emailpassword') {
        if (this.isSignIn) {
          this.signIn()
        } else {
          this.signUp()
        }
      } else {
        this.sendMagicLink()
      }
    },
    checkForSession: async function () {
      if (await Session.doesSessionExist()) {
        // since a session already exists, we redirect the user to the HomeView.vue component
        // window.location.assign('/')
        this.handleRedirect()
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

<style scoped>
#app {
  width: 100vw;
  height: 100vh;
}

.auth-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}

.auth-form-container {
  margin: 26px auto;
  width: 420px;
  text-align: center;
  border-radius: 8px;
  box-shadow: rgb(0, 0, 0, 0.16) 1px 1px 10px;
  background-color: white;
}

.form-title {
  font-size: 24px;
  line-height: 40px;
  letter-spacing: 0.58px;
  font-weight: 800;
  margin-bottom: 2px;
  color: rgb(34, 34, 34);
}

.sign-in-up-text-container {
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.4px;
  color: rgb(101, 101, 101);
}

.auth-form-content-container {
  margin: auto;
  width: 76%;
  padding-top: 40px;
}

.providerButtonLeft {
  width: 40px;
}

.providerButtonLogo {
  height: 30px;
  display: flex;
  border-right: 1px solid rgba(255, 255, 255, 0.6);
}

.providerButtonLogoCenter {
  margin: auto;
}

.providerButtonText {
  margin: auto;
  text-align: center;
  justify-content: center;
  -webkit-box-pack: center;
  font-weight: inherit;
}

.providerContainer {
  padding-top: 9px;
  padding-bottom: 9px;
}

.providerButton {
  width: 100%;
  min-height: 34px;
  display: flex;
  flex-direction: row;
  padding: 2px 0px;
  transition: all 0.4s ease 0s;
  cursor: pointer;
  height: auto !important;
  border-radius: 6px;
  border-width: 1px;
  font-weight: 700;
  color: white;
}

.providerGithub {
  border-color: black;
  background-color: black;
}

.providerGithub:hover {
  filter: brightness(1.1);
}

.providerGoogle {
  border-color: rgb(234, 55, 33);
  background-color: rgb(234, 55, 33);
}

.providerGoogle:hover {
  filter: brightness(0.95);
}

.providerApple {
  border-color: rgb(7, 9, 60);
  background-color: rgb(1, 0, 48);
}

.providerApple:hover {
  filter: brightness(1.1);
}

.input-section-container {
  display: flex;
  flex-direction: column;
  padding-top: 0px;
  padding-bottom: 34px;
}

.input-section-container.error {
  padding-bottom: 0px;
}

form {
  display: block;
  margin-top: 0em;
}

.input-label {
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  color: rgb(34, 34, 34);
}

.input-container {
  margin-top: 6px;
}

.input-wrapper {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  background-color: rgb(250, 250, 250);
  height: 34px;
  border-radius: 6px;
  border: 1px solid rgb(224, 224, 224);
}

.input-wrapper.error {
  border-color: rgb(255, 23, 23);
}

.input {
  box-sizing: border-box;
  padding-left: 15px;
  filter: none;
  color: rgb(34, 34, 34);
  background-color: transparent;
  border-radius: 6px;
  font-size: 14px;
  border: none;
  padding-right: 25px;
  letter-spacing: 1.2px;
  flex: 9 1 75%;
  width: 75%;
  height: 32px;
}

.button {
  width: 100%;
  height: 34px;
  background-color: rgb(255, 155, 51);
  color: white;
  font-weight: 700;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(238, 141, 35);
  border-radius: 6px;
  background-position: center center;
  transition: all 0.4s ease 0s;
  cursor: pointer;
}

.button:hover {
  filter: brightness(0.95);
}

.forgot-password-link {
  padding-left: 3px;
  padding-right: 3px;
  cursor: pointer;
  line-height: 26px;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.4px;
  color: rgb(101, 101, 101);
  margin-top: 10px;
}

.error-container {
  display: flex;
  position: absolute;
  width: calc(100% - 24px);
  background-color: #ffcdd2;
  justify-content: center;
  align-items: center;
  padding-top: 2px;
  padding-bottom: 2px;
  margin-left: 12px;
  margin-right: 12px;
  margin-top: 4px;
  border-radius: 6px;
  box-sizing: border-box;
  border-width: 1px;
  border: 1px solid #ff1744;
}

.input-error {
  padding-top: 5px;
  padding-bottom: 5px;
  color: rgb(255, 23, 23);
  line-height: 24px;
  font-weight: 400;
  font-size: 14px;
  text-align: left;
  animation: slideTop 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s 1 normal both;
  max-width: 330px;
}

@keyframes slideTop {
  0% {
    transform: translateY(-5px);
  }

  100% {
    transform: translateY(0px);
  }
}
</style>
