import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from 'mdbreact';
import Sidebar from '../sidebar/Sidebar';
import styles from './Results.module.css';
import authHeader from '../../services/auth-header';
import Form from 'react-bootstrap/Form';
import { withRouter, Prompt } from 'react-router';

class QuizResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: localStorage.getItem('id'),
      quizKey: localStorage.getItem('key'),
      name: '',
      time: '',
      email: '',
      questions: [{ question: '', answers: [''], correct: '' }],
      answers: [],
      error: null,
      header: authHeader() ? authHeader() : {},
    };
    this.handleClose = this.handleClose.bind(this);
    this.generateQABlock = this.generateQABlock.bind(this);
  }

  componentDidMount() {
    this.callGetResultData()
      .then((res) => {
        this.setState({ 
            name: res[0].quizName,
            email: res[0].candidateEmail,
            time: res[0].quizTimeLimit,
            questions: JSON.parse(res[0].quizQuestions), 
            answers: JSON.parse(res[0].quizAnswers)
        });
        console.log(this.state.questions)
        console.log(this.state.answers)
      })
      .catch((err) => this.setState({ error: err }));
  }

  handleClose() {
    this.props.history.push(`/employers/${this.state.id}/results`);
  }

  callGetResultData = async () => {
    const response = await fetch(`/api/employers/${this.state.id}/quizResult/${this.state.quizKey}`,
        {
            method: 'GET',
            headers: this.state.header,
        }
    );
    const body = await response.json();
    if(body.error) {
        this.setState({ error: body.error });
    } else {
        return body;
    }
  };

  generateQABlock() {
      return this.state.questions.map((questionData, index) => {
        const { question, answers, correct } = questionData;
        return(
            <div class='form-group row'>
          <MDBCol md='10'>
            <div class='input-group-prepend'>
              <span class='input-group-text'>
                Question {index + 1}
              </span>
            </div>
            <textarea
              class='form-control black-text'
              rows='5'
              name='question'
              value={question}
              disabled
              ></textarea>
            {answers.map((a, idx) => {            
                return(
                    <div class='form-group row'>
                        <MDBCol md='10'>
                        <div class='input-group-prepend'>
                            <div class='input-group'>
                            <div class='input-group-prepend'>
                                <div class='input-group-text'>
                                <input
                                    type='radio'
                                    checked={this.state.answers[index] == idx}
                                    disabled
                                />
                                </div>
                            </div>
                            <input
                                type='text'
                                class={correct.toString() != idx ? 'form-control black-text' : 'form-control black-text bg-success'}
                                name='answer'
                                disabled
                                value={answers[idx]}
                            />
                            </div>
                        </div>
                        </MDBCol>
                    </div>
                )
            })}
          </MDBCol>
        </div>
        )
    });
}

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
                  {'Quiz Result: ' + this.state.email}
                </h3>
                <div class='card-body'>
                  <Form>
                    <div class='form-group row'>
                      <MDBCol md='6'>
                        <div class='input-group-prepend'>
                          <span class='input-group-text'>Name</span>
                        </div>
                        <input
                          type='text'
                          class='form-control black-text'
                          name='name'
                          disabled
                          value={this.state.name}
                        />
                      </MDBCol>
                      <MDBCol md='6'>
                        <div class='input-group-prepend'>
                          <span class='input-group-text'>Time Limit (min)</span>
                        </div>
                        <input
                          type='number'
                          class='form-control black-text'
                          name='time'
                          disabled
                          value={this.state.time}
                        />
                      </MDBCol>
                    </div>
                    <div class='form-group row'>
                      <MDBCol md='2' class='align-middle'>
                        <h4 class='font-weight-bold text-uppercase py-3'>
                          Questions
                        </h4>
                      </MDBCol>
                    </div>

                    {this.generateQABlock()}
                    
                    {this.state.error && (
                      <h6 class='text-danger text-center'>
                        Error: {this.state.error}
                      </h6>
                    )}
                    <div class='form-group row'>
                      <MDBCol md='6'>
                        <div class='text-right'>
                          <MDBBtn
                            onClick={() => this.handleClose()}
                            class='btn btn-danger offset-4'
                          >
                            Back to Results
                          </MDBBtn>
                        </div>
                      </MDBCol>
                    </div>
                  </Form>
                </div>
              </div>
            </MDBContainer>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}
export default withRouter(QuizResults);
