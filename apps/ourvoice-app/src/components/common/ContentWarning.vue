<template>
  <transition name="fade">
    <div class="mb-5" v-show="props.hasContentWarning">
      <Alert class="bg-ourvoice-warning-light p-5 rounded-md">
        <template #icon>
          <div class="flex-shrink-0">
            <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" aria-hidden="true" />
          </div>
        </template>
        <template #title>
          <h3 class="text-sm font-medium text-yellow-800">Content warning</h3>
        </template>
        <template #content>
          <div class="mt-2 text-sm text-yellow-700">
            <p class="break-normal">
              This post has been identified as containing sensitive content. Viewer discretion is
              advised. If this post has raised any concerns for you, please visit
              <span class="underline font-bold text-ourvoice-util-blue">
                <a
                  href="https://itstopswithme.humanrights.gov.au/take-action/support-services"
                  target="_blank"
                >
                  It Stops With Me
                </a>
              </span>
              for a list of services that can provide support.
            </p>
          </div>
        </template>
      </Alert>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/20/solid'
import Alert from './Alert.vue'

const props = defineProps<{ hasContentWarning: boolean }>()
</script>
