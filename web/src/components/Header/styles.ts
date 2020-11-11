import styled from 'styled-components';

interface ContainerProps {
  size?: 'small' | 'large';
  page?: 'listagem' | 'cadastro' | 'importar';
}

export const Container = styled.div<ContainerProps>`
  background: #5636d3;
  padding: 30px 0;

  header {
    width: 1120px;
    margin: 0 auto;
    padding: ${({ size }) => (size === 'small' ? '0 20px ' : '0 20px 150px')};
    display: flex;
    align-items: center;
    justify-content: space-between;

    nav {
      display: flex;
      a {
        color: #fff;
        text-decoration: none;
        font-size: 16px;
        transition: opacity 0.2s;
        .list {
          display: ${({ page }) => (page === 'listagem' ? 'flex' : 'none')};
        }

        .import {
          display: ${({ page }) => (page === 'importar' ? 'flex' : 'none')};
        }
        .registry {
          display: ${({ page }) => (page === 'cadastro' ? 'flex' : 'none')};
        }
        div {
          margin-top: 4px;
          width: 100%;
          height: 2px;
          background: #ff872c;
        }

        & + a {
          margin-left: 32px;
        }

        &:hover {
          opacity: 0.6;
        }
      }
    }
  }
`;
