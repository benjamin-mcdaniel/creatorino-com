<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Creator Insights</h1>
          <p class="mt-1 text-sm text-gray-500">Deep dive into creator performance metrics</p>
        </div>
      </div>

      <!-- Insights Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Growth Analysis -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Subscriber Growth Analysis</h2>
          <div class="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
            Chart Placeholder
          </div>
        </div>

        <!-- Content Performance -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Content Performance</h2>
          <div class="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
            Chart Placeholder
          </div>
        </div>

        <!-- Engagement Metrics -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Engagement Metrics</h2>
          <div class="space-y-4">
            <div v-for="metric in ['Likes', 'Comments', 'Shares', 'Watch Time']" :key="metric" 
                 class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span class="text-gray-600">{{ metric }}</span>
              <div class="flex items-center">
                <span class="text-gray-900 font-medium mr-2">{{ Math.floor(Math.random() * 90 + 10) }}%</span>
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Audience Demographics -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Audience Demographics</h2>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="text-sm text-gray-500 mb-1">Age Groups</div>
              <div class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span>18-24</span>
                  <span class="font-medium">35%</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span>25-34</span>
                  <span class="font-medium">42%</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span>35-44</span>
                  <span class="font-medium">18%</span>
                </div>
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="text-sm text-gray-500 mb-1">Top Locations</div>
              <div class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span>United States</span>
                  <span class="font-medium">45%</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span>United Kingdom</span>
                  <span class="font-medium">15%</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span>Canada</span>
                  <span class="font-medium">12%</span>
                </div>
              </div>
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
