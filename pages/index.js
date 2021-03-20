import React, { Fragment, useState } from 'react';

import styles from '../styles/MainPage.module.css';
import Nav from './components/Nav';
import SimonSays from './components/SimonSays';

export default function Home() {
    return (
        <Fragment>
            <Nav />
            <SimonSays/>

        </Fragment>
    );
}
