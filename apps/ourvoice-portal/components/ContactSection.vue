<template>
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-col text-center w-full mb-12">
      <h2
        class="sm:text-3xl text-2xl font-medium title-font mb-4 text-ourvoice-blue"
      >
        Contact Us
      </h2>
      <p class="text-ourvoice-grey text-lg text-center lg:text-left mb-6">
        For more specific information on how to start and configure the platform
        for your workplace environment, please send us a hi through this form.
      </p>
    </div>
    <div class="lg:w-1/2 md:w-2/3 mx-auto">
      <div class="flex flex-wrap -m-2">
        <div class="p-2 w-screen md:w-1/2">
          <div class="relative">
            <label for="name" class="leading-7 text-sm text-ourvoice-grey"
              >Name</label
            >
            <input
              id="name"
              type="text"
              name="name"
              class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-ourvoice-purple focus:bg-ourvoice-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-ourvoice-grey py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
        </div>
        <div class="p-2 w-screen md:w-1/2">
          <div class="relative">
            <label for="email" class="leading-7 text-sm text-ourvoice-grey"
              >Email</label
            >
            <input
              id="email"
              type="email"
              name="email"
              class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-ourvoice-purple focus:bg-ourvoice-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-ourvoice-grey py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
        </div>
        <div class="p-2 w-full">
          <div class="relative">
            <label for="message" class="leading-7 text-sm text-ourvoice-grey"
              >Message</label
            >
            <textarea
              id="message"
              name="message"
              class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-ourvoice-purple focus:bg-ourvoice-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-ourvoice-grey py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
            ></textarea>
          </div>
        </div>
        <div class="p-2 w-full">
          <button
            type="button"
            class="flex mx-auto btn btn-purple btn-hover"
            @click="recaptcha"
          >
            Submit
          </button>
        </div>
        <div
          class="p-2 w-full pt-8 mt-8 border-t border-ourvoice-grey text-center"
        >
          <a class="text-ourvoice-purple">admin@actionlab.dev</a>
          <p class="leading-normal my-5">
            25 Exhibition Walk, Clayton <br />
            Clayton, Melbourne, Australia, 3168
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useReCaptcha, VueReCaptcha } from 'vue-recaptcha-v3'

export default defineComponent({
  name: 'ContactSection',

  setup() {
    const { vueApp } = useNuxtApp()
    vueApp.use(VueReCaptcha, {
      // TODO: Add site key for recaptcha
      siteKey: '',
    })

    const recaptchaInstance = useReCaptcha()

    const recaptcha = async () => {
      // (optional) Wait until recaptcha has been loaded.
      await recaptchaInstance?.recaptchaLoaded()

      // Execute reCAPTCHA with action "login".
      // const token = await recaptchaInstance?.executeRecaptcha('submit')
      // console.log(token)
      // Do stuff with the received token.
    }

    return {
      recaptcha,
    }
  },
})
</script>

<style scoped></style>
