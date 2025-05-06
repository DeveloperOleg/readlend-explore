
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

// Pages
import Index from "./pages/Index";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import SavedBooks from "./pages/SavedBooks";
import TopReads from "./pages/TopReads";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Achievements from "./pages/Achievements";
import BookReader from "./pages/BookReader";

// Layouts
import Layout from "./components/Layout";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/" element={<Layout />}>
            <Route path="home" element={<Home />} />
            <Route path="profile/:username?" element={<Profile />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="saved" element={<SavedBooks />} />
            <Route path="top-reads" element={<TopReads />} />
            <Route path="search" element={<Search />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="book/:bookId" element={<BookReader />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
