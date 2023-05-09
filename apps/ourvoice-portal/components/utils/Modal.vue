<template>
  <div>
    <transition name="modal-animation">
      <div v-show="modalActive" class="modal">
        <transition name="modal-animatioon-inner">
          <div v-show="modalActive" class="modal-inner">
            Test sfsdfsdfsdfsd
            <slot />
            <button type="button" class="btn btn-red btn-hover">Close</button>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Modal',

  props: {
    modalActive: Boolean,
  },

  setup() {
    return {}
  },
})
</script>

<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100hv;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.7);
}

.modal-inner {
  position: relative;
  max-width: 640px;
  width: 80%;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  background-color: #fff;
  padding: 64px 16px;
}
</style>
