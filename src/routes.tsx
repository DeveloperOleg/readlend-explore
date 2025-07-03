
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

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/book/:bookId",
    element: <BookReader />,
  },
  {
    path: "/comic/:comicId",
    element: <ComicReader />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/profile/:userId",
    element: <Profile />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/top-reads",
    element: <TopReads />,
  },
  {
    path: "/recommendations",
    element: <Recommendations />,
  },
  {
    path: "/featured",
    element: <Featured />,
  },
  {
    path: "/comics",
    element: <ComicsPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
