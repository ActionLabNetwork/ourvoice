<template>
  <div class="min-h-screen">
    <div class="container mx-auto p-4">
      <div
        class="bg-white rounded-lg shadow-md p-8 max-w-lg mx-auto"
        @submit.prevent="submitForm"
      >
        <form>
          <h2 class="text-2xl font-semibold mb-6 text-gray-800">Create Post</h2>
          <div class="mb-6">
            <label for="title" class="block text-gray-700 mb-2 text-md">Title</label>
            <div class="flex">
              <span class="bg-gray-200 p-2 rounded-l-md">
                <font-awesome-icon :icon="['fas', 'heading']" class="icon-color" />
              </span>
              <input
                v-model="title"
                type="text"
                id="title"
                placeholder="Share your thoughts anonymously"
                class="w-full border border-solid border-gray-300 rounded-md rounded-l-none px-4 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none transition duration-200 font-semibold"
              />
            </div>
          </div>
          <div class="mb-6">
            <label for="content" class="block text-gray-700 text-md mb-2">Content</label>
            <textarea
              id="content"
              v-model="content"
              class="w-full mt-1 border border-solid border-gray-300 rounded-md px-4 pl-7 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none transition duration-200"
              rows="4"
              placeholder="I have an idea for improving..."
              @input="updateCharacterCount"
            ></textarea>
            <div class="flex flex-col text-right">
              <span class="text-gray-500">{{ characterCount }} / 50</span>
              <span class="text-red-500">{{ contentError }}</span>
            </div>
          </div>
          <div class="mb-6">
            <label for="categories" class="block text-gray-700 text-md mb-2">Categories</label>
            <Multiselect id="categories" v-model="selectedCategories" :options="categories.data.map(({ name }) => name)" mode="tags" :searchable="true" required :caret="true" placeholder="Select categories" class="px-4 multiselect-blue" />
          </div>
          <div class="mb-6">
            <label for="attachments" class="block text-gray-700 text-md mb-2">Attachments</label>
            <div class="flex">
              <span class="bg-gray-200 px-2 py-3 rounded-l-md">
                <font-awesome-icon :icon="['fas', 'paperclip']" class="icon-color" />
              </span>
              <input
                @change="updateAttachments"
                type="file"
                id="attachments"
                class="w-full border border-solid border-gray-300 rounded-md rounded-l-none px-4 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none transition duration-200"
                multiple
                />
            </div>
          </div>
          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md flex items-center transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive } from 'vue';
import Multiselect from '@vueform/multiselect';
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const postCharacterLimit = 50;

interface CategoriesObjType {
  data: { id: number, name: string }[];
  loading: boolean;
  error: Error | undefined
}

export default {
  components: { Multiselect },
  setup() {
    const { onResult } = useQuery<{ categories: { id: number, name: string }[] }>(gql`
      query {
        categories {
          id
          name
        }
      }
    `)

    const title = ref('');
    const content = ref('');
    const category = ref('');
    const categories = reactive<CategoriesObjType>({
      data: [],
      loading: false,
      error: undefined
    })
    const selectedCategories = ref<string[]>([])
    const attachments = ref<FileList | null>(null);
    const characterCount = ref(0)
    const contentError = ref('')

    const updateCharacterCount = () => {
      characterCount.value = content.value.length
      contentError.value = content.value.length > postCharacterLimit ? `Content must not exceed ${postCharacterLimit} characters.` : '';
    }

    const updateAttachments = (event: Event) => {
      const files = (event.target as HTMLInputElement).files;
      attachments.value = files ? files : null
    }

    const submitForm = () => {
      // Perform form validation, data processing, and API calls here.
      console.log("Title:", title.value);
      console.log("Content:", content.value);
      console.log("Category:", category.value);
      console.log("Attachments:", attachments.value);

      // After successfully submitting the form, reset the form fields
      title.value = '';
      content.value = '';
      category.value = '';
      attachments.value = null;
    };

    onResult(({ data, loading, error }) => {
      categories.data = data.categories.map(({ id, name }) => ({ id, name }))
      categories.loading = loading
      categories.error = error
    });

    return {
      title,
      content,
      category,
      categories,
      selectedCategories,
      attachments,
      updateCharacterCount,
      characterCount,
      contentError,
      updateAttachments,
      submitForm,
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
