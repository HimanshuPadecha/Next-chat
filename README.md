# Next-chat 

A modern, real-time chat application frontend built with React, Vite, and TypeScript. It features a premium dark-themed, glassmorphic UI tailored for an optimal user experience.

**Live Demo:** [https://next-chat-ten-theta.vercel.app](https://next-chat-ten-theta.vercel.app)

## ✨ Features

- **Real-time Messaging**: Instant message delivery and receiving powered by Socket.io.
- **Live Presence**: Real-time online/offline status indicators for all users in your contacts.
- **Premium UI/UX**: A highly polished dark theme utilizing glassmorphism, custom gradient message bubbles, micro-animations, and custom scrollbars.
- **Secure Authentication**: Full login and signup flows with profile picture upload support and password visibility toggles.
- **Robust Validation**: Client-side form validation seamlessly handled by React Hook Form and Zod.
- **Responsive Layout**: A robust flexbox-driven layout ensuring that the chat interface remains usable and overlap-free on all screen sizes.
- **Toast Notifications**: Styled, non-intrusive notifications for errors and actions using `react-toastify`.

## 🛠️ Tech Stack

- **Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, custom CSS variables, `tw-animate-css`
- **Routing**: React Router DOM v7
- **UI Components**: Radix UI Primitives (via shadcn/ui patterns), Lucide React (Icons)
- **Forms & Validation**: React Hook Form, Zod
- **Networking/Real-time**: Axios, Socket.io-client

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- The Next-chat Backend must be running (locally or remotely) for full functionality.

### Installation

1. Navigate to the frontend directory and install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Ensure your `.env` file is set up correctly with any required API endpoints to communicate with your backend.

3. Start the development server:
   ```bash
   npm run dev
   ```

   The app will typically be available at `http://localhost:5173`.

### Build for Production

To create an optimized production bundle:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

## 📁 Project Structure

- `/src/auth/` - Authentication components, layouts, and login/signup logic.
- `/src/chat/` - Core chat interface components including message lists, input fields, and the chat header.
- `/src/home/` - Main application shell and sidebar logic.
- `/src/components/ui/` - Reusable UI components (buttons, inputs, loaders, skeletons).
- `/src/context/` - React Context providers for global state (Authentication, WebSockets).
- `/src/utils/` - API request handlers, local storage utilities, and global error handlers.
