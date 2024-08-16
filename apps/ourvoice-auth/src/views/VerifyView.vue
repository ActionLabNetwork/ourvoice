<template>
  <div class="fill">
    <div class="form-container">
      <div v-if="processing" class="form-content-container">
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
      <div v-else class="form-content-container">
        <div class="form-text-header">Sign In or Sign Up</div>
        <div class="form-subtitle">Click the button below to log in on this device</div>
        <div class="button-container">
          <button class="form-button" v-on:click="goToAuth">CONTINUE</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Session from 'supertokens-web-js/recipe/session'
import Passwordless from 'supertokens-web-js/recipe/passwordless'
import { ManageRedirectStateService } from '../utils/manage-redirect-state.service'
import { defineComponent } from 'vue'
import { DeploymentService } from '../utils/deployment.service'
import config from '@/config'
import YamlContent from '../../../../config/config.yml'

const redirect: ManageRedirectStateService = new ManageRedirectStateService()
const deployment: DeploymentService = new DeploymentService()
// TODO: this list might be coming from the database later
const deploymentOrganisation = YamlContent.deployment as string

const domain = config.sessionTokenFrontendDomain

export default defineComponent({
  setup() {
    return { deployment: deployment.exists() ? deployment.get() : deploymentOrganisation }
  },
  data() {
    return {
      processing: true
    }
  },
  mounted() {
    // this redirects the user to the app if a session
    // already exists.
    this.checkForSession()
  },
  methods: {
    goToAuth() {
      window.location.assign('/signinWithoutPassword')
    },
    handleMagicLinkClicked: async function () {
      try {
        let response = await Passwordless.consumeCode({
          options: {
            preAPIHook: async (context) => {
              let requestInit = context.requestInit

              let headers = {
                ...requestInit.headers,
                deployment: this.deployment
              }
              requestInit = {
                ...requestInit,
                headers
              }
              return {
                url: context.url,
                requestInit
              }
            }
          }
        })

        if (response.status === 'OK') {
          Passwordless.clearLoginAttemptInfo()
          if (response.createdNewRecipeUser) {
            // attempt refreshing token to get deployment data into payload
            Session.attemptRefreshingSession().then((success) => {
              if (success) {
                // remove deployment info
                deployment.purge()
                this.handleRedirect()
              } else {
                // we redirect to the login page since the user
                // is now logged out
                return window.location.assign('/signinWithoutPassword')
              }
            })
          } else {
            // user sign in success
            deployment.purge()
            this.handleRedirect()
          }
        } else {
          // this can happen if the magic link has expired or is invalid
          console.log('Login failed. Please try again')
          Passwordless.clearLoginAttemptInfo()
          window.location.assign(
            '/signinWithoutPassword?error=Invalid magic link. Please try again'
          )
        }
      } catch (err: any) {
        if (err.isSuperTokensGeneralError === true) {
          // this may be a custom error message sent from the API by you.
          console.log(err.message)
        } else {
          console.log('Oops! Something went wrong.')
        }
      }
    },
    hasInitialMagicLinkBeenSent: async function () {
      if (!(await Passwordless.getLoginAttemptInfo())) {
        this.processing = false
      } else {
        this.handleMagicLinkClicked()
      }
    },
    checkForSession: async function () {
      if (await Session.doesSessionExist()) {
        this.handleRedirect()
      } else {
        this.hasInitialMagicLinkBeenSent()
      }
    },
    handleRedirect: function () {
      if (redirect.exists()) {
        const redirectTo = redirect.get()
        redirect.purge()
        window.location.href = redirectTo
      } else {
        // fallback redirect
        window.location.href = `http://${deploymentOrganisation}${domain}`
      }
    }
  }
})
</script>

<style scoped>
.form-text-header {
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

.button-container {
  display: flex;
  flex-direction: column;
  padding-top: 0px;
  padding-bottom: 34px;
}

.form-button {
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
  background-size: 12000%;
  cursor: pointer;
}

.fill {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.form-container {
  width: 420px;
  margin: 26px auto;
  text-align: center;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.16) 1px 1px 10px;
  background-color: white;
  padding-top: 30px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
}

.form-content-container {
  margin: 0px auto;
}

.spinner {
  width: 80px;
  height: auto;
  padding-top: 20px;
  padding-bottom: 40px;
  margin: 0 auto;
}
</style>
