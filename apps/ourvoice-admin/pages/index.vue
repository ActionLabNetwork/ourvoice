<template>
  <div
    v-if="session"
    class="container flex flex-col-reverse lg:flex-row items-center gap-12 mt-14 lg:mt-28 fill"
  >
    <div class="top-bar">
      <div class="sign-out" @click="submitSignOut">SIGN OUT</div>
    </div>
    <!-- Content -->
    <div class="flex fill flex-1 flex-col items-center lg:items-start">
      <h1
        class="text-ourvoice-blue text-5xl md:text-6 lg:text-6xl text-center lg:text-left mb-6"
      >
        <span class="text-ourvoice-red">OurVoice</span> Admin
      </h1>
      <p class="text-ourvoice-grey text-lg text-center lg:text-left mb-6">
        A safe space for employees and community members to anonymously discuss
        issues and concerns about their work environments.
      </p>
      <div class="flex justify-center flex-wrap gap-6">
        <button type="button" class="btn btn-red btn-hover">Deploy</button>
      </div>
    </div>
    <!-- Image -->
    <div class="flex justify-center flex-1 mb-10 md:mb-16 lg:mb-0 z-10">
      <img
        class="w-5/6 h-5/6 sm:w-3/4 sm:h-3/4 md:w-full md:h-full"
        :src="'/img/ourvoice_logo.svg'"
        alt="OurVoice interface"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { signOut } from 'supertokens-web-js/recipe/emailpassword'
import Session from 'supertokens-web-js/recipe/session'
import { onMounted, ref } from 'vue'

const session = ref(false)
const userId = ref('')

async function checkForSession() {
  if (!(await Session.doesSessionExist())) {
    // since a session does not exist, we send the user to the login page.
    return window.location.assign('/auth')
  }
  const user = await Session.getUserId()
  // this will render the UI
  session.value = true
  userId.value = user
}
async function submitSignOut() {
  await signOut()
  window.location.assign('/auth')
}

onMounted(() => {
  // this function checks if a session exists, and if not,
  // it will redirect to the login screen.
  checkForSession()
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

.home-content {
  /* width: 100%; */
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: bold;
  color: rgb(51, 51, 51);
  padding-top: 10px;
  padding-bottom: 40px;
  margin: auto;
}

.home-emoji {
  font-size: 50px;
}

.session-button {
  padding: 8px 13px;
  background-color: #000;
  border-radius: 10px;
  cursor: pointer;
  color: #fff;
  font-weight: 700;
  font-size: 17px;
}

.bottom-banner {
  display: flex;
  width: 100vw;
  padding-top: 8px;
  padding-bottom: 8px;
  background-color: rgb(0, 0, 0);
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  color: rgb(255, 255, 255);
  font-weight: bold;
}
</style>
