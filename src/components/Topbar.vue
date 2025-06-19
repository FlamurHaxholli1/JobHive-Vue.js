<template>
  <div class="topbar">
    <h1>{{ title }}</h1>
  </div>
</template>

<script setup>
defineProps(['title'])
</script>

<style scoped>
.topbar {
  background: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}
</style>
