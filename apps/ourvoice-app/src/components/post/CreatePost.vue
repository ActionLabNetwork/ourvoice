<template>
  <div class="min-h-screen">
    <div class="container mx-auto p-4">
      <div
        class="bg-white rounded-lg shadow-md p-8 max-w-lg mx-auto"
      >
        <!-- Form for creating new post -->
        <form @submit="onSubmit" class="space-y-6">
          <h2 class="text-2xl font-semibold mb-6 text-gray-800">Create Post</h2>

          <!-- Title input field -->
          <FormInput id="title" labelText="Title" name="title" labelSpan="required">
            <template #icon>
              <span class="bg-gray-200 p-2 rounded-l-md">
                <font-awesome-icon :icon="['fas', 'heading']" class="icon-color" />
              </span>
            </template>
            <Field
                v-model="title"
                type="text"
                id="title"
                name="title"
                :placeholder="inputPlaceholders.title"
                class="w-full border border-solid border-gray-300 rounded-md rounded-l-none px-4 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none transition duration-200 font-semibold text-gray-800"
                :rules="'validateTitle'"
            />
          </FormInput>

          <!-- Content text area-->
          <FormInput id="content" labelText="Content" name="content"  labelSpan="required">
            <Field
              as="textarea"
              id="content"
              name="content"
              v-model="content"
              class="w-full mt-1 border border-solid border-gray-300 rounded-md px-4 pl-12 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none transition duration-200"
              rows="4"
              :placeholder="inputPlaceholders.content"
              @input="updateCharacterCount"
              :rules="'validateContent'"
            ></Field>

            <!-- Character count and error message -->
            <template #info>
              <div class="flex flex-row-reverse justify-between text-sm">
                <span :class="contentError ? 'text-red-500' : 'text-green-500'">{{ characterCount }} / {{ createPostContentCharacterLimit }}</span>
              </div>
            </template>
          </FormInput>

          <!-- Categories input field -->
          <FormInput v-if="!categoriesData.loading" id="categories" name="categories" labelText="Categories" labelSpan="select 1 to 2">
            <div class="flex flex-col w-full">
              <Field id="categories" name="categories" :rules="'validateCategories'" v-slot="{ field }">
                <Multiselect
                  id="categories"
                  v-model="selectedCategories"
                  :options="categoriesData.data.map(({ id, name }) => ({ label: name, value: id }))"
                  mode="tags"
                  :searchable="true"
                  :caret="true"
                  :placeholder="inputPlaceholders.categories"
                  class="px-8 multiselect-blue"
                  v-bind="field"
                />
              </Field>
              <!-- Show error message if there's an error fetching categories -->
              <div v-if="categoriesData.errorMessage" class="text-red-500 text-sm">
                {{ categoriesData.errorMessage }}
              </div>
            </div>
          </FormInput>
          <div v-else>
            <p class="font-semibold text-gray-500">Loading categories...</p>
          </div>

          <!-- Attachments input field -->
          <Field id="attachments" name="attachments" :rules="'validateAttachments'" v-slot="{ field }">
            <AttachmentInput
              :attachmentsError="attachmentsError" @update:attachments="updateAttachments"
              v-bind="field"
            />
          </Field>

          <!-- Uploaded Attachments -->
          <AttachmentList v-if="attachments" :attachments="attachments" />

          <!-- Submit button -->
          <div v-if="!categoriesData.loading" class="flex justify-end">
            <button
              type="submit"
              :disabled="!isValidForm"
              class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md flex items-center transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
              data-cy="create-post-submit-button"
            >
              Create Post
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

<script lang="ts">
import { ref, computed } from 'vue';
import Multiselect from '@vueform/multiselect';
import FormInput from '@/components/inputs/FormInput.vue'
import { useCategoriesStore } from '@/stores/categories';
import AttachmentInput from '../inputs/AttachmentInput.vue';
import AttachmentList from '../inputs/AttachmentList.vue';
import { createPostContentCharacterLimit, postFilesBucket, postFilesPresignedUrlTTL, inputPlaceholders } from '@/constants/post';
import { usePostsStore } from '@/stores/posts';
import { uploadFileUsingPresignedUrl } from '@/services/s3-service';
import { Field, defineRule, useForm } from 'vee-validate';
import { validateAttachments, validateCategories, validateContent, validateTitle } from '@/validators';

interface PresignedUrlResponse {
  key: string;
  url: string;
}

export default {
  components: { AttachmentInput, AttachmentList, Field, FormInput, Multiselect },
  setup() {
    // Fetch categories and initial state
    const categoriesStore = useCategoriesStore()
    categoriesStore.fetchCategories()

    const postsStore = usePostsStore()

    const { handleSubmit, resetForm, setFieldValue, setFieldError, errors } = useForm()

    // Form fields
    const title = ref('');
    const content = ref('');
    const selectedCategories = ref<string[]>([])
    const attachments = ref<FileList | null>(null);
    const attachmentsInputRef = ref<HTMLInputElement | null>(null)
    const characterCount = ref(0)
    const presignedUrls = ref<PresignedUrlResponse[]>([])

    // Errors
    const titleError = ref('')
    const contentError = ref('')
    const attachmentsError = ref('')

    // Update character count and validate content length
    const updateCharacterCount = () => {
      characterCount.value = content.value.length
      contentError.value = content.value.length > createPostContentCharacterLimit ? `Content must not exceed ${createPostContentCharacterLimit} characters.` : '';
    }

    const updateAttachments = async (event: Event) => {
      const files = (event.target as HTMLInputElement).files;
      attachments.value = files ? files : null

      if (!files) return;

      // Generate unique keys for each attachment
      const keys = Array.from(files).map((file, index) => `user123/${Date.now()}_${index}_${file.name}`);

      const response = await postsStore.getPresignedUrls(postFilesBucket, keys, postFilesPresignedUrlTTL)
      presignedUrls.value = response as { key: string; url: string; }[] ?? []
    }

    // Define form validation rules
    defineRule('validateTitle', validateTitle)
    defineRule('validateContent', validateContent)
    defineRule('validateCategories', validateCategories)
    defineRule('validateAttachments', validateAttachments)

    // Check if form is valid
    const isValidForm = computed(() => {
      return Object.keys(errors.value).length === 0
    })

    // Handle Form submission
    const onSubmit = handleSubmit(async (values) => {
      // Upload files to S3 using the presigned URLs
      if (values.attachments && presignedUrls.value.length > 0) {
        try {
          const uploadPromises = presignedUrls.value.map((presignedUrl, index) =>
            values.attachments && uploadFileUsingPresignedUrl(presignedUrl, values.attachments[index])
          );

          await Promise.all(uploadPromises);
        } catch (error) {
          console.error('Error uploading files using presigned URLs:', error);
          // TODO: Handle error accordingly (e.g., show an error message to the user)
          return
        }
      }

      // TODO: Replace authorId with the actual user ID when integrating with auth.
      await postsStore.createPost({
        title: values.title, content: values.content, categoryIds: values.categories, files: presignedUrls.value.map(({ key }) => key), authorId: 1
      })

      // After successfully submitting the form, reset the form fields
      resetForm()
      selectedCategories.value = []
      setFieldValue('categories', [])
      setFieldError('categories', undefined)

      attachments.value = null;
      if (attachmentsInputRef.value) attachmentsInputRef.value.value = '';

      characterCount.value = 0
    })

    return {
      title,
      content,
      categoriesData: categoriesStore,
      selectedCategories,
      attachments,
      updateCharacterCount,
      characterCount,
      createPostContentCharacterLimit,
      titleError,
      contentError,
      attachmentsError,
      updateAttachments,
      isValidForm,
      onSubmit,
      inputPlaceholders
    };
  },
};
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
