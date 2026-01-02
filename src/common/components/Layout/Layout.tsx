import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export const Layout = () => {
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    // Настройка кнопки "Назад" в Telegram
    const tg = window.Telegram?.WebApp;
    if (tg?.BackButton) {
      tg.BackButton.onClick(() => {
        navigate(-1);
      });
    }
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: window.Telegram?.WebApp?.themeParams?.bg_color || '#ffffff',
        color: window.Telegram?.WebApp?.themeParams?.text_color || '#000000',
      }}
    >
      <nav
        style={{
          padding: '1rem',
          background: window.Telegram?.WebApp?.themeParams?.button_color || '#3390ec',
          color: window.Telegram?.WebApp?.themeParams?.button_text_color || '#ffffff',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <Link to='/' style={{ marginRight: '1rem', color: 'inherit' }}>
            Главная
          </Link>
          <Link to='/features' style={{ marginRight: '1rem', color: 'inherit' }}>
            Возможности
          </Link>
          {isPremium && (
            <Link to='/premium' style={{ marginRight: '1rem', color: 'inherit' }}>
              Premium
            </Link>
          )}
        </div>
        <div>
          {user && (
            <span>
              {user.firstName} {isPremium ? '⭐' : ''}
            </span>
          )}
        </div>
      </nav>
      <Outlet />
    </div>
  );
};
