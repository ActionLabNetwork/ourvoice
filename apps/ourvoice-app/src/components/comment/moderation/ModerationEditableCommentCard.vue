<template>
  <div
    v-if="comment && version"
    class="bg-white shadow-lg border border-gray-200 rounded-t-lg p-6 hover:shadow-xl transition-all duration-200 relative flex flex-col gap-3"
  >
    <!-- Author -->
    <AuthorBadge
      v-if="nickname.author.nickname"
      :authorName="nickname.author.nickname"
      :authorAvatar="`https://ui-avatars.com/api/?name=${nickname.author.parts.first}+${nickname.author.parts.last}`"
      :modificationDate="formattedDate(version)"
      :modifierName="nickname.moderator.nickname"
    />

    <!-- Content -->
    <div>
      <div class="text-gray-700 text-lg leading-relaxed mb-3">
        <textarea
          v-model="contentField.value.value"
          name="content"
          class="border rounded p-2 w-full"
          data-cy="modify-content-input"
        ></textarea>
      </div>
      <p
        v-if="contentField.errorMessage.value"
        class="text-red-700 mb-5 text-sm"
        data-cy="content-input-error"
      >
        {{ contentField.errorMessage.value }}
      </p>
    </div>

    <!-- Moderator decisions count -->
    <div class="flex gap-3 justify-around">
      <div v-for="(count, decision) in moderationResultGroups" :key="decision">
        <p class="text-xs text-gray-600">{{ decision }}: {{ count }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watchEffect, onMounted } from 'vue'
import { type Moderation, type CommentVersion } from '@/stores/moderation-comments'
import { formatTimestampToReadableDate } from '@/utils'
import { storeToRefs } from 'pinia'
import { useCategoriesStore } from '@/stores/categories'
import { useField, useForm } from 'vee-validate'
import { validateContent } from '@/validators/moderation-comment-validator'
import AuthorBadge from '@/components/common/AuthorBadge.vue'
import { getGroupsByProperty } from '@/utils/groupByProperty'
import type { ModerationVersionDecision } from '@/types/moderation'
import { useCommentModerationStore } from '@/stores/comment-moderation'

const emit = defineEmits(['update'])

const nickname = computed(() => {
  const authorNickname = comment.value?.versions?.at(-1)?.authorNickname
  const moderatorNickname =
    version.value?.authorNickname !== authorNickname ? version.value?.authorNickname : undefined

  const nicknameSeparator = '_'
  const [aFirst, aMiddle, aLast] = authorNickname?.split(nicknameSeparator) || []
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
const commentModerationStore = useCommentModerationStore()
const { commentInModeration: comment, versionInModeration: version } =
  storeToRefs(commentModerationStore)

const categoriesStore = useCategoriesStore()

onMounted(async () => {
  await categoriesStore.fetchCategories()
})

const modifyModerationCommentValidationSchema = {
  content(value: string) {
    return validateContent(value)
  }
}

const { errors } = useForm({ validationSchema: modifyModerationCommentValidationSchema })

// VeeValidate Form Fields
function useVeeValidateField<T>(fieldName: string, initialValue?: T) {
  const { errorMessage, value, meta } = useField<T>(fieldName, undefined, { initialValue })

  return { errorMessage, value, meta }
}

const contentField = useVeeValidateField<string>('content', version.value?.content)

const formHasNoErrors = computed(() => {
  return Object.keys(errors.value).length === 0
})

const formWasUpdated = computed(() => {
  const contentFieldUpdated = version.value?.content?.trim() !== contentField.value?.value?.trim()

  return contentFieldUpdated
})

// Counts the number of accepted/rejected moderations by past moderators
const moderationResultGroups = computed(() => {
  const groups: Record<ModerationVersionDecision, Moderation[]> | undefined =
    version.value?.moderations.reduce(
      (acc, moderation) => {
        return getGroupsByProperty('decision', acc, moderation)
      },
      { ACCEPTED: [] as Moderation[], REJECTED: [] as Moderation[] }
    )

  const groupsCount: Record<ModerationVersionDecision, number> = { ACCEPTED: 0, REJECTED: 0 }

  if (groups) {
    ;(Object.keys(groups) as Array<keyof typeof groups>).forEach((key) => {
      groupsCount[key] = groups[key].length
    })
  }

  return groupsCount
})

const formattedDate = (version: CommentVersion) => formatTimestampToReadableDate(+version.timestamp)

// Reactive copies of version
let localVersion = reactive({
  ...version.value,
  content: contentField.value.value
})

watchEffect(() => {
  // Keep local version in sync with VeeValidate fields
  localVersion.content = contentField.value.value

  if (formWasUpdated.value && formHasNoErrors.value) {
    commentModerationStore.versionInModification = {
      version: localVersion,
      isValid: true
    }
    emit('update', { version: localVersion, isValid: true })
  } else {
    commentModerationStore.versionInModification = {
      ...commentModerationStore.versionInModification,
      isValid: false
    }
    emit('update', { version: localVersion, isValid: false })
  }
})
</script>
