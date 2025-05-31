<!-- Search and Landing page -->
<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Discover Creator Analytics
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Track performance, analyze trends, and discover insights from your favorite content creators across YouTube, Twitch, and more.
        </p>
        
        <!-- Call to Action -->
        <div class="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <router-link to="/trending" 
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
            Explore Trending
          </router-link>          <router-link to="/recent-activity"
            class="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            View Recent Activity
          </router-link>
        </div>
          <!-- Quick Category Filters -->
        <div class="flex flex-wrap justify-center gap-2 mt-6">
          <span 
            v-for="category in ['Technology', 'Gaming', 'Cooking', 'Fitness', 'Travel', 'Programming']"
            :key="category"
            class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
          >
            {{ category }}
          </span>
        </div>
      </div>      <!-- Trending Creators -->
      <div class="mb-12">
        <div class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900">Trending Creators</h2>
          <p class="text-gray-600 mt-1">Discover the fastest growing creators right now</p>
        </div>
        
        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="creator in trendingCreators" :key="creator.id" 
               class="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer group"
               @click="navigateToCreator(creator.id)">
            <div class="flex items-center space-x-4 mb-4">
              <img :src="creator.avatarUrl" :alt="creator.name" 
                   class="w-14 h-14 rounded-full ring-2 ring-gray-100">
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2 mb-1">
                  <h3 class="text-lg font-semibold text-gray-900 truncate group-hover:text-primary-700">
                    {{ creator.name }}
                  </h3>
                  <svg v-if="creator.verified" class="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <p class="text-sm text-gray-500">{{ creator.category }}</p>
              </div>
              <div class="text-right">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  +{{ creator.stats.recentGrowth }}%
                </span>
              </div>
            </div>
            
            <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ creator.description }}</p>
            
            <div class="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p class="text-gray-500">Subscribers</p>
                <p class="font-semibold text-gray-900">{{ formatNumber(creator.stats.subscribers) }}</p>
              </div>
              <div>
                <p class="text-gray-500">Videos</p>
                <p class="font-semibold text-gray-900">{{ formatNumber(creator.stats.videos) }}</p>
              </div>
              <div>
                <p class="text-gray-500">Views</p>
                <p class="font-semibold text-gray-900">{{ formatNumber(creator.stats.totalViews) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>      <!-- Recent Activity -->
      <div class="mb-12">
        <div class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900">Recent Activity</h2>
          <p class="text-gray-600 mt-1">Latest updates from tracked creators</p>
        </div>
        
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div v-for="(event, index) in recentEvents" :key="event.id" 
               class="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
               :class="{ 'border-b border-gray-200': index < recentEvents.length - 1 }"
               @click="navigateToCreator(event.creatorId)">
            <div class="flex items-center space-x-4">
              <img :src="event.creatorAvatar" :alt="event.creatorName" 
                   class="w-10 h-10 rounded-full">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">
                  <span class="font-semibold">{{ event.creatorName }}</span>
                  {{ event.description }}
                </p>
                <p class="text-sm text-gray-500">{{ formatTimestamp(event.timestamp) }}</p>
              </div>
              <div class="text-right text-sm text-gray-500">
                <div class="font-medium">{{ formatNumber(event.metrics.views) }} views</div>
                <div>{{ formatNumber(event.metrics.likes) }} likes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Platform Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">YouTube</h3>
          <p class="text-3xl font-bold text-gray-900 mb-1">{{ creators.length }}</p>
          <p class="text-sm text-gray-500">Tracked Creators</p>
        </div>
        
        <div class="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Total Views</h3>
          <p class="text-3xl font-bold text-gray-900 mb-1">{{ formatNumber(totalViews) }}</p>
          <p class="text-sm text-gray-500">Across All Creators</p>
        </div>
        
        <div class="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Subscribers</h3>
          <p class="text-3xl font-bold text-gray-900 mb-1">{{ formatNumber(totalSubscribers) }}</p>
          <p class="text-sm text-gray-500">Combined Reach</p>        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCreatorStore } from '../stores/creator'
import MainLayout from '../components/layout/MainLayout.vue'

const router = useRouter()
const creatorStore = useCreatorStore()
const { creators, loading, error, trendingCreators } = storeToRefs(creatorStore)

// Modal state
const showRecentActivityModal = ref(false)

// Computed properties for stats
const totalVideos = computed(() => {
  return creators.value.reduce((sum, creator) => sum + creator.stats.videos, 0)
})

const totalSubscribers = computed(() => {
  return creators.value.reduce((sum, creator) => sum + creator.stats.subscribers, 0)
})

const totalViews = computed(() => {
  return creators.value.reduce((sum, creator) => sum + creator.stats.totalViews, 0)
})

// Recent events (using timeline data from creators)
const recentEvents = computed(() => {
  const events = []
  creators.value.forEach(creator => {
    if (creator.timeline && creator.timeline.length > 0) {
      // Get the 2 most recent events from each creator
      creator.timeline.slice(0, 2).forEach(event => {
        events.push({
          id: `${creator.id}_${event.id}`,
          creatorId: creator.id,
          creatorName: creator.name,
          creatorAvatar: creator.avatarUrl,
          description: event.description,
          timestamp: event.date,
          metrics: {
            views: event.views,
            likes: event.likes
          }
        })
      })
    }
  })
  
  // Sort by date and return top 5
  return events
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))    .slice(0, 5)
})

// All recent events for modal (more comprehensive)
const allRecentEvents = computed(() => {
  const events = []
  creators.value.forEach(creator => {
    if (creator.timeline && creator.timeline.length > 0) {
      // Get all events from each creator (not just 2)
      creator.timeline.forEach(event => {
        events.push({
          id: `${creator.id}_${event.id}`,
          creatorId: creator.id,
          creatorName: creator.name,
          creatorAvatar: creator.avatarUrl,
          description: event.description,
          timestamp: event.date,
          metrics: {
            views: event.views,
            likes: event.likes
          }
        })
      })
    }
  })
  
  // Sort by date and return top 20 for modal
  return events
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 20)
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

// Utility function to format timestamps
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else if (diffInHours < 48) {
    return 'Yesterday'
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }
}

// Navigation
const navigateToCreator = (id) => {
  router.push(`/creator/${id}`)
}

onMounted(() => {
  creatorStore.fetchCreators()
})
</script>
