<template>
  <div class="w-full flex flex-col items-center">
    <div class="w-full max-w-[800px] p-4 flex flex-col items-start">
      <h1 class="text-lg lg:text-2xl mb-4">Preferences</h1>
      <h2 class="text-md lg:text-lg mb-2">Change email address</h2>
      <Form class="flex flex-col w-full sm:flex-row gap-2" @submit="onSubmit">
        <div class="flex-grow">
          <Field
            name="email"
            type="email"
            placeholder="New email address"
            :rules="(validateEmail as any)"
            class="mr-4 p-2 w-full sm:min-w-[300px] grow-1 border-2 border-gray-300 rounded-full"
          />
          <ErrorMessage class="block text-ourvoice-error text-sm" name="email" />
        </div>
        <button
          :disabled="changeEmailState.loadingState !== 'idle' || emailField.errors.value.length !== 0"
          class="w-fit h-fit md:min-w-[100px] px-4 py-2 btn-primary rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="changeEmailState.loadingState === 'idle'">Send verification email</span>
          <span v-else-if="changeEmailState.loadingState === 'loading'">Sending</span>
          <span v-else-if="changeEmailState.loadingState === 'error'">Failed</span>
          <span v-else-if="changeEmailState.loadingState === 'success'">Sent</span>
        </button>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { da } from 'date-fns/locale'
import { useField, Field, Form, ErrorMessage } from 'vee-validate'
import { reactive, ref } from 'vue'

const emailField = useField<string>('email')

const changeEmailState = reactive<{
  loadingState: 'idle' | 'loading' | 'error' | 'success'
}>({
  loadingState: 'idle'
})

const validateEmail = (value: string) => {
  if (!value) {
    return 'This field is required'
  }
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
  if (!regex.test(value)) {
    return 'This field must be a valid email'
  }
  return true
}

async function onSubmit(values: any) {
  try {
    changeEmailState.loadingState = 'loading'
    const response = await fetch(import.meta.env.VITE_APP_AUTH_API_URL + '/changeEmail', {
      method: 'POST',
      body: JSON.stringify({ newEmail: values.email }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    if (data.result !== 'OK') {
      throw new Error(data)
    }
    changeEmailState.loadingState = 'success'
  } catch (e) {
    changeEmailState.loadingState = 'error'
  }
}
</script>
