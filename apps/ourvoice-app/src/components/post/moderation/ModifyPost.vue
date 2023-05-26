<template>
  <div>
    <div id="modify-form">
      <div
        class="bg-white p-8 shadow-lg"
      >
        <!-- Form for creating new post -->
        <form @submit="onSubmit" class="space-y-6">
          <h2 class="text-xl font-semibold mb-6 text-gray-800">Modify Post</h2>

          <!-- Title input field -->
          <FormInput id="title" labelText="Title" name="title" labelSpan="required" :error-message="titleField.errorMessage.value" :meta="titleField.meta">
            <template #icon>
              <span
              class="bg-gray-200 p-2 rounded-l-md border border-solid border-gray-300"
              :class="{
                'focus:border-blue-500 focus:ring-blue-500': !titleField.errorMessage.value,
                'border-red-500 :border-red-500 focus:ring-red-500': titleField.errorMessage.value
              }">
                <font-awesome-icon :icon="['fas', 'heading']" class="icon-color" />
              </span>
            </template>
            <input v-model="titleField.value.value" type="text" id="title" name="title"     :placeholder="inputPlaceholders.title"
            class="w-full border border-solid border-gray-300 rounded-md rounded-l-none px-4 py-2 outline-none transition duration-200 font-semibold text-gray-800"
            :class="{
              'focus:border-blue-500 focus:ring-blue-500': !titleField.errorMessage.value,
              'border-red-500 :border-red-500 focus:ring-red-500': titleField.errorMessage.value
            }" />
          </FormInput>

          <!-- Content text area-->
          <FormInput id="content" labelText="Content" name="content"  labelSpan="required" :error-message="contentField.errorMessage.value" :meta="contentField.meta">
            <textarea
              id="content"
              name="content"
              v-model="contentField.value.value"
              class="w-full mt-1 border border-solid border-gray-300 rounded-md px-4 pl-12 py-2 outline-none transition duration-200"
              :class="{
                'focus:border-blue-500 focus:ring-blue-500': !contentField.errorMessage.value,
                'border-red-500 focus:border-red-500 focus:ring-red-500': contentField.errorMessage.value
              }"
              rows="4"
              :placeholder="inputPlaceholders.content"
              @input="updateCharacterCount" />

            <!-- Character count and error message -->
            <template #info>
              <div class="flex flex-row-reverse justify-between text-sm">
                <span :class="contentError ? 'text-red-500' : 'text-green-500'">{{ characterCount }} / {{ createPostContentCharacterLimit }}</span>
              </div>
            </template>
          </FormInput>

          <!-- Submit button -->
          <div v-if="!categoriesStore.loading" class="flex justify-end gap-2">
            <button
              type="submit"
              :disabled="!isValidForm"
              class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md flex items-center transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
              data-cy="create-post-submit-button"
            >
              Check Modified Post
            </button>
          </div>
          <div v-else>
            <p class="font-semibold text-gray-500">Please wait while categories are loading...</p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, type Ref } from 'vue';
import Multiselect from '@vueform/multiselect';
import FormInput from '@/components/inputs/FormInput.vue'
import { useCategoriesStore } from '@/stores/categories';
import AttachmentList from '../inputs/AttachmentList.vue';
import { createPostContentCharacterLimit, postFilesBucket, postFilesPresignedUrlTTL, inputPlaceholders } from '@/constants/post';
import { usePostsStore } from '@/stores/posts';
import { uploadFileUsingPresignedUrl } from '@/services/s3-service';
import { useForm, useField } from 'vee-validate';
import { validateAttachments, validateCategories, validateContent, validateTitle } from '@/validators';
import { useUserStore } from '@/stores/user';

export interface FormFields {
  title?: string;
  content?: string;
  categories?: string[];
  attachments?: FileList | null;
}

const props = defineProps({
  // deployment: { type: String, required: true, default: '' },
  title: String,
  content: String
})

const emit = defineEmits(['modify-form-submit'])

interface PresignedUrlResponse {
  key: string;
  url: string;
}

const initialFormValues = computed(() => ({
  title: props.title,
  content: props.content,
}))

const createPostValidationSchema = {
  title(value: string) {
    return validateTitle(value)
  },
  content(value: string) {
    return validateContent(value)
  },
  // categories(value: string[]) {
  //   return validateCategories(value)
  // },
  // attachments(value: FileList | null) {
  //   return validateAttachments(value)
  // }
}

// Init user store and set deployment
// const userStore = useUserStore()
// userStore.setDeployment(props.deployment)

// Fetch categories and initial state
const categoriesStore = useCategoriesStore()
categoriesStore.fetchCategories()

const postsStore = usePostsStore()

const { handleSubmit, resetForm, errors } = useForm({ validationSchema: createPostValidationSchema, initialValues: initialFormValues })

// Form fields
const selectedCategories = ref<string[]>([])
const attachmentsInputRef = ref<HTMLInputElement | null>(null)
const characterCount = ref(0)
const presignedUrls = ref<PresignedUrlResponse[]>([])

// VeeValidate Form Fields
const useVeeValidateField = <T,>(fieldName: string) => {
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
  contentError.value = contentField.value.value.length > createPostContentCharacterLimit ? `Content must not exceed ${createPostContentCharacterLimit} characters.` : '';
}

const generateUniqueKey = (userIdentifier: string, file: File, index: number) => {
  const timestamp = Date.now();
  return `${userIdentifier}/${timestamp}_${index}_${file.name}`;
};

// const updateAttachments = async (event: Event) => {
//   const inputElement = event.target as HTMLInputElement;
//   const files = inputElement.files;

//   if (!files) {
//     attachmentsField.value.value = null;
//     return;
//   }

//   attachmentsField.value.value = files

//   // Generate unique keys for each attachment
//   const keys = Array.from(files).map((file, index) => generateUniqueKey(userStore.sessionHash, file, index));


//   try {
//     const response = await postsStore.getPresignedUrls(postFilesBucket, keys, postFilesPresignedUrlTTL)
//     presignedUrls.value = response as { key: string; url: string; }[] ?? [];
//   } catch (error) {
//     console.error('Error getting presigned URLs:', error);
//     return
//   }
// }

// const requiredFields = [titleField, contentField, categoriesField]
const requiredFields = [titleField, contentField]


const allRequiredFieldsValidated = computed(() => {
  return requiredFields.every(field => field.meta.validated);
});

const formHasNoErrors = computed(() => {
  return Object.keys(errors.value).length === 0
})

// Check if form is valid
const isValidForm = computed(() => {
  return allRequiredFieldsValidated.value && formHasNoErrors.value
})



// Handle Form submission
const onSubmit = handleSubmit(async (values) => {
  console.log("emitting modifu form submit")
  // Emit values to parent component
  emit('modify-form-submit', values)
})
// const onSubmit = handleSubmit(async (values) => {
//   // Upload files to S3 using the presigned URLs
//   if (values.attachments && presignedUrls.value.length > 0) {
//     try {
//       const uploadPromises = presignedUrls.value.map((presignedUrl, index) =>
//         values.attachments && uploadFileUsingPresignedUrl(presignedUrl, values.attachments[index])
//       );

//       await Promise.all(uploadPromises);
//     } catch (error) {
//       console.error('Error uploading files using presigned URLs:', error);
//       // TODO: Handle error accordingly (e.g., show an error message to the user)
//       return
//     }
//   }

//   // TODO: Replace authorId with the actual user ID when integrating with auth.
//   await postsStore.createPost({
//     title: values.title, content: values.content, categoryIds: values.categories, files: presignedUrls.value.map(({ key }) => key)
//   })

//   // After successfully submitting the form, reset the form fields
//   resetFormFields()
// })

const resetFormFields = () => {
  // Clear selected categories
  selectedCategories.value = [];

  // Clear attachments
  attachmentsField.value.value = null;
  if (attachmentsInputRef.value) {
    attachmentsInputRef.value.value = '';
  }

  // Reset character count
  characterCount.value = 0;

  // Reset the form
  resetForm();
}

const categoriesOptions = computed(() => {
  return categoriesStore.data.map(({ id, name }) => ({ label: name, value: id }))
})

// The ref returned by veevalidate doesn't work with @vueform/multiselect, so we need this workaround
watch(selectedCategories, async () => {
  categoriesField.value.value = selectedCategories.value
})
</script>

<style src="@vueform/multiselect/themes/default.css">
</style>
<style>
:root {
  --form-brand-blue: #2196f3;
}

.multiselect-blue {
  --ms-tag-bg: #DBEAFE;
  --ms-tag-color: #2563EB;
  --ms-border-color-active: var(--form-brand-blue);
  --ms-ring-width: 0;
}
</style>
<style scoped>
.icon-color {
  color: #5c5e61;
}

input[type="file"] {
  cursor: pointer;
}
</style>
