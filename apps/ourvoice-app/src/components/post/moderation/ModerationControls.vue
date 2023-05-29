<template>
  <form action="#" class="relative">
    <div class="overflow-hidden rounded-b-lg border border-gray-300 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
      <textarea v-model="moderationReason" rows="6" name="description" id="description" class="block w-full resize-none border-0 py-5 px-6 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Moderation reason..." />
    </div>

    <!-- Moderation actions -->
    <div class="absolute inset-x-px bottom-0 bg-white rounded-b-lg">
      <div class="flex items-center border-t justify-between border-gray-200 px-2 py-2 sm:px-3">
        <div>
          <Listbox as="div" v-model="action" class="flex-shrink-0">
            <div class="relative">
              <ListboxButton class="relative inline-flex items-center whitespace-nowrap rounded-full bg-slate-100 px-2 py-2 text-sm font-medium text-gray-500 hover:bg-slate-200 sm:px-3">
                <font-awesome-icon :icon="['fas', action.icon]" />
                <span :class="[action.name === null ? '' : 'text-gray-900', 'hidden truncate sm:ml-2 sm:block']">
                  {{ action.name }}
                </span>
              </ListboxButton>

              <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <ListboxOptions class="absolute -top-14 right-28 z-10 mt-1 max-h-56 w-52 overflow-auto rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <ListboxOption as="template" v-for="action in actions" :key="action.name" :value="action" v-slot="{ active }">
                    <ul>
                      <li :class="[active ? 'bg-gray-100' : 'bg-white', 'relative cursor-default select-none px-3 py-2']">
                        <div class="flex items-center gap-2">
                          <font-awesome-icon :icon="['fas', action.icon]" />
                          <span class="block truncate font-medium">
                            {{ action.name }}
                          </span>
                        </div>
                      </li>
                    </ul>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </div>

        <!-- Submit button -->
        <div class="flex-shrink-0">
          <button type="submit" @click.prevent="handleSubmit" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Submit Moderation</button>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'

const emit = defineEmits(['moderation-action-change', 'moderation-submit'])

const actions = [
  { name: 'Accept', icon: 'fa-check' },
  { name: 'Modify', icon: 'fa-edit' },
  { name: 'Reject', icon: 'fa-xmark' },
]

const action = ref(actions[0])
const moderationReason = ref('')

const handleSubmit = () => {
  emit('moderation-submit', { action: action.value.name, reason: moderationReason.value })
}

watchEffect(() => {
  emit('moderation-action-change', action.value.name)
})

</script>
