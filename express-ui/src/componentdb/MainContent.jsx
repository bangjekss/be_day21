import React, { Component } from 'react';

class MainContent extends Component {
  state = {};
  render() {
    const { renderCardProduct } = this.props;
    return <div className="col-9 d-flex flex-wrap justify-content-start">{renderCardProduct}</div>;
    // <div className="d-flex">
    {
      /* <div className="col-3"></div> */
    }
    // </div>
  }
}

export default MainContent;
