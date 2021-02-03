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
import { postProductAction, editProductAction } from '../redux/action';
import Swal from 'sweetalert2';

class EditModal extends Component {
  state = {
    id: null,
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
  // componentDidMount() {
  //   const { rxProductSelected } = this.props;
  //   // console.log(rxProductSelected);
  //   // console.log(this.state);
  // }
  componentDidUpdate(prevProps, prevState) {
    const { rxProductSelected } = this.props;
    if (prevProps.rxProductSelected !== rxProductSelected) {
      if (rxProductSelected) {
        this.setState({
          id: rxProductSelected.id,
          nama: rxProductSelected.nama,
          harga: rxProductSelected.harga,
          stock: rxProductSelected.stock,
          caption: rxProductSelected.caption,
        });
      }
      // console.log(rxProductSelected);
    }
  }
  handleInputTemp = (e) => {
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
  };
  handleConfirmBtn = (productID) => {
    const { editProductAction } = this.props; // action
    const { id, nama, harga, stock, caption, image } = this.state;
    const patchData = {
      id,
      nama,
      harga,
      stock,
      caption,
      image,
    };
    if (!nama || !harga || !stock || !caption) {
      return Swal.fire({
        title: 'The fields cannot be empty!!',
        icon: 'error',
        timer: 3000,
        timerProgressBar: true,
      });
    }
    editProductAction(patchData);
    this.props.closeToggleEditModal();
  };
  handleOnChangeImage = (e) => {
    if (e.target.files[0]) {
      this.setState({
        image: {
          imageName: e.target.files[0].name,
          imageFile: e.target.files[0],
        },
      });
      // console.log(e.target);
    } else {
      this.setState({
        image: {
          imageName: 'Choose file',
          imageFile: null,
        },
      });
    }
    // console.log(this.state.image);
  };
  closeToggleEditModal = () => {
    console.log(this.state);
    const { closeToggleEditModal } = this.props;
    closeToggleEditModal();
    this.setState({
      image: {
        imageName: 'Choose file',
        imageFile: null,
      },
    });
  };
  render() {
    // console.log(this.state);
    const { imageName } = this.state.image;
    const { rxProductSelected } = this.props;
    const { isOpenEditModal, toggleEditBtn } = this.props;
    return (
      <div>
        <Modal isOpen={isOpenEditModal} toggle={toggleEditBtn} onClosed={this.closeToggleEditModal}>
          <ModalHeader toggle={toggleEditBtn}>Edit product</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Nama</Label>
              <Input
                type="text"
                id="nama"
                placeholder="Name"
                onChange={this.handleInputTemp}
                defaultValue={rxProductSelected ? rxProductSelected.nama : ''}
              />
            </FormGroup>
            <FormGroup>
              <Label>Harga</Label>
              <Input
                type="number"
                id="harga"
                placeholder="Price"
                onChange={this.handleInputTemp}
                defaultValue={rxProductSelected ? rxProductSelected.harga : ''}
              />
            </FormGroup>
            <FormGroup>
              <Label>Stock</Label>
              <Input
                type="number"
                id="stock"
                placeholder="Stock"
                onChange={this.handleInputTemp}
                defaultValue={rxProductSelected ? rxProductSelected.stock : ''}
              />
            </FormGroup>
            <FormGroup>
              <Label>Caption</Label>
              <Input
                type="text"
                id="caption"
                placeholder="Caption"
                onChange={this.handleInputTemp}
                defaultValue={rxProductSelected ? rxProductSelected.caption : ''}
              />
            </FormGroup>
            <FormGroup>
              <Label>Image</Label>
              <CustomInput
                type="file"
                // placeholder="Choose file"
                label={imageName}
                onChange={this.handleOnChangeImage}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              color="warning"
              onClick={rxProductSelected ? () => this.handleConfirmBtn(rxProductSelected.id) : null}
            >
              Confirm
            </Button>
            <Button color="danger" onClick={this.closeToggleEditModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = ({ productReducer }) => {
  return {
    rxProductSelected: productReducer.productSelected,
  };
};

export default connect(mapStateToProps, { postProductAction, editProductAction })(EditModal);
