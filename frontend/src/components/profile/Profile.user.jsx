import React from 'react';
import { useHistory } from 'react-router-dom';

export function Profile() {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove o usuário do localStorage
    history.push('/login'); // Redireciona para a página de login
  };

  return (
    <div>
      <h1>Perfil do Usuário</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}