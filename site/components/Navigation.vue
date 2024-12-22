<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  className: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <div :class="`w-screen flex justify-around p-1 ${props.className}`">
  <slot />
  </div>
</template>