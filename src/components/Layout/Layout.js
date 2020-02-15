import React from 'react';
import Aux from "../../hoc/Aux";
import layoutClasses from './Layout.module.css';
import Toolbar from "../Navigation/Toolbar/Toolbar";

const layout = (props) => {
    return (
        <Aux>
            <Toolbar/>
            <main className={layoutClasses.Content}>
                {props.children}
            </main>
        </Aux>
    );
};

export default layout