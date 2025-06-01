<!-- Creator details page -->
<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Back Button -->
      <div class="mb-6">
        <button 
          @click="goBack"
          class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to search
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
        {{ error }}
      </div>      <!-- Creator Content -->
      <template v-else-if="currentCreator">
        <CreatorHeader :creator="currentCreator" />
        <GrowthStatsGraph :creator="currentCreator" />
        <Timeline :creator="currentCreator" />
      </template>
    </div>
  </MainLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useCreatorStore } from '../stores/creator'
import MainLayout from '../components/layout/MainLayout.vue'
import CreatorHeader from '../components/creator/CreatorHeader.vue'
import GrowthStatsGraph from '../components/creator/GrowthStatsGraph.vue'
import Timeline from '../components/timeline/Timeline.vue'

const route = useRoute()
const router = useRouter()
const creatorStore = useCreatorStore()
const { currentCreator, loading, error } = storeToRefs(creatorStore)
const creatorId = route.params.id

const goBack = () => {
  // Check if there's history to go back to, otherwise go to home
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

onMounted(() => {
  creatorStore.fetchCreatorById(creatorId)
})
</script>
