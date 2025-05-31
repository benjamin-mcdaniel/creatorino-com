import { defineStore } from 'pinia'

// Generate realistic timeline events
const generateTimelineEvents = (creatorName, months = 12) => {
  const events = []
  const eventTypes = [
    { type: 'video_upload', weight: 60 },
    { type: 'milestone', weight: 15 },
    { type: 'collaboration', weight: 10 },
    { type: 'announcement', weight: 10 },
    { type: 'stream', weight: 5 }
  ]
  
  const videoTitles = [
    'Ultimate Tutorial Guide', 'Behind the Scenes', 'Q&A Session', 'Live Stream Highlights',
    'New Project Reveal', 'Tips and Tricks', 'Review and Analysis', 'Community Challenge',
    'Special Event Coverage', 'Expert Interview', 'Tutorial Series Part', 'Monthly Update'
  ]
  
  for (let i = 0; i < months * 8; i++) {
    const daysAgo = Math.floor(Math.random() * months * 30)
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    
    let event = {
      id: `event_${i}`,
      date: date.toISOString(),
      type: randomType.type,
      views: Math.floor(Math.random() * 500000) + 1000,
      likes: Math.floor(Math.random() * 50000) + 100,
      comments: Math.floor(Math.random() * 5000) + 10
    }
    
    switch (randomType.type) {
      case 'video_upload':
        event.title = `${videoTitles[Math.floor(Math.random() * videoTitles.length)]} #${i + 1}`
        event.description = `New video upload by ${creatorName}`
        event.thumbnail = `https://picsum.photos/320/180?random=${i}`
        event.duration = `${Math.floor(Math.random() * 20) + 5}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
        break
      case 'milestone':
        const milestones = ['100K subscribers', '1M views', '500K subscribers', '10M total views', '1M subscribers']
        event.title = `🎉 ${milestones[Math.floor(Math.random() * milestones.length)]} reached!`
        event.description = `${creatorName} hit a major milestone`
        break
      case 'collaboration':
        event.title = `Collaboration with other creators`
        event.description = `${creatorName} collaborated on a special project`
        break
      case 'announcement':
        event.title = `Important announcement`
        event.description = `${creatorName} shared important news with the community`
        break
      case 'stream':
        event.title = `Live stream session`
        event.description = `${creatorName} went live for ${Math.floor(Math.random() * 4) + 1} hours`
        event.duration = `${Math.floor(Math.random() * 4) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`
        break
    }
    
    events.push(event)
  }
  
  return events.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export const useCreatorStore = defineStore('creator', {
  state: () => ({
    creators: [],
    currentCreator: null,
    loading: false,
    error: null,
    searchQuery: '',
    searchResults: []
  }),
  
  getters: {
    trendingCreators: (state) => {
      return state.creators
        .sort((a, b) => b.stats.recentGrowth - a.stats.recentGrowth)
        .slice(0, 6)
    },
    
    filteredCreators: (state) => {
      if (!state.searchQuery) return state.creators
      return state.creators.filter(creator => 
        creator.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        creator.category.toLowerCase().includes(state.searchQuery.toLowerCase())
      )
    }
  },
  
  actions: {
    async fetchCreators() {
      this.loading = true
      try {
        // Enhanced dummy data with more creators
        this.creators = [
          {
            id: '1',
            name: 'TechReviewGuru',
            avatarUrl: 'https://picsum.photos/100/100?random=1',
            bannerUrl: 'https://picsum.photos/1200/300?random=1',
            category: 'Technology',
            verified: true,
            description: 'Latest tech reviews, tutorials, and industry insights. Helping you make informed tech decisions.',
            stats: {
              subscribers: 1250000,
              videos: 850,
              totalViews: 45000000,
              recentGrowth: 15.2,
              averageViews: 85000,
              joinDate: '2019-03-15'
            },
            socialLinks: {
              twitter: '@techreviewguru',
              instagram: 'techreviewguru',
              website: 'https://techreviewguru.com'
            },
            timeline: generateTimelineEvents('TechReviewGuru', 18)
          },
          {
            id: '2',
            name: 'GamingWithSarah',
            avatarUrl: 'https://picsum.photos/100/100?random=2',
            bannerUrl: 'https://picsum.photos/1200/300?random=2',
            category: 'Gaming',
            verified: true,
            description: 'Professional gamer and streamer. RPGs, FPS, and indie game reviews. Live streams every Tuesday and Friday!',
            stats: {
              subscribers: 890000,
              videos: 1200,
              totalViews: 68000000,
              recentGrowth: 22.8,
              averageViews: 65000,
              joinDate: '2018-07-22'
            },
            socialLinks: {
              twitter: '@gamingwithsarah',
              twitch: 'gamingwithsarah',
              discord: 'Sarah\'s Gaming Community'
            },
            timeline: generateTimelineEvents('GamingWithSarah', 24)
          },
          {
            id: '3',
            name: 'CookingMasterclass',
            avatarUrl: 'https://picsum.photos/100/100?random=3',
            bannerUrl: 'https://picsum.photos/1200/300?random=3',
            category: 'Cooking',
            verified: false,
            description: 'Professional chef sharing recipes, techniques, and culinary secrets. From basics to advanced cooking.',
            stats: {
              subscribers: 450000,
              videos: 320,
              totalViews: 12000000,
              recentGrowth: 8.5,
              averageViews: 35000,
              joinDate: '2020-01-10'
            },
            socialLinks: {
              instagram: 'cookingmasterclass',
              website: 'https://cookingmasterclass.com'
            },
            timeline: generateTimelineEvents('CookingMasterclass', 15)
          },
          {
            id: '4',
            name: 'FitnessWithMike',
            avatarUrl: 'https://picsum.photos/100/100?random=4',
            bannerUrl: 'https://picsum.photos/1200/300?random=4',
            category: 'Fitness',
            verified: true,
            description: 'Certified personal trainer. Workout routines, nutrition tips, and motivation for your fitness journey.',
            stats: {
              subscribers: 780000,
              videos: 520,
              totalViews: 25000000,
              recentGrowth: 12.3,
              averageViews: 48000,
              joinDate: '2019-09-05'
            },
            socialLinks: {
              twitter: '@fitnesswithmike',
              instagram: 'fitnesswithmike',
              website: 'https://mikefitness.com'
            },
            timeline: generateTimelineEvents('FitnessWithMike', 20)
          },
          {
            id: '5',
            name: 'TravelVlogger_Emma',
            avatarUrl: 'https://picsum.photos/100/100?random=5',
            bannerUrl: 'https://picsum.photos/1200/300?random=5',
            category: 'Travel',
            verified: true,
            description: 'Exploring the world one destination at a time. Travel tips, cultural experiences, and adventure guides.',
            stats: {
              subscribers: 920000,
              videos: 680,
              totalViews: 38000000,
              recentGrowth: 18.7,
              averageViews: 55000,
              joinDate: '2018-11-18'
            },
            socialLinks: {
              twitter: '@emmtravels',
              instagram: 'emmtravels',
              youtube: 'TravelVlogger_Emma'
            },
            timeline: generateTimelineEvents('TravelVlogger_Emma', 22)
          },
          {
            id: '6',
            name: 'CodeAcademyPro',
            avatarUrl: 'https://picsum.photos/100/100?random=6',
            bannerUrl: 'https://picsum.photos/1200/300?random=6',
            category: 'Programming',
            verified: false,
            description: 'Learn programming from scratch. JavaScript, Python, React, and more. Beginner-friendly tutorials.',
            stats: {
              subscribers: 650000,
              videos: 890,
              totalViews: 22000000,
              recentGrowth: 25.1,
              averageViews: 28000,
              joinDate: '2020-05-12'
            },
            socialLinks: {
              twitter: '@codeacademypro',
              github: 'codeacademypro',
              website: 'https://codeacademypro.dev'
            },
            timeline: generateTimelineEvents('CodeAcademyPro', 16)
          },
          {
            id: '7',
            name: 'ArtStudioDaily',
            avatarUrl: 'https://picsum.photos/100/100?random=7',
            bannerUrl: 'https://picsum.photos/1200/300?random=7',
            category: 'Art',
            verified: false,
            description: 'Digital and traditional art tutorials. Speed paintings, technique breakdowns, and art challenges.',
            stats: {
              subscribers: 340000,
              videos: 420,
              totalViews: 8500000,
              recentGrowth: 14.2,
              averageViews: 20000,
              joinDate: '2019-12-03'
            },
            socialLinks: {
              instagram: 'artstudiodaily',
              twitter: '@artstudiodaily',
              deviantart: 'artstudiodaily'
            },
            timeline: generateTimelineEvents('ArtStudioDaily', 14)
          },
          {
            id: '8',
            name: 'MusicProducerBeats',
            avatarUrl: 'https://picsum.photos/100/100?random=8',
            bannerUrl: 'https://picsum.photos/1200/300?random=8',
            category: 'Music',
            verified: true,
            description: 'Beat making tutorials, music production tips, and studio session behind-the-scenes content.',
            stats: {
              subscribers: 580000,
              videos: 750,
              totalViews: 19000000,
              recentGrowth: 11.8,
              averageViews: 32000,
              joinDate: '2018-04-27'
            },
            socialLinks: {
              soundcloud: 'musicproducerbeats',
              spotify: 'MusicProducerBeats',
              instagram: 'musicproducerbeats'
            },
            timeline: generateTimelineEvents('MusicProducerBeats', 21)
          }
        ]
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },    async fetchCreatorById(id) {
      this.loading = true
      this.error = null
      try {
        // If creators array is empty, fetch creators first
        if (this.creators.length === 0) {
          await this.fetchCreators()
        }
        
        // Find the creator by id (convert to string since route params are strings)
        this.currentCreator = this.creators.find(c => c.id === String(id))
        if (!this.currentCreator) {
          throw new Error('Creator not found')
        }
      } catch (err) {
        this.error = err.message
        this.currentCreator = null
      } finally {
        this.loading = false
      }
    },

    searchCreators(query) {
      this.searchQuery = query
      this.searchResults = this.filteredCreators
    },

    clearSearch() {
      this.searchQuery = ''
      this.searchResults = []
    }
  }
})
