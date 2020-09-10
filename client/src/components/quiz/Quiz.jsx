import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from 'mdbreact';
import styles from './Quiz.module.css';
import Form from 'react-bootstrap/Form';
import { withRouter, Prompt } from 'react-router';

class Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizKey: localStorage.getItem('quizKey'),
      quizID: localStorage.getItem('quizID'),
      candidateID: localStorage.getItem('candidateID'),
      quizName: '',
      minutes: 1,
      seconds: 0,
      questions: [{ question: '', answers: [''] }],
      candidateAnswers: [],
      error: null,
      isSubmitted: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    localStorage.removeItem('candidateID');
    localStorage.removeItem('quizID');
    localStorage.removeItem('quizKey');
    this.callGetQuiz()
      .then((res) => {
        this.setState({ quizName: res.quizName });
        this.setState({ minutes: res.quizTimeLimit });
        const questions = eval('(' + res.quizQuestions + ')');
        this.setState({ questions: questions });
        const answers = new Array(questions.length).fill(null);
        this.setState({ candidateAnswers: answers });
      })
      .catch((err) => this.setState({ error: err }));
    this.myInterval = setInterval(() => {
      const seconds = this.state.seconds;
      const minutes = this.state.minutes;
      if (seconds > 0) {
        this.setState(({ seconds }) => ({
          seconds: seconds - 1,
        }));
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(this.myInterval);
          this.handleSubmit();
        } else {
          this.setState(({ minutes }) => ({
            minutes: minutes - 1,
            seconds: 59,
          }));
        }
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.myInterval);
  }

  callGetQuiz = async () => {
    const response = await fetch(
      `/api/candidates/${this.state.candidateID}/quizzes/${this.state.quizID}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const body = await response.json();
    if (body.error) {
      this.setState({ error: body.error });
    } else {
      return body;
    }
  };

  async handleSubmit() {
    const response = await fetch(
      `/api/candidates/${this.state.candidateID}/quizzes/${this.state.quizID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: this.state.quizKey,
          answers: this.state.candidateAnswers,
        }),
      }
    );
    const body = await response.json();
    if (body.error) {
      this.setState({ error: body.error });
    } else {
      this.setState({ isSubmitted: true });
      this.props.history.push(`/candidate`);
    }
  }
  handleAnswerChange(index, idx) {
    const values = [...this.state.candidateAnswers];
    values[index] = idx;
    this.setState({ candidateAnswers: values });
  }

  render() {
    const seconds = this.state.seconds;
    const minutes = this.state.minutes;
    return (
      <MDBContainer fluid className={styles.outerContainer}>
        <MDBContainer fluid className={styles.welcomeContainer}>
          <div class='card'>
            <MDBRow>
              <MDBCol md='8'>
                <h3 class='card-header font-weight-bold text-uppercase py-4'>
                  {this.state.quizName}
                </h3>
              </MDBCol>
              <MDBCol md='4'>
                {/* {minutes === 0 && seconds === 0 ? (
                  () => this.handleSubmit()
                ) : (
                  <h3 class='card-header font-weight-bold py-4'>
                    Time remaining | {minutes}:
                    {seconds < 10 ? `0${seconds}` : seconds}
                  </h3>
                )} */}
                <h3 class='card-header font-weight-bold py-4'>
                  Time remaining | {minutes}:
                  {seconds < 10 ? `0${seconds}` : seconds}
                </h3>
              </MDBCol>
            </MDBRow>
            <div class='card-body'>
              <Form onSubmit={this.handleSubmit}>
                {this.state.questions.map((q, index) => (
                  <div class='form-group row'>
                    <MDBCol>
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
                        disabled
                      ></textarea>
                      {q.answers.map((a, idx) => (
                        <div class='form-group row'>
                          <MDBCol>
                            <div class='input-group-prepend'>
                              <span class='input-group-text'>{idx + 1}</span>
                              <div class='input-group'>
                                <div class='input-group-prepend'>
                                  <div class='input-group-text'>
                                    <input
                                      type='radio'
                                      checked={
                                        this.state.candidateAnswers[index] ===
                                        idx
                                      }
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
                                  disabled
                                />
                              </div>
                            </div>
                          </MDBCol>
                        </div>
                      ))}
                    </MDBCol>
                  </div>
                ))}
                {this.state.error && (
                  <h6 class='text-danger text-center'>
                    Error: {this.state.error}
                  </h6>
                )}
                <div class='form-group row'>
                  <MDBBtn color='indigo' type='submit'>
                    Submit
                  </MDBBtn>
                </div>
              </Form>
            </div>
          </div>
        </MDBContainer>
        <Prompt
          when={!this.state.isSubmitted}
          message={'Do you want to leave without submit?'}
        />
      </MDBContainer>
    );
  }
}
export default withRouter(Quiz);
