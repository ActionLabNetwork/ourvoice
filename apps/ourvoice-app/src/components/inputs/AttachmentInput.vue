<template>
  <FormInput id="attachments" labelText="Attachments" :error="attachmentsError" labelSpan="optional">
    <template #icon>
      <span class="bg-gray-200 px-2 py-3 rounded-l-md">
        <font-awesome-icon :icon="['fas', 'paperclip']" class="icon-color" />
      </span>
    </template>
    <input
      ref="attachmentsInput"
      @change="updateAttachments"
      type="file"
      id="attachments"
      class="w-full border border-solid border-gray-300 rounded-md rounded-l-none px-4 py-2 focus:border-blue-500 focus:ring-blue-500 outline-none transition duration-200"
      multiple
    />
  </FormInput>
</template>

<script lang="ts">
import { ref, type Ref } from 'vue';
import FormInput from '@/components/inputs/FormInput.vue';

export default {
  components: { FormInput },
  props: {
    attachmentsError: String,
  },
  setup(_, { emit }) {
    const attachmentsInputRef: Ref<HTMLInputElement | null> = ref<HTMLInputElement | null>(null);

    const updateAttachments = async (event: Event) => {
      emit('update:attachments', event);
    };

    return {
      attachmentsInputRef,
      updateAttachments,
    };
  },
};
</script>

<style scoped>
.icon-color {
  color: #5c5e61;
}

input[type="file"] {
  cursor: pointer;
}
</style>
