# Book Service API Frontend

A modern React frontend built with Vite, TypeScript, and Material UI for the Book Service API.

## Features

- 📚 View all books in a responsive data grid
- ➕ Add new books with form validation
- ✏️ Edit existing book details
- 👁️ View detailed book information
- 🗑️ Delete books with confirmation
- 📱 Responsive Material UI design
- ⚡ Fast development with Vite HMR

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Material UI** for beautiful, accessible components
- **React Router** for client-side routing
- **Axios** for API communication
- **Material UI X Data Grid** for advanced table features

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── BookList.tsx      # Main books listing with data grid
│   │   ├── BookForm.tsx      # Add/Edit book form
│   │   └── BookDetail.tsx    # Individual book view
│   ├── services/
│   │   └── bookService.ts    # API service layer
│   ├── App.tsx               # Main app with routing
│   └── main.tsx             # React entry point
├── public/
├── index.html
├── package.json
└── vite.config.ts
```

## API Integration

The frontend is configured to proxy API requests to `http://localhost:5000` during development. Make sure your backend server is running on port 5000.

## Building for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files that can be served by any static file server.