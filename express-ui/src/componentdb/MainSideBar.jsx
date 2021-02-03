import React, { Component } from 'react';
import { FormGroup, Label, Input, Button } from 'reactstrap';

class MainSideBar extends Component {
  state = {};
  render() {
    const { handleCheckbox, isAvailable, handleSearchBtn, handleAddBtn } = this.props;
    return (
      <div className="d-flex flex-column col-3" style={{ position: 'sticky', top: '0' }}>
        <FormGroup check className="mb-2">
          <Label check>
            <Input type="checkbox" id="checkbox" onChange={handleCheckbox} checked={isAvailable} />
            Available Productss
          </Label>
        </FormGroup>
        <Button color="warning" className="mb-2" onClick={handleSearchBtn}>
          Search
        </Button>
        <Button color="warning" className="mb-2" onClick={handleAddBtn}>
          Add Product
        </Button>
      </div>
    );
  }
}

export default MainSideBar;
