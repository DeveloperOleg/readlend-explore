
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { t, language } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          {language === 'ru' ? 'Ой! Страница не найдена' : 'Oops! Page not found'}
        </p>
        <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
          {language === 'ru' ? 'Вернуться на главную' : 'Return to Home'}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
