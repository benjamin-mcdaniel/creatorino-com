<!-- Timeline event card -->
<template>  <div class="relative flex items-center">
    <!-- Date positioned 45% down the vertical side of the event card, bigger and more visible -->
    <div class="absolute left-12 top-8 text-sm text-gray-700 font-semibold bg-white px-2 py-1 rounded-md shadow-sm border border-gray-200">
      {{ formatTimestamp(event.date) }}
    </div>
    
    <!-- Horizontal connecting line (thinner and softer) -->
    <div class="absolute left-4 w-28 h-px" :class="getEventLineClass(event.type)"></div>    <!-- Event content (moved further right to avoid intersection with vertical line) -->
    <div class="ml-32 flex-1 min-w-0 pb-3">      <div class="bg-white border rounded-lg p-4 hover:shadow-md transition-all" :class="getEventBorderClass(event.type)">
        <!-- Main content container with image support -->
        <div class="flex items-start space-x-4">
          <!-- Left side: Text content -->
          <div class="flex-1 min-w-0">            <!-- Event header - expanded to take more space -->
            <div class="flex items-start space-x-2 mb-4">
              <div class="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0" :class="getEventBgClass(event.type)">
                <component :is="getEventIcon(event.type)" :class="getEventIconClass(event.type)" />
              </div>              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-bold text-gray-900 mb-3 leading-tight">{{ event.title }}</h3>
                <p class="text-sm text-gray-600 leading-relaxed mb-2">{{ event.description }}</p>
              </div>
            </div>

            <!-- Metrics with platform badges inline -->
            <div class="flex items-center justify-between">
              <!-- Platform badges on the left -->
              <div class="flex items-center space-x-2">
                <span class="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-red-100 text-red-800">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                  YouTube
                </span>
                <span v-if="event.type === 'stream'" class="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-purple-100 text-purple-800">
                  Live Stream
                </span>
              </div>              <!-- Metrics on the right -->
              <div class="flex items-center space-x-6">
                <div class="text-left">
                  <p class="text-base font-bold text-gray-900">{{ formatMetricValue(event.views) }}</p>
                  <p class="text-sm text-gray-500 uppercase tracking-wide">Views</p>
                </div>
                <div class="text-left">
                  <p class="text-base font-bold text-gray-900">{{ formatMetricValue(event.likes) }}</p>
                  <p class="text-sm text-gray-500 uppercase tracking-wide">Likes</p>
                </div>
                <div class="text-left">
                  <p class="text-base font-bold text-gray-900">{{ formatMetricValue(event.comments) }}</p>
                  <p class="text-sm text-gray-500 uppercase tracking-wide">Comments</p>
                </div>
              </div>
            </div>
          </div>          <!-- Right side: Fixed-width image area (always present) -->
          <div class="flex-shrink-0 w-72">
            <!-- Large thumbnail for video uploads -->
            <div v-if="event.type === 'video_upload' && event.thumbnail" class="relative">
              <img :src="event.thumbnail" :alt="event.title" 
                   class="w-72 h-54 object-cover rounded-lg shadow-md">
              <!-- Duration overlay -->
              <div v-if="event.duration" class="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                {{ event.duration }}
              </div>
            </div>            <!-- Transparent area for non-video events -->
            <div v-else class="w-72 h-54">
              <!-- Empty transparent space -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

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
    if (diffInDays < 30) {
      return `${diffInDays}d ago`
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    }
  }
}

const getEventIcon = (type) => {
  const icons = {
    video_upload: () => h('svg', { 
      fill: 'none', 
      stroke: 'currentColor', 
      viewBox: '0 0 24 24',
      class: 'w-4 h-4'
    }, [
      h('path', { 
        'stroke-linecap': 'round', 
        'stroke-linejoin': 'round', 
        'stroke-width': '2', 
        d: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' 
      })
    ]),
    milestone: () => h('svg', { 
      fill: 'none', 
      stroke: 'currentColor', 
      viewBox: '0 0 24 24',
      class: 'w-4 h-4'
    }, [
      h('path', { 
        'stroke-linecap': 'round', 
        'stroke-linejoin': 'round', 
        'stroke-width': '2', 
        d: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' 
      })
    ]),
    collaboration: () => h('svg', { 
      fill: 'none', 
      stroke: 'currentColor', 
      viewBox: '0 0 24 24',
      class: 'w-4 h-4'
    }, [
      h('path', { 
        'stroke-linecap': 'round', 
        'stroke-linejoin': 'round', 
        'stroke-width': '2', 
        d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' 
      })
    ]),
    announcement: () => h('svg', { 
      fill: 'none', 
      stroke: 'currentColor', 
      viewBox: '0 0 24 24',
      class: 'w-4 h-4'
    }, [
      h('path', { 
        'stroke-linecap': 'round', 
        'stroke-linejoin': 'round', 
        'stroke-width': '2', 
        d: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' 
      })
    ]),
    stream: () => h('svg', { 
      fill: 'none', 
      stroke: 'currentColor', 
      viewBox: '0 0 24 24',
      class: 'w-4 h-4'
    }, [
      h('path', { 
        'stroke-linecap': 'round', 
        'stroke-linejoin': 'round', 
        'stroke-width': '2', 
        d: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' 
      })
    ])
  }
  return icons[type] || icons.video_upload
}

const getEventBgClass = (type) => {
  const classes = {
    video_upload: 'bg-blue-50',
    milestone: 'bg-green-50',
    collaboration: 'bg-purple-50',
    announcement: 'bg-yellow-50',
    stream: 'bg-red-50'
  }
  return classes[type] || 'bg-gray-50'
}

const getEventIconClass = (type) => {
  const classes = {
    video_upload: 'text-blue-500',
    milestone: 'text-green-500',
    collaboration: 'text-purple-500',
    announcement: 'text-yellow-600',
    stream: 'text-red-500'
  }
  return classes[type] || 'text-gray-500'
}

const getEventDotClass = (type) => {
  const classes = {
    video_upload: 'bg-blue-500',
    milestone: 'bg-primary-500',
    collaboration: 'bg-purple-500',
    announcement: 'bg-yellow-500',
    stream: 'bg-red-500'
  }
  return classes[type] || 'bg-primary-500'
}

const getEventLineClass = (type) => {
  const classes = {
    video_upload: 'bg-blue-300',
    milestone: 'bg-green-300',
    collaboration: 'bg-purple-300',
    announcement: 'bg-yellow-300',
    stream: 'bg-red-300'
  }
  return classes[type] || 'bg-gray-200'
}

const getEventBorderClass = (type) => {
  const classes = {
    video_upload: 'border-blue-200',
    milestone: 'border-green-200',
    collaboration: 'border-purple-200',
    announcement: 'border-yellow-200',
    stream: 'border-red-200'
  }
  return classes[type] || 'border-gray-200'
}

const formatMetricValue = (value) => {
  if (typeof value === 'number') {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M'
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K'
    }
    return value.toLocaleString()
  }
  return value
}
</script>
