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
        <div class="form-title">Sign In or Sign Up</div>

        <div class="divider-container">
          <div class="divider" />
        </div>
        <!-- Deployment image -->
        <div class="flex justify-center flex-1 mb-10 md:mb-16 lg:mb-0 z-10">
          <img
            class="w-5/6 h-5/6 sm:w-3/4 sm:h-3/4 md:w-full md:h-full"
            :src="getConfig('logo')"
            alt="OurVoice interface"
          />
        </div>
        <Login />

        <div v-if="error" class="error-container">
          <div class="error-message">{{ errorMessage }}</div>
        </div>

        <div class="divider-container"></div>
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
      <div v-else class="auth-form-content-container">
        <div class="conformation">
          <img src="@/assets/email_icon.svg" alt="Email Icon" class="emailIcon" />
          <div class="form-title">Link sent!</div>
          <p v-html="verifyText" class="form-subtitle"></p>
          <div>
            <span v-if="period >= 0 && !isVerify" class="faded-text">00:{{ counter }}</span>
            <span v-else class="resend-button" v-on:click="resendMagicLink">Resend link</span>
          </div>
          <div class="divider-container"></div>
          <span v-on:click="reset" class="faded-link">Change email</span>
        </div>
        <div style="margin-bottom: 10px" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Passwordless from 'supertokens-web-js/recipe/passwordless'
import Session from 'supertokens-web-js/recipe/session'

import { EmailVerificationClaim } from 'supertokens-web-js/recipe/emailverification'
import { ManageRedirectStateService } from '../utils/manage-redirect-state.service'
import { defineComponent } from 'vue'

import YamlContent from '../../../../config/config.yml'
import Login from '../../../../config/content/login.md'

// const websitePort = import.meta.env.VUE_APP_WEB_PORT || 3000
// const websiteDomain = import.meta.env.VUE_APP_WEB_URL || `http://localhost:${websitePort}`

const redirect: ManageRedirectStateService = new ManageRedirectStateService()
const domain = import.meta.env.VITE_APP_FRONTEND_DOMAIN

// TODO: this list might be coming from the database later
const organisation = YamlContent.organisation

export default defineComponent({
  components: {
    Login
  },
  props: ['deployment'],
  data() {
    return {
      // used for setting magic link already sent status
      isVerify: false,

      // this will store the email entered by the user.
      email: '',

      // any generic error states
      error: false,
      errorMessage: 'Something went wrong',

      // any error states specific to the input fields.
      emailError: '',

      processing: false,
      needsVerifying: false,

      // Countdown timer
      period: 15,
      timer: 0
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
  computed: {
    verifyText() {
      return `We sent a link to <strong> ${
        this.email !== '' ? this.email : 'your email'
      } </strong> </br>Click the link to login or sign up`
    },
    counter() {
      return this.period.toString().length === 1 ? `0${this.period}` : this.period
    }
  },
  mounted() {
    const params = new URLSearchParams(window.location.search)

    if (params.has('error')) {
      this.errorMessage = params.get('error') || 'Something went wrong'
      this.error = true
    }
    // this redirects the user to the HomeView.vue component if a session
    // already exists.
    this.checkForSession()
    this.hasInitialMagicLinkBeenSent()
  },

  methods: {
    // TODO: this list might be coming from the database later
    getConfig(option: string) {
      return YamlContent[option]
    },
    hasInitialMagicLinkBeenSent: async function () {
      if (await Passwordless.getLoginAttemptInfo()) {
        this.needsVerifying = true
        this.isVerify = true
        // redirect.set(appURL)
      }
    },
    startTimer() {
      this.period = 15
      this.timer = setInterval(() => {
        if (!this.period) this.stopTimer()
        this.period -= 1
      }, 1000)
    },
    stopTimer() {
      clearInterval(this.timer)
    },
    signOut: async function () {
      await Session.signOut()
      this.handleRedirect()
    },
    reset: async function () {
      this.email = ''
      this.error = false
      this.errorMessage = 'Something went wrong'
      this.emailError = ''
      this.processing = false
      this.needsVerifying = false
      this.period = 15
      this.isVerify = false
    },
    validateEmail(email: string) {
      return email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    },

    sendMagicLink: async function () {
      if (this.email.substring(this.email.lastIndexOf('@') + 1) !== organisation) {
        this.processing = false
        this.errorMessage = 'Organisation does not match'
        this.error = true
        return
      }
      try {
        await Passwordless.createCode({
          email: this.email
        })
        // Magic link sent successfully.
        this.processing = false
        this.needsVerifying = true
        this.startTimer()
      } catch (err: any) {
        this.processing = false
        if (err.isSuperTokensGeneralError === true) {
          // this may be a custom error message sent from the API by you,
          // or if the input email / phone number is not valid.
          this.errorMessage = err.message
          this.error = true
        } else {
          this.errorMessage = 'Oops! Something went wrong.'
          this.error = true
        }
      }
    },

    resendMagicLink: async function () {
      this.processing = true
      try {
        let response = await Passwordless.resendCode()

        if (response.status === 'RESTART_FLOW_ERROR') {
          // this can happen if the user has already successfully logged in into
          // another device whilst also trying to login to this one.
          window.location.assign('/signinWithoutPassword')
        } else {
          // Magic link resent successfully.
          this.processing = false
          this.needsVerifying = true
          this.isVerify = false
          this.startTimer()
        }
      } catch (err: any) {
        this.processing = false
        if (err.isSuperTokensGeneralError === true) {
          // this may be a custom error message sent from the API by you,
          // or if the input email / phone number is not valid.
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

      this.processing = true
      this.sendMagicLink()
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
