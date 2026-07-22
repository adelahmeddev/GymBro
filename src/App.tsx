import { Suspense } from 'react';
import { Router } from '@/app/Router';
import './index.css';

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-surface flex items-center justify-center">
          <svg className="animate-spin h-8 w-8 text-accent" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      }
    >
      <Router />
    </Suspense>
  );
}
