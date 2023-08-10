<template>
  <div class="w-full h-full flex flex-col p-4 items-center justify-center">
    <div class="p-4 md:shadow-lg md:rounded-lg">
      <div class="mb-2">
        <div v-if="state.loadingState == 'loading'">loading</div>
        <div v-else-if="state.loadingState == 'error'">Failed to verify your email</div>
        <div v-else>Your email has been successfully changed</div>
      </div>
      <button
        v-if="state.loadingState !== 'loading'"
        @click="returnToHomepage()"
        class="bg-ourvoice-primary-1 px-4 py-2 rounded-full"
      >
        Return to Login
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import config from '../config'
import Session from 'supertokens-web-js/recipe/session'

const router = useRouter()
const token = router.currentRoute.value.query.token

type UiState = {
  loadingState: 'loading' | 'error' | 'success'
}

const state = reactive<UiState>({
  loadingState: 'loading'
})

async function returnToHomepage() {
  await Session.signOut()
  window.location.href = '/signinWithoutPassword'
}

;(async () => {
  try {
    if (!token) {
      throw Error('token is not set')
    }
    const response = await fetch(config.apiDomain + '/verifyEmail', {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    if (data.result !== 'OK') {
      throw Error(data.message)
    }
    state.loadingState = 'success'
  } catch (err) {
    state.loadingState = 'error'
  }
})()
</script>
