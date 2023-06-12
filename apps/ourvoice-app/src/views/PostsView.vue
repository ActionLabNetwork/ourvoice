<template>
  <div class="lg:grid grid-cols-5 w-screen">
    <!--First Grid Fraction-->
    <!-- <AppNavBar class="h-[5vh] lg:h-full col-span-1" /> -->

    <!-- Second Grid Fraction-->
    <div class="border-red-400 h-[95vh] lg:h-screen flex flex-col col-span-5">
      <main class="px-0 lg:px-0 border-green-400 flex flex-col overflow-hidden grow relative">
        <!-- Overlay container for a single post with comments start -->
        <TransitionRoot :show="postOverlayOpen">
          <TransitionChild
            enter="transition-all duration-200"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="transition-all duration-200"
            leave-from="opacity-100"
            leave-to="opacity-0"
            class="absolute inset-0 z-20 bg-white overflow-y-auto"
          >
            <div class="relative">
              <div class="border-b backdrop-blur-lg sticky top-0 z-10">
                <button @click="closePostOverlay" class="p-4">
                  <font-awesome-icon icon="fa-solid fa-arrow-left" />
                  <span class="ml-2">Back</span>
                </button>
              </div>

              <PostWrapper
                class="drop-shadow-md"
                :id="posts[postIndex].node?.id"
                :title="posts[postIndex].node?.title"
                :content="posts[postIndex].node?.content"
                :author="posts[postIndex].node?.author"
                :votesUp="posts[postIndex].node?.votesUp"
                :votesDown="posts[postIndex].node?.votesDown"
                :comments="posts[postIndex].node?.comments"
                :createdAt="posts[postIndex].node?.createdAt"
                :publishedAt="posts[postIndex].node?.publishedAt"
                :moderatedAt="posts[postIndex].node?.moderatedAt"
                :updatedAt="posts[postIndex].node?.updatedAt"
                :files="posts[postIndex].node?.files"
                :categories="posts[postIndex].node?.categories"
              >
                <div>
                  <!-- Remove comment butten in the standalone post page -->
                </div>
              </PostWrapper>
              <CommentList class="max-w-4xl mx-auto" :postId="posts[postIndex].node?.id" />
            </div>
          </TransitionChild>
        </TransitionRoot>

        <!-- Overlay container for a single post with comments end -->

        <section
          class="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-4 border-yellow-400 flex-1 overflow-auto"
        >
          <!-- Post grid/take 3 columns -->
          <div class="lg:col-span-3 border-r overflow-y-auto h-full relative" ref="scrollContainer">
            <!-- <div class="border-2 border-red-400" v-for="(value, key) in filters" :key="key">
            {{ key }}:{{ value }}
          </div>
          <div class="border-2 border-indigo-400">
            <p>sort by: {{ sortOptions }}</p>
            <p>sort order: {{ sortDescending ? 'descending' : 'ascending' }}</p>
          </div>

          <div class="border-2 border-green-400">
            gqlPostsSort(computed): {{ gqlPostsSort }} <br />
            gqlPostsFilter(computed):
            {{ gqlPostsFilter }}
          </div>
          <div class="border-2 border-black">currentVariables: {{ variables }}</div> -->

            <!-- stiky page header -->
            <div class="sticky top-0 z-10 backdrop-blur-lg">
              <!-- <div class="border-2 border-blue-400">
              scroll y: {{ y }} <br />
              arrivedState {{ arrivedState }}
            </div> -->
              <div class="flex items-baseline justify-between border-b lg:py-6">
                <h1 class="text-lg lg:text-4xl font-bold tracking-tight text-gray-900 mx-4">
                  Posts
                </h1>

                <div class="flex items-center mx-4">
                  <button
                    @click="modalOpen = true"
                    class="mr-6 px-2 py-1 text-gray-500 hover:text-gray-600"
                  >
                    <font-awesome-icon icon="fa-solid fa-plus" />
                  </button>
                  <!-- create post Modal -->
                  <Modal :isOpen="modalOpen" @close="modalOpen = false">
                    <template #content>
                      <CreatePost />
                    </template>
                  </Modal>
                  <!-- Sort Dropdown -->
                  <Menu as="div" class="relative inline-block text-left">
                    <div>
                      <MenuButton
                        class="group inline-flex justify-center text-sm font-medium text-gray-800 hover:text-gray-900"
                      >
                        Sort by
                        <ChevronDownIcon
                          class="mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-500 group-hover:text-gray-600"
                          aria-hidden="true"
                        />
                      </MenuButton>
                    </div>

                    <transition>
                      <MenuItems
                        class="absolute right-0 z-20 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
                      >
                        <div class="py-1">
                          <MenuItem
                            v-for="option in sortOptions"
                            :key="option.name"
                            v-slot="{ active }"
                            @click="handleSortChange(option.name)"
                          >
                            <button
                              type="button"
                              :class="[
                                option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                active ? 'bg-gray-100' : '',
                                'px-4 py-2 text-sm w-full'
                              ]"
                            >
                              {{ option.name }}
                            </button>
                          </MenuItem>
                        </div>
                      </MenuItems>
                    </transition>
                  </Menu>
                  <!-- Sort Order Toggle-->
                  <button
                    @click="toggleSortOrder()"
                    type="button"
                    class="ml-4 p-2 text-gray-500 hover:text-gray-600"
                  >
                    <font-awesome-icon
                      v-if="sortDescending"
                      icon="fa-solid fa-arrow-down-wide-short"
                    />
                    <font-awesome-icon v-else icon="fa-solid fa-arrow-down-short-wide" />
                  </button>
                  <!-- Filter button on Small screen -->
                  <button
                    type="button"
                    class="ml-4 p-2 text-gray-500 hover:text-gray-600 lg:hidden"
                    @click="mobileFiltersOpen = true"
                  >
                    <FunnelIcon class="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Post Card List-->
            <PostWrapper
              v-for="(post, index) in posts"
              :key="index"
              :id="post.node?.id"
              :title="post.node?.title"
              :content="post.node?.content"
              :author="post.node?.author"
              :votesUp="post.node?.votesUp"
              :votesDown="post.node?.votesDown"
              :comments="post.node?.comments"
              :createdAt="post.node?.createdAt"
              :publishedAt="post.node?.publishedAt"
              :moderatedAt="post.node?.moderatedAt"
              :updatedAt="post.node?.updatedAt"
              :files="post.node?.files"
              :categories="post.node?.categories"
              class="hover:drop-shadow-lg transition duration-300 ease-in-out"
            >
              <button @click="openPostOverlay(index)" class="hover:underline text-sm lg:text-base">
                comments({{ post.node?.comments.length }})
              </button>
            </PostWrapper>
            <!-- PlaceHolder If no posts found -->
            <div v-if="!posts.length" class="flex pt-6 justify-center">Not Found</div>
          </div>
          <!-- Filters/take 1 column-->
          <form @submit.prevent="handleSubmitFilters" class="hidden lg:block border-orange-400">
            <Disclosure
              as="div"
              v-for="(value, key) in filters"
              :key="key"
              class="border-b border-gray-200 py-6"
              v-slot="{ open }"
              :defaultOpen="true"
            >
              <h3 class="-my-3 flow-root">
                <DisclosureButton
                  class="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
                >
                  <span class="font-medium text-gray-900">{{ key }}</span>
                  <span class="ml-6 flex items-center">
                    <PlusIcon v-if="!open" class="h-5 w-5" aria-hidden="true" />
                    <MinusIcon v-else class="h-5 w-5" aria-hidden="true" />
                  </span>
                </DisclosureButton>
              </h3>
              <DisclosurePanel class="pt-6">
                <div class="space-y-4">
                  <div
                    v-for="(option, optionIdx) in value"
                    :key="option.value"
                    class="flex items-center"
                  >
                    <input
                      :id="`filter-${key}-${optionIdx}`"
                      :name="`${key}[]`"
                      :value="option.value"
                      type="checkbox"
                      v-model="option.checked"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label :for="`filter-${key}-${optionIdx}`" class="ml-3 text-sm text-gray-600">{{
                      option.label
                    }}</label>
                  </div>
                </div>
              </DisclosurePanel>
            </Disclosure>
            <div class="p-6 flex flex-col justify-around space-y-4">
              <button
                type="submit"
                class="p-2 text-white rounded-lg bg-gray-800 hover:bg-opacity-70 transform duration-200"
              >
                Apply
              </button>
              <button
                type="button"
                @click="resetFilters"
                class="p-2 text-white rounded-lg bg-ourvoice-red hover:bg-opacity-70 transform duration-200"
              >
                Reset
              </button>
            </div>
          </form>

          <!-- Mobile filter overlay dialog -->
          <TransitionRoot as="template" :show="mobileFiltersOpen">
            <Dialog as="div" class="relative z-40 lg:hidden" @close="mobileFiltersOpen = false">
              <TransitionChild
                as="template"
                enter="transition-opacity ease-linear duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div class="fixed inset-0 bg-black bg-opacity-25" />
              </TransitionChild>

              <div class="fixed inset-0 z-40 flex">
                <TransitionChild
                  as="template"
                  enter="transition ease-in-out duration-300 transform"
                  enter-from="translate-x-full"
                  enter-to="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leave-from="translate-x-0"
                  leave-to="translate-x-full"
                >
                  <DialogPanel
                    class="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl"
                  >
                    <div class="flex items-center justify-between px-4">
                      <h2 class="text-lg font-medium text-gray-900">Filters</h2>
                      <button
                        type="button"
                        class="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                        @click="mobileFiltersOpen = false"
                      >
                        <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    <!-- Filters -->
                    <form
                      @submit.prevent="handleSubmitFilters"
                      class="mt-4 border-t border-gray-200"
                    >
                      <Disclosure
                        as="div"
                        v-for="(value, key) in filters"
                        :key="key"
                        class="border-t border-gray-200 px-4 py-6"
                        v-slot="{ open }"
                        :defaultOpen="true"
                      >
                        <h3 class="-mx-2 -my-3 flow-root">
                          <DisclosureButton
                            class="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"
                          >
                            <span class="font-medium text-gray-900">{{ key }}</span>
                            <span class="ml-6 flex items-center">
                              <PlusIcon v-if="!open" class="h-5 w-5" aria-hidden="true" />
                              <MinusIcon v-else class="h-5 w-5" aria-hidden="true" />
                            </span>
                          </DisclosureButton>
                        </h3>
                        <DisclosurePanel class="pt-6">
                          <div class="space-y-6">
                            <div
                              v-for="(option, optionIdx) in value"
                              :key="option.value"
                              class="flex items-center"
                            >
                              <input
                                :id="`filter-mobile-${key}-${optionIdx}`"
                                :name="`${key}[]`"
                                :value="option.value"
                                type="checkbox"
                                v-model="option.checked"
                                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label
                                :for="`filter-mobile-${key}-${optionIdx}`"
                                class="ml-3 min-w-0 flex-1 text-gray-500"
                                >{{ option.label }}</label
                              >
                            </div>
                          </div>
                        </DisclosurePanel>
                      </Disclosure>
                      <div class="p-6 flex flex-col justify-around space-y-4">
                        <button
                          type="submit"
                          class="p-2 text-white rounded-lg bg-gray-800 hover:bg-opacity-70 transform duration-200"
                        >
                          Apply
                        </button>
                        <button
                          type="button"
                          @click="resetFilters"
                          class="p-2 text-white rounded-lg bg-ourvoice-red hover:bg-opacity-70 transform duration-200"
                        >
                          Reset
                        </button>
                      </div>
                    </form>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </Dialog>
          </TransitionRoot>
        </section>
      </main>
      <AppFooter />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Modal from '@/components/common/Modal.vue'
import PostWrapper from '@/components/post/PostWrapper.vue'
import CommentList from '@/components/comment/CommentList.vue'
import CreatePost from '@/components/post/CreatePost.vue'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon } from '@heroicons/vue/20/solid'
import { computed, reactive, ref, watch, watchEffect } from 'vue'
import { useCategoriesStore } from '@/stores/categories'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useToggle, useScroll } from '@vueuse/core'

const scrollContainer = ref<HTMLElement | null>(null)
const { y } = useScroll(scrollContainer)

const GET_POST_QUERY = gql`
  query Posts(
    $sort: PostSortingInput
    $pagination: PostPaginationInput
    $filter: PostsFilterInput
  ) {
    posts(sort: $sort, pagination: $pagination, filter: $filter) {
      edges {
        cursor
        node {
          author {
            id
            nickname
          }
          categories {
            name
            id
          }
          createdAt
          disabledAt
          moderatedAt
          moderated
          publishedAt
          published
          title
          votes {
            id
            voteType
          }
          votesDown
          votesUp
          files
          id
          content
          comments {
            id
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        startCursor
      }
      totalCount
    }
  }
`
const mobileFiltersOpen = ref(false)
const modalOpen = ref(false)
const sortOptions = ref([
  { name: 'Created Time', value: 'sortByCreatedAt', current: true },
  { name: 'Upvotes Count', value: 'sortByVotesUp', current: false },
  { name: 'Downvotes Count', value: 'sortByVotesDown', current: false },
  { name: 'Comments Count', value: 'sortByCommentsCount', current: false }
])

const filters = ref({
  Category: [{ id: 0, value: 'All', label: 'All', checked: true }],
  TimeRange: [
    { value: 'latest', label: 'Latest (3 days)', checked: false },
    { value: 'all time', label: 'All Time', checked: true }
  ]
})
const posts = ref([] as any)
const sortDescending = ref(true)
const toggleSortOrder = useToggle(sortDescending)
const filterChanged = ref(false)

const gqlPostsFilter = computed(() => {
  const createdAfter = filters.value.TimeRange[0].checked
    ? new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    : null
  return {
    categoryIds: filters.value.Category.filter((category) => category.checked).map(
      (category) => category.id
    ),
    createdAfter
  }
})
const gqlPostsSort = computed(() => {
  const sortOption = sortOptions.value.find((option) => option.current)
  if (!sortOption) return null
  return {
    [sortOption.value]: sortDescending.value ? 'desc' : 'asc'
  }
})

const { onResult, onError, variables } = useQuery(GET_POST_QUERY, {
  pagination: {
    limit: 100,
    cursor: null
  } as any,
  filter: null as any,
  sort: gqlPostsSort
} as any)

onResult(({ data, loading }) => {
  if (loading) return
  console.log('load posts', data)
  posts.value = data.posts.edges
  y.value = 0
})

onError((err) => console.log(err))
const categoriesStore = useCategoriesStore()
categoriesStore.fetchCategories()
const categories = computed(() => categoriesStore)
const handleSortChange = (sortOption: string) => {
  sortOptions.value.forEach((option) => {
    option.current = option.name === sortOption
  })
}

const handleSubmitFilters = () => {
  console.log('Applied filters', gqlPostsFilter.value)
  variables.value.filter = gqlPostsFilter.value
  filterChanged.value = false
}

const resetFilters = () => {
  filters.value.Category.forEach((category) => {
    category.checked = true
  })
  filters.value.TimeRange.forEach((timeRange) => {
    timeRange.checked = false
  })
  filters.value.TimeRange[1].checked = true
  handleSubmitFilters()
  filterChanged.value = false
}

watch(gqlPostsFilter, () => {
  filterChanged.value = true
})

watchEffect(() => {
  const cats = categories.value.data.map((category) => {
    return reactive({
      id: category.id,
      value: category.name,
      label: category.name,
      checked: true
    })
  })
  filters.value.Category = cats
})

// Todo: replace with a better solution using date picker
watch(filters.value.TimeRange[0], (newValue) => {
  if (newValue.checked) {
    filters.value.TimeRange[1].checked = false
  }
})
watch(filters.value.TimeRange[1], (newValue) => {
  if (newValue.checked) {
    filters.value.TimeRange[0].checked = false
  }
})

// Todo: Comment Overlay Logic
const postOverlayOpen = ref(false)
const postIndex = ref<number>(0)
const closePostOverlay = () => {
  postOverlayOpen.value = false
}
const openPostOverlay = (index: number) => {
  postOverlayOpen.value = true
  postIndex.value = index
}
</script>
