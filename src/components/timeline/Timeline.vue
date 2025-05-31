<!-- Timeline container -->
<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-semibold text-gray-900">Timeline</h2>
      <div class="flex items-center space-x-2">
        <button class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
          </svg>
          Filter
        </button>
        <button class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
          </svg>
          Sort
        </button>
      </div>
    </div>
    
    <div class="relative">
      <!-- Timeline line -->
      <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      
      <!-- Timeline events -->
      <div class="space-y-8">
        <TimelineEvent 
          v-for="event in events" 
          :key="event.id" 
          :event="event" 
        />
      </div>
    </div>
    
    <!-- Load more button -->
    <div class="text-center pt-6">
      <button class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Load more events
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TimelineEvent from './TimelineEvent.vue'

const props = defineProps({
  creatorId: {
    type: String,
    required: true
  }
})

const events = ref([])

onMounted(async () => {
  // For now, we'll use mock data
  events.value = [
    {
      id: 1,
      timestamp: new Date('2025-05-30T14:30:00'),
      type: 'video',
      title: 'New Video Release',
      description: 'Advanced Vue 3 Composition API Tutorial - Complete Guide',
      platform: 'youtube',
      metrics: {
        views: 15420,
        likes: 1285,
        comments: 347
      }
    },
    {
      id: 2,
      timestamp: new Date('2025-05-29T09:15:00'),
      type: 'milestone',
      title: 'Subscriber Milestone',
      description: 'Reached 100,000 subscribers! Thank you everyone! 🎉',
      platform: 'youtube',
      metrics: {
        total_subscribers: 100000,
        subscriber_growth: 5000
      }
    },
    {
      id: 3,
      timestamp: new Date('2025-05-27T16:45:00'),
      type: 'video',
      title: 'New Video Release',
      description: 'Building a Modern Dashboard with Vue 3 and Tailwind CSS',
      platform: 'youtube',
      metrics: {
        views: 8900,
        likes: 756,
        comments: 189
      }
    }
  ]
})
</script>
