import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import Icon from '@mdi/react';
import { mdiMenu, mdiBackburger, mdiGithubFace, mdiBrightness4 } from '@mdi/js';
import Transition from 'components/Transition';
import Title from 'components/Title';
import HeaderText from 'components/Header/HeaderText';

export const getPath = open => (open ? mdiBackburger : mdiMenu);

export default function Header({ open, toggleDrawer, togglePrefersColorScheme }) {
  return (
    <Transition in component={Fade} delay={337} timeout={775}>
      <AppBar position="sticky" color="primary" elevation={2}>
        <Toolbar>
          <Hidden lgUp>
            <IconButton edge="start" aria-label="open navigation drawer" onClick={toggleDrawer}>
              <Hidden smUp>
                <Icon path={getPath(open)} size={1} color="currentColor" />
              </Hidden>
              <Hidden xsDown>
                <Icon path={getPath(open)} size={1.125} color="currentColor" />
              </Hidden>
            </IconButton>
          </Hidden>
          <Hidden smUp>
            <Title variant="h6" color="textPrimary">
              <HeaderText />
            </Title>
          </Hidden>
          <Hidden xsDown>
            <Title variant="h5" color="textPrimary">
              <HeaderText />
            </Title>
          </Hidden>
          <Hidden xsDown>
            <Tooltip title="Contributions to open source" placement="bottom">
              <IconButton href="https://github.com/typekev" target="_blank">
                <Icon path={mdiGithubFace} size={1.125} color="currentColor" />
              </IconButton>
            </Tooltip>
          </Hidden>
          <Tooltip title="Toggle color scheme" placement="bottom">
            <IconButton onClick={togglePrefersColorScheme}>
              <Icon path={mdiBrightness4} size={1.125} color="currentColor" />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </Transition>
  );
}

Header.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  togglePrefersColorScheme: PropTypes.func.isRequired,
};
