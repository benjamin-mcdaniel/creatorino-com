<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Compare Creators</h1>
          <p class="mt-1 text-sm text-gray-500">Analyze and compare creator performance</p>
        </div>
      </div>

      <!-- Creator Selection -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Creator 1</h2>
          <select class="w-full rounded-lg border-gray-300 text-gray-700">
            <option>Select a creator...</option>
            <option>Tech Tutorial Pro</option>
            <option>Gaming with Sarah</option>
            <option>Daily Vlogger</option>
          </select>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Creator 2</h2>
          <select class="w-full rounded-lg border-gray-300 text-gray-700">
            <option>Select a creator...</option>
            <option>Tech Tutorial Pro</option>
            <option>Gaming with Sarah</option>
            <option>Daily Vlogger</option>
          </select>
        </div>
      </div>

      <!-- Comparison Metrics -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Subscriber Growth -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Subscriber Growth</h2>
          <div class="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
            Line Chart Placeholder
          </div>
        </div>

        <!-- Engagement Rate -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Engagement Rate</h2>
          <div class="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
            Bar Chart Placeholder
          </div>
        </div>

        <!-- Content Output -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Content Output</h2>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="text-sm text-gray-500 mb-1">Creator 1</div>
                <div class="space-y-2">
                  <div class="flex items-center justify-between text-sm">
                    <span>Videos/Month</span>
                    <span class="font-medium">12</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span>Avg. Duration</span>
                    <span class="font-medium">15:24</span>
                  </div>
                </div>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="text-sm text-gray-500 mb-1">Creator 2</div>
                <div class="space-y-2">
                  <div class="flex items-center justify-between text-sm">
                    <span>Videos/Month</span>
                    <span class="font-medium">8</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span>Avg. Duration</span>
                    <span class="font-medium">22:15</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Audience Overlap -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Audience Overlap</h2>
          <div class="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
            Venn Diagram Placeholder
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '../components/layout/MainLayout.vue'
</script>
