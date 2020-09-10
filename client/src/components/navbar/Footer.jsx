import React, { Component } from 'react';
import { MDBContainer, MDBFooter } from 'mdbreact';
import styles from './Navbar.module.css';

class Footer extends Component {
  render() {
    return (
      <MDBFooter color='indigo' class={styles.footer}>
        <div className='footer-copyright text-right py-3 navbar-fixed-bottom'>
          <MDBContainer fluid>
            &copy; {new Date().getFullYear()} Copyright: Team Quiz
          </MDBContainer>
        </div>
      </MDBFooter>
    );
  }
}

export default Footer;
