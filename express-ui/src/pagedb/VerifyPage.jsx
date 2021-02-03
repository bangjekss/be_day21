import React, { Component } from 'react';
import QueryString from 'querystring';
import { connect } from 'react-redux';
import { emailVerificationAction, sendEmailVerificationAction } from '../redux/action';
import { logoYuchaseFull } from '../spritedb';
import { Alert, Button } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';

class VerifyPage extends Component {
  state = {
    isSent: false,
  };
  handleSendBtn = () => {
    const { rxUserID, rxEmail } = this.props; // reducer
    const { sendEmailVerificationAction } = this.props; // action

    this.setState({
      isSent: !this.state.isSent,
    });
    sendEmailVerificationAction(rxUserID, rxEmail);
  };
  handleResendBtn = () => {
    this.setState({
      isSent: !this.state.isSent,
    });
  };
  render() {
    const { rxUsername, rxEmail, rxError, rxIsLoading } = this.props;
    const { isSent } = this.state;
    const { emailVerificationAction } = this.props;
    const username = new URLSearchParams(this.props.location.search).get('username');
    const password = new URLSearchParams(this.props.location.search).get('password');
    if (username && password) {
      const data = { username, password };
      emailVerificationAction(data);
      return (
        <div
          className="row py-5 px-4 d-flex justify-content-center"
          style={{
            backgroundColor: 'rgba(255, 202, 17)',
            minHeight: '100vh',
            width: '100%',
            margin: 0,
          }}
        >
          <Redirect to="/" />
        </div>
      );
    }
    if (rxIsLoading) {
      return (
        <div
          className="row py-5 px-4 d-flex justify-content-center"
          style={{
            backgroundColor: 'rgba(255, 202, 17)',
            minHeight: '100vh',
            width: '100%',
            margin: 0,
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255)',
              // minHeight: '400px',
              minWidth: '700px',
              // maxHeight: '600px',
              maxWidth: '700px',
              borderRadius: '50px',
              boxShadow: '0 1px 10px 5px rgba(0,0,0,0.1)',
            }}
            className="p-5"
          >
            <div className="d-flex justify-content-center mb-4">
              <img src={logoYuchaseFull} alt="file_err" width="450px" height="100px" />
            </div>
            <div className="d-flex justify-content-center">
              <div
                style={{
                  backgroundColor: 'rgba(255, 202, 17)',
                  // minHeight: '400px',
                  minWidth: '600px',
                  // maxHeight: '300px',
                  maxWidth: '600px',
                  borderRadius: '50px',
                  boxShadow: '0 1px 10px 5px rgba(0,0,0,0.1)',
                }}
              >
                <div className="p-5">
                  <div
                    className="d-flex justify-content-center flex-column text-muted"
                    style={{ textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.3)' }}
                  >
                    <h1 className="text-primary">Verify your account</h1>
                    <Loader type="Plane" />
                    <h5 className="my-3">Please wait...</h5>
                    <div className="mb-5">Waiting response from server</div>
                  </div>
                  <div className="my-2">
                    <Link onClick={this.handleResendBtn}>
                      Need to resend the email or change your email address?
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (isSent && !rxError) {
      return (
        <div
          className="row py-5 px-4 d-flex justify-content-center"
          style={{
            backgroundColor: 'rgba(255, 202, 17)',
            minHeight: '100vh',
            width: '100%',
            margin: 0,
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255)',
              // minHeight: '400px',
              minWidth: '700px',
              // maxHeight: '600px',
              maxWidth: '700px',
              borderRadius: '50px',
              boxShadow: '0 1px 10px 5px rgba(0,0,0,0.1)',
            }}
            className="p-5"
          >
            <div className="d-flex justify-content-center mb-4">
              <img src={logoYuchaseFull} alt="file_err" width="450px" height="100px" />
            </div>
            <div className="d-flex justify-content-center">
              <div
                style={{
                  backgroundColor: 'rgba(255, 202, 17)',
                  // minHeight: '400px',
                  minWidth: '600px',
                  // maxHeight: '300px',
                  maxWidth: '600px',
                  borderRadius: '50px',
                  boxShadow: '0 1px 10px 5px rgba(0,0,0,0.1)',
                }}
              >
                <div className="p-5">
                  <div
                    className="d-flex justify-content-center flex-column text-muted"
                    style={{ textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.3)' }}
                  >
                    <h1 className="text-primary">Verify your account</h1>
                    <h5 className="my-3">Dear {rxUsername}, </h5>
                    <div className="mb-5">
                      We now need to verify your email address, We've sent an email to
                      <b> {rxEmail}</b> to verify your account. Please click the link into mail to
                      continue.
                    </div>
                  </div>
                  <div className="my-2">
                    <Link onClick={this.handleResendBtn}>
                      Need to resend the email or change your email address?
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div
        className="row py-5 px-4 d-flex justify-content-center"
        style={{
          backgroundColor: 'rgba(255, 202, 17)',
          minHeight: '100vh',
          width: '100%',
          margin: 0,
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255)',
            // minHeight: '500px',
            minWidth: '700px',
            // maxHeight: '600px',
            maxWidth: '700px',
            borderRadius: '50px',
            boxShadow: '0 1px 10px 5px rgba(0,0,0,0.1)',
          }}
          className="p-5"
        >
          <div className="d-flex justify-content-center mb-4">
            <img src={logoYuchaseFull} alt="file_err" width="450px" height="100px" />
          </div>
          <div className="d-flex justify-content-center">
            <div
              style={{
                backgroundColor: 'rgba(255, 202, 17)',
                minHeight: '400px',
                minWidth: '600px',
                // maxHeight: '300px',
                maxWidth: '600px',
                borderRadius: '50px',
                boxShadow: '0 1px 10px 5px rgba(0,0,0,0.1)',
              }}
            >
              <div className="p-5">
                <div
                  className="d-flex justify-content-center flex-column text-muted"
                  style={{ textAlign: 'center' }}
                >
                  <h1 className="text-primary">Verify your email address</h1>
                  <h5 className="my-3">Dear {rxUsername}, </h5>
                  <div className="mb-3">
                    Thank you for your support! If you haven't done so already, please confirm that
                    you want to use this address in your account. Once you verify you can begin to
                    send email
                  </div>
                  <div className="d-flex justify-content-center flex-column text-muted mb-3">
                    <b className="mb-1  ">Your email address</b>
                    <Alert color="warning">
                      <b>{rxEmail}</b>
                    </Alert>
                    <div style={{ textAlign: 'left' }}>
                      <Link>change your email address?</Link>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <Button color="primary" onClick={this.handleSendBtn}>
                    Verify your account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ userReducer }) => {
  return {
    rxVerified: userReducer.verified,
    rxIsLoading: userReducer.isLoading,
    rxError: userReducer.error,
    rxUserID: userReducer.id,
    rxUsername: userReducer.username,
    rxEmail: userReducer.email,
  };
};

export default connect(mapStateToProps, { sendEmailVerificationAction, emailVerificationAction })(
  VerifyPage
);
