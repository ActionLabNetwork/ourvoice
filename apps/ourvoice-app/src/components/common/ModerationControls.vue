<template>
  <form @submit.prevent="onSubmit" class="relative" v-if="isStoreLoaded">
    <div
      class="overflow-hidden rounded-b-lg border border-gray-300 shadow-sm"
      :class="{
        'focus-within:border-red-500  focus-within:ring-red-500':
          moderationReasonField.errorMessage.value,
        'focus-within:border-indigo-500 focus-within:ring-indigo-500':
          !moderationReasonField.errorMessage.value
      }"
    >
      <textarea
        id="moderationReason"
        name="moderationReason"
        v-model="moderationReasonField.value.value"
        rows="6"
        class="block w-full resize-none border-none outline-none py-5 px-6 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
        :placeholder="fieldPlaceholder"
        data-cy="moderation-reason-textarea"
      />
    </div>

    <!-- Moderation actions -->
    <div class="absolute inset-x-px bottom-0 bg-white rounded-b-lg">
      <div class="flex items-center border-t justify-between border-gray-200 px-2 py-2 sm:px-3">
        <div>
          <div class="flex gap-2">
            <div v-for="a in actions" :key="a.name">
              <CustomButton
                :label="a.name"
                :class-name="`w-28 ${action.name === a.name ? 'bg-ourvoice-base-light-300' : ''}`"
                variant="outlined"
                :on-click="() => (action = a)"
                type="button"
              >
                <template #icon-after-text>
                  <font-awesome-icon :icon="['fas', a.icon]" />
                </template>
              </CustomButton>
            </div>
          </div>
        </div>

        <!-- Submit button -->
        <div class="flex-shrink-0">
          <CustomButton
            data-cy="moderate-button"
            :disabled-predicate="() => !isValidForm"
            label="Submit Moderation"
            class-name="bg-ourvoice-primary-3 text-white hover:bg-ourvoice-primary-3/80"
            type="submit"
          />
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, ref, watch, watchEffect, type PropType, onMounted } from 'vue'
import { useField, useForm } from 'vee-validate'
import { validateModerationReason } from '@/validators/moderation-post-validator'
import { MODERATION_ACTIONS } from '@/constants/moderation'
import CustomButton from '@/components/common/CustomButton.vue'

const props = defineProps({
  threadType: {
    type: String as PropType<'post' | 'comment'>,
    required: true
  }
})

const emit = defineEmits(['moderation-action-change', 'moderation-submit'])

const loadStore = async () => {
  let store
  if (props.threadType === 'post') {
    const { usePostModerationStore } = await import('@/stores/post-moderation')
    store = usePostModerationStore()
  } else {
    const { useCommentModerationStore } = await import('@/stores/comment-moderation')
    store = useCommentModerationStore()
  }
  return store
}

const actions = MODERATION_ACTIONS
const action = ref(actions[0])
const fieldPlaceholder = ref('')
const isStoreLoaded = ref(false)
let store: Awaited<ReturnType<typeof loadStore>> | undefined = undefined

const { resetForm } = useForm()

onMounted(async () => {
  store = await loadStore()
  if (store) isStoreLoaded.value = true
})
// VeeValidate Form Fields
function useVeeValidateField<T>(fieldName: string, validationNeeded = true) {
  const { errorMessage, value, meta } = useField<T>(fieldName, (value) =>
    validationNeeded ? validateModerationReason(value as string) : true
  )
  return { errorMessage, value, meta }
}

let moderationReasonField = useVeeValidateField<string>('moderationReason', action.value.validate)

const isValidForm = computed(() => {
  const modifyFormHasNoErrors = store?.versionInModification.isValid
  const reasonFieldHasNoErrors =
    moderationReasonField.meta.validated && moderationReasonField.errorMessage.value == null

  switch (action.value.name) {
    case 'Accept':
      // No validations for accepting the post
      return true

    case 'Modify':
      return modifyFormHasNoErrors && reasonFieldHasNoErrors

    case 'Reject':
      return reasonFieldHasNoErrors

    default:
      // If the action name does not match any case
      return false // Should never happen
  }
})

async function onSubmit() {
  // This should never happen since we disable the button, but just in case
  if (moderationReasonField.errorMessage.value != null) {
    return
  }

  emit('moderation-submit', {
    action: action.value.name,
    reason: moderationReasonField.value.value
  })
}

watch(
  action,
  (newAction) => {
    moderationReasonField = useVeeValidateField<string>('moderationReason', newAction.validate)
    resetForm()
  },
  { immediate: true }
)

watchEffect(() => {
  emit('moderation-action-change', action.value.name)
  fieldPlaceholder.value = action.value.placeholder
})
</script>
