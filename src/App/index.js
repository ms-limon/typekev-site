import React, { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import styled from 'styled-components';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import LinearProgress from '@material-ui/core/LinearProgress';
import getMuiTheme from 'utils/getMuiTheme';
import Page from 'templates/Page';
import useDrawer from 'hooks/useDrawer';
import Header from 'components/Header';
import Copyright from 'components/Copyright';
import Drawer from 'components/Drawer';
import Root from 'App/Root';
import './index.css';

export const Explore = React.lazy(() => import('routes/Explore'));
export const Discover = React.lazy(() => import('routes/Discover'));
export const Work = React.lazy(() => import('routes/Work'));
export const Blog = React.lazy(() => import('routes/Blog'));
export const Contact = React.lazy(() => import('routes/Contact'));

const TYPEKEV_SITE_PREFERS_COLOR_SCHEME = 'typekev-site-prefers-color-scheme';

const PREFERS_COLOR_SCHEME =
  window.matchMedia('(prefers-color-scheme: dark)').matches === true ? 'DARK' : 'LIGHT';

const togglePrefersColorScheme = (SELECTED_COLOR_SCHEME, setCookie) => () =>
  setCookie(
    TYPEKEV_SITE_PREFERS_COLOR_SCHEME,
    SELECTED_COLOR_SCHEME === 'DARK' ? 'LIGHT' : 'DARK',
    {
      path: '/',
    },
  );

export const Main = styled.div`
  flex: 1 1 auto;
  display: flex;
`;

export default function App() {
  const [open, toggleDrawer] = useDrawer();
  const [cookies, setCookie] = useCookies([TYPEKEV_SITE_PREFERS_COLOR_SCHEME]);

  const SELECTED_COLOR_SCHEME = cookies[TYPEKEV_SITE_PREFERS_COLOR_SCHEME] || PREFERS_COLOR_SCHEME;

  const theme = getMuiTheme(SELECTED_COLOR_SCHEME);

  console.log(window.matchMedia('(prefers-color-scheme: dark)'));

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Drawer open={open} toggleDrawer={toggleDrawer} />
        <Root open={open}>
          <Header
            open={open}
            toggleDrawer={toggleDrawer}
            togglePrefersColorScheme={togglePrefersColorScheme(SELECTED_COLOR_SCHEME, setCookie)}
          />
          <Main>
            <Page open={open}>
              <Suspense fallback={<LinearProgress color="secondary" />}>
                <Switch>
                  <Route exact path="/" component={Explore} />
                  <Route path="/discover" component={Discover} />
                  <Route path="/work" component={Work} />
                  <Route path="/blog" component={Blog} />
                  <Route path="/contact" component={Contact} />
                  <Redirect to="/" />
                </Switch>
              </Suspense>
            </Page>
          </Main>
          <Copyright />
        </Root>
      </Router>
    </MuiThemeProvider>
  );
}
