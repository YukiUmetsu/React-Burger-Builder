import React from 'react';
import classes from './Toolbar.module.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../Sidedrawer/DrawerToggle/DrawerToggle';

const toolbar = (props) => {
    return (
        <header className={classes.Toolbar}>
            <DrawerToggle clicked={props.drawerToggleClicked}/>
            <div className={classes.LogoBox}>
                <Logo />
            </div>
            <nav className={classes.DesktopOnly}>
               <NavigationItems isAuthenticated={props.isAuth}/>
            </nav>
        </header>
    );
};

export default toolbar