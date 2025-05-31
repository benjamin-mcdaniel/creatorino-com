<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Trending Creators</h1>
        <div class="flex items-center space-x-4">
          <select class="form-select rounded-lg border-gray-300 text-gray-700">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      <!-- Trending Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" 
             class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div class="p-6">
            <div class="flex items-center space-x-4 mb-4">
              <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div>
                <h3 class="font-medium text-gray-900">Creator Name</h3>
                <p class="text-sm text-gray-500">@handle</p>
              </div>
              <div class="flex-1 text-right">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  +24%
                </span>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>Views: <span class="text-gray-900 font-medium">1.2M</span></div>
              <div>Engagement: <span class="text-gray-900 font-medium">8.5%</span></div>
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
