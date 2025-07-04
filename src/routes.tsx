
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
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
import Index from "./pages/Index";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <NotFound />
  },
  {
    path: "/home",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />
      }
    ]
  },
  {
    path: "/book/:bookId",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <BookReader />
      }
    ]
  },
  {
    path: "/comic/:comicId",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ComicReader />
      }
    ]
  },
  {
    path: "/settings",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Settings />
      }
    ]
  },
  {
    path: "/profile/:userId",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Profile />
      }
    ]
  },
  {
    path: "/search",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Search />
      }
    ]
  },
  {
    path: "/top-reads",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <TopReads />
      }
    ]
  },
  {
    path: "/recommendations",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Recommendations />
      }
    ]
  },
  {
    path: "/featured",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Featured />
      }
    ]
  },
  {
    path: "/comics",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ComicsPage />
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  },
]);

export default routes;
