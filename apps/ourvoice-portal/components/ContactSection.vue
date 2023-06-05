<template>
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-col text-center w-full mb-12 items-center">
      <h2
        class="sm:text-3xl text-2xl font-bold title-font mb-4 text-ourvoice-blue"
      >
        Contact Us
      </h2>
      <p class="text-lg text-center mb-6 max-w-2xl">
        For more specific information on how to start and configure the platform
        for your workplace environment, please send us a hi through this form.
      </p>
    </div>
    <div class="md:max-w-4xl mx-auto flex flex-wrap -m-2">
      <div class="p-2 w-screen md:w-1/2">
        <div class="relative">
          <label for="name" class="leading-7 text-lg font-semibold font-Inter"
            >Name</label
          >
          <input
            id="name"
            v-model="form.name"
            type="text"
            name="name"
            class="w-full contact-form-input text-base outline-none py-1 px-3 h-[60px] leading-8 transition-colors duration-200 ease-in-out"
            @input="v$.name.$reset()"
            @blur="v$.name.$touch()"
            :disabled="state.formState != 'open'"
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
          <label for="email" class="leading-7 text-lg font-semibold font-Inter"
            >Email</label
          >
          <input
            id="email"
            v-model="form.email"
            type="email"
            name="email"
            class="w-full contact-form-input text-base outline-none py-1 px-3 h-[60px] leading-8 transition-colors duration-200 ease-in-out"
            @input="v$.email.$reset()"
            @blur="v$.email.$touch()"
            :disabled="state.formState != 'open'"
          />
          <div class="h-4 mt-0.5">
            <p v-if="v$.email.$error" class="text-xs text-red-500">
              {{ v$.email.$errors[0].$message }}
            </p>
          </div>
        </div>
      </div>
      <div class="p-2 w-full">
        <div class="relative left-0">
          <label
            for="message"
            class="leading-7 text-lg font-semibold font-Inter"
            >Message</label
          >
          <textarea
            id="message"
            v-model="form.message"
            name="message"
            class="w-full contact-form-input h-[250px] text-base outline-none py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
            @input="v$.message.$reset()"
            @blur="v$.message.$touch()"
            :disabled="state.formState != 'open'"
          />
          <div class="h-4 mt-0.5">
            <p v-if="v$.message.$error" class="text-xs text-red-500">
              {{ v$.message.$errors[0].$message }}
            </p>
          </div>
        </div>
      </div>
      <div class="p-2">
        <button
          type="button"
          class="flex mx-auto btn-base py-4 px-6 btn-yellow btn-hover w-40"
          :disabled="state.formState != 'open'"
          @click="submitForm"
        >
          <div class="m-auto">
            <span v-if="state.formState == 'open'"
              ><span class="mr-1.5">Submit</span>
              <ClientOnly> <font-awesome-icon icon="arrow-right" /></ClientOnly>
            </span>
            <span v-else-if="state.formState == 'loading'">Loading...</span>
            <span v-else>Submitted</span>
          </div>
        </button>
      </div>
      <!--        <div-->
      <!--          class="p-2 w-full pt-8 mt-8 border-t border-ourvoice-grey text-center"-->
      <!--        >-->
      <!--          <a class="text-black">admin@actionlab.dev</a>-->
      <!--          <p class="leading-normal my-5">-->
      <!--            25 Exhibition Walk, Clayton <br />-->
      <!--            Clayton, Melbourne, Australia, 3168-->
      <!--          </p>-->
      <!--        </div>-->
    </div>
  </div>
</template>

<script lang="ts">
import { provideApolloClient, useMutation } from '@vue/apollo-composable'
import useVuelidate from '@vuelidate/core'
import {
  email,
  helpers,
  maxLength,
  minLength,
  required,
} from '@vuelidate/validators'
import { createApolloClient } from '~/graphql/client'
import gql from 'graphql-tag'
import { defineComponent } from 'vue'
import { useReCaptcha, VueReCaptcha } from 'vue-recaptcha-v3'

export default defineComponent({
  name: 'ContactSection',

  setup() {
    const config = useRuntimeConfig()
    const { vueApp } = useNuxtApp()
    vueApp.use(VueReCaptcha, {
      siteKey: config.public.recaptchaSiteKey,
      loaderOptions: {},
    })
    provideApolloClient(createApolloClient(config.public.apiUrl))
    const CREATE_CONTACT_FORM_ENTRY = gql`
      mutation CreateContactFormEntry($data: ContactFormEntryCreateInput!) {
        createContactFormEntry(data: $data)
      }
    `
    const { mutate: createContactFormEntry } = useMutation(
      CREATE_CONTACT_FORM_ENTRY
    )

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

    type State = {
      formState: 'open' | 'loading' | 'submitted'
    }
    const state: State = reactive({
      formState: 'open',
    })

    const submitForm = async () => {
      v$.value.$touch()
      if (v$.value.$error) return
      state.formState = 'loading'
      try {
        if (!recaptchaInstance) {
          throw new Error('reCaptcha is not available')
        }
        await recaptchaInstance.recaptchaLoaded()
        const token = await recaptchaInstance.executeRecaptcha('submit')
        const data = { ...form, recaptchaToken: token }
        await createContactFormEntry({
          data,
        })
        v$.value.$reset()
        state.formState = 'submitted'
      } catch (error) {
        if (error instanceof Error) {
          const message = error.message
          window.alert(message)
        }
        state.formState = 'open'
      }
    }

    return {
      submitForm,
      form,
      v$,
      state,
    }
  },
})
</script>

<style scoped></style>
