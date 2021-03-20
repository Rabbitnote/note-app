import React,{Fragment} from 'react';
import styles from '../../styles/Nav.module.css';
import Head from 'next/head';
const Nav = () =>{
    return (<Fragment>
         <Head>
                <title>Note App</title>
            </Head>

            <div className={styles.nav}>
                <div className={styles.container}>
                    <div className={styles.title}>Mr.Rabbit</div>
                    <div>
                        <button className={styles.button}>Hello</button>
                    </div>
                </div>
            </div>
            <div>
              </div>
        </Fragment>);
}
export default Nav;