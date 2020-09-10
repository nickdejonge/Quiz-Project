import React, { Component } from 'react';
import { MDBBtn } from 'mdbreact';
import Form from 'react-bootstrap/Form';
import styles from './Signup.module.css';
import { withRouter } from 'react-router';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      info: null,
      error: null,
      isSubmitted: false,
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
    const response = await fetch('/api/employers/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.name,
        email: this.state.email,
        passphrase: this.state.password,
      }),
    });
    const body = await response.json();
    this.setState({ isSubmitted: true });
    if (body.error) {
      this.setState({ error: body.error });
    } else {
      const info = { name: this.state.name, email: this.state.email };
      this.setState({ info: info });
    }
    if (!this.state.error) {
      localStorage.setItem('name', this.state.name);
      localStorage.setItem('email', this.state.email);
      this.props.history.push('/employers/info');
    }
  }

  render() {
    return (
      <div className={styles.parentContainer}>
        <div className={styles.signupContainer}>
          <Form onSubmit={this.handleSubmit}>
            <p className='h5 text-center mb-4'>Sign up</p>
            <Form.Group controlId='formBasicName'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                name='name'
                value={this.state.name}
                onChange={this.handleChange}
                placeholder='Enter name'
                required
              />
            </Form.Group>
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
              {/* <Form.Control.Feedback type='invalid'>
              {error.email}
            </Form.Control.Feedback> */}
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
                  Signup
                </MDBBtn>
              </div>
            </Form.Group>
          </Form>
        </div>
      </div>
    );
  }
}

export default withRouter(Signup);
