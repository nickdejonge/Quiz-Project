import React, { Component } from 'react';
import { MDBBtn } from 'mdbreact';
import Form from 'react-bootstrap/Form';
import styles from './Candidate.module.css';
import { withRouter } from 'react-router';

class Candidate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      key: '',
      error: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const response = await fetch('/api/candidates/startquiz', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        key: this.state.key,
      }),
    });
    const body = await response.json();
    if (body.error) {
      this.setState({ error: body.error });
    } else {
      localStorage.setItem('candidateID', body.candidateID);
      localStorage.setItem('quizKey', body.key);
      localStorage.setItem('quizID', body.quizID);
      const url = `/candidates/${body.candidateID}/quizzes/${body.quizID}`;
      this.props.history.push(url);
    }
  }

  render() {
    return (
      <div className={styles.parentContainer}>
        <div className={styles.signupContainer}>
          <Form onSubmit={this.handleSubmit}>
            <p className='h5 text-center mb-4'>Start quiz</p>
            <Form.Group controlId='formBasicEmail'>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type='email'
                name='email'
                value={this.state.email}
                placeholder='Enter email'
                onChange={this.handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId='formBasicPassword'>
              <Form.Label>Key</Form.Label>
              <Form.Control
                type='text'
                name='key'
                value={this.state.key}
                placeholder='Enter quiz key'
                onChange={this.handleChange}
                required
              />
              {this.state.error && (
                <h6 class='text-danger text-center'>
                  Error: {this.state.error}
                </h6>
              )}
            </Form.Group>
            <div className='text-center'>
              <MDBBtn color='indigo' type='submit'>
                Start
              </MDBBtn>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default withRouter(Candidate);
