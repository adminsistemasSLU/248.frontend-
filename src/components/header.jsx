import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import { Collapse } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useAuth } from "../services/AuthProvider";

const drawerWidth = 240;

function Header(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [open, setOpen] = React.useState({});
  const { user, isLoading, menu, signout } = useAuth();

  const settings = user
    ? [
        {
          descripcion: "Cerrar sesión",
          url: "/login",
          action: () => signout("api/Logout", "POST"),
        },
      ] // Agrega la acción de cerrar sesión aquí si la necesitas
    : [
        { descripcion: "Login", url: "/login" },
        { descripcion: "Registrar", url: "/register" },
      ];

  const handleClick = (text) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [text]: !prevOpen[text],
    }));
  };
  let menu1 = null;
  if (!isLoading && menu != null) {
    //menu1 = JSON.parse(menu);
  }

  const drawerRef = useRef();
  const navItemsMob = menu1;
  const navItems = menu1;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && drawerRef.current.contains(event.target)) {
        // Si el menú está abierto y el clic fue fuera del menú, cierra el menú
        if (mobileOpen) {
          handleDrawerToggle();
        }
      }
    };

    // Agrega el escuchador de eventos al document
    document.addEventListener("mousedown", handleClickOutside);

    // Función de limpieza para remover el escuchador
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileOpen]);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const [anchorEl, setAnchorEl] = React.useState(null); // Para submenús
  const [anchorElUser, setAnchorElUser] = React.useState(null); // Para menú de configuración

  const handleMenuOpen = (event, item) => {
    setOpen({ ...open, [item]: true });
    setAnchorEl(event.currentTarget); // Cambio aquí
  };

  const handleMenuClose = () => {
    setOpen({});
    setAnchorEl(null);
    setAnchorElUser(null); // Asegúrate de cerrar también el menú de configuración si está abierto
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    setAnchorEl(null); // Cierra también los submenús si están abiertos
  };

  const drawer = (
    <Box ref={drawerRef} sx={{ textAlign: "center" }}>
      <List>
        {navItemsMob?.map((item, index) => (
          <React.Fragment key={"navItems" + index}>
            <ListItem disablePadding>
              <ListItemButton
                key={"navItems" + index}
                sx={{
                  textDecoration: "none",
                  color: "#00a99e",
                  fontSize: "12px",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onClick={() => {
                  handleDrawerToggle(); // Cerrar el Drawer al seleccionar un elemento
                  if (item.Submenu) {
                    handleClick(item.descripcion); // Manejar submenús si existen
                  }
                }}
              >
                <ListItemText primary={item.descripcion} />
                {item.Submenu &&
                  (open[item.descripcion] ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </ListItem>
            {item.Submenu && (
              <Collapse
                in={open[item.descripcion]}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {item.Submenu.map((childItem, index) => (
                    <ListItemButton
                      key={index}
                      sx={{ pl: 4 }}
                      onClick={() => {
                        handleDrawerToggle(); // Cierra el Drawer también aquí
                      }}
                    >
                      <Link
                        to={childItem.path}
                        style={{
                          textDecoration: "none",
                          color: "#00a99e",
                          fontSize: "12px",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <ListItemText primary={childItem.descripcion} />
                      </Link>
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              textDecoration: "none",
              color: "#00a99e",
              fontSize: "12px",
              cursor: "pointer",
              textAlign: "left",
            }}
            onClick={() => {
              handleDrawerToggle(); // Cerrar el Drawer al seleccionar un elemento
              handleClick("UsuarioSettings"); // Usar una key específica para manejar la expansión
            }}
          >
            <ListItemText primary="Usuario" />
            <ExpandMore />
          </ListItemButton>
        </ListItem>
        <Collapse in={open["UsuarioSettings"]} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {settings.map((childItem, index) => (
              <ListItemButton
                key={index}
                sx={{ pl: 4 }}
                onClick={() => {
                  if (childItem.action) {
                    childItem.action(); // Ejecuta la acción, como signout
                  }
                  handleDrawerToggle(); // Cierra el Drawer también aquí
                }}
              >
                <Link
                  to={childItem.path}
                  style={{
                    textDecoration: "none",
                    color: "#00a99e",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  <ListItemText primary={childItem.descripcion} />
                </Link>
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex", height: "100px" }}>
      <AppBar component="nav">
        <Toolbar sx={{ backgroundColor: "#02545C" }}>
          {/* Botón para el menú móvil */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { xs: "block", sm: "none" },
              color: "#00a99e",
            }}
          >
            <MenuIcon />
          </IconButton>
          {/* Logo o título de la aplicación */}
          <Link
            to="/quoter/dashboard"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img
              src={process.env.PUBLIC_URL + "/assets/images/LogoUnionBlanco.png"}
              alt="Icono"
              style={{ height: "60px", paddingTop: "10px", paddingBottom: "10px" }}
            />
          </Link>
          {/* Menú de escritorio */}
          <Box sx={{ display: { xs: "none", sm: "block", textAlign: 'right' }, flexGrow: 1 }}>
            {menu && (
              <Button
                key={"-1"}
                sx={{ color: "white", fontSize: "12px", marginRight: 2 }}
                href={"/quoter/Pymes/MyQuotes"}
              >
                Mis Cotizaciones
              </Button>
            )}

            {navItems?.map((item, index) => (
              <React.Fragment key={index}>
                <Button
                  key={index}
                  sx={{ color: "#00a99e", fontSize: "12px", marginRight: 2 }}
                  onClick={(event) => handleMenuOpen(event, item.descripcion)}
                >
                  {item.descripcion}
                </Button>
                <Menu
                  id={`menu-${item.descripcion}`}
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl && open[item.descripcion])}
                  onClose={handleMenuClose}
                  MenuListProps={{
                    "aria-labelledby": `button-${item.descripcion}`,
                  }}
                >
                  {item.Submenu?.map((submenuItem, index) => (
                    <MenuItem key={"SubMenu" + index} onClick={handleMenuClose}>
                      <Link
                        to={submenuItem.path}
                        style={{
                          color: "#00a99e",
                          fontSize: "12px",
                          cursor: "pointer",
                          textDecoration: "none",
                        }}
                      >
                        {submenuItem.descripcion}
                      </Link>
                    </MenuItem>
                  ))}
                </Menu>
              </React.Fragment>
            ))}
            {/* Configuración de usuario y otros botones */}
            <Tooltip title="Open settings">
              <Button
                onClick={handleOpenUserMenu}
                sx={{ color: "white", fontSize: "12px", cursor: "pointer" }}
              >
                Usuario
              </Button>
            </Tooltip>
            <Menu
              onMouseLeave={handleCloseUserMenu}
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    if (setting.action) {
                      setting.action(); // Ejecuta la acción, como signout
                    }
                    handleCloseUserMenu();
                  }}
                >
                  <Link
                    key={index}
                    to={setting.url}
                    style={{ textDecoration: "none", color: "#00a99e" }}
                  >
                    <Button
                      key={index}
                      sx={{ color: "#00a99e", fontSize: "12px" }}
                    >
                      {setting.descripcion}
                    </Button>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        {/* Drawer para el menú móvil */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
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
