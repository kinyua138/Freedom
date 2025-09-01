# Freedom - Modern Web Development Platform

A sophisticated React-based web application that combines a modern landing page with an interactive UI builder tool. Built with TypeScript, Redux Toolkit, and modern web technologies.

## 🚀 Features

### Core Features
- **Modern Landing Page** - Beautiful, responsive landing page with animated elements
- **Interactive UI Builder** - Drag-and-drop interface builder with real-time preview (Independent Application)
- **Multi-page Navigation** - Complete routing system with lazy loading
- **Theme System** - Dark/light mode with custom color schemes
- **Undo/Redo** - Full history management for the UI builder
- **Export Functionality** - Export projects as HTML/CSS

### Technical Features
- **TypeScript** - Full type safety throughout the application
- **Redux Toolkit** - Centralized state management
- **Performance Optimized** - Lazy loading, code splitting, and bundle optimization
- **Testing** - Comprehensive test suite with Jest and React Testing Library
- **Code Quality** - ESLint, Prettier, and Husky for code quality
- **Accessibility** - ARIA labels, keyboard navigation, and screen reader support
- **SEO Optimized** - Meta tags, structured data, and performance metrics

## 🏗️ Architecture

### Main Website (`/`)
- **Layout**: Includes Navbar and Footer
- **Pages**: Home, About, Contact
- **Purpose**: Marketing and information site
- **Navigation**: Standard website navigation

### UI Builder (`/ui-builder`)
- **Layout**: Independent layout without Navbar/Footer
- **Purpose**: Standalone application for building interfaces
- **Navigation**: Minimal header with back to main site
- **Features**: Full-screen builder experience

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **State Management**: Redux Toolkit, Zustand
- **Styling**: Tailwind CSS, Framer Motion
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Testing**: Jest, React Testing Library
- **Code Quality**: ESLint, Prettier, Husky
- **Icons**: Heroicons, Lucide React
- **Notifications**: React Hot Toast
- **SEO**: React Helmet Async

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Freedom
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Main website: `http://localhost:3000`
   - UI Builder: `http://localhost:3000/ui-builder`

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🔧 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check

# Analyze bundle
npm run analyze
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui-builder/      # UI Builder specific components
│   │   └── UIBuilderHeader.tsx  # Minimal header for UI Builder
│   └── __tests__/       # Component tests
├── pages/              # Page components
├── layouts/            # Layout components
│   ├── MainLayout.tsx  # Main website layout (with navbar/footer)
│   └── UIBuilderLayout.tsx  # UI Builder layout (independent)
├── hooks/              # Custom React hooks
├── store/              # Redux store configuration
│   └── slices/         # Redux slices
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── constants/          # Application constants
└── index.css           # Global styles
```

## 🎨 UI Builder Features

### Components Available
- **Basic Elements**: Button, Text, Image, Card, Container
- **Form Elements**: Input, Select, Checkbox, Radio
- **Layout Elements**: Divider, Spacer, Grid, Flexbox
- **Interactive Elements**: Modal, Tooltip, Dropdown
- **Page Templates**: Landing Page, Dashboard, Contact Form

### Advanced Features
- **Real-time Preview** - See changes instantly
- **Component Library** - Drag and drop pre-built components
- **Property Panel** - Customize component properties
- **Page Management** - Create and manage multiple pages
- **Export Options** - Export as HTML, React components, or JSON
- **Undo/Redo** - Full history management
- **Responsive Design** - Test on different screen sizes
- **Independent Layout** - No navbar/footer interference

## 🔒 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url_here
VITE_ANALYTICS_ID=your_analytics_id
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. Deploy with one click

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify

### Manual Deployment
1. Build the project: `npm run build`
2. Upload the contents of the `dist` folder to your web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Redux Toolkit](https://redux-toolkit.js.org/) - The official, opinionated toolset for efficient Redux development
- [Framer Motion](https://www.framer.com/motion/) - Production-ready motion library for React

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the development team.
