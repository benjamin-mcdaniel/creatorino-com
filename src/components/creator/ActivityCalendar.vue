<!-- GitHub-style activity calendar component -->
<template>
  <div class="bg-white rounded-lg border border-gray-300 p-6 mb-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-900">Activity Calendar</h2>
      <div class="text-sm text-gray-500">{{ currentYear }}</div>
    </div>

    <!-- Activity summary -->
    <div class="mb-6 text-sm text-gray-600">
      <span class="font-semibold">{{ totalActivities }}</span> contributions in {{ currentYear }}
    </div>

    <!-- Calendar grid -->
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full">
        <!-- Month labels -->
        <div class="flex mb-2">
          <div class="w-10"></div> <!-- spacer for day labels -->
          <div class="flex-1 grid grid-cols-12 gap-1">
            <div v-for="month in months" :key="month" class="text-xs text-gray-500 text-center">
              {{ month }}
            </div>
          </div>
        </div>

        <!-- Calendar grid with day labels -->
        <div class="flex">
          <!-- Day of week labels -->
          <div class="w-10 flex flex-col justify-around text-xs text-gray-500">
            <div class="h-3"></div>
            <div>Mon</div>
            <div class="h-3"></div>
            <div>Wed</div>
            <div class="h-3"></div>
            <div>Fri</div>
            <div class="h-3"></div>
          </div>

          <!-- Activity squares grid -->
          <div class="flex-1">
            <div class="grid grid-cols-53 gap-1">
              <div
                v-for="(day, index) in activityData"
                :key="index"
                :class="getActivityClass(day.count)"
                :title="`${day.count} activities on ${day.date}`"
                class="w-3 h-3 rounded-sm cursor-pointer transition-colors hover:ring-1 hover:ring-gray-400"
              ></div>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="flex items-center justify-between mt-4">
          <div class="text-xs text-gray-500">
            Less
          </div>
          <div class="flex items-center space-x-1">
            <div class="w-3 h-3 bg-gray-100 rounded-sm"></div>
            <div class="w-3 h-3 bg-green-200 rounded-sm"></div>
            <div class="w-3 h-3 bg-green-300 rounded-sm"></div>
            <div class="w-3 h-3 bg-green-500 rounded-sm"></div>
            <div class="w-3 h-3 bg-green-700 rounded-sm"></div>
          </div>
          <div class="text-xs text-gray-500">
            More
          </div>
        </div>
      </div>
    </div>

    <!-- Activity stats -->
    <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div class="text-center">
        <div class="text-lg font-bold text-gray-900">{{ longestStreak }}</div>
        <div class="text-gray-600">Longest streak</div>
      </div>
      <div class="text-center">
        <div class="text-lg font-bold text-gray-900">{{ currentStreak }}</div>
        <div class="text-gray-600">Current streak</div>
      </div>
      <div class="text-center">
        <div class="text-lg font-bold text-gray-900">{{ averagePerDay.toFixed(1) }}</div>
        <div class="text-gray-600">Avg per day</div>
      </div>
      <div class="text-center">
        <div class="text-lg font-bold text-gray-900">{{ mostActiveDay }}</div>
        <div class="text-gray-600">Most active day</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  creator: {
    type: Object,
    required: true
  }
})

const currentYear = new Date().getFullYear()
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const activityData = ref([])
const totalActivities = ref(0)
const longestStreak = ref(0)
const currentStreak = ref(0)

// Generate activity data for the entire year
const generateActivityData = () => {
  const data = []
  const startDate = new Date(currentYear, 0, 1) // January 1st of current year
  const endDate = new Date(currentYear, 11, 31) // December 31st of current year
  
  // Get the first Monday before or on January 1st to align the grid
  const firstDay = new Date(startDate)
  while (firstDay.getDay() !== 1) { // 1 = Monday
    firstDay.setDate(firstDay.getDate() - 1)
  }

  // Generate 53 weeks worth of data (371 days to cover full year)
  let totalCount = 0
  let maxStreak = 0
  let currentStreakCount = 0
  let tempStreak = 0
  
  for (let i = 0; i < 371; i++) {
    const currentDate = new Date(firstDay)
    currentDate.setDate(firstDay.getDate() + i)
    
    let activityCount = 0
    
    // Only generate activity for days within the current year
    if (currentDate.getFullYear() === currentYear) {
      // Generate realistic activity patterns
      const dayOfWeek = currentDate.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      
      // More activity on weekdays, some random variation
      const baseChance = isWeekend ? 0.3 : 0.7
      const random = Math.random()
      
      if (random < baseChance) {
        // Generate activity count (0-10 activities per day)
        activityCount = Math.floor(Math.random() * 8) + 1
        
        // Occasional high activity days
        if (Math.random() < 0.1) {
          activityCount += Math.floor(Math.random() * 5) + 5
        }
        
        tempStreak++
        maxStreak = Math.max(maxStreak, tempStreak)
      } else {
        tempStreak = 0
      }
      
      totalCount += activityCount
    }
    
    data.push({
      date: currentDate.toDateString(),
      count: activityCount,
      isCurrentYear: currentDate.getFullYear() === currentYear
    })
  }
  
  // Calculate current streak (from today backwards)
  const today = new Date()
  let streakCount = 0
  for (let i = data.length - 1; i >= 0; i--) {
    const day = data[i]
    const dayDate = new Date(day.date)
    
    if (dayDate <= today && day.isCurrentYear) {
      if (day.count > 0) {
        streakCount++
      } else {
        break
      }
    }
  }
  
  activityData.value = data
  totalActivities.value = totalCount
  longestStreak.value = maxStreak
  currentStreak.value = streakCount
}

const getActivityClass = (count) => {
  if (count === 0) return 'bg-gray-100'
  if (count <= 2) return 'bg-green-200'
  if (count <= 4) return 'bg-green-300'
  if (count <= 7) return 'bg-green-500'
  return 'bg-green-700'
}

const averagePerDay = computed(() => {
  const daysInYear = activityData.value.filter(day => day.isCurrentYear).length
  return daysInYear > 0 ? totalActivities.value / daysInYear : 0
})

const mostActiveDay = computed(() => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dayCounts = new Array(7).fill(0)
  
  activityData.value.forEach(day => {
    if (day.isCurrentYear && day.count > 0) {
      const dayOfWeek = new Date(day.date).getDay()
      dayCounts[dayOfWeek] += day.count
    }
  })
  
  const maxIndex = dayCounts.indexOf(Math.max(...dayCounts))
  return dayNames[maxIndex]
})

onMounted(() => {
  generateActivityData()
})
</script>
