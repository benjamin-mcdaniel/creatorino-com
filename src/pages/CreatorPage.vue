<!-- Creator details page -->
<template>
  <MainLayout>
    <div v-if="loading" class="flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
    <div v-else-if="error" class="text-red-500">
      {{ error }}
    </div>
    <template v-else>
      <CreatorHeader :creator="currentCreator" />
      <Timeline :creatorId="creatorId" />
    </template>
  </MainLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useCreatorStore } from '../stores/creator'
import MainLayout from '../components/layout/MainLayout.vue'
import CreatorHeader from '../components/creator/CreatorHeader.vue'
import Timeline from '../components/timeline/Timeline.vue'

const route = useRoute()
const creatorStore = useCreatorStore()
const { currentCreator, loading, error } = storeToRefs(creatorStore)
const creatorId = route.params.id

onMounted(() => {
  creatorStore.fetchCreatorById(creatorId)
})
</script>
