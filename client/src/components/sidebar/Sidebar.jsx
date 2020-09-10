import React, { Component } from 'react';
import {
  MDBContainer,
  MDBNavbarNav,
  MDBNavLink,
  MDBNavItem,
  MDBIcon,
} from 'mdbreact';
import styles from './Sidebar.module.css';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }
  handleLogout() {
    localStorage.removeItem('id');
    localStorage.removeItem('name');
  }
  render() {
    const id = localStorage.getItem('id');
    return (
      <div className={styles.sidebar}>
        <div class='card'>
          <MDBContainer fluid className={styles.userContainer}>
            <h4>
              <strong>{localStorage.getItem('name')}</strong>
            </h4>
          </MDBContainer>
        </div>
        <div class='card'>
          <MDBContainer fluid className={styles.sideContainer}>
            <MDBNavbarNav>
              <MDBNavItem>
                <MDBNavLink
                  to={{ pathname: `/employers/${id}/profile` }}
                  className={styles.linkColor}
                >
                  <MDBIcon icon='user' /> Profile
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink
                  to={{ pathname: `/employers/${id}/quizzes` }}
                  className={styles.linkColor}
                >
                  <MDBIcon icon='file' /> Quizzes
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink
                  to={{ pathname: `/employers/${id}/results` }}
                  className={styles.linkColor}
                >
                  <MDBIcon icon='poll' /> Results
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink
                  to='/login'
                  className={styles.linkColor}
                  onClick={this.handleLogout}
                >
                  <MDBIcon icon='sign-out-alt' /> Logout
                </MDBNavLink>
              </MDBNavItem>
            </MDBNavbarNav>
          </MDBContainer>
        </div>
      </div>
    );
  }
}

export default Sidebar;
