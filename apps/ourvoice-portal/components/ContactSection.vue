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
              v-model="form.name"
              type="text"
              name="name"
              class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-ourvoice-purple focus:bg-ourvoice-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-ourvoice-grey py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              @input="v$.name.$reset()"
              @blur="v$.name.$touch()"
            />
            <div class="h-4 mt-0.5">
              <p v-if="v$.name.$error" class="text-xs text-red-500">
                {{ v$.name.$errors[0].$message }}
              </p>
            </div>
          </div>
        </div>
        <div class="p-2 w-screen md:w-1/2">
          <div class="relative">
            <label for="email" class="leading-7 text-sm text-ourvoice-grey"
              >Email</label
            >
            <input
              id="email"
              v-model="form.email"
              type="email"
              name="email"
              class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-ourvoice-purple focus:bg-ourvoice-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-ourvoice-grey py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              @input="v$.email.$reset()"
              @blur="v$.email.$touch()"
            />
            <div class="h-4 mt-0.5">
              <p v-if="v$.email.$error" class="text-xs text-red-500">
                {{ v$.$errors[0].$message }}
              </p>
            </div>
          </div>
        </div>
        <div class="p-2 w-full">
          <div class="relative">
            <label for="message" class="leading-7 text-sm text-ourvoice-grey"
              >Message</label
            >
            <textarea
              id="message"
              v-model="form.message"
              name="message"
              class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-ourvoice-purple focus:bg-ourvoice-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-ourvoice-grey py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
              @input="v$.message.$reset()"
              @blur="v$.message.$touch()"
            />
            <div class="h-4 mt-0.5">
              <p v-if="v$.message.$error" class="text-xs text-red-500">
                {{ v$.message.$errors[0].$message }}
              </p>
            </div>
          </div>
        </div>
        <div class="p-2 w-full">
          <button
            type="button"
            class="flex mx-auto btn btn-purple btn-hover"
            @click="submitForm"
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
import useVuelidate from '@vuelidate/core'
import {
  email,
  helpers,
  maxLength,
  minLength,
  required,
} from '@vuelidate/validators'
import { defineComponent } from 'vue'
import { useReCaptcha, VueReCaptcha } from 'vue-recaptcha-v3'

export default defineComponent({
  name: 'ContactSection',

  setup() {
    const config = useRuntimeConfig()
    const { vueApp } = useNuxtApp()
    vueApp.use(VueReCaptcha, {
      siteKey: config.public.recaptchaSiteKey,
    })
    const recaptchaInstance = useReCaptcha()

    const form = reactive({
      name: '',
      email: '',
      message: '',
    })
    const customEmailValidator = helpers.withMessage('Not a valid email', email)
    const customRequiredValidator = helpers.withMessage(
      'This field is required',
      required
    )
    const rules = {
      name: { customRequiredValidator, maxLength: maxLength(200) },
      email: { customRequiredValidator, customEmailValidator },
      message: {
        customRequiredValidator,
        minLength: minLength(10),
        maxLength: maxLength(1000),
      },
    }
    const v$ = useVuelidate(rules, form)

    const submitForm = async () => {
      if (!recaptchaInstance) {
        return
      }
      await recaptchaInstance.recaptchaLoaded()
      const token = await recaptchaInstance.executeRecaptcha('submit')

      v$.value.$touch()
      if (v$.value.$error) return

      console.log(`Posting form with recaptcha token ${token}`)
    }

    return {
      submitForm,
      form,
      v$,
    }
  },
})
</script>

<style scoped></style>
