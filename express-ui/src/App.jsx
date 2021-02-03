import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Header } from './componentdb';
import {
  HomePage,
  RegisterPage,
  LoginPage,
  VerifyPage,
  ForgotPasswordPage,
  ChangePasswordPage,
  ChatPage,
  ChatCord,
} from './pagedb';
import { keepLoginAction } from './redux/action';
import { connect } from 'react-redux';
import { notification, socket } from './favordb';
import Swal from 'sweetalert2';

class App extends Component {
  state = {};
  componentDidMount() {
    const { keepLoginAction } = this.props;
    const token = localStorage.getItem('token');
    if (token) {
      keepLoginAction();
    }

    socket.on('notification', (data) => {
      console.log('aa');
      notification(data);
    });
  }
  render() {
    return (
      <div>
        <Header />
        <Route path="/" exact component={HomePage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/verify" component={VerifyPage} />
        <Route path="/forgot-password" component={ForgotPasswordPage} />
        <Route path="/change-password" component={ChangePasswordPage} />
        <Route path="/chat" component={ChatPage} />
        <Route path="/chat-cord" component={ChatCord} />
      </div>
    );
  }
}

export default connect(null, { keepLoginAction })(App);
