<template>
  <div class="min-h-screen">
    <div class="container mx-auto p-4">
      <div class="bg-white rounded-lg shadow-md p-8 max-w-lg mx-auto">
        <form @submit.prevent="submitForm">
          <h2 class="text-2xl font-semibold mb-6 text-gray-800">Create Comment</h2>

          <div class="mb-6"></div>

          <div class="mb-6">
            <label
              :for="commentFor === 'comment' ? 'comments' : 'post-id'"
              class="block text-gray-700 text-md mb-2"
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
              :options="comments.data"
              mode="single"
              :searchable="true"
              required
              :caret="true"
              placeholder="Select comment"
              class="px-4 multiselect-blue"
            />
            <input
              v-else
              v-model="selectedPost"
              id="post-id"
              type="number"
              placeholder="Enter Post ID"
              class="w-full mt-1 border border-solid border-gray-300 rounded-md px-4 pl-7 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none transition duration-200"
            />

            <div class="flex flex-col text-right">
              <!-- <span class="text-gray-500">{{ characterCount }} / 50</span>
              <span class="text-red-500">{{ contentError }}</span> -->
            </div>
          </div>
          <div class="mb-6">
            <label for="comment-content" class="block text-gray-700 text-md mb-2">Content</label>
            <textarea
              id="comment-content"
              v-model="content"
              class="w-full mt-1 border border-solid border-gray-300 rounded-md px-4 pl-7 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none transition duration-200"
              rows="4"
              placeholder="I have a comment for Comment #..."
            ></textarea>
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
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { watch } from 'vue'
import { reactive, ref } from 'vue'
import Multiselect from '@vueform/multiselect'

interface CommentsObj {
  data: { id: number; content: string }[]
  loading: boolean
  error: Error | undefined
}
export default {
  components: {
    Multiselect
  },
  setup() {
    const { onResult } = useQuery<{ comments: { id: number; content: string }[] }>(gql`
      query {
        comments {
          id
          content
        }
      }
    `)

    // const { result } = useQuery(gql`
    //   query {
    //     post {
    //       id
    //       content
    //     }
    //   }
    // `)
    // watch(result, (value: any) => {
    //   console.log('posts', value)
    // })

    const comments = reactive<CommentsObj>({
      data: [],
      loading: false,
      error: undefined
    })
    const commentFor = ref('comment')
    const selectedComments = ref(null)
    const selectedPost = ref(null)
    const content = ref<string>('')

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

    onResult(({ data, loading, error }) => {
      comments.data = data.comments.map(({ id, content }) => ({ id, content }))
      comments.loading = loading
      comments.error = error
      console.log('data', data)
    })

    return {
      comments,
      content,
      submitForm,
      selectedComments,
      selectedPost,
      commentFor
    }
  }
}
</script>

<style></style>
