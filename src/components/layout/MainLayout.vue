<!-- Main layout wrapper -->
<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <main class="min-h-screen bg-gray-50">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
import Header from './Header.vue'
</script>
