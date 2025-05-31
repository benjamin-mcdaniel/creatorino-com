import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../pages/DashboardPage.vue'
import CreatorPage from '../pages/CreatorPage.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardPage
  },
  {
    path: '/creator/:id',
    name: 'creator',
    component: CreatorPage
  },
  {
    path: '/trending',
    name: 'trending',
    component: () => import('../pages/TrendingPage.vue')
  },
  {
    path: '/youtube',
    name: 'youtube',
    component: () => import('../pages/YoutubePage.vue')
  },
  {
    path: '/twitch',
    name: 'twitch',
    component: () => import('../pages/TwitchPage.vue')
  },
  {
    path: '/insights',
    name: 'insights',
    component: () => import('../pages/InsightsPage.vue')
  },
  {
    path: '/comparisons',
    name: 'comparisons',
    component: () => import('../pages/ComparisonsPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
