import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from 'mdbreact';
import Sidebar from '../sidebar/Sidebar';
import styles from './Quiz.module.css';
import authHeader from '../../services/auth-header';
import { withRouter } from 'react-router';
import Modal from 'react-bootstrap/Modal';

class Quizzes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: localStorage.getItem('id'),
      quizzes: [],
      error: null,
      header: authHeader() ? authHeader() : {},
      show: false,
      quizID: '',
    };
    this.renderTableData = this.renderTableData.bind(this);
    this.handleCreateQuiz = this.handleCreateQuiz.bind(this);
    this.handleRemoveQuiz = this.handleRemoveQuiz.bind(this);
    this.handleViewKey = this.handleViewKey.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleShow(id) {
    this.setState({ show: true });
    this.setState({ quizID: id });
  }
  handleClose() {
    this.setState({ show: false });
  }
  handleCreateQuiz() {
    this.props.history.push(`/employers/${this.state.id}/quizzes/create`);
  }

  handleViewKey(id, name) {
    localStorage.setItem('quizID', id);
    localStorage.setItem('quizName', name);
    this.props.history.push(`/employers/${this.state.id}/quizzes/${id}/keys`);
  }
  async handleRemoveQuiz(id) {
    const response = await fetch(
      `/api/employers/${this.state.id}/quizzes/${id}`,
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
  handleEditQuiz(id) {
    localStorage.setItem('quizID', id);
    this.props.history.push(`/employers/${this.state.id}/quizzes/${id}/edit`);
  }
  renderTableData() {
    return this.state.quizzes.map((quiz, index) => {
      const { quizID, quizName, quizTimeLimit, quizQuestions } = quiz; //destructuring
      // const quizQuest = eval('(' + quizQuestions + ')');
      return (
        <tr>
          <td>{quizName}</td>
          <td>{quizTimeLimit}</td>
          <td>{eval('(' + quizQuestions + ')').length}</td>
          <td>
            <span>
              <button
                type='button'
                class='btn btn-primary btn-rounded btn-sm my-0'
                onClick={() => this.handleViewKey(quizID, quizName)}
              >
                View
              </button>
            </span>
          </td>
          <td>
            <span>
              <button
                type='button'
                class='btn btn-info btn-rounded btn-sm my-0'
                onClick={() => this.handleEditQuiz(quizID)}
              >
                Edit
              </button>
            </span>
          </td>
          <td>
            <span class='table-remove'>
              <button
                type='button'
                class='btn btn-danger btn-sm my-0'
                onClick={() => this.handleShow(quizID)}
              >
                Remove
              </button>
            </span>
          </td>
        </tr>
      );
    });
  }

  componentDidMount() {
    this.callGetQuizzes()
      .then((res) => {
        this.setState({ quizzes: res });
      })
      .catch((err) => this.setState({ error: err }));
  }
  callGetQuizzes = async () => {
    const response = await fetch(`/api/employers/${this.state.id}/quizzes`, {
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
  render() {
    return (
      <MDBContainer fluid className={styles.outerContainer}>
        <MDBRow>
          <MDBCol md='2'>
            <MDBContainer fluid className={styles.sideContainer}>
              <Sidebar />
            </MDBContainer>
          </MDBCol>
          <MDBCol md='10'>
            <MDBContainer fluid className={styles.welcomeContainer}>
              <div class='card'>
                <h3 class='card-header text-center font-weight-bold text-uppercase py-4'>
                  Quizzes
                </h3>
                <div class='card-body'>
                  <div id='table'>
                    <span class='table-add float-right mb-3 mr-2'>
                      <MDBBtn color='success' onClick={this.handleCreateQuiz}>
                        <i class='fas fa-plus'></i> <strong>Create quiz</strong>
                      </MDBBtn>
                    </span>
                    <table class='table table-bordered table-responsive-md table-striped text-center'>
                      <thead>
                        <tr>
                          <th class='text-center'>Name</th>
                          <th class='text-center'>Time Limit (mins)</th>
                          <th class='text-center'>Number of Questions</th>
                          <th class='text-center'>Key</th>
                          <th class='text-center'>Edit</th>
                          <th class='text-center'>Remove</th>
                        </tr>
                      </thead>
                      <tbody>{this.renderTableData()}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            </MDBContainer>
          </MDBCol>
        </MDBRow>
        {this.state.error && (
          <h6 class='text-danger text-center'>Error: {this.state.error}</h6>
        )}
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Quiz</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you want to delete this quiz and all records belong to it?
          </Modal.Body>
          <Modal.Footer>
            <MDBBtn class='btn btn-info' onClick={this.handleClose}>
              Cancel
            </MDBBtn>
            <MDBBtn
              class='btn btn-danger'
              onClick={() => this.handleRemoveQuiz(this.state.quizID)}
            >
              Delete
            </MDBBtn>
          </Modal.Footer>
        </Modal>
      </MDBContainer>
    );
  }
}

export default withRouter(Quizzes);
