
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
import ComicReader from "./pages/ComicReader";
import Comics from "./pages/Comics";
import MangaReader from "./pages/MangaReader";
import FanfictionReader from "./pages/FanfictionReader";

// Settings Pages
import AccountSettings from "./pages/settings/AccountSettings";
import SecuritySettings from "./pages/settings/SecuritySettings";
import AppearanceSettings from "./pages/settings/AppearanceSettings";
import LanguageSettings from "./pages/settings/LanguageSettings";
import StorageSettings from "./pages/settings/StorageSettings";
import PrivacySettings from "./pages/settings/PrivacySettings";
import BlockedUsers from "./pages/settings/BlockedUsers";
import NotificationSettings from "./pages/settings/NotificationSettings";
import AboutApp from "./pages/settings/AboutApp";

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
            <Route path="settings/account" element={<AccountSettings />} />
            <Route path="settings/security" element={<SecuritySettings />} />
            <Route path="settings/appearance" element={<AppearanceSettings />} />
            <Route path="settings/language" element={<LanguageSettings />} />
            <Route path="settings/storage" element={<StorageSettings />} />
            <Route path="settings/privacy" element={<PrivacySettings />} />
            <Route path="settings/blocked" element={<BlockedUsers />} />
            <Route path="settings/notifications" element={<NotificationSettings />} />
            <Route path="settings/about" element={<AboutApp />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="book/:bookId" element={<BookReader />} />
            <Route path="comic/:comicId" element={<ComicReader />} />
            <Route path="comics" element={<Comics />} />
            <Route path="manga/:mangaId" element={<MangaReader />} />
            <Route path="fanfiction/:fanfictionId" element={<FanfictionReader />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
