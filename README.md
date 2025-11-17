# Real-Time Chat Application with Socket.io

A full-stack real-time chat application built with Node.js, Express, Socket.io, and React. Features live messaging, private conversations, typing indicators, message reactions, and read receipts.

## 📋 Features Implemented

### ✅ Task 1: Project Setup
- Express server with Socket.io configured
- React + Vite frontend
- Bidirectional communication between client and server
- CORS enabled for cross-origin requests

### ✅ Task 2: Core Chat Functionality
- **Username-based authentication**: Simple login system with username storage
- **Global chat room**: All users can send and receive messages in real-time
- **Message display**: Shows sender name and timestamp for each message
- **Typing indicators**: Live display of who is typing
- **Online status**: Shows all connected users with online/offline status (🟢 Online / 🔴 Offline)

### ✅ Task 3: Advanced Chat Features (5 features implemented)
1. **Private messaging**: Send direct messages to specific users
2. **Message reactions**: React to messages with emojis (👍 ❤️ 😂 😮 😢 🔥)
3. **Read receipts**: See when messages have been read (✓✓ indicator)
4. **Message search**: Search through all messages by content or sender name
5. **User list with count**: View all online users and their count

### ✅ Task 4: Real-Time Notifications
- **Browser notifications**: Receive desktop notifications for new messages
- **Join/Leave notifications**: System messages when users join or leave
- **Online user count**: Display number of connected users
- **Visual status indicators**: Clear online/offline status display

### ✅ Task 5: Performance & UX Optimization
- **Reconnection logic**: Automatic reconnection with configurable attempts
- **Message history**: Last 100 messages stored server-side
- **Responsive design**: Works on desktop and mobile devices
- **Error handling**: Proper error handling and connection state management
- **Loading states**: Visual feedback for connection status
- **Message search**: Filter messages in real-time

## 🛠️ Tech Stack

**Backend:**
- Node.js with Express.js
- Socket.io for real-time communication
- CORS middleware
- Environment configuration with dotenv

**Frontend:**
- React 18
- Socket.io Client
- Vite (build tool)
- CSS3 with gradients and animations

## 📦 Installation & Setup

### Prerequisites
- Node.js v18+ 
- npm or yarn

### Server Setup
```bash
cd server
npm install
npm run dev
```
Server runs on `http://localhost:5000`

### Client Setup
```bash
cd client
npm install
npm run dev
```
Client runs on `http://localhost:5173` (Vite default)

## 🚀 Running the Application

1. **Start the server** (Terminal 1):
```bash
cd server
npm run dev
```

2. **Start the client** (Terminal 2):
```bash
cd client
npm run dev
```

3. **Open in browser**: Navigate to `http://localhost:5173`

4. **Test with multiple users**: Open multiple browser windows/tabs to see real-time features

## 🎯 How to Use

### Login
- Enter a username to join the chat
- Username is stored in localStorage for persistence

### Global Chat
- Send messages to all connected users
- See who is typing in real-time
- View all active users in the sidebar

### Private Messaging
- Click on a user in the sidebar to send private messages
- Visual indicator shows when messaging privately

### Message Reactions
- Hover over any message and click the `+` button
- Select an emoji reaction
- Click again to remove your reaction
- See count of who reacted

### Read Receipts
- Messages show ✓✓ when read by others
- Automatic marking as read when viewing

### Message Search
- Use the search box at the top of the user list
- Search by message content or sender name
- Real-time filtering of displayed messages

### Browser Notifications
- Allow notifications when prompted
- Receive desktop alerts for new messages

## 🏗️ Project Structure

```
.
├── server/
│   ├── server.js          # Main server file with Socket.io handlers
│   └── package.json       # Server dependencies
├── client/
│   ├── index.html         # HTML entry point
│   ├── package.json       # Client dependencies
│   └── src/
│       ├── main.jsx       # React app entry
│       ├── App.jsx        # Main app component
│       ├── styles.css     # Global styles
│       ├── socket/
│       │   └── socket.js  # Socket.io client setup and useSocket hook
│       └── components/
│           ├── Login.jsx  # Login component
│           └── Chat.jsx   # Chat UI component
└── README.md
```

## 🔌 Socket.io Events

### Client → Server
- `user_join`: Join with username
- `send_message`: Send message to global chat
- `private_message`: Send private message to user
- `typing`: Notify typing status
- `mark_read`: Mark message as read
- `add_reaction`: Add emoji reaction to message
- `remove_reaction`: Remove emoji reaction

### Server → Client
- `user_list`: Updated list of connected users
- `user_joined`: User joined notification
- `user_left`: User left notification
- `receive_message`: New message received
- `private_message`: New private message
- `typing_users`: Current typing users
- `reaction_added`: Reaction added to message
- `reaction_removed`: Reaction removed
- `message_read`: Message was read by user

## 📱 Responsive Design

The application is fully responsive:
- **Desktop**: Two-column layout with sidebar and main chat area
- **Mobile**: Sidebar adapts, full-width chat interface
- **Tablet**: Adaptive layout

## 🔐 Security Notes

This is a demonstration application. For production:
- Implement proper JWT-based authentication
- Add password hashing and validation
- Use HTTPS/WSS for secure connections
- Add rate limiting to prevent spam
- Validate and sanitize all user inputs

## 🚀 Optional Enhancements

Future improvements could include:
- Message persistence with database
- Multiple chat rooms/channels
- File/image upload support
- User profiles and avatars
- Message edit/delete functionality
- User blocking/muting

## 📚 Assignment Info

**Week 5: Real-Time Communication with Socket.io**
- Repository: `real-time-communication-with-socket-io-graceygrayy`
- Owner: PLP-MERN-Stack-Development

**Status**: ✅ Complete with all required features 