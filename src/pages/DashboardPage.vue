<!-- Dashboard page -->
<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-gray-900 mb-2">Dashboard</h1>
        <p class="text-gray-600">Monitor creator activity and discover trending content across platforms</p>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Creators</p>
              <p class="text-2xl font-semibold text-gray-900">{{ creators.length }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Videos</p>
              <p class="text-2xl font-semibold text-gray-900">{{ totalVideos.toLocaleString() }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Subscribers</p>
              <p class="text-2xl font-semibold text-gray-900">{{ totalSubscribers.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {{ error }}
      </div>

      <!-- Creators Grid -->
      <div v-else>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">Featured Creators</h2>
          <router-link to="/trending" class="text-sm font-medium text-primary-600 hover:text-primary-700">
            View all →
          </router-link>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="creator in creators" :key="creator.id" 
               class="group bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
               @click="navigateToCreator(creator.id)">
            <div class="flex items-center space-x-4 mb-4">
              <img :src="creator.avatarUrl" :alt="creator.name" 
                   class="w-12 h-12 rounded-full ring-2 ring-gray-100">
              <div class="flex-1 min-w-0">
                <h3 class="text-base font-semibold text-gray-900 truncate group-hover:text-primary-700">
                  {{ creator.name }}
                </h3>
                <p class="text-sm text-gray-500">YouTube Creator</p>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Subscribers</p>
                <p class="text-lg font-semibold text-gray-900">{{ formatNumber(creator.stats.subscribers) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Videos</p>
                <p class="text-lg font-semibold text-gray-900">{{ formatNumber(creator.stats.videos) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCreatorStore } from '../stores/creator'
import MainLayout from '../components/layout/MainLayout.vue'

const router = useRouter()
const creatorStore = useCreatorStore()
const { creators, loading, error } = storeToRefs(creatorStore)

// Computed properties for stats
const totalVideos = computed(() => {
  return creators.value.reduce((sum, creator) => sum + creator.stats.videos, 0)
})

const totalSubscribers = computed(() => {
  return creators.value.reduce((sum, creator) => sum + creator.stats.subscribers, 0)
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

// Navigation
const navigateToCreator = (id) => {
  router.push(`/creator/${id}`)
}

onMounted(() => {
  creatorStore.fetchCreators()
})
</script>
