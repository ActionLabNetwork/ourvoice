<template>
  <div v-if="post && version" class="bg-white shadow-lg border border-gray-200 rounded-t-lg p-6 hover:shadow-xl transition-all duration-200 relative flex flex-col gap-3">
    <div class="absolute right-10" v-if="props.decisionIcon">
      <div :class="[props.decisionIcon?.indicatorClass, 'flex gap-2 items-center rounded-full p-1 px-2']">
        <div class="h-2 w-2 rounded-full bg-current" />
        <p>{{ props.decisionIcon?.text }} by you</p>
      </div>
    </div>

    <!-- Author -->
    <div class="group block flex-shrink-0 mb-3">
      <div class="flex items-center">
        <div>
          <img class="inline-block h-9 w-9 rounded-full" :src="`https://ui-avatars.com/api/?name=${nicknameInParts.first}+${nicknameInParts.last}`" alt="PseudoNickname" />
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-700">
            {{ userStore.nickname }}</p>
          <p class="text-xs font-medium text-gray-500">{{ `${formattedDate(version)}` }}</p>
        </div>
      </div>
    </div>

    <!-- Title -->
    <h3 class="text-2xl font-extrabold text-black-700 mb-3">
       <textarea v-model="localVersion.title" class="border rounded p-2 w-full"></textarea>
    </h3>

    <!-- Content -->
    <p class="text-gray-700 text-lg leading-relaxed mb-3">
      <textarea v-model="localVersion.content" class="border rounded p-2 w-full"></textarea>
    </p>

    <!-- Categories -->
    <FormInput v-if="!categoriesStore.loading" id="categoriesWrapper" name="categories" labelText="Categories" labelSpan="select 1 to 2" :error-message="categoriesField.errorMessage.value" :meta="categoriesField.meta">
      <div class="flex flex-col w-full">
        <Multiselect
          id="categories"
          name="categories"
          v-model="selectedCategories"
          :options="categoriesOptions"
          mode="tags"
          :searchable="true"
          :caret="true"
          class="px-8 multiselect-blue"
          />
        <!-- Show error message if there's an error fetching categories -->
        <div v-if="categoriesStore.errorMessage" class="text-red-500 text-sm">
          {{ categoriesStore.errorMessage }}
        </div>
      </div>
    </FormInput>

    <!-- Attachments -->
    <p v-if="version.files && version.attachmentsDownloadUrls" class="mt-2 text-gray-400 text-md mb-2">
      {{ `${version.attachmentsDownloadUrls.length}` }} attachments
    </p>
    <AttachmentBadge v-if="version.attachmentsDownloadUrls"  :files="version.attachmentsDownloadUrls" :modifyMode ="true" @remove-file="handleRemoveFile" />

    <!-- Moderator decisions count -->
    <div class="flex gap-3 justify-around">
      <div v-for="(count, decision) in moderationResultGroups" :key="decision">
        <p class="text-xs text-gray-600">
          {{ decision }}: {{ count }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, watchEffect } from 'vue';
import { useModerationPostsStore, type Moderation, type PostVersion } from '@/stores/moderation-posts';
import type { PropType } from 'vue';
import { formatTimestampToReadableDate } from '@/utils';
import { storeToRefs } from 'pinia';
import { useCategoriesStore } from '@/stores/categories';
import { useField } from 'vee-validate';
import Multiselect from '@vueform/multiselect';
import FormInput from '@/components/inputs/FormInput.vue'
import AttachmentBadge from '@/components/common/AttachmentBadge.vue';
import { useUserStore } from '@/stores/user';

interface DecisionIcon {
  text: string;
  indicatorClass: string;
}

const props = defineProps({
  preview: {
    type: Boolean,
    defaultValue: false
  },
  decisionIcon: {
    type: Object as PropType<DecisionIcon>,
    required: false
  }
});

const emit = defineEmits(['update']);

const userStore = useUserStore()
const { nicknameInParts } = storeToRefs(userStore)

const moderationPostsStore = useModerationPostsStore();
const { postInModeration: post, versionInModeration: version } = storeToRefs(moderationPostsStore);

const categoriesStore = useCategoriesStore()
await categoriesStore.fetchCategories()

// VeeValidate Form Fields
const useVeeValidateField = <T,>(fieldName: string) => {
  const { errorMessage, value, meta } = useField<T>(fieldName)
  return { errorMessage, value, meta }
}

const titleField = useVeeValidateField<string>('title')
const contentField = useVeeValidateField<string>('content')
const categoriesField = useVeeValidateField<number[]>('categories')
const attachmentsField = useVeeValidateField<FileList | null>('attachments')

// Form fields
const selectedCategories = ref<number[]>([])
const attachmentsInputRef = ref<HTMLInputElement | null>(null)
const characterCount = ref(0)
// const presignedUrls = ref<PresignedUrlResponse[]>([])

const categoriesOptions = computed(() => {
  return categoriesStore.data.map(({ id, name }) => ({ label: name, value: id }))
})

if (version.value) {
  selectedCategories.value = version.value.categories.map(({ id }) => id)
}

// The ref returned by veevalidate doesn't work with @vueform/multiselect, so we need this workaround
watch(selectedCategories, async () => {
  categoriesField.value.value = selectedCategories.value
  localVersion.categoryIds = selectedCategories.value
  console.log(selectedCategories.value)
})


const moderationResultGroups = computed(() => {
  const groups = version.value?.moderations.reduce((acc, moderation) => {
    const group = moderation.decision
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(moderation);
    return acc;
  }, {} as Record<string, Moderation[]>);

  const groupsCount = {} as Record<string, number>

  if (groups) {
    Object.keys(groups).forEach((key) => {
      groupsCount[key] = groups[key].length;
    });
  }

  return groupsCount
})

const formattedDate = (version: PostVersion) =>
  formatTimestampToReadableDate(+version.timestamp);

// Reactive copies of post and version
const localVersion = reactive({ ...version.value });

const handleRemoveFile = (file: { key: string; url: string; }) => {
  if (!moderationPostsStore.versionInModeration) return

  const modifiedAttachments = moderationPostsStore.versionInModeration.attachmentsDownloadUrls?.filter((f) => f.key !== file.key)

  moderationPostsStore.versionInModeration = {
    ...moderationPostsStore.versionInModeration,
    attachmentsDownloadUrls: modifiedAttachments
  }

  localVersion.files = modifiedAttachments?.map(({ key }) => key)
}

watch(
  localVersion,
  () => {
    emit('update', localVersion);
  },
  { deep: true }
);
</script>
