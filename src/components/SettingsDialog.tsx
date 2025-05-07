
// This file is completely deprecated as settings functionality is now handled by dedicated pages
// File kept for reference purposes only
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SettingsDialog: React.FC = () => {
  const navigate = useNavigate();
  
  // Redirect to the settings page
  React.useEffect(() => {
    navigate('/settings');
  }, [navigate]);
  
  return null;
};

export default SettingsDialog;
