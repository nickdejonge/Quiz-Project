import React, { Component } from 'react';
import { MDBBtn } from 'mdbreact';
// import styles from './Signup.module.css';

class UserInfo extends Component {
  render() {
    const name = localStorage.getItem('name');
    localStorage.removeItem('name');
    const email = localStorage.getItem('email');
    localStorage.removeItem('email');
    return (
      <div class='container-fluid m-0 p-0'>
        <h2 class='h4 text-center d-block font-weight-bold text-uppercase'>
          User Info
        </h2>
        <span class='bottom-line d-block mx-auto mt-3 mb-4 text-center'></span>
        <div class='row my-2 mx-auto '>
          <div class='col-6 text-right border-right border-dark'>Name:</div>
          <div class='col-6 pl-4'>{name}</div>
        </div>
        <div class='row my-2 mx-auto '>
          <div class='col-6 text-right border-right border-dark'>Username:</div>
          <div class='col-6 pl-4'>{email}</div>
        </div>
        <div className='text-center'>
          <MDBBtn color='indigo' href='/login'>
            Login
          </MDBBtn>
        </div>
      </div>
    );
  }
}
export default UserInfo;
