<template>
  <div class="min-h-screen">
    <div class="container mx-auto p-4">
      <div class="bg-white rounded-lg shadow-md p-8 max-w-lg mx-auto">
        <form @submit.prevent="submitForm">
          <h2 class="text-2xl font-semibold mb-6 text-gray-800">Create Comment</h2>

          <div class="mb-6"></div>

          <div class="mb-6">
            <label
              :for="commentFor === 'comment' ? 'comments' : 'posts'"
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
              v-model="selectedComment"
              :groups="true"
              valueProp="id"
              label="content"
              :options="commentsData.getGroupedComments"
              mode="single"
              :searchable="true"
              required
              :caret="true"
              placeholder="Select a comment"
              class="px-4"
            />
            <Multiselect
              v-else
              id="posts"
              v-model="selectedPost"
              valueProp="id"
              label="title"
              :options="postsData.data"
              mode="single"
              :searchable="true"
              required
              :caret="true"
              placeholder="Select a post"
              class="px-4"
            />
          </div>
          <div class="mb-6">
            <label for="comment-content" class="block text-gray-700 text-lg font-semibold mb-1"
              >Content</label
            >
            <textarea
              id="comment-content"
              required
              maxlength="255"
              v-model="content"
              class="w-full mt-1 border border-solid border-gray-300 rounded-md px-4 pl-7 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none transition duration-200"
              rows="4"
              placeholder="I have a comment"
              @input="updateCharacterCount"
            ></textarea>
            <div class="flex flex-col text-right">
              <span :class="contentError ? 'text-red-500' : 'text-green-500'"
                >{{ characterCount }} /{{ createPostContentCharacterLimit }}</span
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

  <!-- <pre class="bg-slate-800 text-orange-400"><h1>length: {{commentsData.data.length}}</h1>
  {{ commentsData.data }}
  </pre>
  <pre class="bg-white text-orange-400">{{ commentsData.getGroupedComments }}</pre> -->
</template>

<script lang="ts">
import { useCommentsStore } from '@/stores/comments'
import { usePostsStore } from '@/stores/posts'
import { ref } from 'vue'
import Multiselect from '@vueform/multiselect'
import { createPostContentCharacterLimit } from '@/constants/post'

export default {
  components: {
    Multiselect
  },
  setup() {
    // Fetch comments and initial state
    const commentsStore = useCommentsStore()
    const postsStore = usePostsStore()
    commentsStore.fetchComments()
    postsStore.fetchPosts()

    // Form fields
    const commentFor = ref('comment')
    const selectedComment = ref<number[]>([])
    const selectedPost = ref<number[]>([])
    const content = ref<string>('')
    const characterCount = ref(0)

    const submitForm = async () => {
      //Todo: Perform validation and api call here
      console.log('selectedComment:', selectedComment.value)
      console.log('selectedPost:', selectedPost.value)
      console.log('commentFor:', commentFor.value)
      console.log('content:', content.value)
      //Create comment
      await commentsStore
        .createComment({
          content: content.value,
          postId:
            commentFor.value === 'post' ? selectedPost.value[0] ?? selectedPost.value : undefined,
          parentId:
            commentFor.value === 'comment'
              ? selectedComment.value[0] ?? selectedComment.value
              : undefined,
          //Todo: Get authorId from auth
          authorId: 1
        })
        .then(() => {
          console.log('Comment created successfully')
          //Rest form after successfully submitting the form
          selectedComment.value = []
          selectedPost.value = []
          content.value = ''
          characterCount.value = 0
        })
        .catch((error) => {
          console.log('Error creating comment:', error)
        })
    }

    //Errors
    const contentError = ref('')

    // Update character count and validate content length
    const updateCharacterCount = () => {
      characterCount.value = content.value.length
      contentError.value =
        content.value.length > createPostContentCharacterLimit
          ? `Content must not exceed ${createPostContentCharacterLimit} characters.`
          : ''
    }

    return {
      commentsData: commentsStore,
      postsData: postsStore,
      content,
      submitForm,
      selectedComment,
      selectedPost,
      commentFor,
      updateCharacterCount,
      characterCount,
      contentError,
      createPostContentCharacterLimit
    }
  }
}
</script>

<style></style>
