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
            <input
              id="title"
              v-model="title"
              type="text"
              placeholder="Share your thoughts anonymously"
              class="w-full mt-1 border border-solid border-gray-300 rounded-md px-4 pl-7 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none transition duration-200 font-semibold"
            />
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-md mb-2">Content</label>
            <textarea
              v-model="content"
              class="w-full mt-1 border border-solid border-gray-300 rounded-md px-4 pl-7 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none transition duration-200"
              rows="4"
              placeholder="I have an idea for improving..."
            ></textarea>
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-md mb-2">Categories</label>
            <Multiselect v-model="selectedCategories" :options="categories" mode="tags" :searchable="true" required :caret="true" placeholder="Select categories" class="px-4 multiselect-blue" />
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-md mb-2">Attachments</label>
            <input
              @change="updateAttachments"
              type="file"
              class="w-full mt-1 border border-solid border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none transition duration-200"
              multiple
            />
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
import { ref } from 'vue';
import Multiselect from '@vueform/multiselect';

export default {
  components: { Multiselect },
  setup() {
    const title = ref('');
    const content = ref('');
    const category = ref('');
    const categories = ref(['Technology', 'Business', 'Design', 'Science', 'Health']);
    const selectedCategories = ref<string[]>([])
    const attachments = ref<FileList | null>(null);

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

    return {
      title,
      content,
      category,
      categories,
      selectedCategories,
      attachments,
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
