<template>
  <div class="min-h-screen">
    <div class="container mx-auto p-4">
      <div class="bg-white rounded-lg shadow-md p-8 max-w-lg mx-auto">
        <form @submit.prevent="submitForm">
          <h2 class="text-2xl font-semibold mb-6 text-gray-800">Create Comment</h2>

          <div class="mb-6"></div>

          <div class="mb-6">
            <label
              :for="commentFor === 'comment' ? 'commentsData' : 'post-id'"
              class="block text-gray-700 text-lg mb-1 font-semibold"
              >Comment for</label
            >
            <input
              type="radio"
              id="comment"
              name="commentTabGroup"
              value="comment"
              v-model="commentFor"
            />
            <label for="comment">&nbsp; Comment</label>
            <br />
            <input
              type="radio"
              id="post"
              name="commentTabGroup"
              value="post"
              v-model="commentFor"
            />
            <label for="post">&nbsp; Post</label>
            <Multiselect
              v-if="commentFor === 'comment'"
              id="comments"
              v-model="selectedComments"
              valueProp="id"
              label="content"
              :options="commentsData.data"
              mode="single"
              :searchable="true"
              required
              :caret="true"
              placeholder="Select comment"
              class="px-4"
            />
            <input
              v-else
              v-model="selectedPost"
              id="post-id"
              type="number"
              placeholder="Enter Post ID"
              class="w-full mt-1 border border-solid border-gray-300 rounded-md px-4 pl-7 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none transition duration-200"
            />
          </div>
          <div class="mb-6">
            <label for="comment-content" class="block text-gray-700 text-lg font-semibold mb-1"
              >Content</label
            >
            <textarea
              id="comment-content"
              v-model="content"
              class="w-full mt-1 border border-solid border-gray-300 rounded-md px-4 pl-7 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none transition duration-200"
              rows="4"
              placeholder="I have a comment for ..."
              @input="updateCharacterCount"
            ></textarea>
            <div class="flex flex-col text-right">
              <span :class="contentError ? 'text-red-500' : 'text-green-500'"
                >{{ characterCount }} /{{ createPostCharacterLimit }}</span
              >
            </div>
          </div>
          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md flex items-center transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useCommentsStore } from '@/stores/comments'
import { ref } from 'vue'
import Multiselect from '@vueform/multiselect'
import { createPostCharacterLimit } from '@/constants/post'

export default {
  components: {
    Multiselect
  },
  setup() {
    // Fetch comments and initial state
    const commentsStore = useCommentsStore()
    commentsStore.fetchComments()

    // Form fields
    const commentFor = ref('comment')
    const selectedComments = ref(null)
    const selectedPost = ref(null)
    const content = ref<string>('')
    const characterCount = ref(0)

    const submitForm = () => {
      //Todo: Perform validation and api call here
      console.log('selectedComments:', selectedComments.value)
      console.log('selectedPost:', selectedPost.value)
      console.log('commentFor:', commentFor.value)
      console.log('content:', content.value)

      //Rest form
      selectedComments.value = null
      selectedPost.value = null
      content.value = ''
    }

    //Errors
    const contentError = ref('')

    // Update character count and validate content length
    const updateCharacterCount = () => {
      characterCount.value = content.value.length
      contentError.value =
        content.value.length > createPostCharacterLimit
          ? `Content must not exceed ${createPostCharacterLimit} characters.`
          : ''
    }

    return {
      commentsData: commentsStore,
      content,
      submitForm,
      selectedComments,
      selectedPost,
      commentFor,
      updateCharacterCount,
      characterCount,
      contentError,
      createPostCharacterLimit
    }
  }
}
</script>

<style></style>
