import React, { Component } from 'react';
import { MDBRow, MDBCol, MDBIcon } from 'mdbreact';

class Home extends Component {
  render() {
    return (
      <section className='my-5'>
        <h2 className='h1-responsive font-weight-bold text-center my-5'>
          Programming Quiz
        </h2>
        <p className='lead grey-text w-responsive text-center mx-auto mb-5'>
          A web application similar to Survey Monkey which will enable employers
          to create quizzes and test incoming employment candidates.
        </p>

        <MDBRow>
          <MDBCol lg='5' className='text-center text-lg-left'>
            <img
              className='img-fluid'
              src='https://www.drupal.org/files/project-images/quiz-image_0.jpg'
              alt=''
            />
          </MDBCol>
          <MDBCol lg='7'>
            <MDBRow className='mb-3'>
              <MDBCol size='1'>
                <MDBIcon icon='user-edit' size='lg' className='indigo-text' />
              </MDBCol>
              <MDBCol xl='10' md='11' size='10'>
                <h5 className='font-weight-bold mb-3'>Employers</h5>
                <p className='grey-text'>
                  Create, read, update, and destroy accounts. Create quiz and
                  generate a unique ‘key’ that authorizes a person to take the
                  quiz. View ranked quiz results from multiple candidates.
                </p>
              </MDBCol>
            </MDBRow>
            <MDBRow className='mb-3'>
              <MDBCol size='1'>
                <MDBIcon
                  icon='user-graduate'
                  size='lg'
                  className='indigo-text'
                />
              </MDBCol>
              <MDBCol xl='10' md='11' size='10'>
                <h5 className='font-weight-bold mb-3'>Candidates</h5>
                <p className='grey-text'>
                  Take the quiz with the matching key and email address.
                </p>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </section>
    );
  }
}
export default Home;
