<template>
  <div>
    <div class="flex gap-4">
      <slot name="icon"> </slot>
      <div>
        <slot name="title"></slot>
        <slot name="content"></slot>
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>
