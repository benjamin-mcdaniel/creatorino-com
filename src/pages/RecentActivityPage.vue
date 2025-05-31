<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Recent Activity</h1>
        <p class="text-gray-600 mt-2">Latest updates from all tracked creators</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>

      <!-- Activity List -->
      <div v-else class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div v-for="(event, index) in paginatedEvents" :key="event.id" 
             class="p-6 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-200 last:border-b-0"
             @click="navigateToCreator(event.creatorId)">
          <div class="flex items-center space-x-4">
            <img :src="event.creatorAvatar" :alt="event.creatorName" 
                 class="w-12 h-12 rounded-full">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">
                <span class="font-semibold">{{ event.creatorName }}</span>
                {{ event.description }}
              </p>
              <p class="text-sm text-gray-500 mt-1">{{ formatTimestamp(event.timestamp) }}</p>
            </div>
            <div class="text-right text-sm text-gray-500">
              <div class="font-medium">{{ formatNumber(event.metrics.views) }} views</div>
              <div>{{ formatNumber(event.metrics.likes) }} likes</div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="allEvents.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">No recent activity</h3>
          <p class="mt-2 text-gray-500">Check back later for updates from creators.</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex items-center justify-between">
        <div class="flex items-center text-sm text-gray-500">
          Showing {{ (currentPage - 1) * eventsPerPage + 1 }} to {{ Math.min(currentPage * eventsPerPage, allEvents.length) }} of {{ allEvents.length }} activities
        </div>
        
        <div class="flex items-center space-x-2">
          <button 
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          
          <div class="flex items-center space-x-1">
            <button 
              v-for="page in visiblePages" 
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-md',
                page === currentPage 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
              ]">
              {{ page }}
            </button>
          </div>
          
          <button 
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
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
const { creators, loading } = storeToRefs(creatorStore)

// Pagination
const currentPage = ref(1)
const eventsPerPage = 50

// All events from all creators
const allEvents = computed(() => {
  const events = []
  creators.value.forEach(creator => {
    if (creator.timeline && creator.timeline.length > 0) {
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
  
  // Sort by date (most recent first)
  return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
})

// Pagination computed properties
const totalPages = computed(() => Math.ceil(allEvents.value.length / eventsPerPage))

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * eventsPerPage
  const end = start + eventsPerPage
  return allEvents.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Show first page, current page with context, and last page
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }
  
  return pages.filter(page => page !== '...' || pages.indexOf(page) === pages.lastIndexOf(page))
})

// Navigation functions
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const navigateToCreator = (id) => {
  router.push(`/creator/${id}`)
}

// Utility functions
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

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

onMounted(() => {
  creatorStore.fetchCreators()
})
</script>
