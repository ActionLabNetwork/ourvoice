<template>
  <div class="max-h-screen">
    <transition name="fade">
      <div class="h-[80vh]" v-if="loading">
        <Loading>Submitting form to moderation...</Loading>
      </div>
    </transition>
    <div class="container mx-auto p-4" v-if="!loading">
      <div class="mx-auto" v-if="showAlert">
        <Alert class="bg-ourvoice-success/20 p-5 rounded-md">
          <template #icon>
            <div class="flex-shrink-0">
              <CheckCircleIcon class="h-10 w-10 text-ourvoice-success/80" aria-hidden="true" />
            </div>
          </template>
          <template #title>
            <h3 class="text-xl font-medium text-ourvoice-success">Post Submitted for Moderation</h3>
          </template>
          <template #content>
            <div class="space-y-5 mt-5">
              <p>
                Your post has been successfully submitted and is now pending review by our
                moderation team.
              </p>
              <p>
                This is a standard process to ensure our discussions remains safe and welcoming for
                everyone. Please allow up to 24 hours for the review process. Once your post has
                been reviewed and approved, it will be visible to other community members.
              </p>
              <p>
                In the meantime, feel free to explore other discussions and engage with our
                community. We appreciate your patience and understanding.
              </p>
              <p>Thank you for being part of our community!</p>
            </div>
          </template>
          <template #actions>
            <div class="mt-10">
              <div class="-my-1.5 flex">
                <CustomButton
                  type="button"
                  to="/posts"
                  class-name="rounded-md hover:bg-ourvoice-success-dark/80 px-2 py-1.5 text-sm font-medium bg-ourvoice-success-dark text-white"
                  label="Back to Discussion page"
                />
              </div>
            </div>
          </template>
        </Alert>
      </div>
      <div class="bg-white rounded-lg shadow-md p-8 max-w-lg mx-auto" v-if="!showAlert">
        <!-- Form for creating new post -->
        <form @submit="onSubmit" class="space-y-6">
          <h2 class="text-2xl font-semibold mb-6 text-gray-800">Create Post</h2>
          <!-- Title input field -->
          <FormInput
            id="title"
            labelText="Title"
            name="title"
            labelSpan="required"
            :error-message="titleField.errorMessage.value"
            :meta="titleField.meta"
          >
            <template #icon>
              <span
                class="bg-gray-200 p-2 rounded-l-md border border-solid border-gray-300"
                :class="{
                  'focus:border-blue-500 focus:ring-blue-500': !titleField.errorMessage.value,
                  'border-red-500 :border-red-500 focus:ring-red-500': titleField.errorMessage.value
                }"
              >
                <font-awesome-icon :icon="faHeading" class="icon-color" />
              </span>
            </template>
            <input
              v-model="titleField.value.value"
              type="text"
              id="title"
              name="title"
              :placeholder="inputPlaceholders.title"
              class="w-full border border-solid border-gray-300 rounded-md rounded-l-none px-4 py-2 outline-none transition duration-200 font-semibold text-gray-800"
              :class="{
                'focus:border-blue-500 focus:ring-blue-500': !titleField.errorMessage.value,
                'border-red-500 :border-red-500 focus:ring-red-500': titleField.errorMessage.value
              }"
            />
          </FormInput>

          <!-- Content text area-->
          <FormInput
            id="content"
            labelText="Content"
            name="content"
            labelSpan="required"
            :error-message="contentField.errorMessage.value"
            :meta="contentField.meta"
          >
            <textarea
              id="content"
              name="content"
              v-model="contentField.value.value"
              class="w-full mt-1 border border-solid border-gray-300 rounded-md px-4 pl-12 py-2 outline-none transition duration-200"
              :class="{
                'focus:border-blue-500 focus:ring-blue-500': !contentField.errorMessage.value,
                'border-red-500 focus:border-red-500 focus:ring-red-500':
                  contentField.errorMessage.value
              }"
              rows="4"
              :placeholder="inputPlaceholders.content"
              @input="updateCharacterCount"
            />

            <!-- Character count and error message -->
            <template #info>
              <div class="flex flex-row-reverse justify-between text-sm">
                <span :class="contentError ? 'text-red-500' : 'text-green-500'"
                  >{{ characterCount }} / {{ createPostContentCharacterLimit }}</span
                >
              </div>
            </template>
          </FormInput>

          <!-- Categories input field -->
          <FormInput
            v-if="!categoriesStore.loading"
            id="categoriesWrapper"
            name="categories"
            labelText="Categories"
            labelSpan="select at least 1"
            :error-message="categoriesField.errorMessage.value"
            :meta="categoriesField.meta"
          >
            <div class="flex flex-col w-full">
              <Multiselect
                id="categories"
                name="categories"
                v-model="selectedCategories"
                :options="categoriesOptions"
                mode="tags"
                :searchable="true"
                :caret="true"
                :placeholder="inputPlaceholders.categories"
                class="px-8 multiselect-blue"
              />
              <!-- Show error message if there's an error fetching categories -->
              <div v-if="categoriesStore.errorMessage" class="text-red-500 text-sm">
                {{ categoriesStore.errorMessage }}
              </div>
            </div>
          </FormInput>

          <div v-else>
            <p class="font-semibold text-gray-500">Loading categories...</p>
          </div>

          <!-- Attachments input field -->
          <FormInput
            id="attachments"
            name="attachments"
            labelText="Attachments"
            labelSpan="optional"
            :error-message="attachmentsField.errorMessage.value"
            :meta="attachmentsField.meta"
            v-if="showAttachmentsInput"
          >
            <template #icon>
              <span
                class="bg-gray-200 px-2 py-3 rounded-l-md border border-solid border-gray-300"
                :class="{
                  'focus:border-blue-500 focus:ring-blue-500': !attachmentsField.errorMessage.value,
                  'border-red-500 focus:border-red-500 focus:ring-red-500':
                    attachmentsField.errorMessage.value
                }"
              >
                <font-awesome-icon :icon="faPaperclip" class="icon-color" />
              </span>
            </template>
            <input
              ref="attachmentsInputRef"
              @change="updateAttachments"
              type="file"
              id="attachments"
              name="attachments"
              class="w-full border border-solid border-gray-300 rounded-md rounded-l-none px-4 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none transition duration-200"
              :class="{
                'focus:border-blue-500 focus:ring-blue-500': !attachmentsField.errorMessage.value,
                'border-red-500 focus:border-red-500 focus:ring-red-500':
                  attachmentsField.errorMessage.value
              }"
              multiple
            />
          </FormInput>

          <!-- Uploaded Attachments -->
          <AttachmentList
            v-if="attachmentsField.value.value && !attachmentsField.errorMessage.value"
            :attachments="attachmentsField.value.value"
          />

          <!-- Include from the moderators tag checkbox -->
          <div class="gap-x-2 mt-3 flex items-center" v-if="hasElevatedPermissions">
            <label for="from-moderator-chkbox">
              Include
              <FromTheModeratorsTag />
              tag
            </label>
            <input
              type="checkbox"
              id="content-warning-chkbox"
              name="from-moderator-chkbox"
              v-model="hasFromTheModeratorsTag"
            />
          </div>

          <!-- Submit button -->
          <div v-if="!categoriesStore.loading" class="flex justify-end gap-2">
            <button
              type="submit"
              :disabled="!isValidForm"
              class="btn-primary hover:bg-ourvoice-primary/70 px-6 py-2 rounded-full shadow-md flex items-center transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-ourvoice-primary/50 disabled:cursor-not-allowed"
              data-cy="create-post-submit-button"
            >
              Create Post
              <IconArrowLeft class="w-4 h-4 ml-2 rotate-180" />
            </button>
          </div>
          <div v-else>
            <p class="font-semibold text-gray-500">Please wait while categories are loading...</p>
          </div>
        </form>
      </div>
    </div>
    <Toast
      type="danger"
      class="fixed bottom-0 right-5"
      :message="toast.toastMessage.value"
      v-if="toast.showToast.value"
      @click="toast.hide()"
    />
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/20/solid'
import IconArrowLeft from '../icons/IconArrowLeft.vue'
import { ref, computed, watch, onMounted, watchEffect } from 'vue'
import Multiselect from '@vueform/multiselect'
import Toast from '../common/Toast.vue'
import FormInput from '@/components/inputs/FormInput.vue'
import { useCategoriesStore } from '@/stores/categories'
import AttachmentList from '../inputs/AttachmentList.vue'
import {
  createPostContentCharacterLimit,
  postFilesPresignedUrlTTL,
  inputPlaceholders
} from '@/constants/post'
import { usePostsStore } from '@/stores/posts'
import { generateUniqueKey, uploadFileUsingPresignedUrl } from '@/services/s3-service'
import { useForm, useField } from 'vee-validate'
import {
  validateAttachments,
  validateCategories,
  validateContent,
  validateTitle
} from '@/validators'
import { useUserStore } from '@/stores/user'
import Loading from '../common/Loading.vue'
import Alert from '../common/Alert.vue'
import { faHeading, faPaperclip, faUsers } from '@fortawesome/free-solid-svg-icons'
import CustomButton from '../common/CustomButton.vue'
import FromTheModeratorsTag from '../common/FromTheModeratorsTag.vue'
import { useToast } from '@/composables/useToast'

interface PresignedUrlResponse {
  key: string
  url: string
}

const createPostValidationSchema = {
  title(value: string) {
    return validateTitle(value)
  },
  content(value: string) {
    return validateContent(value)
  },
  categories(value: string[]) {
    return validateCategories(value)
  },
  attachments(value: FileList | null) {
    return validateAttachments(value)
  }
}

const toast = useToast()
const userStore = useUserStore()
const hasElevatedPermissions = computed(
  () => userStore.isModerator || userStore.isAdmin || userStore.isSuperAdmin
)

// Fetch categories and initial state
const categoriesStore = useCategoriesStore()
const postsStore = usePostsStore()

onMounted(async () => {
  await userStore.verifyUserSession()
  await categoriesStore.fetchCategories()
})

const { handleSubmit, resetForm, errors } = useForm({
  validationSchema: createPostValidationSchema
})

const loading = ref(false)
const showAlert = ref(false)
const showAttachmentsInput = false

// Form fields
const selectedCategories = ref<string[]>([])
const attachmentsInputRef = ref<HTMLInputElement | null>(null)
const characterCount = ref(0)
const presignedUrls = ref<PresignedUrlResponse[]>([])
const hasFromTheModeratorsTag = ref<boolean>(false)

// VeeValidate Form Fields
const useVeeValidateField = function <T>(fieldName: string) {
  const { errorMessage, value, meta } = useField<T>(fieldName)
  return { errorMessage, value, meta }
}

const titleField = useVeeValidateField<string>('title')
const contentField = useVeeValidateField<string>('content')
const categoriesField = useVeeValidateField<string[]>('categories')
const attachmentsField = useVeeValidateField<FileList | null>('attachments')

// Errors
const contentError = ref('')

// Update character count and validate content length
const updateCharacterCount = () => {
  characterCount.value = contentField.value.value.length
  contentError.value =
    contentField.value.value.length > createPostContentCharacterLimit
      ? `Content must not exceed ${createPostContentCharacterLimit} characters.`
      : ''
}

const updateAttachments = async (event: Event) => {
  const inputElement = event.target as HTMLInputElement
  const files = inputElement.files

  if (!files) {
    attachmentsField.value.value = null
    return
  }

  attachmentsField.value.value = files

  // Generate unique keys for each attachment
  const keys = Array.from(files).map((file, index) =>
    generateUniqueKey(userStore.sessionHash, file, index)
  )

  try {
    const response = await postsStore.getPresignedUrls(keys, postFilesPresignedUrlTTL)
    presignedUrls.value = (response as { key: string; url: string }[]) ?? []
  } catch (error) {
    console.error('Error getting presigned URLs:', error)
    return
  }
}

const requiredFields = [titleField, contentField, categoriesField]

const allRequiredFieldsValidated = computed(() => {
  return requiredFields.every((field) => field.meta.validated)
})
const formHasNoErrors = computed(() => {
  return Object.keys(errors.value).length === 0
})
// Check if form is valid
const isValidForm = computed(() => {
  return allRequiredFieldsValidated.value && formHasNoErrors.value
})

// Handle Form submission
const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  // Upload files to S3 using the presigned URLs
  if (values.attachments && presignedUrls.value.length > 0) {
    try {
      const uploadPromises = presignedUrls.value.map(
        (presignedUrl, index) =>
          values.attachments && uploadFileUsingPresignedUrl(presignedUrl, values.attachments[index])
      )

      await Promise.all(uploadPromises)
    } catch (error) {
      console.error('Error uploading files using presigned URLs:', error)
      // TODO: Handle error accordingly (e.g., show an error message to the user)
      return
    }
  }

  if (!hasElevatedPermissions.value && hasFromTheModeratorsTag.value) {
    toast.setToastMessage('You are not a moderator, unable to include the tag')
    toast.show()
    loading.value = false
    return
  }

  await postsStore.createPost({
    title: values.title,
    content: values.content,
    categoryIds: values.categories,
    files: presignedUrls.value.map(({ key }) => key),
    hasFromTheModeratorsTag: hasFromTheModeratorsTag.value
  })

  // After successfully submitting the form, reset the form fields
  resetFormFields()
  loading.value = false
  showAlert.value = true
})

const resetFormFields = () => {
  // Clear selected categories
  selectedCategories.value = []

  // Clear attachments
  attachmentsField.value.value = null
  if (attachmentsInputRef.value) {
    attachmentsInputRef.value.value = ''
  }

  // Reset character count
  characterCount.value = 0

  // Reset the form
  resetForm()
}

const categoriesOptions = computed(() => {
  return categoriesStore.data.map(({ id, name }) => ({ label: name, value: id }))
})

// The ref returned by veevalidate doesn't work with @vueform/multiselect, so we need this workaround
watch(selectedCategories, async () => {
  categoriesField.value.value = selectedCategories.value
})
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
<style>
:root {
  --form-brand-blue: #2196f3;
}

.multiselect-blue {
  --ms-tag-bg: #dbeafe;
  --ms-tag-color: #2563eb;
  --ms-border-color-active: var(--form-brand-blue);
  --ms-ring-width: 0;
}
</style>
<style scoped>
.icon-color {
  color: #5c5e61;
}

input[type='file'] {
  cursor: pointer;
}
</style>
