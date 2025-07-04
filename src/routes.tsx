
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import BookReader from "./pages/BookReader";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import TopReads from "./pages/TopReads";
import Recommendations from "./pages/Recommendations";
import Featured from "./pages/Featured";
import ComicsPage from "./pages/ComicsPage";
import ComicReader from '@/pages/ComicReader';
import ErrorBoundary from '@/components/ErrorBoundary';

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <Home />
      </ErrorBoundary>
    ),
    errorElement: (
      <ErrorBoundary>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error loading home page</h1>
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </div>
      </ErrorBoundary>
    ),
  },
  {
    path: "/book/:bookId",
    element: (
      <ErrorBoundary>
        <BookReader />
      </ErrorBoundary>
    ),
  },
  {
    path: "/comic/:comicId",
    element: (
      <ErrorBoundary>
        <ComicReader />
      </ErrorBoundary>
    ),
  },
  {
    path: "/settings",
    element: (
      <ErrorBoundary>
        <Settings />
      </ErrorBoundary>
    ),
  },
  {
    path: "/profile/:userId",
    element: (
      <ErrorBoundary>
        <Profile />
      </ErrorBoundary>
    ),
  },
  {
    path: "/search",
    element: (
      <ErrorBoundary>
        <Search />
      </ErrorBoundary>
    ),
  },
  {
    path: "/top-reads",
    element: (
      <ErrorBoundary>
        <TopReads />
      </ErrorBoundary>
    ),
  },
  {
    path: "/recommendations",
    element: (
      <ErrorBoundary>
        <Recommendations />
      </ErrorBoundary>
    ),
  },
  {
    path: "/featured",
    element: (
      <ErrorBoundary>
        <Featured />
      </ErrorBoundary>
    ),
  },
  {
    path: "/comics",
    element: (
      <ErrorBoundary>
        <ComicsPage />
      </ErrorBoundary>
    ),
  },
  {
    path: "*",
    element: (
      <ErrorBoundary>
        <NotFound />
      </ErrorBoundary>
    ),
  },
]);

export default routes;
