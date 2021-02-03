import React, { Component } from 'react';
import { FormRegis } from '../componentdb';
import { ea } from '../spritedb';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import { registerAction } from '../redux/action';
import { Redirect } from 'react-router-dom';

class RegisterPage extends Component {
  state = {
    regisLog: {
      username: '',
      email: '',
      password: '',
      cpassword: '',
    },
  };
  handleInput = (e) => {
    this.setState({
      regisLog: {
        ...this.state.regisLog,
        [e.target.id]: e.target.value,
      },
    });
  };
  handleRoleRadionBtn = (e) => {
    this.setState({
      regisLog: {
        ...this.state.regisLog,
        roleID: parseInt(e.target.value),
      },
    });
    console.log(this.state.regisLog);
  };
  handleSignUpBtn = () => {
    const { rxIsValidEmail, rxIsValidPassword, rxIsValidCPassword, rxIsValidUsername } = this.props; // reducer
    const { registerAction } = this.props; // action
    const { username, email, password, cpassword } = this.state.regisLog;
    if (username !== '' || email !== '' || password !== '' || cpassword !== '') {
      if (rxIsValidEmail && rxIsValidPassword && rxIsValidCPassword && rxIsValidUsername) {
        console.log('yey');
        console.log(rxIsValidUsername, rxIsValidEmail, rxIsValidPassword, rxIsValidCPassword);
        console.log(this.state.regisLog);
        registerAction(this.state.regisLog);
        // return this.state.regisLog;
      } else {
        return Swal.fire({
          title: 'Ooppss..!!',
          icon: 'error',
          text: 'Make sure the fields you filled are correct',
          timeout: 5000,
          timerProgressBar: true,
        });
      }
    } else {
      return Swal.fire({
        title: 'Ooppss..!!',
        icon: 'error',
        text: 'The fields must be filled',
        timeout: 5000,
        timerProgressBar: true,
      });
    }
  };

  render() {
    const { regisLog } = this.state;
    const { rxUsername } = this.props;
    if (rxUsername) {
      return <Redirect to="/" />;
    }
    return (
      <div className="d-flex align-items-center" style={{ minHeight: '100vh' }}>
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
        <FormRegis
          className="col-3"
          handleInput={this.handleInput}
          handleSignUpBtn={this.handleSignUpBtn}
          // handleRoleRadionBtn={this.handleRoleRadionBtn}
          // selected={regisLog.roleID}
          valueMail={regisLog.email}
          valuePassword={regisLog.password}
          valueCPassword={regisLog.cpassword}
          valueUsername={regisLog.username}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ userReducer, registerReducer }) => {
  return {
    rxIsLoading: userReducer.isLoading,
    rxUsername: userReducer.username,
    rxIsValidUsername: registerReducer.isValidUsername,
    rxIsValidEmail: registerReducer.isValidEmail,
    rxIsValidPassword: registerReducer.isValidPassword,
    rxIsValidCPassword: registerReducer.isValidCPassword,
  };
};

export default connect(mapStateToProps, { registerAction })(RegisterPage);
