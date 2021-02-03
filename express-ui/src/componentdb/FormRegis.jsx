import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import Fade from 'react-reveal/Fade';
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner';
// import { DelayInput } from 'react-delay-input';
import { validation } from '../redux/action';
import { Link } from 'react-router-dom';

class FormRegis extends Component {
  state = {};

  componentDidUpdate(prevProps, prevState) {
    let { valueMail, valuePassword, valueCPassword, valueUsername } = this.props;
    let { validation } = this.props;
    const value = {
      username: valueUsername,
      email: valueMail,
      password: valuePassword,
      cpassword: valueCPassword,
    };
    if (
      prevProps.valueUsername !== valueUsername ||
      prevProps.valueMail !== valueMail ||
      prevProps.valuePassword !== valuePassword ||
      prevProps.valueCPassword !== valueCPassword
    ) {
      validation(value);
      // console.log(prevProps.valueMail, 'prevProps');
      // console.log(valueMail, 'this');
      // console.log(this.props.rxIsValidEmail);
    }
  }
  render() {
    const {
      handleInput,
      handleSignUpBtn,
      valueUsername,
      valueMail,
      valuePassword,
      valueCPassword,
      // handleRoleRadionBtn,
      // selected,
    } = this.props;
    let {
      rxIsValidEmail,
      rxIsInvalidEmail,
      rxIsValidPassword,
      rxIsInvalidPassword,
      rxIsValidCPassword,
      rxIsInvalidCPassword,
      rxIsValidUsername,
      rxIsInvalidUsername,
    } = this.props;
    // const regex_email = /[\w-\.]+(@[\w-\.]+\.)+[\w-\.]{2,4}$/;
    // const regex_password = /(?=.*[\d])(?=.*[A-Z])(?=.*[!@#$%^&*\-\_=<>,\.?]).{8,16}$/;
    // if (valueMail.match(regex_email)) {
    //   rxIsValidEmail = true;
    //   rxIsInvalidEmail = false;
    //   // getValueMail(valueMail);
    // } else {
    //   rxIsValidEmail = false;
    //   rxIsInvalidEmail = true;
    // }
    // if (valuePassword.match(regex_password)) {
    //   rxIsValidPassword = true;
    //   rxIsInvalidPassword = false;
    //   // getValuePassword(valuePassword);
    // } else {
    //   rxIsValidPassword = false;
    //   rxIsInvalidPassword = true;
    // }
    // if (valueCPassword !== valuePassword) {
    //   rxIsValidCPassword = false;
    //   rxIsInvalidCPassword = true;
    //   // getValueCPassword(valueCPassword);
    // } else {
    //   rxIsValidCPassword = true;
    //   rxIsInvalidCPassword = false;
    // }

    if (valueUsername.length < 1) rxIsInvalidUsername = false;
    if (valueMail.length < 1) rxIsInvalidEmail = false;
    if (valuePassword.length < 1) rxIsInvalidPassword = false;
    if (valueCPassword.length < 1) rxIsValidCPassword = false;
    // console.log(rxIsValidEmail, rxIsValidPassword, rxIsValidCPassword);
    const { rxIsLoading } = this.props;
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
          <h2>SIGN UP</h2>
        </div>
        <div className="px-5 py-5">
          <Form className="mb-5" autoComplete="off">
            <FormGroup>
              <Label>Username</Label>
              <Input
                valid={valueUsername.length !== 0 ? rxIsValidUsername : false}
                placeholder="username"
                onChange={handleInput}
                id="username"
                className={rxIsInvalidUsername ? 'is-invalid' : ''}
                style={{ borderRadius: '50px', padding: '20px 25px' }}
              />
              <Fade bottom collapse when={rxIsInvalidUsername}>
                <div className="invalid-feedback" style={{ display: 'block' }}>
                  ** Username already taken
                </div>
              </Fade>
            </FormGroup>
            <FormGroup className="position-relative">
              <Label>Email</Label>
              <Input
                valid={rxIsValidEmail}
                placeholder="email"
                type="email"
                onChange={handleInput}
                id="email"
                className={rxIsInvalidEmail ? 'is-invalid' : ''}
                style={{ borderRadius: '50px', padding: '20px 25px' }}
              />
              <Fade bottom collapse when={rxIsInvalidEmail}>
                <div className="invalid-feedback" style={{ display: 'block' }}>
                  ** Invalid email or email already taken
                </div>
              </Fade>
            </FormGroup>
            <FormGroup className="position-relative">
              <Label>Password</Label>
              <Input
                valid={rxIsValidPassword}
                placeholder="password"
                type="password"
                onChange={handleInput}
                id="password"
                className={rxIsInvalidPassword ? 'is-invalid' : ''}
                style={{ borderRadius: '50px', padding: '20px 25px' }}
              />
              <Fade bottom collapse when={rxIsInvalidPassword}>
                <div className="invalid-feedback" style={{ display: 'block' }}>
                  ** Password must include At least one digit, one uppercase, one special character,
                  and 8-16 character
                </div>
              </Fade>
            </FormGroup>
            <FormGroup className="position-relative">
              <Label>Confirm Password</Label>
              <Input
                valid={rxIsValidCPassword}
                placeholder="retype password"
                type="password"
                onChange={handleInput}
                id="cpassword"
                className={rxIsInvalidCPassword ? 'is-invalid' : ''}
                style={{ borderRadius: '50px', padding: '20px 25px' }}
              />
              <Fade bottom collapse when={rxIsInvalidCPassword}>
                <div className="invalid-feedback" style={{ display: 'block' }}>
                  ** Password doesn't match
                </div>
              </Fade>
            </FormGroup>
            {/* <div className="d-flex justify-content-center">
              <FormGroup className="mx-4">
                <Label>
                  <Input
                    type="radio"
                    name="role"
                    value="0"
                    checked={selected == 0}
                    onChange={handleRoleRadionBtn}
                  />
                  User
                </Label>
              </FormGroup>
              <FormGroup className="mx-4">
                <Label>
                  <Input
                    type="radio"
                    name="role"
                    value="1"
                    onChange={handleRoleRadionBtn}
                    checked={selected == 1}
                  />
                  Admin
                </Label>
              </FormGroup>
            </div> */}
          </Form>
          <div className="d-flex justify-content-between">
            <Link to="/login">
              <Button color="warning" style={{ borderRadius: '50px' }} className="px-3">
                Have an account?
              </Button>
            </Link>
            <Button
              color="primary"
              style={{ borderRadius: '50px', width: '100px', maxHeight: '50px' }}
              className="px-3 py-2"
              onClick={handleSignUpBtn}
              disabled={rxIsLoading}
            >
              {rxIsLoading ? (
                <Loader type="Bars" color="#00BFFF" height={25} width={25} />
              ) : (
                <b>Sign Up</b>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = ({ userReducer, registerReducer }) => {
  return {
    rxIsLoading: userReducer.isLoading,
    rxUsername: userReducer.username,
    rxIsValidUsername: registerReducer.isValidUsername,
    rxIsInvalidUsername: registerReducer.isInvalidUsername,
    rxIsValidEmail: registerReducer.isValidEmail,
    rxIsInvalidEmail: registerReducer.isInvalidEmail,
    rxIsValidPassword: registerReducer.isValidPassword,
    rxIsInvalidPassword: registerReducer.isInvalidPassword,
    rxIsValidCPassword: registerReducer.isValidCPassword,
    rxIsInvalidCPassword: registerReducer.isInvalidCPassword,
  };
};

export default connect(mapStateToProps, { validation })(FormRegis);
