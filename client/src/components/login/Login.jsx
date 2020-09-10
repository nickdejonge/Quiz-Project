import React, { Component } from 'react';
import { MDBBtn } from 'mdbreact';
import Form from 'react-bootstrap/Form';
import styles from './Login.module.css';
import { withRouter } from 'react-router';
import jwt from 'jwt-decode';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  }
  async handleSubmit(event) {
    event.preventDefault();
    const response = await fetch('/api/employers/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        passphrase: this.state.password,
      }),
    });
    const body = await response.json();
    if (body.error) {
      this.setState({ error: body.error });
    } else {
      const token = jwt(body.token);
      localStorage.setItem('jwt', body.token);
      localStorage.setItem('name', token.user.name);
      localStorage.setItem('id', token.user.id);
      const url = 'employers/' + token.user.id + '/quizzes';
      this.props.history.push(url);
    }
  }

  render() {
    return (
      <div className={styles.parentContainer}>
        <div className={styles.loginContainer}>
          <Form onSubmit={this.handleSubmit}>
            <p className='h5 text-center mb-4'>Login</p>

            <Form.Group controlId='formBasicEmail'>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type='email'
                name='email'
                value={this.state.email}
                onChange={this.handleChange}
                placeholder='Enter email'
                required
              />
            </Form.Group>

            <Form.Group controlId='formBasicPassword'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                name='password'
                value={this.state.password}
                onChange={this.handleChange}
                placeholder='Password'
                required
              />
            </Form.Group>
            {this.state.error && (
              <h6 class='text-danger text-center'>Error: {this.state.error}</h6>
            )}
            <Form.Group>
              <div className='text-center'>
                <MDBBtn color='indigo' type='submit'>
                  Login
                </MDBBtn>
              </div>
            </Form.Group>
          </Form>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
