import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col text-[#172033] relative selection:bg-[#F3E8D0] selection:text-[#173B72]">
            {/* Global Site-Wide Vidhan Bhawan Architectural Layer (Requirements 5, 6, 8) */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
              {/* High-Resolution Vidhan Bhawan Monument Base */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: "url('/assets/vidhan-bhawan.jpg')",
                }}
              />
              {/* Institutional Navy & Heritage Sandstone Wash (High Readability & Official Dignity) */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#173B72]/80 via-[#F5F7FA]/90 to-[#F5F7FA]/95" />
              <div className="absolute inset-0 bg-[#F3E8D0]/8 mix-blend-multiply" />
            </div>

            <Navbar />
            <main className="flex-grow relative z-10">
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
