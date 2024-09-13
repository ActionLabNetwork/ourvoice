<template>
  <div aria-hidden="true" class="fixed inset-0 bg-black/30" />
  <div class="fixed inset-0 flex items-center justify-center p-4">
    <dialog-panel class="w-full max-w-[800px] p-4 flex flex-col bg-white rounded-lg">
      <dialog-title>
        <h4>{{ props.title }}</h4>
      </dialog-title>
      <div
        v-if="locked"
        class="my-2 p-2 text-sm flex flex-row bg-ourvoice-error bg-opacity-30 rounded-md"
      >
        There are votes on the poll. You can not change the question or the options.
      </div>
      <div>Poll Question</div>
      <textarea
        id="title"
        v-model="fields.question"
        class="rounded-3xl px-4 py-2 focus:placeholder:opacity-50 border-2 border-black-400 focus:border-0 rounded-md"
        :disabled="props.locked"
        maxlength="400"
        placeholder="Question"
        type="text"
      />
      <div class="text-sm text-gray text-right">
        {{ fields.question.length }}/400
      </div>
      <div class="py-2 flex flex-col gap-2">
        <div
          v-for="(_, i) in fields.options.length"
          :key="i"
          class="w-full flex flex-row items-center"
        >
          <div class="min-w-[16px] text-gray mr-4">
            {{ i + 1 }}
          </div>
          <input
            v-model="fields.options[i]"
            class="mr-2 flex-grow px-4 py-2 border-2 border-black-400 focus:border-0 rounded-md"
            :disabled="props.locked"
            maxlength="100"
            placeholder="no option"
            type="text"
          >
          <div class="text-sm text-gray text-right">
            {{ fields.options[i].length }}/100
          </div>
          <button v-if="!locked" class="p-2 rounded-full" :disabled="locked" @click="addOption(i)">
            <font-awesome-icon :icon="faPlus" />
          </button>
          <button
            v-if="!locked"
            class="p-2 rounded-full"
            :disabled="locked"
            @click="removeOption(i)"
          >
            <font-awesome-icon :icon="faMinus" />
          </button>
        </div>
        <div
          v-if="!isNumOptionsValid"
          class="my-2 p-2 text-sm flex flex-row bg-ourvoice-error bg-opacity-30 rounded-md"
        >
          You must have 2 to 6 options.
        </div>
      </div>
      <div class="py-2 flex flex-row">
        <div class="flex-grow">
          Closing Date
        </div>
        <input v-model="fields.expiresAtEnabled" class="mr-2" type="checkbox">
        <input
          v-model="fields.localExpiresAt"
          :disabled="!fields.expiresAtEnabled"
          type="datetime-local"
        >
      </div>
      <div class="py-2 flex flex-row">
        <div class="flex-grow">
          Published (user can vote on the poll)
        </div>
        <input v-model="fields.published" type="checkbox">
      </div>
      <div class="py-2 flex flex-row">
        <div class="flex-grow">
          Active (poll is visible to the user)
        </div>
        <input v-model="fields.active" type="checkbox">
      </div>
      <div class="mt-4 flex flex-row justify-between gap-2">
        <button class="btn-outline btn-rounded w-[120px] flex-shrink" @click="$emit('close')">
          Cancel
        </button>
        <button class="btn-primary btn-rounded w-[120px] flex-shrink" :disabled="!isFormValid" @click="submit()">
          Submit
        </button>
      </div>
    </dialog-panel>
  </div>
</template>

<script setup lang="ts">
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { DialogPanel, DialogTitle } from '@headlessui/vue'
import { computed, onMounted, type PropType, reactive } from 'vue'

import type { PollCreateInput } from '@/graphql/generated/graphql'

const props = defineProps({
  poll: {
    type: Object as PropType<PollCreateInput>,
    required: false,
  },
  locked: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})
const emit = defineEmits<{
  (e: 'submit', object: PollCreateInput): void;
  (e: 'close'): void;
}>()

function convertToLocalDate(date: Date | string) {
  // https://stackoverflow.com/questions/30166338/setting-value-of-datetime-local-from-date
  const dateObj = new Date(date)
  const offset = dateObj.getTimezoneOffset()
  dateObj.setMinutes(dateObj.getMinutes() - offset)
  return dateObj.toISOString().slice(0, 16)
}

const fields: Omit<PollCreateInput, 'options' | 'expiresAt'> & {
  options: string[];
  localExpiresAt: string;
  expiresAtEnabled: boolean;
} = reactive({
  question: '',
  published: true,
  options: [''],
  active: true,
  postLink: null,
  weight: 1,
  expiresAtEnabled: false,
  localExpiresAt: convertToLocalDate(new Date()),
})

function initializeFields() {
  if (props.poll) {
    fields.question = props.poll.question
    fields.published = props.poll.published
    fields.options = props.poll.options.map(option => option.option)
    fields.active = props.poll.active
    fields.postLink = props.poll.postLink
    fields.weight = props.poll.weight
    fields.expiresAtEnabled = props.poll.expiresAt != null
    fields.localExpiresAt = convertToLocalDate(props.poll.expiresAt ?? new Date())
  }
}

onMounted(initializeFields)

function addOption(index: number) {
  fields.options = [...fields.options.slice(0, index + 1), '', ...fields.options.slice(index + 1)]
}

function removeOption(index: number) {
  fields.options = [...fields.options.slice(0, index), ...fields.options.slice(index + 1)]
}

const NUM_OPTIONS_LIMIT = 6
const isNumOptionsValid = computed(() => {
  return fields.options.length >= 2 && fields.options.length <= NUM_OPTIONS_LIMIT
})
const isFormValid = computed(() => isNumOptionsValid.value)

function submit() {
  const {
    published,
    active,
    postLink,
    weight,
    expiresAtEnabled,
    localExpiresAt,
    question,
    options: optionStrings,
  } = fields
  const options = optionStrings
    .filter(option => option.trim().length !== 0)
    .map(option => ({ option }))
  emit('submit', {
    published,
    active,
    postLink,
    weight,
    expiresAt: expiresAtEnabled ? new Date(localExpiresAt) : null,
    question,
    options,
  })
  emit('close')
}
</script>
