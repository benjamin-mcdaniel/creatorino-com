<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">YouTube Analytics</h1>
          <p class="mt-1 text-sm text-gray-500">Track performance across YouTube creators</p>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="text-sm font-medium text-gray-500 mb-1">Total Views</div>
          <div class="text-2xl font-bold text-gray-900">24.5M</div>
          <div class="mt-1 flex items-center text-sm text-green-600">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
            <span>12% vs last month</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="text-sm font-medium text-gray-500 mb-1">Avg. Watch Time</div>
          <div class="text-2xl font-bold text-gray-900">8:45</div>
          <div class="mt-1 flex items-center text-sm text-green-600">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
            <span>5% vs last month</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="text-sm font-medium text-gray-500 mb-1">Engagement Rate</div>
          <div class="text-2xl font-bold text-gray-900">7.2%</div>
          <div class="mt-1 flex items-center text-sm text-red-600">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
            <span>2% vs last month</span>
          </div>
        </div>
      </div>

      <!-- Content Categories -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Content Categories</h2>
        <div class="space-y-4">
          <div v-for="(category, i) in ['Gaming', 'Tech Reviews', 'Tutorials', 'Vlogs']" :key="i">
            <div class="flex items-center justify-between text-sm mb-1">
              <span class="text-gray-600">{{ category }}</span>
              <span class="text-gray-900 font-medium">{{ Math.floor(Math.random() * 40 + 10) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-primary rounded-full h-2" :style="{ width: Math.floor(Math.random() * 40 + 10) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '../components/layout/MainLayout.vue'
</script>
