import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';

const drawerWidth = 240;
const navItems = [
  { text: 'Inicio', path: '/quoter/dashboard' },
  // { text: 'Nuestro Seguro', path: '/nuestro-seguro' },
  // { text: 'Transparencias', path: '/transparencias' },
  // { text: 'Nuestra Historia', path: '/nuestra-historia' },
  // { text: 'Noticias', path: '/noticias' },
  // { text: 'Contacto', path: '/contacto' },
  // { text: 'Accionista', path: '/accionista' },
];

const navItemsMob = [
  { text: 'Inicio', path: '/quoter/dashboard' },
  // { text: 'Nuestro Seguro', path: '/nuestro-seguro' },
  // { text: 'Transparencias', path: '/transparencias' },
  // { text: 'Nuestra Historia', path: '/nuestra-historia' },
  // { text: 'Login', path: '/login' },
  // { text: 'Registrar', path: '/Register' },
];

const settings = [
  { text: 'Login', path: '/login' },
  { text: 'Registrar', path: '/Register' },
  // { text: 'Dashboard', path: '/brocker/personalForm' },
  // { text: 'Logout', path: '/nuestra-historia' },
];

function Header(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        La Union S.A.
      </Typography>
      <Divider />
      <List>
        {navItemsMob.map((item) => (
          <ListItem key={item.text} disablePadding>
            <Link to={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item.text} />
            </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex', height: '100px' }}>
      <CssBaseline />
      <AppBar component="nav" >
        <Toolbar sx={{ backgroundColor: '#fff' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Link to='/quoter/dashboard' style={{ textDecoration: 'none', color: 'inherit' }}>
          <img src={process.env.PUBLIC_URL + '/assets/images/LogoSLU.jpg'} alt="Icono" style={{ height: '100px' }} />
          </Link>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item.text} sx={{ color: '#00a99e', fontSize: '12px' }}>
                <Link to={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {item.text}
                </Link>
              </Button>
            ))}
            <Tooltip title="Open settings">
              <Button key="users" onClick={handleOpenUserMenu} onMouseEnter={handleOpenUserMenu} sx={{ color: '#00a99e', fontSize: '12px', cursor: 'pointer' }}>
                Usuario
              </Button>
            </Tooltip>
            <Menu onMouseLeave={handleCloseUserMenu}
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.text} onClick={handleCloseUserMenu}>
                    <Button key={setting.text} sx={{ color: '#00a99e', fontSize: '12px' }}>
                      <Link to={setting.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {setting.text}
                      </Link>
                    </Button>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

Header.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};
export default Header;