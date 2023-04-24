<template>
  <div class="min-h-screen">
    <div class="container mx-auto p-4">
      <div
        class="bg-white rounded-lg shadow-md p-8 max-w-lg mx-auto"
      >
        <!-- Form for creating new post -->
        <form @submit.prevent="handleFormSubmit" class="space-y-6">
          <h2 class="text-2xl font-semibold mb-6 text-gray-800">Create Post</h2>

          <!-- Title input field -->
          <FormInput id="title" labelText="Title" :error="titleError">
            <template #icon>
              <span class="bg-gray-200 p-2 rounded-l-md">
                <font-awesome-icon :icon="['fas', 'heading']" class="icon-color" />
              </span>
            </template>
            <input
                v-model="title"
                type="text"
                id="title"
                placeholder="Share your thoughts anonymously"
                class="w-full border border-solid border-gray-300 rounded-md rounded-l-none px-4 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none transition duration-200 font-semibold text-gray-800"
            />
          </FormInput>

          <!-- Content text area-->
          <FormInput id="content" labelText="Content" :error="contentError">
            <textarea
              id="content"
              v-model="content"
              class="w-full mt-1 border border-solid border-gray-300 rounded-md px-4 pl-12 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none transition duration-200"
              rows="4"
              placeholder="I have an idea for improving..."
              @input="updateCharacterCount"
            ></textarea>

            <!-- Character count and error message -->
            <template #info>
              <div class="flex flex-row-reverse justify-between text-sm">
                <span :class="contentError ? 'text-red-500' : 'text-green-500'">{{ characterCount }} / 50</span>
              </div>
            </template>
          </FormInput>

          <!-- Categories input field -->
          <div v-if="!categoriesData.loading" class="flex flex-col space-y-2">
              <label for="categories" class="block text-gray-700 font-semibold mb-1">Categories</label>
              <Multiselect id="categories" v-model="selectedCategories" :options="categoriesData.data.map(({ id, name }) => ({ label: name, value: id }))"
              mode="tags" :searchable="true" :caret="true" placeholder="Select categories" class="px-4 multiselect-blue" />

              <!-- Show error message if there's an error fetching categories -->
              <div v-if="categoriesData.errorMessage" class="text-red-500 text-sm">
                {{ categoriesData.errorMessage }}
              </div>
          </div>
          <div v-else>
            <p class="font-semibold text-gray-500">Loading categories...</p>
          </div>

          <!-- Attachments input field -->
          <FormInput id="attachments" labelText="Attachments" :error="attachmentsError">
            <template #icon>
              <span class="bg-gray-200 px-2 py-3 rounded-l-md">
                <font-awesome-icon :icon="['fas', 'paperclip']" class="icon-color" />
              </span>
            </template>
            <input
              @change="updateAttachments"
              type="file"
              id="attachments"
              class="w-full border border-solid border-gray-300 rounded-md rounded-l-none px-4 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none transition duration-200"
              multiple
            />
          </FormInput>

          <!-- Uploaded Attachments -->
          <div class="mt-2">
            <p class="font-semibold text-sm mb-1">Uploaded Attachments:</p>
            <ul class="list-inside list-disc">
              <li v-for="(attachment, index) in attachments" :key="index" class="text-sm">{{ attachment.name }}</li>
            </ul>
          </div>

          <!-- Submit button -->
          <div v-if="!categoriesData.loading" class="flex justify-end">
            <button
              type="submit"
              :disabled="!isValidForm"
              class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md flex items-center transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
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
import gql from 'graphql-tag';
import { useMutation } from '@vue/apollo-composable';

const postCharacterLimit = 50;

const CREATE_POST_MUTATION = gql`
  mutation CreatePost($data: PostCreateInput!) {
    createPost(data: $data) {
      id
      title
      content
    }
  }
`

export default {
  components: { FormInput, Multiselect },
  setup() {
    // Fetch categories and initial state
    const categoriesStore = useCategoriesStore()
    categoriesStore.fetchCategories()

    const { mutate } = useMutation(CREATE_POST_MUTATION)

    // Form fields
    const title = ref('');
    const content = ref('');
    const selectedCategories = ref<string[]>([])
    const attachments = ref<FileList | null>(null);
    const characterCount = ref(0)

    // Errors
    const titleError = ref('')
    const contentError = ref('')
    const attachmentsError = ref('')

    // Check if the form is valid
    // TODO: Add more complex validation here. Maybe use Vuelidate/VeeValidate?
    const isValidForm = computed(() => {
      const hasTitle = !!title.value
      const hasContent = !!content.value
      const hasContentError = !!contentError.value
      const hasCategories = !!selectedCategories.value.length

      return hasTitle && hasContent && !hasContentError && hasCategories
    })

    // Update character count and validate content length
    const updateCharacterCount = () => {
      characterCount.value = content.value.length
      contentError.value = content.value.length > postCharacterLimit ? `Content must not exceed ${postCharacterLimit} characters.` : '';
    }

    const updateAttachments = (event: Event) => {
      const files = (event.target as HTMLInputElement).files;
      attachments.value = files ? files : null
    }

    // Handle Form submission
    const handleFormSubmit = async () => {
      if (!isValidForm.value) return;

      const data = {
        title: title.value,
        content: content.value,
        categories: selectedCategories.value,
        attachments: attachments.value,
      };

      // Perform form validation, data processing, and API calls here.
      console.log('Title:', data.title)
      console.log('Content:', data.content)
      console.log('Categories:', data.categories)
      console.log('Attachments:', data.attachments)

      // TODO: Replace authorId with the actual user ID when integrating with auth.
      await mutate({
        data: { title: data.title, content: data.content, categoryIds: data.categories, authorId: 1 }
      })

      // After successfully submitting the form, reset the form fields
      title.value = '';
      content.value = '';
      selectedCategories.value = [];
      attachments.value = null;
    };

    return {
      title,
      content,
      categoriesData: categoriesStore,
      selectedCategories,
      attachments,
      updateCharacterCount,
      characterCount,
      titleError,
      contentError,
      attachmentsError,
      isValidForm,
      updateAttachments,
      handleFormSubmit,
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
