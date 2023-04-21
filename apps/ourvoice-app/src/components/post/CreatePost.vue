<template>
  <div class="min-h-screen">
    <div class="container mx-auto p-4">
      <div
        class="bg-white rounded-lg shadow-md p-8 max-w-lg mx-auto"
      >
        <form @submit.prevent="submitForm" class="space-y-6">
          <h2 class="text-2xl font-semibold mb-6 text-gray-800">Create Post</h2>
          <div class="flex flex-col space-y-2">
            <label for="title" class="block text-gray-700 mb-1 font-semibold">Title</label>
            <div class="flex">
              <span class="bg-gray-200 p-2 rounded-l-md">
                <font-awesome-icon :icon="['fas', 'heading']" class="icon-color" />
              </span>
              <input
                v-model="title"
                type="text"
                id="title"
                placeholder="Share your thoughts anonymously"
                class="w-full border border-solid border-gray-300 rounded-md rounded-l-none px-4 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none transition duration-200 font-semibold text-gray-800"
              />
            </div>
          </div>
          <div class="flex flex-col space-y-2">
            <label for="content" class="block text-gray-700 font-semibold mb-1">Content</label>
            <textarea
              id="content"
              v-model="content"
              class="w-full mt-1 border border-solid border-gray-300 rounded-md px-4 pl-7 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none transition duration-200"
              rows="4"
              placeholder="I have an idea for improving..."
              @input="updateCharacterCount"
            ></textarea>
            <div class="flex flex-row-reverse justify-between text-sm">
              <span :class="contentError ? 'text-red-500' : 'text-green-500'">{{ characterCount }} / 50</span>
              <span class="text-red-500">{{ contentError }}</span>
            </div>
          </div>
          <div class="flex flex-col space-y-2">
            <label for="categories" class="block text-gray-700 font-semibold mb-1">Categories</label>
            <Multiselect id="categories" v-model="selectedCategories" :options="categoriesData.data.map(({ name }) => name)" mode="tags" :searchable="true" required :caret="true" placeholder="Select categories" class="px-4 multiselect-blue" />
          </div>
          <div class="flex flex-col space-y-2">
            <label for="attachments" class="block text-gray-700 font-semibold mb-1">Attachments</label>
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
            <div class="mt-2">
              <p class="font-semibold text-sm mb-1">Uploaded Attachments:</p>
              <ul class="list-inside list-disc">
                <li v-for="(attachment, index) in attachments" :key="index" class="text-sm">{{ attachment.name }}</li>
              </ul>
            </div>
          </div>
          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="!isValidForm"
              class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md flex items-center transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
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
import { ref, reactive, computed } from 'vue';
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
    const categoriesData = reactive<CategoriesObjType>({
      data: [],
      loading: false,
      error: undefined
    })
    const selectedCategories = ref<string[]>([])
    const attachments = ref<FileList | null>(null);
    const characterCount = ref(0)
    const contentError = ref('')

    const isValidForm = computed(() => {
      const hasTitle = !!title.value
      const hasContent = !!content.value
      const hasContentError = !!contentError.value
      const hasCategories = !!selectedCategories.value.length

      return hasTitle && hasContent && !hasContentError && hasCategories
    })

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
      console.log("Categories:", selectedCategories.value);
      console.log("Attachments:", attachments.value);

      // After successfully submitting the form, reset the form fields
      title.value = '';
      content.value = '';
      selectedCategories.value = [];
      attachments.value = null;
    };

    onResult(({ data, loading, error }) => {
      categoriesData.data = data.categories.map(({ id, name }) => ({ id, name }))
      categoriesData.loading = loading
      categoriesData.error = error
    });

    return {
      title,
      content,
      categoriesData,
      selectedCategories,
      attachments,
      updateCharacterCount,
      characterCount,
      contentError,
      isValidForm,
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
