<template>
  <button data-testid="counter" @click="inc">Count: {{ count }}</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const count = ref(0);
function inc() {
  count.value += 1;
}
</script>
