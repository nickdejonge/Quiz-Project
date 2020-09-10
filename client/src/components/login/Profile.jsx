import React, { Component } from 'react';
import { MDBBtn, MDBContainer, MDBRow, MDBCol } from 'mdbreact';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import styles from './Login.module.css';
import Sidebar from '../sidebar/Sidebar';
import authHeader from '../../services/auth-header';
import { withRouter } from 'react-router';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      error: null,
      id: localStorage.getItem('id'),
      header: authHeader() ? authHeader() : {},
      show: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.callGetUser()
      .then((res) => {
        this.setState({ name: res.name });
        this.setState({ email: res.email });
        this.setState({ password: res.password });
      })
      .catch((err) => this.setState({ error: err }));
  }
  callGetUser = async () => {
    const response = await fetch(`/api/employers/${this.state.id}`, {
      method: 'GET',
      headers: this.state.header,
    });
    const body = await response.json();
    if (body.error) {
      this.setState({ error: body.error });
    } else {
      return body;
    }
  };

  handleChange(event) {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  }
  async handleSubmit(event) {
    event.preventDefault();
    const response = await fetch(`/api/employers/${this.state.id}`, {
      method: 'PUT',
      headers: this.state.header,
      body: JSON.stringify({
        name: this.state.name,
        email: this.state.email,
        passphrase: this.state.password,
      }),
    });
    const body = await response.json();
    if (body.error) {
      this.setState({ error: body.error });
    } else {
      localStorage.setItem('name', this.state.name);
      window.location.reload(false);
    }
  }

  async handleDelete(event) {
    event.preventDefault();
    const response = await fetch(`/api/employers/${this.state.id}`, {
      method: 'DELETE',
      headers: this.state.header,
    });
    const body = await response.json();
    if (body.error) {
      this.setState({ error: body.error });
    } else {
      localStorage.removeItem('id');
      localStorage.removeItem('name');
      this.props.history.push('/login');
    }
  }
  handleShow() {
    this.setState({ show: true });
  }
  handleClose() {
    this.setState({ show: false });
  }

  render() {
    return (
      <MDBContainer fluid className={styles.outerContainer}>
        <MDBRow>
          <MDBCol md='2'>
            <MDBContainer fluid>
              <Sidebar />
            </MDBContainer>
          </MDBCol>
          <MDBCol md='10'>
            <div class='card'>
              <div class='card-body'>
                <div class='row'>
                  <div class='col-md-8'>
                    <h4 class='text-left'>Your Profile</h4>
                  </div>
                </div>
                <div class='row'>
                  <div class='col-md-12'>
                    <Form onSubmit={this.handleSubmit}>
                      <div class='form-group row'>
                        <label class='col-4 col-form-label'>Name*</label>
                        <div class='col-8'>
                          <input
                            name='name'
                            placeholder='Name'
                            class='form-control here'
                            required='required'
                            type='text'
                            value={this.state.name}
                            onChange={this.handleChange}
                          ></input>
                        </div>
                      </div>
                      <div class='form-group row'>
                        <label class='col-4 col-form-label'>Email*</label>
                        <div class='col-8'>
                          <input
                            name='email'
                            placeholder='Email'
                            class='form-control here'
                            type='email'
                            required
                            value={this.state.email}
                            onChange={this.handleChange}
                          ></input>
                        </div>
                      </div>
                      <div class='form-group row'>
                        <label class='col-4 col-form-label'>
                          New Password*
                        </label>
                        <div class='col-8'>
                          <input
                            name='password'
                            placeholder='New Password'
                            class='form-control here'
                            type='password'
                            required
                            value={this.state.password}
                            onChange={this.handleChange}
                          ></input>
                        </div>
                      </div>
                      {this.state.error && (
                        <h6 class='text-danger text-center'>
                          Error: {this.state.error}
                        </h6>
                      )}
                      <div class='form-group row'>
                        <div class='offset-4 md-col-6'>
                          <Form.Group>
                            <MDBBtn color='indigo' type='submit'>
                              Update Profile
                            </MDBBtn>
                          </Form.Group>
                        </div>
                        <div class='md-col-6'>
                          <Form.Group>
                            <MDBBtn
                              class='btn btn-danger'
                              onClick={this.handleShow}
                            >
                              Delete Profile
                            </MDBBtn>
                          </Form.Group>
                        </div>
                      </div>
                    </Form>
                    <Modal show={this.state.show} onHide={this.handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>Delete account</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        Do you want to delete this account and all records
                        belong to it?
                      </Modal.Body>
                      <Modal.Footer>
                        <MDBBtn class='btn btn-info' onClick={this.handleClose}>
                          Cancel
                        </MDBBtn>
                        <MDBBtn
                          class='btn btn-danger'
                          onClick={this.handleDelete}
                        >
                          Delete
                        </MDBBtn>
                      </Modal.Footer>
                    </Modal>
                  </div>
                </div>
              </div>
            </div>
            {this.state.error && (
              <h6 class='text-danger text-center'>Error: {this.state.error}</h6>
            )}
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default withRouter(Profile);
