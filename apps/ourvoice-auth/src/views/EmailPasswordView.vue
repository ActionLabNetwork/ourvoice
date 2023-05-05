<template>
  <div class="auth-container">
    <div v-if="processing" class="auth-form-container">
      <div class="spinner">
        <svg version="1.1" viewBox="25 25 50 50">
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="none"
            strokeWidth="20"
            stroke="rgb(255, 155, 51)"
            strokeLinecap="round"
            strokeDashoffset="0"
            strokeDasharray="200, 200"
          >
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-dashoffset"
              values="0;-30;-124"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-dasharray"
              values="0,200;110,200;110,200"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
    </div>
    <div v-else class="auth-form-container">
      <div v-if="!needsVerifying" class="auth-form-content-container">
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
        <div v-if="error" class="error-container">
          <div class="error-message">{{ errorMessage }}</div>
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
        <div class="conformation">
          <img src="@/assets/email_icon.svg" alt="Email Icon" class="emailIcon" />
          <div class="form-title">Verify your email address</div>
          <p class="form-subtitle">
            To confirm your email address, <strong>click on the link</strong> in the email we sent
            you.
          </p>
          <span class="resend-button" v-on:click="sendVerificationEmail">Resend Email</span>
          <div class="divider-container"></div>
          <span v-on:click="signOut" class="faded-link">Logout</span>
        </div>
        <div style="margin-bottom: 10px" />
      </div>
      <div v-if="isSignIn && !needsVerifying" class="faded-link">
        <router-link :to="{ path: `/auth/reset-password` }"> Forgot Password? </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import EmailPassword from 'supertokens-web-js/recipe/emailpassword'
import Session from 'supertokens-web-js/recipe/session'
import { sendVerificationEmail } from 'supertokens-web-js/recipe/emailverification'

import { EmailVerificationClaim } from 'supertokens-web-js/recipe/emailverification'
import { ManageRedirectStateService } from '../utils/manage-redirect-state.service'
import { defineComponent } from 'vue'

// import YamlContent from '../../../../config/config.yml'

const redirect: ManageRedirectStateService = new ManageRedirectStateService()
const domain = import.meta.env.VITE_APP_FRONTEND_DOMAIN

// TODO: this list might be coming from the database later
// const organisation = YamlContent.organisation

export default defineComponent({
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
      passwordError: '',

      processing: false,
      needsVerifying: false
    }
  },
  watch: {
    email: {
      handler: function () {
        this.error = false
      },
      deep: true
    }
  },
  computed: {},
  mounted() {
    // this.recepie = this.mode
    const params = new URLSearchParams(window.location.search)

    if (params.has('error')) {
      this.errorMessage = params.get('error') || 'Something went wrong'
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
    signOut: async function () {
      await Session.signOut()
      this.handleRedirect()
    },
    reset: async function () {
      this.isSignIn = true
      this.email = ''
      this.password = ''
      this.error = false
      this.errorMessage = 'Something went wrong'
      this.emailError = ''
      this.passwordError = ''
      this.processing = false
      this.needsVerifying = false
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
        this.processing = false
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
        this.processing = false
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
          this.needsVerifying = true
          this.processing = false
        }
      } catch (err: any) {
        if (err.isSuperTokensGeneralError === true) {
          // this may be a custom error message sent from the API by you.
          this.errorMessage = err.message
          this.error = true
        } else {
          this.errorMessage = 'Oops! Something went wrong.'
          this.error = true
        }
      }
    },

    onSubmitPressed: function (e: Event) {
      e.preventDefault()
      // we reset the error states in case the user has fixed the input errors
      this.error = false
      this.emailError = ''
      this.passwordError = ''

      this.processing = true

      if (this.isSignIn) {
        this.signIn()
      } else {
        this.signUp()
      }
    },
    checkForSession: async function () {
      if (await Session.doesSessionExist()) {
        // session exists but checking if verification is needed
        let validationErrors = await Session.validateClaims()

        if (validationErrors.length === 0) {
          // user has verified their email address
          this.handleRedirect()
        } else {
          for (const err of validationErrors) {
            if (err.validatorId === EmailVerificationClaim.id) {
              // email is not verified
              this.needsVerifying = true
            }
          }
        }
      }
    },
    handleRedirect: function () {
      if (redirect.exists()) {
        const redirectTo = redirect.get()
        redirect.purge()
        window.location.href = redirectTo
      } else {
        // fallback redirect
        window.location.href = `http://demo${domain}`
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

.resend-button {
  padding-left: 3px;
  padding-right: 3px;
  color: rgb(0, 118, 255);
  font-size: 14px;
  cursor: pointer;
  letter-spacing: 0.16px;
  line-height: 26px;
}

.form-title {
  font-size: 24px;
  line-height: 40px;
  letter-spacing: 0.58px;
  font-weight: 800;
  margin-bottom: 2px;
  color: rgb(34, 34, 34);
}

.form-subtitle {
  margin-bottom: 10px;
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

.emailIcon {
  margin: auto;
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

.faded-link {
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

.faded-text {
  padding-left: 3px;
  padding-right: 3px;
  line-height: 26px;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.4px;
  color: rgb(101, 101, 101);
  margin-top: 10px;
}

.error-container {
  display: flex;
  width: calc(100% - 24px);
  background-color: #ffcdd2;
  justify-content: center;
  align-items: center;
  padding-top: 2px;
  padding-bottom: 2px;
  margin-left: 12px;
  margin-right: 12px;
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

.spinner {
  width: 80px;
  height: auto;
  padding-top: 20px;
  padding-bottom: 40px;
  margin: 0 auto;
}
</style>
