import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, FormFeedback, FormText, Button } from 'reactstrap';
import Fade from 'react-reveal/Fade';
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner';
import { Link } from 'react-router-dom';

class FormLogin extends Component {
  state = {};
  render() {
    const { handleInput, handleLoginBtn } = this.props;
    const { rxUsername, rxIsLoading } = this.props;
    return (
      <div
        style={{
          backgroundColor: 'rgba(255, 202, 17)',
          width: '100%',
          minHeight: '100vh',
        }}
      >
        <div
          className="d-flex justify-content-center py-4"
          style={{ boxShadow: '0px 1px 5px 1px rgba(0,0,0,0.2) ' }}
        >
          <h2>LOGIN</h2>
        </div>
        <div className="px-5 py-5">
          <Form className="mb-5" autoComplete="off">
            <FormGroup className="position-relative">
              <Label>Username or email</Label>
              <Input
                placeholder="username or email"
                type="email"
                onChange={handleInput}
                id="username_email"
                style={{ borderRadius: '50px', padding: '20px 25px' }}
              />
            </FormGroup>
            <FormGroup className="position-relative">
              <Label>Password</Label>
              <Input
                placeholder="password"
                type="password"
                onChange={handleInput}
                id="password"
                className=""
                style={{ borderRadius: '50px', padding: '20px 25px' }}
              />
            </FormGroup>
            <div className="d-flex justify-content-end">
              <Link to="/forgot-password">
                <div>Forgot password?</div>
              </Link>
            </div>
          </Form>
          <div className="d-flex justify-content-between">
            <Link to="/register">
              <Button color="warning" style={{ borderRadius: '50px' }} className="px-3">
                Create one, here!
              </Button>
            </Link>
            <Button
              color="primary"
              style={{ borderRadius: '50px', width: '100px', maxHeight: '50px' }}
              className="px-3 py-2"
              onClick={handleLoginBtn}
              disabled={rxIsLoading}
            >
              {rxIsLoading ? (
                <Loader type="Bars" color="#00BFFF" height={25} width={25} />
              ) : (
                <b>Login</b>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = ({ userReducer }) => {
  return {
    rxIsLoading: userReducer.isLoading,
    rxUsername: userReducer.username,
  };
};

export default connect(mapStateToProps)(FormLogin);
