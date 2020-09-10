import React, { Component } from 'react';
// import styles from './Commons.module.css';

class Error extends Component {
  render() {
    return (
      <div class='container-fluid m-0 p-0'>
        <div class='d-flex justify-content-center align-items-center' id='main'>
          <h1 class='mr-3 pr-3 align-top border-right inline-block align-content-center'>
            404
          </h1>
          <div class='inline-block align-middle'>
            <h2 class='font-weight-normal lead' id='desc'>
              The page you requested was not found.
            </h2>
          </div>
        </div>
      </div>
    );
  }
}
export default Error;
