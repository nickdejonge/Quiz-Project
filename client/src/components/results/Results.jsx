import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from 'mdbreact';
import Sidebar from '../sidebar/Sidebar';
import styles from './Results.module.css';
import authHeader from '../../services/auth-header';
import { withRouter } from 'react-router';
import Modal from 'react-bootstrap/Modal';
import QuizDiv from './QuizDivs';

class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: localStorage.getItem('id'),
      results: [],
      quizzes: [],
      error: null,
      header: authHeader() ? authHeader() : {},
      show: false,
      key: '',
    };
    this.renderTableData = this.renderTableData.bind(this);
    this.renderQuizDivs = this.renderQuizDivs.bind(this);
    this.handleViewQuiz = this.handleViewQuiz.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleShow() {
    this.setState({ show: true });
  }
  handleClose() {
    this.setState({ show: false });
  }
  handleViewQuiz(keyID) {
    localStorage.setItem('key', keyID);
    this.props.history.push(`/employers/${this.state.id}/quizResult/` + keyID + `/view`);
  }

  renderQuizDivs(){
    return this.state.quizzes.map(quiz => {
      const { quizID, quizName} = quiz; //destructuring
      return <QuizDiv name = {quizName} ID = {quizID} results = {
        this.renderTableData(quizID)
      }
      />
    });
  }
  
  renderTableData(quizID) {
    return this.state.results.map((result, index) => {
      const { keyID, candidateEmail, quizName, quizScore, quizStart, quizFinish, r } = result; //destructuring
      if (result.quizID != quizID){
        return;
      } else {
        return (
          <tr>
            <td>{r}</td>
            <td>{candidateEmail}</td>
            <td>{quizName}</td>
            <td>{quizScore * 100}%</td>  
            <td>{quizStart}</td>
            <td>{quizFinish}</td>    
            <td>
              <span>
                <button
                  type='button'
                  class='btn btn-primary btn-sm my-0'
                  onClick={() => this.handleViewQuiz(keyID)}
                >
                  View Quiz
                </button>
              </span>
            </td>
          </tr>
        );
      }
    });
  }

  componentDidMount() {
    this.callGetResults()
      .then((res) => {
        this.setState({ results: res });
      })
      .catch((err) => this.setState({ error: err }));

    this.callGetQuizzes().then((res) => {
        this.setState({ quizzes: res });
      })
      .catch((err) => this.setState({ error: err}));
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

  callGetResults = async () => {
    const response = await fetch(`/api/employers/${this.state.id}/allQuizResults`, {
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
                  Results
                </h3>
                <div class='card-body' >
                  {this.renderQuizDivs()}                
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
            <Modal.Title>Key</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.key}</Modal.Body>
          <Modal.Footer>
            <MDBBtn class='btn btn-info' onClick={this.handleClose}>
              Close
            </MDBBtn>
          </Modal.Footer>
        </Modal>
      </MDBContainer>
    );
  }
}

export default withRouter(Results);
