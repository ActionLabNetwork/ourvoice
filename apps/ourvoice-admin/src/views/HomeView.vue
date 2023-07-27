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
      <hr style="width: 100%; text-align: left; margin-left: 0" />
      <p>Manage moderators:</p>
      <table class="table table-striped table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Email</th>
            <th>Deployment</th>
            <th>User</th>
            <th>Moderator</th>
            <th>Administrator</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="index">
            <td>{{ user.id || 'not yet registred' }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.deployment }}</td>
            <td v-for="(role, index) in roles" :key="index">
              <input
                @change="changeRole($event, user.id, role.name)"
                type="checkbox"
                :checked="user.roles.includes(role.name)"
                :fieldId="role.id"
                :disabled="!user.roles.length"
              />
              <!-- <check-box :checked="user.roles.includes(role.name)" :fieldId="role.id" /> -->
              <!-- <select class="form-control" @change="changeRole($event, user.id, user.role)">
                <option value="" selected disabled>Choose</option>
                <option
                  v-for="role in roles"
                  :value="role.id"
                  :key="role.id"
                  :selected="user.role === role.name"
                >
                  {{ role.name }}
                </option>
              </select> -->
            </td>
          </tr>
        </tbody>
      </table>

      <hr style="width: 100%; text-align: left; margin-left: 0" />
      <p>Add allowed user emails:</p>
      <span v-if="!allowedEmails.length">All emails are allowed to register</span>
      <div
        class="grid-flow-col overflow-x-auto py-4 space-x-5 space-y-2 backdrop-blur-md items-center allowed-emails"
      >
        <div v-for="email in allowedEmails" :key="email" class="chip">
          <div class="chip-content">{{ email }}</div>
          <div class="chip-close" @click="removeAllowedEmail(email)">
            <svg class="chip-svg" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
      <input
        type="email"
        inputmode="text"
        multiple
        v-model="allowedEmailsInput"
        @keydown="emailsChanged"
      />
      <button
        :disabled="!emailsValid || allowedEmailsInput.length < 1"
        type="button"
        class="btn btn-red btn-hover"
        @click="addAllowedEmails()"
      >
        Submit
      </button>
      <hr style="width: 100%; text-align: left; margin-left: 0" />
      <p>Add allowed moderator emails:</p>
      <input
        type="email"
        inputmode="text"
        multiple
        v-model="moderatorsInput"
        @keydown="moderatorsChanged"
      />
      <button
        :disabled="!moderatorsValid || moderatorsInput.length < 1"
        type="button"
        class="btn btn-red btn-hover"
        @click="addAllowedModerators()"
      >
        Submit
      </button>
      <!-- <div class="flex justify-center flex-wrap gap-6">
        <button type="button" class="btn btn-red btn-hover">Deploy</button>
      </div> -->
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

import config from '@/config'

const apiURL = config.apiURL
const authURL = `${config.authURL}/signinWithEmailPassword`

export type User = {
  id: string
  email: string
  deployment: string
  roles: string[]
}

export default defineComponent({
  data() {
    return {
      // if session is false, we show a blank screen
      // else we render the UI
      session: false,
      emailsValid: false,
      moderatorsValid: false,
      userId: '',
      users: [] as User[],
      roles: [
        { name: 'user', id: 1 },
        { name: 'moderator', id: 2 },
        { name: 'admin', id: 2 }
      ],
      allowedEmailsInput: '',
      moderatorsInput: '',
      allowedEmails: []
    }
  },
  methods: {
    emailsChanged() {
      // remove empty values
      const emails = this.allowedEmailsInput.split(',').filter((e) => String(e).trim())
      this.emailsValid = emails.every(this.validateEmail)
    },
    moderatorsChanged() {
      // remove empty values
      const emails = this.moderatorsInput.split(',').filter((e) => String(e).trim())
      this.moderatorsValid = emails.every(this.validateEmail)
    },
    validateEmail(email: string) {
      return email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    },
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
            window.location.href = authURL
          }
        }
      }
    },
    callAPI: async function () {
      const response = await fetch(`${apiURL}/sessioninfo`)

      if (response.status === 401) {
        // this means that the session has expired and the
        // user needs to relogin.
        window.location.href = authURL
        return
      }

      const json = await response.json()

      window.alert('Session Information:\n' + JSON.stringify(json, null, 2))
    },
    getUsers: async function () {
      await fetch(`${apiURL}/users`)
        .then(async (response) => {
          const data = await response.json()

          // check for error response
          if (response.status === 401) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status
            window.location.href = authURL
            return Promise.reject(error)
          }
          this.users = data.users
        })
        .catch((error) => {
          console.error('There was an error!', error)
        })
    },
    getAllowedEmails: async function () {
      await fetch(`${apiURL}/users/allowed`)
        .then(async (response) => {
          const data = await response.json()

          // check for error response
          if (response.status === 401) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status
            window.location.href = authURL
            return Promise.reject(error)
          }
          this.allowedEmails = data.users
        })
        .catch((error) => {
          console.error('There was an error!', error)
        })
    },
    async changeRole(event: any, userId: string, role: string) {
      await fetch(`${apiURL}/users/role/${userId}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role,
          assign: event.target.checked
        })
      })
        .then(async (response) => {
          const data = await response.json()

          // check for error response
          if (response.status === 401) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status
            window.location.href = authURL
            return Promise.reject(error)
          }
        })
        .catch((error) => {
          console.error('There was an error!', error)
        })
    },
    async addAllowedEmails() {
      const emails = this.allowedEmailsInput.split(',').filter((e) => String(e).trim())
      await fetch(`${apiURL}/users/allowed`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          emails
        })
      })
        .then(async (response) => {
          const data = await response.json()

          // check for error response
          if (response.status === 401) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status
            window.location.href = authURL
            return Promise.reject(error)
          }
          // TODO: show user message
          if (response.status === 200) {
            this.allowedEmailsInput = ''
            this.getAllowedEmails()
          }
        })
        .catch((error) => {
          console.error('There was an error!', error)
        })
    },
    async removeAllowedEmail(email: string) {
      await fetch(`${apiURL}/users/allowed`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email
        })
      })
        .then(async (response) => {
          const data = await response.json()

          // check for error response
          if (response.status === 401) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status
            window.location.href = authURL
            return Promise.reject(error)
          }
          // TODO: show user message
          if (response.status === 200) {
            this.allowedEmails = this.allowedEmails.filter((e) => e != email)
          }
        })
        .catch((error) => {
          console.error('There was an error!', error)
        })
    },
    async addAllowedModerators() {
      const moderators = this.moderatorsInput.split(',').filter((e) => String(e).trim())
      await fetch(`${apiURL}/users/moderators`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          moderators
        })
      })
        .then(async (response) => {
          const data = await response.json()

          // check for error response
          if (response.status === 401) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status
            window.location.href = authURL
            return Promise.reject(error)
          }
          // TODO: show user message
          if (response.status === 200) {
            this.moderatorsInput = ''
            this.getUsers()
          }
        })
        .catch((error) => {
          console.error('There was an error!', error)
        })
    }
  },

  mounted() {
    // this function checks if a session exists, and if not,
    // it will redirect to the login screen.
    this.checkForSession()
    this.getUsers()
    this.getAllowedEmails()
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
input {
  border: 2px solid black;
  display: block;
  width: 100%;
  margin: 1rem auto;
}

input:focus {
  outline: none; /* To make sure you see the border-color change as you type */
}

input:invalid {
  border-color: red;
}

input:valid {
  border-color: green;
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.8;
}

.allowed-emails {
  width: 100%;
}
.chip {
  display: inline-flex;
  flex-direction: row;
  background-color: #e5e5e5;
  border: none;
  cursor: default;
  height: 36px;
  outline: none;
  padding: 0;
  font-size: 14px;
  font-color: #333333;
  font-family: 'Open Sans', sans-serif;
  white-space: nowrap;
  align-items: center;
  border-radius: 16px;
  vertical-align: middle;
  text-decoration: none;
  justify-content: center;
}
.chip-head {
  display: flex;
  position: relative;
  overflow: hidden;
  background-color: #32c5d2;
  font-size: 1.25rem;
  flex-shrink: 0;
  align-items: center;
  user-select: none;
  border-radius: 50%;
  justify-content: center;
  width: 36px;
  color: #fff;
  height: 36px;
  font-size: 20px;
  margin-right: -4px;
}
.chip-content {
  cursor: inherit;
  display: flex;
  align-items: center;
  user-select: none;
  white-space: nowrap;
  padding-left: 12px;
  padding-right: 12px;
}
.chip-svg {
  color: #999999;
  cursor: pointer;
  height: auto;
  margin: 4px 4px 0 -8px;
  fill: currentColor;
  width: 1em;
  height: 1em;
  display: inline-block;
  font-size: 24px;
  transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  user-select: none;
  flex-shrink: 0;
}
.chip-svg:hover {
  color: #666666;
}
</style>
