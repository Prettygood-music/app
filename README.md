# prettygood.music

A music streaming platform built with minimal blockchain integration on Sui, offering the familiar experience of Spotify while providing crypto payments for artists and users.

## Overview

prettygood.music focuses on user experience first, with blockchain elements that enhance rather than dominate the experience. The platform provides high-quality music streaming with direct artist support through cryptocurrency payments.

## Features

- **High-quality Streaming**: Up to 320kbps audio with adaptive playback
- **Artist Direct Support**: Tipping via Sui blockchain
- **Social Features**: Following artists, sharing playlists, and more
- **Recommendation Engine**: Personalized music recommendations
- **Progressive Web App**: Install on any device with offline capabilities
- **Minimal UI**: Clean, intuitive interface focusing on the music

## Progressive Web App

prettygood.music is available as a Progressive Web App (PWA), which means you can install it on your device and use it like a native application:

- **Install on Any Device**: Works on mobile and desktop
- **Offline Access**: Listen to your saved music even without an internet connection
- **Fast Loading**: Optimized performance with cached assets
- **App-like Experience**: Full-screen view without browser controls
- **Home Screen Access**: Launch directly from your home screen

To install the app, visit the [Install Page](/install) or use your browser's installation feature.

## Technology Stack

### Frontend

- **Framework**: SvelteKit with Svelte 5 (runes API)
- **Styling**: TailwindCSS + shadcn component system
- **Audio Processing**: Web Audio API
- **Web3 Integration**: Sui TypeScript SDK

### Backend

- **Server Framework**: Sveltekit server actions
- **Database**: Supabase
- **Media Storage**: Cloud storage

## Development

### Prerequisites

- Node.js 20+
- pnpm 8+

### Getting Started

```bash
# Clone the repository
git clone https://github.com/your-org/prettygood-music.git
cd prettygood-music

# start database
cd database
supabase start

# Start developing
cd ../app
pnpm dev
```

## Project Structure

The project uses a monorepo structure with pnpm workspaces:

- `/app`: FullStack SvelteKit application
- `/database`: Database migration and seeding

## License

[MIT License](LICENSE)
