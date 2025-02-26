# creatorino.com

## setup creatorino.com folder

### npm
run 
npm install

### supabase
create file env.local at /src/

NEXT_PUBLIC_SUPABASE_URL = "https://vargoeshere.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY = "keyvarhere"


## App Structure

src/
├── components/
│   ├── common/
│   │   ├── Card.js                 # Enhanced styled card component with standardized props
│   │   ├── StatCard.js             # Reusable metric card with icon and trend indicator
│   │   ├── PageHeader.js           # Page header with title, subtitle and action buttons
│   │   ├── TabPanel.js             # Reusable tab content container with accessibility props
│   │   └── LoadingState.js         # Standardized loading indicators and skeletons
│   │
│   ├── dashboard/
│   │   ├── index.js                # Main dashboard container with tab navigation
│   │   ├── DashboardLogin.js       # Login prompt for unauthenticated users
│   │   ├── StatCards.js            # Key metrics grid component showing platform stats
│   │   ├── RecentContent.js        # Container for recent videos/streams lists
│   │   ├── SocialLinks.js          # Connected platforms and social profiles summary
│   │   ├── QuickActions.js         # Action panel with common dashboard functions
│   │   │
│   │   ├── YouTube/
│   │   │   ├── index.js            # YouTube tab main container and layout
│   │   │   ├── YouTubeStats.js     # YouTube specific statistics and metrics
│   │   │   ├── RecentVideos.js     # Recent videos list with performance data
│   │   │   └── ConnectYouTube.js   # YouTube connection UI for initial setup
│   │   │
│   │   ├── Twitch/
│   │   │   ├── index.js            # Twitch tab main container and layout
│   │   │   ├── TwitchStats.js      # Twitch streaming statistics and metrics
│   │   │   ├── RecentStreams.js    # Recent streams list with performance data
│   │   │   └── ConnectTwitch.js    # Twitch connection UI for initial setup
│   │   │
│   │   └── SocialLinks/
│   │       ├── index.js            # Social links tab main component and layout
│   │       ├── LinksList.js        # List of current social media links
│   │       └── AddEditLink.js      # Form for adding/editing social links
│   │ 
│   ├── Layout.js                   # Main app layout with navigation and footer
│   └── Navbar.js                   # Responsive navigation bar with auth state
│
├── lib/
│   ├── supabaseClient.js           # Supabase client configuration
│   ├── useAuth.js                  # Authentication hook and user management
│   └── api/                        # API communication layer
│       ├── youtube.js              # YouTube API fetch functions
│       ├── twitch.js               # Twitch API fetch functions
│       └── social.js               # Social links CRUD operations
│
├── hooks/
│   ├── useYouTube.js               # Hook for YouTube data state management
│   ├── useTwitch.js                # Hook for Twitch data state management
│   └── useSocialLinks.js           # Hook for social links data management
│
├── pages/
│   ├── _app.js                     # Next.js app container with theme provider
│   ├── index.js                    # Landing page
│   ├── login.js                    # User login page
│   ├── signup.js                   # User registration page
│   ├── features.js                 # Product features showcase page
│   └── dashboard.js                # Dashboard page container
│
└── utils/
    ├── formatters.js               # Data formatting utilities (numbers, dates, etc.)
    └── theme.js                    # Material UI theme configuration