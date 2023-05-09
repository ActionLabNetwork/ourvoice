<template>
  <div class="flex mt-4">
    <div class="flex-shrink-0 mr-3">
      <img
        class="rounded-full w-6 h-6 sm:w-8 sm:h-8"
        src="https://api.multiavatar.com/mingye.png"
        alt=""
      />
    </div>
    <textarea
      class="flex-1 w-full max-h-20 rounded-lg p-2 drop-shadow-md bg-gray-200"
      maxlength="255"
      name=""
      id=""
      cols="30"
      rows="10"
      placeholder="Write a comment..."
    ></textarea>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CommentTextarea',
  setup() {
    return {}
  }
}
</script>
