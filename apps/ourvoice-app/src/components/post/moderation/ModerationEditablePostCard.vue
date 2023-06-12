<template>
  <div v-if="post && version" class="bg-white shadow-lg border border-gray-200 rounded-t-lg p-6 hover:shadow-xl transition-all duration-200 relative flex flex-col gap-3">
    <!-- Author -->
    <AuthorBadge
      :authorName="nickname.author.nickname"
      :authorAvatar="`https://ui-avatars.com/api/?name=${nickname.author.parts.first}+${nickname.author.parts.last}`"
      :modificationDate="formattedDate(version)"
      :modifierName="nickname.moderator.nickname"
    />

    <!-- Title -->
    <div>
      <div class="text-2xl font-extrabold text-black-700 mb-3">
        <input type="text" name="title" v-model="titleField.value.value" class="border rounded p-2 w-full" />
      </div>
      <p v-if="titleField.errorMessage.value" class="text-red-500 mb-5 text-sm">
        {{ titleField.errorMessage.value }}
      </p>
    </div>

    <!-- Content -->
    <div>
      <div class="text-gray-700 text-lg leading-relaxed mb-3">
        <textarea v-model="contentField.value.value" name="content" class="border rounded p-2 w-full"></textarea>
      </div>
      <p v-if="contentField.errorMessage.value"
      class="text-red-700 mb-5 text-sm">
        {{ contentField.errorMessage.value }}
      </p>
    </div>

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
import { ref, computed, reactive, watch, watchEffect, onMounted } from 'vue';
import { useModerationPostsStore, type Moderation, type PostVersion } from '@/stores/moderation-posts';
import { formatTimestampToReadableDate } from '@/utils';
import { storeToRefs } from 'pinia';
import { useCategoriesStore } from '@/stores/categories';
import { useField, useForm } from 'vee-validate';
import Multiselect from '@vueform/multiselect';
import FormInput from '@/components/inputs/FormInput.vue'
import AttachmentBadge from '@/components/common/AttachmentBadge.vue';
import { validateCategories, validateContent, validateTitle } from '@/validators/moderation-post-validator';
import AuthorBadge from '@/components/common/AuthorBadge.vue';
import { getGroupsByProperty } from '@/utils/groupByProperty';
import { ModerationVersionDecision } from '@/types/moderation';

const emit = defineEmits(['update']);

const nickname = computed(() => {
  const authorNickname = post.value?.versions.at(-1).authorNickname
  const moderatorNickname = version.value?.authorNickname !== authorNickname ? version.value?.authorNickname : null

  const nicknameSeparator = '_'
  const [aFirst, aMiddle, aLast] = authorNickname.split(nicknameSeparator)
  const [mFirst, mMiddle, mLast] = moderatorNickname?.split(nicknameSeparator) || []
  return {
    author: {
      nickname: authorNickname,
      parts: {
        first: aFirst,
        middle: aMiddle,
        last: aLast
      }
    },
    moderator: {
      nickname: moderatorNickname,
      parts: {
        first: mFirst,
        middle: mMiddle,
        last: mLast
      }
    }
  }
})

// Pinia Stores
const moderationPostsStore = useModerationPostsStore();
const { postInModeration: post, versionInModeration: version } = storeToRefs(moderationPostsStore);

const categoriesStore = useCategoriesStore()
onMounted(async () => {
  await categoriesStore.fetchCategories()
})

// VeeValidate Form Validation
const modifyModerationPostValidationSchema = {
  title(value: string) {
    return validateTitle(value)
  },
  content(value: string) {
    return validateContent(value)
  },
  categories(value: string[]) {
    return validateCategories(value)
  },
}

const { errors } = useForm(
  { validationSchema: modifyModerationPostValidationSchema }
)

// VeeValidate Form Fields
const useVeeValidateField = <T,>(fieldName: string, initialValue?: T) => {
  const { errorMessage, value, meta } = useField<T>(
    fieldName, undefined, { initialValue }
  )

  return { errorMessage, value, meta }
}

const titleField = useVeeValidateField<string>('title', version.value?.title)
const contentField = useVeeValidateField<string>(
  'content', version.value?.content
)
const categoriesField = useVeeValidateField<number[]>('categories', version.value?.categoryIds)

// Form field refs
const selectedCategories = ref<number[]>([])

const categoriesOptions = computed(() => {
  return categoriesStore.data
    .map(({ id, name }) => ({ label: name, value: id }))
})

if (version.value) {
  selectedCategories.value = version.value.categories.map(({ id }) => id)
}

// The ref returned by veevalidate doesn't work with @vueform/multiselect, so we need this workaround
watch(selectedCategories, async () => {
  categoriesField.value.value = selectedCategories.value
})

const formHasNoErrors = computed(() => {
  return Object.keys(errors.value).length === 0
})

const formWasUpdated = computed(() => {
  const titleFieldUpdated = version.value?.title?.trim() !== titleField.value?.value?.trim()
  const contentFieldUpdated = version.value?.content?.trim() !== contentField.value?.value?.trim()

  // Order insensitive comparison for categories
  const sortedCategoryIds = JSON.parse(JSON.stringify(version.value?.categoryIds))?.sort()
  const sortedCategoryFieldIds = JSON.parse(JSON.stringify(categoriesField.value?.value))?.sort()

  const categoriesFieldUpdated = JSON.stringify(sortedCategoryIds) !== JSON.stringify(sortedCategoryFieldIds)

  return titleFieldUpdated || contentFieldUpdated || categoriesFieldUpdated
})

// Counts the number of accepted/rejected moderations by past moderators
const moderationResultGroups = computed(() => {
  const groups: Record<ModerationVersionDecision, Moderation[]> = version.value?.moderations.reduce((acc, moderation) => {
    return getGroupsByProperty('decision', acc, moderation)
  }, {
    ACCEPTED: [], REJECTED: []
  });

  const groupsCount: Record<ModerationVersionDecision, number> = {
    ACCEPTED: 0, REJECTED: 0
  }

  if (groups) {
    Object.keys(groups).forEach((key) => {
      groupsCount[key] = groups[key].length;
    });
  }

  return groupsCount
})

const formattedDate = (version: PostVersion) =>
  formatTimestampToReadableDate(+version.timestamp);

// Reactive copies of version
const localVersion = reactive({
  ...version.value,
  title: titleField.value.value,
  content: contentField.value.value,
  categoryIds: categoriesField.value.value,
  files: version.value.files ?? null
});

const handleRemoveFile = (file: { key: string; url: string; }) => {
  if (!moderationPostsStore.versionInModeration) return

  const modifiedAttachments = moderationPostsStore.versionInModeration.attachmentsDownloadUrls?.filter((f) => f.key !== file.key)

  moderationPostsStore.versionInModeration = {
    ...moderationPostsStore.versionInModeration,
    attachmentsDownloadUrls: modifiedAttachments
  }

  localVersion.files = modifiedAttachments?.map(({ key }) => key)
}

watchEffect(() => {
  // Keep local version in sync with VeeValidate fields
  localVersion.title = titleField.value.value
  localVersion.content = contentField.value.value
  localVersion.categoryIds = categoriesField.value.value

  if (formWasUpdated.value && formHasNoErrors.value) {
    moderationPostsStore.versionInModification = {
      version: localVersion,
      isValid: true
    }
    emit('update', { version: localVersion, isValid: true });
  } else {
    moderationPostsStore.versionInModification = {
      ...moderationPostsStore.versionInModification,
      isValid: false
    }
    emit('update', { version: localVersion, isValid: false });
  }
})
</script>
