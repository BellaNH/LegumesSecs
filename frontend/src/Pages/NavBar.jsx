import * as React from 'react';
import { useContext, useState, useEffect } from "react";
import { useGlobalContext } from '../context';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import { Link, useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InfoIcon from '@mui/icons-material/Info';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Button, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FaUserPlus, FaUsers } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FaSitemap } from "react-icons/fa";


export default function NavBar({ drawerWidth }) {
    const location = useLocation();
    const path = location.pathname;
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const { user, logout } = useGlobalContext();
    const [search, setSearch] = React.useState("");

    // ✅ Message pour l'admin
    const isAdminBanner = user && user.role === 'admin' && (
      <p style={{ color: 'green', fontWeight: 'bold', textAlign: 'center', marginTop: '10px',fontSize: '30px', }}>
        
      </p>
    );

    const bienvenueMessage = user && (
        <Typography
          variant="h4"
          align="center"
          sx={{
            mt: 3,
            color: 'green', // ✅ Couleur personnalisable
            fontWeight: 'bold', // optionnel pour le rendre plus visible
          }}
        >
          👋 Bienvenue {user.role || "utilisateur"}
        </Typography>
      );
      

    const changeOpenStatus = () => {
        setOpen(!open);
    };

    const myDrawer = (
        <div>
            <div style={{ textAlign: 'left', padding: '3px' }}>
            </div>

            <Box sx={{ overflow: 'auto', paddingTop: "15px"  }}>
                <List>
                    <ListItem button component={Link} to="/Admin-Create-User">
                        <FaUserPlus size={30} style={{ color: "green", marginRight: "8px" }} />
                        <ListItemText primary="Nouveau compte" />
                    </ListItem>

                    <ListItem button component={Link} to="/supprimer-utilisateur">
                        <FaClipboardList size={20} style={{ color: "purple", marginRight: "8px" }} />
                        <ListItemText primary="Liste & actions" />
                    </ListItem>
                    <ListItem button component={Link} to="/admin/wilayas">
                        <FaMapMarkedAlt size={20} style={{ color: "teal", marginRight: "8px" }} />
                        <ListItemText primary="Wilayas" />
                    </ListItem>
                     
                    <ListItem button component={Link} to="/subdivisions">
                        <FaSitemap size={20} style={{ color: "darkorange", marginRight: "8px" }} />
                        <ListItemText primary="Subdivisions" />
                    </ListItem>
                </List>
            </Box>

            {user && (
                <Box sx={{ position: 'absolute', bottom: 2, left: 0, right: 0, padding: 2 }}>
                    <Button 
                        fullWidth
                        variant="contained"
                        color="error" 
                        onClick={logout}
                    >
                        Déconnexion
                    </Button>
                </Box>
            )}
        </div>
    );

    return (
        <Box sx={{ width: '100%', overflowX: 'hidden' }}>
            <CssBaseline />
            
            {isAdminBanner}
            {bienvenueMessage}

            <AppBar position="fixed" sx={{ backgroundColor: "white", marginLeft: drawerWidth, width: `calc(100% - ${drawerWidth}px)` }}>
                {/* Toolbar ici si nécessaire */}
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                {myDrawer}
            </Drawer>
        </Box>
    );
}


