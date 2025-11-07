# xdiscord Chat Integration Guide

This document provides detailed information about the xdiscord chat integration in FairCoin.

## Overview

FairCoin integrates [xdiscord](https://github.com/jonipwi/xdiscord), an open-source real-time chat application, to provide community support and discussions directly within the application.

## Architecture

### Components

1. **FloatingChatWidget** (`components/FloatingChatWidget.tsx`)
   - Core chat widget component
   - Handles UI rendering, theming, and modal behavior
   - Communicates with xdiscord via iframe and PostMessage API
   - Manages resize, maximize, and mobile responsive behavior

2. **AuthenticatedChatWidget** (`components/AuthenticatedChatWidget.tsx`)
   - Wrapper component that integrates authentication
   - Automatically passes authenticated username to chat
   - Falls back to "guest" for non-authenticated users

### Integration Points

- **Root Layout** (`app/layout.tsx`): Chat widget is mounted at the root level
- **Auth Context** (`contexts/AuthContext.tsx`): Provides user authentication state
- **Theme System**: Chat theme syncs with FairCoin's light/dark mode via PostMessage

## Features

### User Experience

- **Floating Widget**: Non-intrusive bottom-right corner button
- **Resizable Modal**: Drag edges and corners to resize (desktop only)
- **Fullscreen Mode**: Maximize for focused chatting
- **Mobile Optimized**: Auto-fullscreen on mobile devices
- **Theme Sync**: Automatically matches FairCoin's theme
- **Persistent Size**: Modal size saved to localStorage

### Technical Features

- **PostMessage API**: Cross-frame communication between FairCoin and xdiscord
- **Theme Synchronization**: Bidirectional theme updates
- **Authentication Integration**: Automatic username detection
- **Responsive Design**: Adaptive UI for mobile and desktop
- **localStorage**: Persists user preferences (theme, modal size)

## Configuration

### Environment Variables

```properties
# .env or .env.local
NEXT_PUBLIC_CHAT_URL=http://localhost:3031  # For local development
# NEXT_PUBLIC_CHAT_URL=https://chat.faircoin.app  # For production
```

### Development Setup

1. **Clone xdiscord**:
   ```bash
   git clone https://github.com/jonipwi/xdiscord.git
   cd xdiscord
   npm install
   ```

2. **Run xdiscord**:
   ```bash
   npm run dev -- -p 3031
   ```

3. **Configure FairCoin**:
   Create `.env` file with:
   ```properties
   NEXT_PUBLIC_CHAT_URL=http://localhost:3031
   ```

4. **Run FairCoin**:
   ```bash
   npm run dev
   ```

### Production Deployment

1. **Deploy xdiscord separately** (e.g., Vercel, Netlify, or custom server)
2. **Update environment variable** in FairCoin deployment:
   ```properties
   NEXT_PUBLIC_CHAT_URL=https://your-chat-domain.com
   ```

## PostMessage API

### Messages from FairCoin to xdiscord

#### Set Theme
```javascript
iframe.contentWindow.postMessage({
  type: 'SET_THEME',
  theme: 'dark' | 'light'
}, '*')
```

### Messages from xdiscord to FairCoin

#### Close Modal
```javascript
window.parent.postMessage({
  type: 'CLOSE_MODAL'
}, '*')
```

#### Theme Changed
```javascript
window.parent.postMessage({
  type: 'THEME_CHANGED',
  theme: 'dark' | 'light'
}, '*')
```

## URL Parameters

xdiscord supports various URL parameters for customization:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `modal=true` | Enable modal mode | `?modal=true` |
| `compact=true` | Hide sidebar | `?compact=true` |
| `maximized=true` | Start maximized | `?maximized=true` |
| `hideHeader=true` | Hide modal header | `?hideHeader=true` |
| `room=name` | Join specific room | `?room=general` |
| `username=name` | Set username | `?username=JohnDoe` |

### Default FairCoin Configuration

```typescript
const iframeUrl = `${chatUrl}?modal=true&compact=true&maximized=true&hideHeader=true&room=${defaultRoom}&username=${defaultUsername}`
```

## Customization

### Adding New Rooms

To add new chat rooms, update the `defaultRoom` prop in `AuthenticatedChatWidget.tsx`:

```typescript
<FloatingChatWidget 
  chatUrl={process.env.NEXT_PUBLIC_CHAT_URL || 'http://localhost:3031'}
  defaultRoom="your-room-name"  // Change this
  defaultUsername={username}
/>
```

### Custom Username Logic

To customize how usernames are determined, modify `AuthenticatedChatWidget.tsx`:

```typescript
const username = isAuthenticated 
  ? user?.username || user?.email?.split('@')[0] || `user_${user?.user_id || 'guest'}`
  : 'guest'
```

### Styling

The FloatingChatWidget uses Tailwind CSS for styling. To customize:

1. Edit `components/FloatingChatWidget.tsx`
2. Modify Tailwind classes as needed
3. Ensure theme-aware styling is maintained

## Troubleshooting

### Chat Widget Not Appearing

1. **Check environment variable**: Ensure `NEXT_PUBLIC_CHAT_URL` is set
2. **Verify xdiscord is running**: Visit the chat URL directly
3. **Check browser console**: Look for CORS or network errors
4. **Clear localStorage**: Remove saved preferences if widget behaves oddly

### Theme Not Syncing

1. **Check PostMessage communication**: Open browser console and look for errors
2. **Verify iframe loads**: Check Network tab for iframe request
3. **Test theme toggle**: Manually toggle FairCoin theme and observe chat

### Resize Not Working

1. **Check device type**: Resize is disabled on mobile
2. **Verify maximize state**: Resize disabled when maximized
3. **Check browser**: Some browsers may have restrictions

## Security Considerations

### Production PostMessage

In production, restrict PostMessage origins:

```typescript
// Instead of '*', use specific origin
iframe.contentWindow.postMessage(message, 'https://chat.faircoin.app')
```

### User Authentication

- Usernames are passed to xdiscord for display only
- xdiscord should implement its own authentication if needed
- Consider adding authentication token passing for secure features

## Performance

### Lazy Loading

The chat widget is loaded immediately in the root layout. For better initial page load performance, consider:

1. **Lazy loading the widget** after initial render
2. **Loading iframe only when chat opens** (currently loads immediately)
3. **Implementing a service worker** for offline chat support

### Resource Usage

- **Iframe overhead**: Each iframe adds ~5-10MB memory
- **Network**: WebSocket connection maintained when chat is open
- **localStorage**: Minimal usage for preferences (~1KB)

## Future Enhancements

Potential improvements for the chat integration:

1. **Unread Message Badges**: Show count on floating button
2. **Desktop Notifications**: Browser notifications for new messages
3. **Voice/Video Chat**: Integrate WebRTC for real-time communication
4. **File Sharing**: Allow file uploads in chat
5. **Chat History**: Persistent message history across sessions
6. **Multi-room Support**: Easy room switching within widget
7. **Typing Indicators**: Show when others are typing
8. **User Presence**: Online/offline status indicators

## Resources

- **xdiscord Repository**: https://github.com/jonipwi/xdiscord
- **xdiscord Embedding Guide**: https://github.com/jonipwi/xdiscord/blob/main/EMBEDDING_GUIDE.md
- **FairCoin Repository**: https://github.com/jonipwi/faircoin.app
- **FairCoin README**: https://github.com/jonipwi/faircoin.app/blob/main/README.md

## Support

For issues or questions about:
- **xdiscord chat application**: Open an issue at https://github.com/jonipwi/xdiscord/issues
- **FairCoin integration**: Open an issue at https://github.com/jonipwi/faircoin.app/issues
- **General chat feature**: Contact the FairCoin community

---

**Built with ❤️ by the FairCoin Community**

*Light & Truth • Love & Mercy • Just & Peace*
