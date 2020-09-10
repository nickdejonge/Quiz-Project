import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from 'mdbreact';
import Sidebar from '../sidebar/Sidebar';
import styles from './Quiz.module.css';
import authHeader from '../../services/auth-header';
import Form from 'react-bootstrap/Form';
import { withRouter, Prompt } from 'react-router';

class CreateQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: localStorage.getItem('id'),
      name: '',
      time: '',
      questions: [{ question: '', answers: [''], correct: '' }],
      error: null,
      header: authHeader() ? authHeader() : {},
      isSubmitted: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleCancel() {
    this.props.history.push(`/employers/${this.state.id}/quizzes`);
  }
  async handleSubmit(event) {
    event.preventDefault();
    const response = await fetch(`/api/employers/${this.state.id}/quizzes`, {
      method: 'POST',
      headers: this.state.header,
      body: JSON.stringify({
        name: this.state.name,
        time: this.state.time,
        questions: this.state.questions,
      }),
    });
    const body = await response.json();
    if (body.error) {
      this.setState({ error: body.error });
    } else {
      this.setState({ isSubmitted: true });
      this.props.history.push(`/employers/${this.state.id}/quizzes`);
    }
  }
  handleInputChange(event, index, idx) {
    const values = [...this.state.questions];
    switch (event.target.name) {
      case 'name':
        this.setState({ name: event.target.value });
        break;
      case 'time':
        this.setState({ time: event.target.value });
        break;
      case 'question':
        values[index].question = event.target.value;
        break;
      case 'answer':
        values[index].answers[idx] = event.target.value;
        break;
    }
    this.setState({ questions: values });
  }

  handleAnswerChange(index, idx) {
    const values = [...this.state.questions];
    values[index].correct = idx;
    this.setState({ questions: values });
  }

  handleAddAnswer(index) {
    const values = [...this.state.questions];
    values[index].answers.push('');
    this.setState({ questions: values });
  }

  handleRemoveAnswer(index, idx) {
    const values = [...this.state.questions];
    if (values[index].answers.length > 1) {
      values[index].answers.splice(idx, 1);
      this.setState({ questions: values });
    }
  }

  handleAddQuestion() {
    const values = [...this.state.questions];
    values.push({ question: '', answers: [''], correct: '' });
    this.setState({ questions: values });
  }

  handleRemoveQuestion(index) {
    const values = [...this.state.questions];
    if (values.length > 1) {
      values.splice(index, 1);
      this.setState({ questions: values });
    }
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
                  Create Quiz
                </h3>

                <div class='card-body'>
                  <Form onSubmit={this.handleSubmit}>
                    <div class='form-group row'>
                      <MDBCol md='6'>
                        <div class='input-group-prepend'>
                          <span class='input-group-text'>Name</span>
                        </div>
                        <input
                          type='text'
                          class='form-control'
                          name='name'
                          required
                          value={this.state.name}
                          onChange={(event) => this.handleInputChange(event)}
                        />
                      </MDBCol>
                      <MDBCol md='6'>
                        <div class='input-group-prepend'>
                          <span class='input-group-text'>Time Limit (min)</span>
                        </div>
                        <input
                          type='number'
                          class='form-control'
                          name='time'
                          required
                          value={this.state.time}
                          onChange={(event) => this.handleInputChange(event)}
                        />
                      </MDBCol>
                    </div>
                    <div class='form-group row'>
                      <MDBCol md='2' class='align-middle'>
                        <h4 class='font-weight-bold text-uppercase py-3'>
                          Questions
                        </h4>
                      </MDBCol>
                      <MDBCol md='2' class='text-center'>
                        <MDBBtn
                          class='btn btn-success btn-sm'
                          onClick={() => this.handleAddQuestion()}
                        >
                          <i class='fas fa-plus'> </i> Add question
                        </MDBBtn>
                      </MDBCol>
                    </div>
                    {this.state.questions.map((q, index) => (
                      <div class='form-group row'>
                        <MDBCol md='10'>
                          <div class='input-group-prepend'>
                            <span class='input-group-text'>
                              Question {index + 1}
                            </span>
                          </div>
                          <textarea
                            class='form-control'
                            rows='5'
                            required
                            name='question'
                            value={q.question}
                            onChange={(event) =>
                              this.handleInputChange(event, index)
                            }
                          ></textarea>
                          <div class='form-group row'>
                            <MDBCol md='2' class='align-middle'>
                              <h5 class='font-weight-bold text-uppercase py-3'>
                                Answers
                              </h5>
                            </MDBCol>
                            <MDBCol md='2' class='text-center'>
                              <MDBBtn
                                class='btn btn-success btn-sm'
                                onClick={() => this.handleAddAnswer(index)}
                              >
                                <i class='fas fa-plus'></i> Add answer
                              </MDBBtn>
                            </MDBCol>
                          </div>
                          {q.answers.map((a, idx) => (
                            <div class='form-group row'>
                              <MDBCol md='10'>
                                <div class='input-group-prepend'>
                                  <span class='input-group-text'>
                                    {idx + 1}
                                  </span>
                                  <div class='input-group'>
                                    <div class='input-group-prepend'>
                                      <div class='input-group-text'>
                                        <input
                                          type='radio'
                                          checked={q.correct === idx}
                                          onChange={() =>
                                            this.handleAnswerChange(index, idx)
                                          }
                                        />
                                      </div>
                                    </div>
                                    <input
                                      type='text'
                                      class='form-control'
                                      required
                                      name='answer'
                                      value={q.answers[idx]}
                                      onChange={(event) =>
                                        this.handleInputChange(
                                          event,
                                          index,
                                          idx
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              </MDBCol>
                              <MDBCol md='2'>
                                <MDBRow>
                                  <MDBBtn
                                    class='btn btn-danger btn-sm'
                                    onClick={() =>
                                      this.handleRemoveAnswer(index, idx)
                                    }
                                  >
                                    <i class='fas fa-minus'></i>{' '}
                                  </MDBBtn>
                                </MDBRow>
                              </MDBCol>
                            </div>
                          ))}
                        </MDBCol>
                        <MDBCol md='2'>
                          <MDBRow>
                            <MDBBtn
                              class='btn btn-danger btn-sm'
                              onClick={() => this.handleRemoveQuestion(index)}
                            >
                              <i class='fas fa-minus'> </i>
                            </MDBBtn>
                          </MDBRow>
                        </MDBCol>
                      </div>
                    ))}
                    {this.state.error && (
                      <h6 class='text-danger text-center'>
                        Error: {this.state.error}
                      </h6>
                    )}
                    <div class='form-group row'>
                      <MDBCol md='6'>
                        <div class='text-right'>
                          <MDBBtn
                            onClick={() => this.handleCancel()}
                            class='btn btn-danger offset-4'
                          >
                            Cancel
                          </MDBBtn>
                        </div>
                      </MDBCol>
                      <MDBCol md='6'>
                        <div class='text-left'>
                          <MDBBtn color='indigo' type='submit'>
                            Create
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
        <Prompt
          when={!this.state.isSubmitted}
          message={'Do you want to leave without saving?'}
        />
      </MDBContainer>
    );
  }
}
export default withRouter(CreateQuiz);
