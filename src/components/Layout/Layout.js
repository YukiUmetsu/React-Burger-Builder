import React, {Component} from 'react';
import Aux from "../../hoc/Aux";
import layoutClasses from './Layout.module.css';
import Toolbar from "../Navigation/Toolbar/Toolbar";
import Sidedrawer from "../Navigation/Sidedrawer/Sidedrawer";

class Layout extends Component{
    state = {
        showSideDrawer: false
    };

    sideDrawerClosedHandler = () => {
        this.setState({showSideDrawer: false});
    };

    sideDrawerToggleHandler = () => {
        this.setState((previousState) => {
            return {showSideDrawer: !previousState.showSideDrawer};
        });
    };

    render (){
        return (
            <Aux>
                <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler}/>
                <Sidedrawer closed={this.sideDrawerClosedHandler} open={this.state.showSideDrawer}/>
                <main className={layoutClasses.Content}>
                    {this.props.children}
                </main>
            </Aux>
        );
    }
}

export default Layout