import React, { Component } from 'react';
import { FormLogin } from '../componentdb';
import { ea } from '../spritedb';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import { loginAction } from '../redux/action';
import { Redirect } from 'react-router-dom';

class RegisterPage extends Component {
  state = {
    loginLog: {
      username_email: '',
      password: '',
    },
  };

  handleInput = (e) => {
    this.setState({
      loginLog: {
        ...this.state.loginLog,
        [e.target.id]: e.target.value,
      },
    });
  };
  handleLoginBtn = () => {
    const { username_email, password } = this.state.loginLog;
    const { loginAction } = this.props;
    if (username_email !== '' || password !== '') {
      console.log(this.state.loginLog);
      return loginAction(this.state.loginLog);
    } else {
      return Swal.fire({
        title: 'Ooppss..!!',
        icon: 'error',
        text: 'The fields must be filled out',
        timeout: 5000,
        timerProgressBar: true,
      });
    }
  };

  render() {
    const { rxUsername } = this.props;
    if (rxUsername) {
      return <Redirect to="/" />;
    }
    return (
      <div className="d-flex align-items-center" style={{ minHeight: '100vh' }}>
        <FormLogin
          className="col-3"
          handleInput={this.handleInput}
          handleLoginBtn={this.handleLoginBtn}
        />
        <div className="col-9" style={{ padding: '0' }}>
          <div
            style={{
              background: `url(${ea}) no-repeat center rgba(241, 253, 255,1)`,
              minHeight: '100vh',
              width: '100%',
              margin: '0',
            }}
          ></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ userReducer }) => {
  return {
    rxUsername: userReducer.username,
  };
};

export default connect(mapStateToProps, { loginAction })(RegisterPage);
