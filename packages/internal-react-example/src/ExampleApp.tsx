import React, { JSX } from 'react';
import { Link, Outlet, Route, Routes, useLocation } from 'react-router-dom';

import styled from '@emotion/styled';

export interface ExampleToc {
  label: string;
  path: string;
  ui: React.ReactNode | JSX.Element;
}

interface LayoutProps {
  tocs: readonly ExampleToc[];
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const Nav = styled.nav`
  width: 200px;
  flex-grow: 0;
  flex-shrink: 0;
`;

const Content = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  padding: 0 2rem 2rem 1rem;
`;

export const Layout: React.FC<LayoutProps> = ({ tocs }) => {
  const location = useLocation();
  const title = tocs.find(example => example.path === location.pathname)?.label || 'Home';

  return (
    <Container>
      <Nav>
        <ul>
          {tocs.map(example => (
            <li key={example.path}>
              <Link to={example.path}>{example.label}</Link>
            </li>
          ))}
        </ul>
      </Nav>
      <Content>
        <h1>{title}</h1>
        <Outlet />
      </Content>
    </Container>
  );
};

export interface AppProps extends LayoutProps {
  home: React.ComponentType;
}

export const ExampleApp: React.FC<AppProps> = ({ tocs, home: Home }) => (
  <Routes>
    <Route path='/' element={<Layout tocs={tocs} />}>
      <Route index element={<Home />} />
      {tocs.map(example => (
        <Route key={example.path} path={example.path} element={example.ui} />
      ))}
    </Route>
  </Routes>
);
