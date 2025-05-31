<!-- Timeline container -->
<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-semibold text-gray-900">Activity Timeline</h2>
      <div class="flex items-center space-x-2">
        <button 
          @click="toggleFilter('all')"
          :class="activeFilter === 'all' ? 'bg-primary-100 text-primary-700 border-primary-300' : 'bg-white text-gray-700 border-gray-300'"
          class="inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-md hover:bg-gray-50 transition-colors"
        >
          All
        </button>
        <button 
          @click="toggleFilter('video_upload')"
          :class="activeFilter === 'video_upload' ? 'bg-primary-100 text-primary-700 border-primary-300' : 'bg-white text-gray-700 border-gray-300'"
          class="inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-md hover:bg-gray-50 transition-colors"
        >
          Videos
        </button>
        <button 
          @click="toggleFilter('milestone')"
          :class="activeFilter === 'milestone' ? 'bg-primary-100 text-primary-700 border-primary-300' : 'bg-white text-gray-700 border-gray-300'"
          class="inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-md hover:bg-gray-50 transition-colors"
        >
          Milestones
        </button>
      </div>
    </div>
    
    <div class="relative">
      <!-- Timeline line -->
      <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      
      <!-- Timeline events -->
      <div class="space-y-6">
        <TimelineEvent 
          v-for="event in filteredEvents" 
          :key="event.id" 
          :event="event" 
        />
      </div>
    </div>
    
    <!-- Load more button -->
    <div v-if="hasMoreEvents" class="text-center pt-6">
      <button 
        @click="loadMoreEvents"
        :disabled="loadingMore"
        class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        <svg v-if="loadingMore" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        {{ loadingMore ? 'Loading...' : 'Load more events' }}
      </button>
    </div>
    
    <!-- Empty state -->
    <div v-if="filteredEvents.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No events found</h3>
      <p class="mt-2 text-gray-500">
        {{ activeFilter === 'all' ? 'This creator has no timeline events yet.' : `No ${activeFilter.replace('_', ' ')} events found.` }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TimelineEvent from './TimelineEvent.vue'

const props = defineProps({
  creator: {
    type: Object,
    required: true
  }
})

const activeFilter = ref('all')
const eventsToShow = ref(20) // Show 20 events initially
const loadingMore = ref(false)

const allEvents = computed(() => {
  return props.creator?.timeline || []
})

const filteredEvents = computed(() => {
  let events = allEvents.value
  
  if (activeFilter.value !== 'all') {
    events = events.filter(event => event.type === activeFilter.value)
  }
  
  return events.slice(0, eventsToShow.value)
})

const hasMoreEvents = computed(() => {
  let totalEvents = allEvents.value.length
  
  if (activeFilter.value !== 'all') {
    totalEvents = allEvents.value.filter(event => event.type === activeFilter.value).length
  }
  
  return eventsToShow.value < totalEvents
})

const toggleFilter = (filterType) => {
  activeFilter.value = filterType
  eventsToShow.value = 20 // Reset to initial count when changing filter
}

const loadMoreEvents = async () => {
  loadingMore.value = true
  
  // Simulate loading delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  eventsToShow.value += 20
  loadingMore.value = false
}

onMounted(() => {
  // Reset filters when component mounts
  activeFilter.value = 'all'
  eventsToShow.value = 20
})
</script>
