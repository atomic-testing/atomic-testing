import React from 'react';
import { Routes, Route, Outlet, Link, useLocation } from "react-router-dom";
import { tocs } from './directory';
import { Home } from './Home';
import styled from '@emotion/styled';

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
`;

export const Layout:React.FunctionComponent = () => {
  const location = useLocation();

  const title = tocs.find((example) => example.path === location.pathname)?.label || 'Home';

  return (
    <Container>
      <Nav>
        <ul>
          {
            tocs.map((example) => (
              <li key={example.path}>
                <Link to={example.path}>{example.label}</Link>
              </li>
            ))
          }
        </ul>
      </Nav>
      <Content>
        <h1>{title}</h1>
        <Outlet />
      </Content>
    </Container>
  )
}

export function App() {

  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {
            tocs.map((example) => (
              <Route key={example.path} path={example.path} element={example.ui} />
            ))
          }
        </Route>
      </Routes>
    </React.Fragment>
  );
}

