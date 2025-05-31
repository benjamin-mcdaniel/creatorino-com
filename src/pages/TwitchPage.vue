<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Twitch Analytics</h1>
          <p class="mt-1 text-sm text-gray-500">Coming Soon</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div class="w-16 h-16 mx-auto mb-4 text-primary">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
          </svg>
        </div>
        <h2 class="text-xl font-medium text-gray-900 mb-2">Twitch Integration Coming Soon</h2>
        <p class="text-gray-500 mb-6">We're working hard to bring you comprehensive Twitch analytics. Stay tuned!</p>
        <button class="inline-flex items-center px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
          Get Notified
        </button>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '../components/layout/MainLayout.vue'
</script>
