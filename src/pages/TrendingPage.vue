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

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>

      <!-- Trending Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link 
          v-for="creator in trendingCreators" 
          :key="creator.id"
          :to="`/creator/${creator.id}`"
          class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
          <div class="p-6">
            <div class="flex items-center space-x-4 mb-4">
              <img :src="creator.avatarUrl" :alt="creator.name" class="w-12 h-12 rounded-full">
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2">
                  <h3 class="font-medium text-gray-900 truncate">{{ creator.name }}</h3>
                  <svg v-if="creator.verified" class="w-4 h-4 text-primary-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <p class="text-sm text-gray-500 truncate">{{ creator.category }}</p>
              </div>              <div class="text-right">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  creator.stats.recentGrowth >= 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                ]">
                  {{ creator.stats.recentGrowth >= 0 ? '+' : '' }}{{ creator.stats.recentGrowth }}%
                </span>
              </div>
            </div>            <div class="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>Subscribers: <span class="text-gray-900 font-medium">{{ formatNumber(creator.stats.subscribers) }}</span></div>
              <div>Avg Views: <span class="text-gray-900 font-medium">{{ formatNumber(creator.stats.averageViews) }}</span></div>
              <div>Videos: <span class="text-gray-900 font-medium">{{ creator.stats.videos }}</span></div>
              <div>Total Views: <span class="text-gray-900 font-medium">{{ formatNumber(creator.stats.totalViews) }}</span></div>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && trendingCreators.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No trending creators</h3>
        <p class="mt-2 text-gray-500">Check back later for trending creator updates.</p>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCreatorStore } from '../stores/creator'
import MainLayout from '../components/layout/MainLayout.vue'

const creatorStore = useCreatorStore()
const { creators, loading } = storeToRefs(creatorStore)

// Get trending creators (sorted by growth rate)
const trendingCreators = computed(() => {
  return creators.value
    .slice()
    .sort((a, b) => b.stats.recentGrowth - a.stats.recentGrowth)
})

// Utility function to format numbers
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

onMounted(() => {
  creatorStore.fetchCreators()
})
</script>
