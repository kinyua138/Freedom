import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import ThemeProvider from './contexts/ThemeContext'
import ProjectProvider from './contexts/ProjectContext'
import { AuthProvider } from './contexts/AuthContext'
import { I18nProvider } from './contexts/I18nContext'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import UIBuilder from './pages/UIBuilder'
import Analytics from './pages/Analytics'
import ErrorFallback from './components/ErrorFallback'

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <I18nProvider>
        <AuthProvider>
          <ThemeProvider>
            <ProjectProvider>
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="ui-builder" element={<UIBuilder />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </ProjectProvider>
          </ThemeProvider>
        </AuthProvider>
      </I18nProvider>
    </ErrorBoundary>
  )
}

export default App
