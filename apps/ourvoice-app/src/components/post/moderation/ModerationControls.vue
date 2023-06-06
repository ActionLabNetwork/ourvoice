<template>
  <form @submit.prevent="onSubmit" class="relative">
    <div
    class="overflow-hidden rounded-b-lg border border-gray-300 shadow-sm"
    :class="{
      'focus-within:border-red-500  focus-within:ring-red-500': moderationReasonField.errorMessage.value,
      'focus-within:border-indigo-500 focus-within:ring-indigo-500': !moderationReasonField.errorMessage.value
    }">
      <textarea id="moderationReason" name="moderationReason" v-model="moderationReasonField.value.value" rows="6" class="block w-full resize-none border-none outline-none py-5 px-6 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" :placeholder="fieldPlaceholder" />
    </div>

    <!-- Moderation actions -->
    <div class="absolute inset-x-px bottom-0 bg-white rounded-b-lg">
      <div class="flex items-center border-t justify-between border-gray-200 px-2 py-2 sm:px-3">
        <div>
          <Listbox as="div" v-model="action" class="flex-shrink-0">
            <div class="relative">
              <ListboxButton class="relative inline-flex items-center whitespace-nowrap rounded-full bg-slate-100 px-2 py-2 text-sm font-medium text-gray-500 hover:bg-slate-200 sm:px-3 border border-gray-300">
                <font-awesome-icon :icon="['fas', action.icon]" />
                <span :class="[action.name === null ? '' : 'text-gray-900', 'hidden truncate sm:ml-2 sm:block']">
                  {{ action.name }}
                </span>
              </ListboxButton>

              <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <ListboxOptions class="absolute -top-14 right-28 z-10 mt-1 max-h-56 w-52 overflow-auto rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <ListboxOption as="template" v-for="action in actions" :key="action.name" :value="action" v-slot="{ active }">
                    <ul>
                      <li :class="[active ? 'bg-gray-100' : 'bg-white', 'relative cursor-default select-none px-3 py-2']">
                        <div class="flex items-center gap-2">
                          <font-awesome-icon :icon="['fas', action.icon]" />
                          <span class="block truncate font-medium">
                            {{ action.name }}
                          </span>
                        </div>
                      </li>
                    </ul>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </div>

        <!-- Submit button -->
        <div class="flex-shrink-0">
          <button type="submit" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed" :disabled="!isValidForm">Submit Moderation</button>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { useField, useForm } from 'vee-validate';
import { validateModerationReason } from '@/validators/moderation-post-validator'
import { useModerationPostsStore } from '@/stores/moderation-posts';

const emit = defineEmits(['moderation-action-change', 'moderation-submit'])

const actions = [
  { name: 'Accept', icon: 'fa-check', placeholder: 'Moderation reason (optional)...', validate: false },
  { name: 'Modify', icon: 'fa-edit', placeholder: 'Moderation reason (required)...', validate: true },
  { name: 'Reject', icon: 'fa-xmark', placeholder: 'Moderation reason (required)...', validate: true },
]

const moderationPostsStore = useModerationPostsStore()

const action = ref(actions[0])
const fieldPlaceholder = ref('')

const { resetForm } = useForm()

// VeeValidate Form Fields
const useVeeValidateField = <T,>(fieldName: string, validationNeeded = true) => {
  const { errorMessage, value, meta } = useField<T>(fieldName, value => validationNeeded ? validateModerationReason(value as string) : true)
  return { errorMessage, value, meta }
}
let moderationReasonField = useVeeValidateField<string>(
  'moderationReason', action.value.validate
)

const isValidForm = computed(() => {
  const modifyFormHasNoErrors = moderationPostsStore.versionInModification.isValid;
  const reasonFieldHasNoErrors = moderationReasonField.meta.validated && moderationReasonField.errorMessage.value == null;

  switch (action.value.name) {
    case 'Accept':
      // No validations for accepting the post
      return true;

    case 'Modify':
      return modifyFormHasNoErrors && reasonFieldHasNoErrors;

    case 'Reject':
      return reasonFieldHasNoErrors;

    default:
      // If the action name does not match any case
      return false;  // Should never happen
  }
});

async function onSubmit() {
  // This should never happen since we disable the button, but just in case
  if (moderationReasonField.errorMessage.value != null) {
    return
  }

  emit(
    'moderation-submit',
    { action: action.value.name, reason: moderationReasonField.value.value }
  )
};

watch(action, (newAction) => {
  moderationReasonField = useVeeValidateField<string>(
    'moderationReason', newAction.validate
  )
  resetForm()
}, { immediate: true })

watchEffect(() => {
  emit('moderation-action-change', action.value.name)
  fieldPlaceholder.value = action.value.placeholder
})

</script>
