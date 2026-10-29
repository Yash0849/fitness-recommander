import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { profileAPI } from '../lib/api';
import type { UserProfile } from '../lib/localStorage';
import { useTheme } from '../hooks/useTheme';
import Navbar from './dashboard/Navbar';
import Sidebar from './dashboard/Sidebar';

export default function Navigation() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const syncProfile = () => {
      if (user) {
        const profile = profileAPI.get(user.id);
        setUserProfile(profile || null);
      } else {
        setUserProfile(null);
      }
    };

    syncProfile();
    window.addEventListener('profile-updated', syncProfile);

    return () => window.removeEventListener('profile-updated', syncProfile);
  }, [user]);

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <>
      <Sidebar />
      <div className="xl:pl-[292px]">
        <Navbar
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onSignOut={handleSignOut}
          userLabel={user.email}
          userProfile={userProfile}
        />
      </div>
    </>
  );
}
