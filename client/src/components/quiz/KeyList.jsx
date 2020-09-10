import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import styles from './Quiz.module.css';
import { withRouter } from 'react-router';
import authHeader from '../../services/auth-header';
import { MDBBtn, MDBContainer, MDBRow, MDBCol } from 'mdbreact';
import Sidebar from '../sidebar/Sidebar';

class KeyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: localStorage.getItem('id'),
      quizID: localStorage.getItem('quizID'),
      keys: [],
      keyID: '',
      error: null,
      header: authHeader() ? authHeader() : {},
      show: false,
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.renderTableData = this.renderTableData.bind(this);
  }
  componentDidMount() {
    this.callGetKeys()
      .then((res) => {
        this.setState({ keys: res });
      })
      .catch((err) => this.setState({ error: err }));
  }
  callGetKeys = async () => {
    const response = await fetch(
      `/api/employers/${this.state.id}/quizzes/${this.state.quizID}/keys`,
      {
        method: 'GET',
        headers: this.state.header,
      }
    );
    const body = await response.json();
    if (body.error) {
      this.setState({ error: body.error });
    } else {
      return body;
    }
  };
  handleShow(id) {
    this.setState({ show: true });
    this.setState({ keyID: id });
  }
  handleClose() {
    this.setState({ show: false });
  }
  async handleDelete(id) {
    const response = await fetch(
      `/api/employers/${this.state.id}/quizzes/${this.state.quizID}/keys/${id}`,
      {
        method: 'DELETE',
        headers: authHeader() ? authHeader() : {},
      }
    );
    const body = await response.json();
    if (body.error) {
      this.setState({ error: body.error });
    } else {
      window.location.reload(false);
    }
  }
  async handleGenerateKey(id) {
    const response = await fetch(
      `/api/employers/${this.state.id}/quizzes/${this.state.quizID}/quizKeys`,
      {
        method: 'POST',
        headers: authHeader() ? authHeader() : {},
      }
    );
    const body = await response.json();
    if (body.error) {
      this.setState({ error: body.error });
    } else {
      window.location.reload(false);
    }
  }
  renderTableData() {
    return this.state.keys.map((key, index) => {
      const { keyID, candidateEmail } = key; //destructuring
      return (
        <tr>
          <td>{keyID}</td>
          <td>{candidateEmail}</td>
          <td>
            <span class='table-remove'>
              <button
                type='button'
                class='btn btn-danger btn-sm my-0'
                onClick={() => this.handleShow(keyID)}
              >
                Remove
              </button>
            </span>
          </td>
        </tr>
      );
    });
  }

  render() {
    const quizName = localStorage.getItem('quizName');
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
              <h3 class='card-header text-center font-weight-bold text-uppercase py-4'>
                {quizName}
              </h3>
              <div class='card-body'>
                <span class='table-add float-right mb-3 mr-2'>
                  <MDBBtn
                    color='success'
                    onClick={() => this.handleGenerateKey(this.state.quizID)}
                  >
                    <i class='fas fa-plus'></i> <strong>Generate Key</strong>
                  </MDBBtn>
                </span>
                <table class='table table-bordered table-responsive-md table-striped text-center'>
                  <thead>
                    <tr>
                      <th class='text-center'>Key</th>
                      <th class='text-center'>Candidate Email</th>
                      <th class='text-center'>Remove</th>
                    </tr>
                  </thead>
                  <tbody>{this.renderTableData()}</tbody>
                </table>
              </div>
            </div>
          </MDBCol>
        </MDBRow>
        {this.state.error && (
          <h6 class='text-danger text-center'>Error: {this.state.error}</h6>
        )}
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Delete key</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you want to delete this key and all records belong to it?
          </Modal.Body>
          <Modal.Footer>
            <MDBBtn class='btn btn-info' onClick={this.handleClose}>
              Cancel
            </MDBBtn>
            <MDBBtn
              class='btn btn-danger'
              onClick={() => this.handleDelete(this.state.keyID)}
            >
              Delete
            </MDBBtn>
          </Modal.Footer>
        </Modal>
      </MDBContainer>
    );
  }
}

export default withRouter(KeyList);
