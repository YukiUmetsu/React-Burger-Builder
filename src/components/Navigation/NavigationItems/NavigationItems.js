import React from 'react';
import classes from "./NavigationItems.module.css";
import NavigationItem from './NavigationItem/NavigationItem';


const navigationItems = (props) => {
    let authItem = props.isAuthenticated ?
        <NavigationItem link="/logout" >Logout</NavigationItem> :
        <NavigationItem link="/auth" >Authenticate</NavigationItem>;

    let orderItem = props.isAuthenticated ? <NavigationItem link="/orders" >Orders</NavigationItem> : null;

    return (
        <ul className={classes.NavigationItems}>
            <NavigationItem link="/" exact>Burger Builder</NavigationItem>
            {orderItem}
            {authItem}
        </ul>
    );
};

export default navigationItems