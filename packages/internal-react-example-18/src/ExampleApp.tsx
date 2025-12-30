import React from 'react';
// Using namespace import to work around rolldown JSX transformation bug
// See: https://github.com/rolldown/rolldown - affects named imports used as JSX element names
import * as ReactRouter from 'react-router-dom';

import styled from '@emotion/styled';

export interface ExampleToc {
  label: string;
  path: string;
  ui: React.ReactNode;
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
  const location = ReactRouter.useLocation();
  const title = tocs.find(example => example.path === location.pathname)?.label || 'Home';

  return (
    <Container>
      <Nav>
        <ul>
          {tocs.map(example => (
            <li key={example.path}>
              <ReactRouter.Link to={example.path}>{example.label}</ReactRouter.Link>
            </li>
          ))}
        </ul>
      </Nav>
      <Content>
        <h1>{title}</h1>
        <ReactRouter.Outlet />
      </Content>
    </Container>
  );
};

export interface AppProps extends LayoutProps {
  home: React.ComponentType;
}

export const ExampleApp: React.FC<AppProps> = ({ tocs, home }) => {
  return (
    <ReactRouter.Routes>
      <ReactRouter.Route path='/' element={<Layout tocs={tocs} />}>
        <ReactRouter.Route index element={React.createElement(home)} />
        {tocs.map(example => (
          <ReactRouter.Route
            key={example.path}
            path={example.path}
            // @ts-ignore
            element={example.ui}
          />
        ))}
      </ReactRouter.Route>
    </ReactRouter.Routes>
  );
};
