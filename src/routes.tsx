
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
import Layout from "./components/Layout";
import ComicReader from '@/pages/ComicReader';

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Home /></Layout>,
  },
  {
    path: "/book/:bookId",
    element: <Layout><BookReader /></Layout>,
  },
  {
    path: "/comic/:comicId",
    element: <Layout><ComicReader /></Layout>,
  },
  {
    path: "/settings",
    element: <Layout><Settings /></Layout>,
  },
  {
    path: "/profile/:userId",
    element: <Layout><Profile /></Layout>,
  },
  {
    path: "/search",
    element: <Layout><Search /></Layout>,
  },
  {
    path: "/top-reads",
    element: <Layout><TopReads /></Layout>,
  },
  {
    path: "/recommendations",
    element: <Layout><Recommendations /></Layout>,
  },
  {
    path: "/featured",
    element: <Layout><Featured /></Layout>,
  },
  {
    path: "/comics",
    element: <Layout><ComicsPage /></Layout>,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
