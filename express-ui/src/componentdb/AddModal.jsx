import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  CustomInput,
} from 'reactstrap';
import { connect } from 'react-redux';
import { postProductAction } from '../redux/action';
import Swal from 'sweetalert2';

class AddModal extends Component {
  state = {
    nama: null,
    harga: null,
    stock: null,
    caption: null,
    // isAvailable: 1,
    image: {
      imageName: 'Choose file',
      imageFile: null,
    },
  };

  handleOnChangeImage = (e) => {
    if (e.target.files[0]) {
      this.setState({
        image: {
          imageName: e.target.files[0].name,
          imageFile: e.target.files[0],
        },
      });
    } else {
      this.setState({
        image: {
          imageName: 'Choose file',
          imageFile: null,
        },
      });
    }
    console.log(this.state.image);
  };
  handleOnChangeState = (e) => {
    this.setState({
      ...this.state,
      [e.target.id]: e.target.value,
    });
    if (e.target.id === 'harga' || e.target.id === 'stock') {
      this.setState({
        ...this.state,
        [e.target.id]: parseInt(e.target.value),
      });
    }
    console.log(this.state);
  };
  handleAddBtn = () => {
    const { postProductAction } = this.props; // action
    const { nama, harga, stock, caption, image } = this.state;
    if (!nama || !harga || !stock || !caption || !image.imageFile) {
      return Swal.fire({
        title: 'The fields cannot be empty!!',
        icon: 'error',
        timer: 3000,
        timerProgressBar: true,
      });
    }
    postProductAction(this.state);
    this.props.toggleAddBtn();
  };
  toggleAddBtn = () => {
    const { toggleAddBtn } = this.props;
    toggleAddBtn();
    this.setState({
      image: {
        imageName: 'Choose file',
        imageFile: null,
      },
    });
  };
  render() {
    const { isOpenAddModal } = this.props;
    const { imageName } = this.state.image;
    return (
      <div>
        <Modal isOpen={isOpenAddModal} toggle={this.toggleAddBtn}>
          <ModalHeader toggle={this.toggleAddBtn}>Add new product</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Input type="text" id="nama" placeholder="Name" onChange={this.handleOnChangeState} />
            </FormGroup>
            <FormGroup>
              <Label>Harga</Label>
              <Input
                type="number"
                id="harga"
                placeholder="Price"
                onChange={this.handleOnChangeState}
              />
            </FormGroup>
            <FormGroup>
              <Label>Stock</Label>
              <Input
                type="number"
                id="stock"
                placeholder="Stock"
                onChange={this.handleOnChangeState}
              />
            </FormGroup>
            <FormGroup>
              <Label>Caption</Label>
              <Input
                type="text"
                id="caption"
                placeholder="Caption"
                onChange={this.handleOnChangeState}
              />
            </FormGroup>
            <FormGroup>
              <Label>Image</Label>
              <CustomInput
                type="file"
                placeholder="Choose file"
                label={imageName}
                onChange={this.handleOnChangeImage}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="warning" onClick={this.handleAddBtn}>
              Add
            </Button>
            <Button color="danger" onClick={this.toggleAddBtn}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default connect(null, { postProductAction })(AddModal);
