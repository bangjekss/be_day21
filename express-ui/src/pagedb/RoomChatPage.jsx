import React, { Component } from 'react';

class RoomChatPage extends Component {
  state = {};
  render() {
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
              <h5>Users</h5>
              <ul>
                {this.state.user.map((value, index) => (
                  <li key={index}>{value}</li>
                ))}
              </ul>
            </div>
            <div
              className="col-9 px-5 py-4 d-flex flex-column"
              style={{ background: 'rgba(200,200,200)', minHeight: '500px' }}
            >
              <div style={{ height: '500px' }}>
                <div
                  className="px-2 py-1"
                  style={{ background: 'rgba(255,255,255)', borderRadius: '10px' }}
                >
                  <div className="text-secondary">
                    <small className="mr-3">username</small>
                    <small>
                      {new Date().getHours()}:{new Date().getMinutes()}
                    </small>
                  </div>
                  <div className="mx-2 d-flex">message</div>
                </div>
              </div>
              <form>
                <div className="d-flex">
                  <div className="flex-grow-1 pr-2">
                    <Input
                      id="message"
                      // onChange={(e) => this.setState({ message: e.target.value })}
                      placeholder="Message Here"
                      // value={message}
                    />
                  </div>
                  <div>
                    <Button color="warning">Submit Chat</Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RoomChatPage;
