import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';

export function Profile() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userChange'));
    navigate('/login');
  };

  const getInitials = (email) => {
    if (!email) return '?';
    return email.charAt(0).toUpperCase();
  };

  const getAvatarColor = (email) => {
    if (!email) return '#1a73e8';
    const colors = ['#1a73e8', '#e37400', '#0d652d', '#c5221f', '#9334e6', '#188038'];
    const index = email.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (!user) return null;

  return (
    <div className={styles.profileContainer} ref={dropdownRef}>
      <button
        className={styles.avatarButton}
        onClick={() => setIsOpen(!isOpen)}
        style={{ backgroundColor: getAvatarColor(user.email) }}
        aria-label="Conta do Google"
      >
        {getInitials(user.email)}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <div
              className={styles.dropdownAvatar}
              style={{ backgroundColor: getAvatarColor(user.email) }}
            >
              {getInitials(user.email)}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user.email}</div>
              <div className={styles.userEmail}>{user.email}</div>
            </div>
          </div>

          <div className={styles.dropdownDivider}></div>

          <button className={styles.dropdownItem} onClick={handleLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            Sair
          </button>
        </div>
      )}
    </div>
  );
}