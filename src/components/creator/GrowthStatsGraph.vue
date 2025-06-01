<!-- Growth statistics graph component -->
<template>
  <div class="bg-white rounded-lg border border-gray-300 p-6 mb-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-900">Growth Statistics</h2>
      <div class="text-sm text-gray-500">Last 3 months</div>
    </div>

    <!-- Chart container -->
    <div class="relative h-80">
      <canvas ref="chartCanvas" class="w-full h-full"></canvas>
    </div>

    <!-- Legend and metrics -->
    <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="text-center p-4 bg-red-50 rounded-lg">
        <div class="text-2xl font-bold text-red-600">{{ formatNumber(totalViews) }}</div>
        <div class="text-sm text-gray-600">Total Views</div>
        <div class="text-xs text-red-500 mt-1">+{{ viewsGrowth }}% this period</div>
      </div>
      <div class="text-center p-4 bg-blue-50 rounded-lg">
        <div class="text-2xl font-bold text-blue-600">{{ formatNumber(totalSubscribers) }}</div>
        <div class="text-sm text-gray-600">Subscribers</div>
        <div class="text-xs text-blue-500 mt-1">+{{ subscribersGrowth }}% this period</div>
      </div>
      <div class="text-center p-4 bg-green-50 rounded-lg">
        <div class="text-2xl font-bold text-green-600">{{ formatNumber(totalFollowers) }}</div>
        <div class="text-sm text-gray-600">Followers</div>
        <div class="text-xs text-green-500 mt-1">+{{ followersGrowth }}% this period</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  creator: {
    type: Object,
    required: true
  }
})

const chartCanvas = ref(null)
let chartInstance = null

// Mock data for the last 3 months
const totalViews = ref(0)
const totalSubscribers = ref(0)
const totalFollowers = ref(0)
const viewsGrowth = ref(0)
const subscribersGrowth = ref(0)
const followersGrowth = ref(0)

// Generate mock data for 3 months
const generateMockData = () => {
  const now = new Date()
  const labels = []
  const viewsData = []
  const subscribersData = []
  const followersData = []

  // Generate data for last 90 days (3 months)
  for (let i = 89; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))

    // Generate trending data with some randomness
    const baseViews = props.creator.stats.totalViews * 0.7
    const baseSubs = props.creator.stats.subscribers * 0.85
    const baseFollowers = (props.creator.stats.subscribers || 0) * 1.2

    viewsData.push(Math.floor(baseViews + (Math.random() * baseViews * 0.3) + (i * baseViews * 0.003)))
    subscribersData.push(Math.floor(baseSubs + (i * baseSubs * 0.002) + (Math.random() * baseSubs * 0.05)))
    followersData.push(Math.floor(baseFollowers + (i * baseFollowers * 0.002) + (Math.random() * baseFollowers * 0.04)))
  }

  // Set current totals
  totalViews.value = viewsData[viewsData.length - 1]
  totalSubscribers.value = subscribersData[subscribersData.length - 1]
  totalFollowers.value = followersData[followersData.length - 1]

  // Calculate growth percentages
  viewsGrowth.value = Math.round(((viewsData[viewsData.length - 1] - viewsData[0]) / viewsData[0]) * 100)
  subscribersGrowth.value = Math.round(((subscribersData[subscribersData.length - 1] - subscribersData[0]) / subscribersData[0]) * 100)
  followersGrowth.value = Math.round(((followersData[followersData.length - 1] - followersData[0]) / followersData[0]) * 100)

  return { labels, viewsData, subscribersData, followersData }
}

const createChart = () => {
  if (!chartCanvas.value) return

  const { labels, viewsData, subscribersData, followersData } = generateMockData()

  const ctx = chartCanvas.value.getContext('2d')
  
  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Views',
          data: viewsData,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 6,
        },
        {
          label: 'Subscribers',
          data: subscribersData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 6,
        },
        {
          label: 'Followers',
          data: followersData,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 6,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + formatNumber(context.parsed.y)
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false
          },
          ticks: {
            maxTicksLimit: 12
          }
        },
        y: {
          display: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            callback: function(value) {
              return formatNumber(value)
            }
          }
        }
      }
    }
  })
}

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toLocaleString()
}

onMounted(() => {
  createChart()
})

watch(() => props.creator, () => {
  createChart()
}, { deep: true })
</script>
