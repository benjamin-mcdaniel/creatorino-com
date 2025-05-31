import { defineStore } from 'pinia'

export const useCreatorStore = defineStore('creator', {
  state: () => ({
    creators: [],
    currentCreator: null,
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchCreators() {
      this.loading = true
      try {
        // TODO: Replace with actual API call
        this.creators = [
          {
            id: '1',
            name: 'Tech Tutorial Pro',
            avatarUrl: 'https://placeholder.co/100',
            stats: {
              subscribers: 150000,
              videos: 500
            }
          },
          {
            id: '2',
            name: 'Gaming with Sarah',
            avatarUrl: 'https://placeholder.co/100',
            stats: {
              subscribers: 250000,
              videos: 800
            }
          }
        ]
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async fetchCreatorById(id) {
      this.loading = true
      try {
        // TODO: Replace with actual API call
        this.currentCreator = this.creators.find(c => c.id === id) || {
          id,
          name: 'Tech Tutorial Pro',
          avatarUrl: 'https://placeholder.co/100',
          stats: {
            subscribers: 150000,
            videos: 500
          }
        }
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  }
})
