<template>
  <header class="bg-white border-b-2 border-primary-500 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <span class="text-white font-bold text-sm">C</span>
            </div>
            <h1 class="text-xl font-semibold text-gray-900">Creatorino</h1>
          </router-link>
        </div>        <!-- Search Bar -->
        <div class="flex-1 max-w-lg mx-8 relative">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              v-model="searchQuery"
              @input="handleSearchInput"
              @focus="showDropdown = true"
              @blur="hideDropdownDelayed"
              type="text"
              placeholder="Search creators..."
              class="block w-full pl-10 pr-3 py-2 border-2 border-primary-300 rounded-lg bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
            
            <!-- Search Dropdown -->
            <div v-show="showDropdown && (searchResults.length > 0 || searchQuery.length > 0)" 
                 class="absolute z-50 w-full mt-1 bg-white border-2 border-primary-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
              
              <!-- Search Results -->
              <div v-if="searchResults.length > 0" class="py-1">
                <div class="px-3 py-2 text-xs text-gray-500 font-medium uppercase tracking-wide border-b-2 border-primary-100">
                  Creators
                </div>
                <router-link
                  v-for="creator in searchResults.slice(0, 5)"
                  :key="creator.id"
                  :to="`/creator/${creator.id}`"
                  @click="clearSearch"
                  class="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <img :src="creator.avatarUrl" :alt="creator.name" class="w-8 h-8 rounded-full mr-3">
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-gray-900 truncate">{{ creator.name }}</div>
                    <div class="text-sm text-gray-500 truncate">{{ creator.category }} • {{ formatNumber(creator.stats.subscribers) }} subscribers</div>
                  </div>
                  <div v-if="creator.verified" class="ml-2">
                    <svg class="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                </router-link>
                
                <div v-if="searchResults.length > 5" class="px-3 py-2 text-sm text-gray-500 border-t-2 border-primary-100">
                  {{ searchResults.length - 5 }} more results...
                </div>
              </div>
              
              <!-- No Results -->
              <div v-else-if="searchQuery.length > 0" class="px-3 py-4 text-sm text-gray-500 text-center">
                No creators found for "{{ searchQuery }}"
              </div>
              
              <!-- Quick Actions -->
              <div v-if="searchQuery.length === 0" class="py-1">
                <div class="px-3 py-2 text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Quick Actions
                </div>                <router-link to="/trending" class="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                  <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                  <span class="text-gray-700">View Trending</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <router-link to="/" 
            class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
            :class="{ 'text-primary-600': $route.path === '/' }">
            Home
          </router-link>
          <router-link to="/trending" 
            class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
            :class="{ 'text-primary-600': $route.path === '/trending' }">
            Trending
          </router-link>
          <router-link to="/recent-activity" 
            class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
            :class="{ 'text-primary-600': $route.path === '/recent-activity' }">
            Recent Activity
          </router-link>
        </nav>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button @click="mobileMenuOpen = !mobileMenuOpen" 
            class="text-gray-600 hover:text-gray-900 p-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    :d="mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-show="mobileMenuOpen" class="md:hidden border-t-2 border-primary-200">
        <div class="py-2 space-y-1">
          <router-link to="/" 
            class="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            :class="{ 'text-primary-600 bg-primary-50': $route.path === '/' }"
            @click="mobileMenuOpen = false">
            Home
          </router-link>
            <router-link to="/trending" 
            class="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            :class="{ 'text-primary-600 bg-primary-50': $route.path === '/trending' }"
            @click="mobileMenuOpen = false">
            Trending
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCreatorStore } from '../../stores/creator'

const mobileMenuOpen = ref(false)
const searchQuery = ref('')
const showDropdown = ref(false)

// Access creator store
const creatorStore = useCreatorStore()
const { creators } = storeToRefs(creatorStore)

// Search functionality
const searchResults = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 2) return []
  
  return creators.value.filter(creator => 
    creator.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    creator.category.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const handleSearchInput = () => {
  showDropdown.value = true
}

const hideDropdownDelayed = () => {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

const clearSearch = () => {
  searchQuery.value = ''
  showDropdown.value = false
}

// Utility function to format numbers
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}
</script>
