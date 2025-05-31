<template>
  <nav class="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-10 flex flex-col">
    <!-- Logo section -->
    <div class="px-6 py-6 border-b border-gray-100">
      <router-link to="/" class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
          <span class="text-white font-bold text-sm">C</span>
        </div>
        <h1 class="text-xl font-semibold text-gray-900">Creatorino</h1>
      </router-link>
    </div>

    <!-- Main navigation -->
    <div class="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
      <!-- Main section -->
      <div>
        <h2 class="px-3 text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Overview</h2>
        <nav class="space-y-1">
          <router-link to="/" 
            class="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50 transition-colors"
            :class="{ 'bg-primary-50 text-primary-700 hover:text-primary-700 hover:bg-primary-50': $route.path === '/' }">
            <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" 
                 :class="{ 'text-primary-500': $route.path === '/' }"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Dashboard
          </router-link>
          
          <router-link to="/trending" 
            class="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50 transition-colors"
            :class="{ 'bg-primary-50 text-primary-700 hover:text-primary-700 hover:bg-primary-50': $route.path === '/trending' }">
            <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500"
                 :class="{ 'text-primary-500': $route.path === '/trending' }"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
            Trending
          </router-link>
        </nav>
      </div>

      <!-- Platforms section -->
      <div>
        <h2 class="px-3 text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Platforms</h2>
        <nav class="space-y-1">
          <router-link to="/youtube" 
            class="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50 transition-colors"
            :class="{ 'bg-primary-50 text-primary-700 hover:text-primary-700 hover:bg-primary-50': $route.path === '/youtube' }">
            <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500"
                 :class="{ 'text-primary-500': $route.path === '/youtube' }"
                 fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
            YouTube
          </router-link>
          
          <router-link to="/twitch" 
            class="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50 transition-colors"
            :class="{ 'bg-primary-50 text-primary-700 hover:text-primary-700 hover:bg-primary-50': $route.path === '/twitch' }">
            <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500"
                 :class="{ 'text-primary-500': $route.path === '/twitch' }"
                 fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
            </svg>
            <span class="flex-1">Twitch</span>
            <span class="text-xs text-gray-400 group-hover:text-gray-500">Soon</span>
          </router-link>
        </nav>
      </div>

      <!-- Analytics section -->
      <div>
        <h2 class="px-3 text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Analytics</h2>
        <nav class="space-y-1">
          <router-link to="/insights" 
            class="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50 transition-colors"
            :class="{ 'bg-primary-50 text-primary-700 hover:text-primary-700 hover:bg-primary-50': $route.path === '/insights' }">
            <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500"
                 :class="{ 'text-primary-500': $route.path === '/insights' }"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Insights
          </router-link>
          
          <router-link to="/comparisons" 
            class="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50 transition-colors"
            :class="{ 'bg-primary-50 text-primary-700 hover:text-primary-700 hover:bg-primary-50': $route.path === '/comparisons' }">
            <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500"
                 :class="{ 'text-primary-500': $route.path === '/comparisons' }"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Compare
          </router-link>
        </nav>
      </div>
    </div>

    <!-- User section -->
    <div class="p-3 border-t border-gray-100 bg-gray-50">
      <div class="flex items-center px-3 py-2 text-sm text-gray-600">
        <div class="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center mr-3">
          <span class="text-white font-medium text-xs">D</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-gray-900 truncate">Demo Mode</p>
          <p class="text-xs text-gray-500 truncate">Preview access</p>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
// Sidebar navigation component with clean Supabase-inspired design
</script>
