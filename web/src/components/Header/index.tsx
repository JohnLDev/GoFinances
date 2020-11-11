import React from 'react';

import { Link } from 'react-router-dom';

import { Container } from './styles';

import Logo from '../../assets/logo.svg';

interface HeaderProps {
  size?: 'small' | 'large';
  page?: 'listagem' | 'cadastro' | 'importar';
}

const Header: React.FC<HeaderProps> = ({
  size = 'large',
  page = 'listagem',
}: HeaderProps) => (
  <Container size={size} page={page}>
    <header>
      <img src={Logo} alt="GoFinances" />
      <nav>
        <>
          <Link to="/">
            Listar
            <div className="list" />
          </Link>
          <Link to="/registry">
            Registrar
            <div className="registry" />
          </Link>
          <Link to="/import">
            Importar
            <div className="import" />
          </Link>
        </>
      </nav>
    </header>
  </Container>
);

export default Header;
