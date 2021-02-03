import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button, Form, FormGroup, Label, Alert } from 'reactstrap';
import Loader from 'react-loader-spinner';
import { socket, api_url } from '../favordb';
import Axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class CharCord extends Component {
  state = {
    user: ['acong', 'ucok'],
    username: '',
    message: '',
    chat: [],
    isGo: false,
    count: 0,
  };
  componentDidMount() {
    window.document.title = 'React App';
    this.getChat();
    // data dari io.emit jumlahUser
    socket.on('jumlahUser', (data) => this.updateUserCount(data));
    socket.on('chat', (data) => this.updateChat(data));
  }
  getChat = async () => {
    const { data } = await Axios.get(`${api_url}/socket`);
    // console.log(data);
    this.setState({ chat: data });
  };
  submitChat = async (e) => {
    const { rxUserID } = this.props;
    e.preventDefault();
    const { message } = this.state;
    if (message !== '') {
      socket.emit('notification', message);
      await Axios.post(`${api_url}/socket/${rxUserID}`, { message });
      this.setState({ message: '' });
    } else {
      alert('please enter msg');
    }
  };
  updateUserCount = (data) => {
    this.setState({ count: data });
  };
  updateChat = (str) => {
    this.setState({
      chat: [...this.state.chat, str],
    });
  };
  render() {
    const { chat, message, count } = this.state;
    const { rxUserID } = this.props;
    // if (!rxUserID) {
    //   alert('login first!!!');
    //   return <Redirect to="/login" />;
    // }
    if (!this.state.isGo) {
      return (
        <div
          style={{
            backgroundColor: 'rgba(255, 202, 17)',
            width: '100%',
            minHeight: '100vh',
          }}
          className="py-5"
        >
          <div className="container">
            <div
              className="d-flex justify-content-center p-3"
              style={{
                background: 'rgba(255,255,255)',
                borderBottom: '2px solid rgba(0,0,0,0.2)',
              }}
            >
              <h2>WELCOME TO CHATCORD</h2>
            </div>
            <div className="d-flex">
              <div
                className="col-3 py-3 px-4"
                style={{
                  background: 'rgba(255,255,255)',
                  minHeight: '500px',
                  borderRight: '2px solid rgba(0,0,0,0.2)',
                }}
              >
                <h5>Users : {count}</h5>
                <ul>
                  {this.state.user.map((value, index) => (
                    <li key={index}>{value}</li>
                  ))}
                </ul>
              </div>
              <div
                className="col-9 px-5 py-4 d-flex flex-column"
                style={{ background: 'rgba(200,200,200)', minHeight: '400px' }}
              >
                <div style={{ height: '400px', overflow: 'auto' }} className="mb-3">
                  {chat.map(({ id, message, username, time }) => {
                    return (
                      <div
                        key={id}
                        className="px-2 py-1 mb-1"
                        style={{ background: 'rgba(255,255,255)', borderRadius: '10px' }}
                      >
                        <div className="text-secondary">
                          <small className="mr-3">{username}</small>
                          <small>{time}</small>
                        </div>
                        <div className="mx-2 d-flex">{message}</div>
                      </div>
                    );
                  })}
                </div>
                <form onSubmit={this.submitChat}>
                  <div className="d-flex">
                    <div className="flex-grow-1 pr-2">
                      <Input
                        id="message"
                        onChange={(e) => this.setState({ message: e.target.value })}
                        placeholder="Message Here"
                        value={message}
                      />
                    </div>
                    <div>
                      <Button color="warning" onClick={this.submitChat}>
                        Submit Chat
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div
        style={{
          backgroundColor: 'rgba(255, 202, 17)',
          width: '100%',
          minHeight: '100vh',
        }}
      >
        <Button onClick={this.handle}></Button>
        <div
          className="d-flex justify-content-center py-4"
          style={{ boxShadow: '0px 1px 5px 1px rgba(0,0,0,0.2) ' }}
        >
          <h2>Welcome to CHATCORD</h2>
        </div>
        <div className="px-5 py-5">
          <Form className="mb-5" autoComplete="off" onSubmit={this.handleGoBtn}>
            <FormGroup className="position-relative">
              <Input
                className="form-control p-4"
                placeholder="username"
                type="text"
                onChange={(e) => this.setState({ username: e.target.value })}
                id="username"
                style={{ borderRadius: '50px' }}
              />
            </FormGroup>
          </Form>
          <div className="d-flex justify-content-end">
            <Button
              color="primary"
              style={{ borderRadius: '50px', width: '100px', maxHeight: '50px' }}
              className="px-3 py-2"
              onClick={this.handleGoBtn}
              // disabled={rxIsLoading}
            >
              {/* {rxIsLoading ? (
                <Loader type="Bars" color="#00BFFF" height={25} width={25} />
              ) : (
                )} */}
              <b>Go</b>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ userReducer }) => {
  return {
    rxUserID: userReducer.id,
  };
};

export default connect(mapStateToProps, {})(CharCord);
