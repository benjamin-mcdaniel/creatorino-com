<!-- Main layout wrapper -->
<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <main class="ml-64 min-h-screen bg-gray-50">
      <div class="p-6">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
</script>
