<!-- eslint-disable prettier/prettier -->
<template>
  <div class="">
    <div class="hidden">
      <div class="auth-container hidden">
        <div v-if="processing" class="auth-form-container">
          <div class="spinner">
            <svg version="1.1" viewBox="25 25 50 50">
              <circle
                cx="50" cy="50" fill="none" r="20" stroke="rgb(255, 155, 51)" strokeDasharray="200, 200"
                strokeDashoffset="0" strokeLinecap="round" strokeWidth="20"
              >
                <animateTransform
                  attributeName="transform" attributeType="XML" dur="4s" from="0 50 50"
                  repeatCount="indefinite" to="360 50 50" type="rotate"
                />
                <animate attributeName="stroke-dashoffset" dur="2s" repeatCount="indefinite" values="0;-30;-124" />
                <animate
                  attributeName="stroke-dasharray" dur="2s" repeatCount="indefinite"
                  values="0,200;110,200;110,200"
                />
              </circle>
            </svg>
          </div>
        </div>
        <div v-else class="auth-form-container">
          <div v-if="!needsVerifying" class="auth-form-content-container">
            <div class="form-title">
              Sign In or Sign Up
            </div>

            <div class="divider-container">
              <div class="divider" />
            </div>
            <!-- Deployment image -->
            <div class="flex justify-center flex-1 mb-10 md:mb-16 lg:mb-0 z-10">
              <img
                alt="OurVoice interface" class="w-5/6 h-5/6 sm:w-3/4 sm:h-3/4 md:w-full md:h-full"
                :src="getConfig('deploymentLogo')"
              >
            </div>
            <login />

            <div v-if="error" class="error-container">
              <div class="error-message">
                {{ errorMessage }}
              </div>
            </div>

            <div class="divider-container" />
            <form autocomplete="on" novalidate @submit="onSubmitPressed">
              <div class="input-section-container" :class="emailError ? 'error' : ''">
                <div class="input-label">
                  Email
                </div>
                <div class="input-container">
                  <div class="input-wrapper" :class="emailError ? 'error' : ''">
                    <input
                      v-model="email" autocomplete="email" class="input" name="email" placeholder="Email address"
                      type="email"
                    >
                  </div>
                </div>
                <div v-if="emailError" class="input-error">
                  {{ `${emailError}` }}
                </div>
              </div>

              <div class="input-section-container">
                <button class="button" type="submit">
                  CONTINUE
                </button>
              </div>
            </form>
          </div>
          <div v-else class="auth-form-content-container">
            <div class="conformation">
              <img alt="Email Icon" class="emailIcon" src="@/assets/email_icon.svg">
              <div class="form-title">
                Link sent!
              </div>
              <p class="form-subtitle" v-html="verifyText" />
              <div>
                <span v-if="period >= 0 && !isVerify" class="faded-text">00:{{ counter }}</span>
                <span v-else class="resend-button" @click="resendMagicLink">Resend link</span>
              </div>
              <div class="divider-container" />
              <span class="faded-link" @click="reset">Change email</span>
            </div>
            <div style="margin-bottom: 10px" />
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-full md:grid-cols-2 h-full">
      <!-- Content -->
      <div class="w-full flex flex-col px-4 md:px-16 py-20 items-center md:items-start md:translate-y-0">
        <!-- Back Button -->
        <button
          class="inline-flex font-semibold items-center gap-2 transform duration-200 hover:gap-[13px] mb-10"
          @click="redirectToIndexPage"
        >
          <icon-arrow-left />
          Go Back
        </button>
        <div>
          <div class="grid grid-cols-2 divide-x-4 divide-black gap-2 place-items-center mb-16 -ml-8">
            <div>
              <a class="" href="#">
                <span class="sr-only">OurVoice</span>
                <img alt="OurVoice Logo" class="h-11" src="@/assets/logo/ourvoice_logo_primary_dark.svg">
              </a>
            </div>
            <div>
              <a class="" href="#">
                <span class="sr-only">OurVocie</span>
                <img
                  alt="Deployment Logo" class="h-11 ml-6 rounded-md"
                  src="@/assets/logo/ourvoice_logo_demo_org.svg"
                >
              </a>
            </div>
          </div>
        </div>
        <!-- Deployment slogan -->
        <p
          class="text-center md:text-left mb-6 text-2xl md:text-3xl lg:text-5xl text-ourvoice-black leading-20 font-bold"
        >
          {{ getConfig('slogan') }}
        </p>
        <!-- Deployment description -->
        <Description class="description-text text-lg text-left mb-6" />
        <div class="flex flex-wrap gap-2 justify-center mx-auto md:mx-0">
          <CustomButton
            class-name="w-52 h-14 px-2 py-4 rounded-full text-ourvoice-base" label="Get Started"
            variant="filled"
          />
          <CustomButton
            class-name="w-52 h-14 px-2 py-4 rounded-full border-2  border-ourvoice-secondary" label="FAQ"
            to="/about" variant="outlined"
          />
        </div>
        <!-- Passwordless input -->
        <div class="w-full flex flex-col gap-5 items-center md:items-start">
          <div v-if="error" class="error-container">
            <div class="error-message">
              {{ errorMessage }}
            </div>
          </div>
          <div class="w-full relative mt-2" :class="emailError ? 'error' : ''">
            <input
              v-model="email" autocomplete="email"
              class="w-full md:max-w-[400px] h-12 p-4 bg-neutral-100 rounded-2xl gap-2 inline-flex text-neutral-600 text-sm font-medium leading-tight tracking-tight"
              name="email" placeholder="Staff email" type="email"
            >
            <div v-if="processing" class="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
              <!-- Loading spinner -->
              <span class="inline-flex items-center px-1 font-sans text-xs text-gray-400">
                <svg class="h-8 w-8 animate-spin" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    class="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            </div>
            <div v-if="!processing && needsVerifying" class="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
              <!-- Sent indicator -->
              <span class="inline-flex items-center px-1 font-sans text-xs text-ourvoice-success">
                Email sent
                <span v-if="period >= 0 && !isVerify"> (00:{{ counter }})</span>
              </span>
            </div>
            <div v-if="emailError" class="input-error">
              {{ `${emailError}` }}
            </div>
          </div>
          <!-- Buttons -->
          <div class="justify-start items-start gap-5 inline-flex mx-auto md:mx-0">
            <button
              v-if="!needsVerifying"
              class="px-5 cursor-pointer py-3 bg-ourvoice-primary hover:bg-ourvoice-primary/80 rounded-full justify-center items-center gap-2 flex"
              @click="onSubmitPressed"
            >
              <div class="text-black text-lg font-medium">
                Send Link
              </div>
            </button>
            <button
              v-if="needsVerifying"
              class="px-5 cursor-pointer py-3 bg-ourvoice-primary hover:bg-ourvoice-primary/80 rounded-full justify-center items-center gap-2 flex"
              @click="resendMagicLink"
            >
              <div class="text-black text-lg font-medium">
                Resend Link
              </div>
            </button>
            <button
              v-if="needsVerifying"
              class="px-5 cursor-pointer py-3 bg-ourvoice-secondary hover:bg-ourvoice-secondary/80 rounded-full justify-center items-center gap-2 flex"
              @click="reset"
            >
              <div class="text-black text-lg font-medium">
                Change Email
              </div>
            </button>
          </div>
        </div>
      </div>
      <div class="hidden md:inline-flex bg-ourvoice-primary">
        <img
          v-if="getConfig('heroImage')" alt="OurVoice interface" class="w-full object-cover h-full"
          :src="getConfig('heroImage')"
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { EmailVerificationClaim } from 'supertokens-web-js/recipe/emailverification'
import Passwordless from 'supertokens-web-js/recipe/passwordless'
import Session from 'supertokens-web-js/recipe/session'
import { defineComponent } from 'vue'

import IconArrowLeft from '@/components/icons/IconArrowLeft.vue'
import config from '@/config'

import YamlContent from '../../../../config/config.yml'
import Login from '../../../../config/content/login.md'
import { ManageRedirectStateService } from '../utils/manage-redirect-state.service'

// const websitePort = import.meta.env.VUE_APP_WEB_PORT || 3000
// const websiteDomain = import.meta.env.VUE_APP_WEB_URL || `http://localhost:${websitePort}`

const redirect: ManageRedirectStateService = new ManageRedirectStateService()
const domain = config.sessionTokenFrontendDomain

// TODO: this list might be coming from the database later
const organisation = YamlContent.organisation
const deploymentOrganisation = YamlContent.deployment as string

export default defineComponent({
  components: {
    Login,
    IconArrowLeft,
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
      timer: 0,
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
    },
  },
  watch: {
    email: {
      handler() {
        this.error = false
      },
      deep: true,
    },
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
    async hasInitialMagicLinkBeenSent() {
      if (await Passwordless.getLoginAttemptInfo()) {
        this.needsVerifying = true
        this.isVerify = true
        // redirect.set(appURL)
      }
    },
    startTimer() {
      this.period = 15
      this.timer = window.setInterval(() => {
        if (!this.period)
          this.stopTimer()
        this.period -= 1
      }, 1000)
    },
    stopTimer() {
      clearInterval(this.timer)
    },
    async signOut() {
      await Session.signOut()
      this.handleRedirect()
    },
    async reset() {
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
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/i,
        )
    },

    async sendMagicLink() {
      // check for organisation restrictions
      if (organisation && this.email.substring(this.email.lastIndexOf('@') + 1) !== organisation) {
        this.processing = false
        this.errorMessage = 'Organisation does not match'
        this.error = true
        return
      }

      try {
        await Passwordless.createCode({
          email: this.email.toLowerCase(),
        })
        // Magic link sent successfully.
        this.processing = false
        this.needsVerifying = true
        this.startTimer()
      }
      catch (err: any) {
        this.processing = false
        if (err.isSuperTokensGeneralError === true) {
          // this may be a custom error message sent from the API by you,
          // or if the input email / phone number is not valid.
          this.errorMessage = err.message
          this.error = true
        }
        else {
          this.errorMessage = 'Oops! Something went wrong.'
          this.error = true
        }
      }
    },

    async resendMagicLink() {
      this.processing = true
      try {
        const response = await Passwordless.resendCode()

        if (response.status === 'RESTART_FLOW_ERROR') {
          // this can happen if the user has already successfully logged in into
          // another device whilst also trying to login to this one.
          window.location.assign('/signinWithoutPassword')
        }
        else {
          // Magic link resent successfully.
          this.processing = false
          this.needsVerifying = true
          this.isVerify = false
          this.startTimer()
        }
      }
      catch (err: any) {
        this.processing = false
        if (err.isSuperTokensGeneralError === true) {
          // this may be a custom error message sent from the API by you,
          // or if the input email / phone number is not valid.
          this.errorMessage = err.message
          this.error = true
        }
        else {
          this.errorMessage = 'Oops! Something went wrong.'
          this.error = true
        }
      }
    },
    onSubmitPressed(e: Event) {
      e.preventDefault()
      // we reset the error states in case the user has fixed the input errors
      this.error = false
      this.emailError = ''

      this.processing = true
      this.sendMagicLink()
    },
    async checkForSession() {
      if (await Session.doesSessionExist()) {
        // session exists but checking if verification is needed
        const validationErrors = await Session.validateClaims()

        if (validationErrors.length === 0) {
          // user has verified their email address
          this.handleRedirect()
        }
        else {
          for (const err of validationErrors) {
            if (err.id === EmailVerificationClaim.id) {
              // email is not verified
              this.needsVerifying = true
            }
          }
        }
      }
    },
    handleRedirect() {
      if (redirect.exists()) {
        const redirectTo = redirect.get()
        redirect.purge()
        window.location.href = redirectTo
      }
      else {
        // fallback redirect
        window.location.href = `http://${deploymentOrganisation}${domain}`
      }
    },
    redirectToIndexPage() {
      window.location.href = config.appURL
    },
  },
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
