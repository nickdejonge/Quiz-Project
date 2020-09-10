import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import './App.css';
import Navbar from './components/navbar/Navbar';
import Footer from './components/navbar/Footer';
import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import Home from './components/home/Home';
import Candidate from './components/candidate/Candidate';
import Quizzes from './components/quiz/Quizzes';
import CreateQuiz from './components/quiz/CreateQuiz';
import EditQuiz from './components/quiz/EditQuiz';
import Quiz from './components/quiz/Quiz';
import KeyList from './components/quiz/KeyList';
import UserInfo from './components/signup/UserInfo';
import Profile from './components/login/Profile';
import Results from './components/results/Results';
import QuizResults from './components/results/QuizResults';
import Error from './components/commons/Error';
import authHeader from './services/auth-header';

function App() {
  const PrivateInfo = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem('email') ? (
          <UserInfo {...props} />
        ) : (
          <Redirect to='/signup' />
        )
      }
    />
  );
  const PrivateProfile = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        authHeader() && props.match.params.id === localStorage.getItem('id') ? (
          <Profile {...props.match.params} />
        ) : (
          <Redirect to='/login' />
        )
      }
    />
  );
  const PrivateQuizzes = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        authHeader() && props.match.params.id === localStorage.getItem('id') ? (
          <Quizzes {...props.match.params} />
        ) : (
          <Redirect to='/login' />
        )
      }
    />
  );
  const PrivateCreateQuiz = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        authHeader() && props.match.params.id === localStorage.getItem('id') ? (
          <CreateQuiz {...props.match.params} />
        ) : (
          <Redirect to='/login' />
        )
      }
    />
  );
  const PrivateEditQuiz = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        authHeader() && props.match.params.id === localStorage.getItem('id') ? (
          <EditQuiz {...props.match.params} />
        ) : (
          <Redirect to='/login' />
        )
      }
    />
  );
  const PrivateResults = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        authHeader() && props.match.params.id === localStorage.getItem('id') ? (
          <Results {...props.match.params} />
        ) : (
          <Redirect to='/login' />
        )
      }
    />
  );
  const PrivateQuizResults = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        authHeader() && props.match.params.id === localStorage.getItem('id') ? (
          <QuizResults {...props.match.params} />
        ) : (
          <Redirect to='/login' />
        )
      }
    />
  );
  const PrivateKeyList = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        authHeader() && props.match.params.id === localStorage.getItem('id') ? (
          <KeyList {...props.match.params} />
        ) : (
          <Redirect to='/login' />
        )
      }
    />
  );
  const PrivateQuiz = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        props.match.params.quizID === localStorage.getItem('quizID') &&
        props.match.params.candidateID ===
          localStorage.getItem('candidateID') ? (
          <Quiz {...props.match.params} />
        ) : (
          <Redirect to='/candidate' />
        )
      }
    />
  );
  return (
    <Router>
      <Navbar></Navbar>
      <Switch>
        <Route path='/signup'>
          <Signup />
        </Route>
        <Route path='/employers/info'>
          <PrivateInfo />
        </Route>
        <Route path='/error'>
          <Error />
        </Route>
        <Route path='/login'>
          <Login />
        </Route>
        <Route path='/candidate'>
          <Candidate />
        </Route>
        <Route exact path='/employers/:id/profile'>
          <PrivateProfile />
        </Route>
        <Route exact path='/employers/:id/quizzes'>
          <PrivateQuizzes />
        </Route>
        <Route exact path='/employers/:id/quizzes/create'>
          <PrivateCreateQuiz />
        </Route>
        <Route exact path='/employers/:id/quizzes/:quizID/edit'>
          <PrivateEditQuiz />
        </Route>
        <Route exact path='/employers/:id/results'>
          <PrivateResults />
        </Route>
        <Route exact path='/employers/:id/quizResult/:key/view'>
          <PrivateQuizResults />
        </Route>
        <Route exact path='/employers/:id/quizzes/:quizID/keys'>
          <PrivateKeyList />
        </Route>
        <Route exact path='/candidates/:candidateID/quizzes/:quizID'>
          <PrivateQuiz />
        </Route>
        <Route path='/'>
          <Home />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
}
export default App;
