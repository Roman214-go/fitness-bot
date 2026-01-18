import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useEffect } from 'react';

import { FiAward } from 'react-icons/fi';
import { GoPerson } from 'react-icons/go';
import { FiHome } from 'react-icons/fi';
import { MdCalendarToday } from 'react-icons/md';
import { IoChatbubblesSharp } from 'react-icons/io5';

import styles from './Layout.module.scss';

export const Layout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg?.BackButton) {
      tg.BackButton.onClick(() => navigate(-1));
    }
  }, [navigate]);

  return (
    <div className={styles.container}>
      <main className={styles.content}>
        <Outlet />
      </main>

      <nav className={styles.nav}>
        <NavLink to='/' className={({ isActive }) => (isActive ? styles.active : '')}>
          <FiHome />
          <span className={styles.label}>Главная</span>
        </NavLink>

        <NavLink to='/calendar' className={({ isActive }) => (isActive ? styles.active : '')}>
          <MdCalendarToday /> <span className={styles.label}>Календарь</span>
        </NavLink>

        <NavLink to='/leaders' className={({ isActive }) => (isActive ? styles.active : '')}>
          <FiAward />
          <span className={styles.label}>Лидеры</span>
        </NavLink>

        <NavLink to='/chat' className={({ isActive }) => (isActive ? styles.active : '')}>
          <IoChatbubblesSharp />
          <span className={styles.label}>Чат</span>
        </NavLink>

        <NavLink to='/profile' className={({ isActive }) => (isActive ? styles.active : '')}>
          <GoPerson />
          <span className={styles.label}>Профиль</span>
        </NavLink>
      </nav>
    </div>
  );
};
