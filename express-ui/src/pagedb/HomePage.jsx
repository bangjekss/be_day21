import React, { Component } from 'react';
import { CardProduct, MainSideBar, MainContent, AddModal, EditModal } from '../componentdb';
import { connect } from 'react-redux';
import {
  getProductdbAction,
  deleteProductAction,
  getProductSelectedAction,
  deleteProductSelectedAction,
} from '../redux/action';
import { loadingbg } from '../spritedb';
import Swal from 'sweetalert2';
import { Alert } from 'reactstrap';
import { warning } from '../spritedb';
import { Link } from 'react-router-dom';

class HomePage extends Component {
  state = {
    isAvailable: true,
    isOpenAddModal: false,
    isOpenEditModal: false,
  };

  componentDidMount() {
    const { getProductdbAction } = this.props;
    const { isAvailable } = this.state;
    getProductdbAction(isAvailable);
  }

  renderCardProduct = () => {
    const { rxProductdb } = this.props;
    return rxProductdb.map((value) => {
      return (
        <div className="m-1" style={{ width: '24.25%' }} key={value.id}>
          <CardProduct
            productID={value.id}
            nama={value.nama}
            harga={value.harga}
            caption={value.caption}
            stock={value.stock}
            image={value.imagePath}
            handleEditBtn={() => this.toggleEditBtn(value.id)}
            handleDeleteBtn={() => this.handleDeleteBtn(value.id)}
          />
        </div>
      );
    });
  };

  handleDeleteBtn = (productID) => {
    const { rxProductdb } = this.props;
    const { deleteProductAction } = this.props;
    const productSelected = rxProductdb.find((value) => value.id === productID);
    Swal.fire({
      title: `Are you sure to delete ${productSelected.nama}?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProductAction(productID, productSelected.nama);
      }
    });
  };
  handleCheckbox = (e) => {
    this.setState({
      isAvailable: e.target.checked,
    });
    // console.log(this.state.isAvailable);
  };
  handleSearchBtn = () => {
    const { getProductdbAction } = this.props;
    const { isAvailable } = this.state;
    getProductdbAction(isAvailable);
  };
  toggleAddBtn = () => {
    this.setState({ isOpenAddModal: !this.state.isOpenAddModal });
  };
  // closeToggleAddModal = () => {
  //   this.setState({ isOpenAddModal: !this.state.isOpenAddModal });
  // };
  toggleEditBtn = (productID) => {
    const { getProductSelectedAction } = this.props;
    const { rxProductdb } = this.props;
    const productSelected = rxProductdb.find((value) => {
      return value.id === productID;
    });
    getProductSelectedAction(productSelected);
    this.setState({ isOpenEditModal: true });
    // console.log(productSelected);
    // console.log(productID);
  };
  closeToggleEditModal = () => {
    const { deleteProductSelectedAction } = this.props;
    deleteProductSelectedAction(null);
    this.setState({ isOpenEditModal: false });
  };
  render() {
    const { rxIsLoading, rxUsername, rxVerified } = this.props; // reducer
    const { isAvailable, isOpenAddModal, isOpenEditModal } = this.state;

    if (rxIsLoading) {
      return (
        <div
          style={{
            height: '100vh',
            background: `url(${loadingbg}) no-repeat center`,
            position: 'relative',
            top: '-50px',
          }}
        ></div>
      );
    }
    return (
      <div
        className="row py-5 px-4"
        style={{
          backgroundColor: 'rgba(200,200,200,0.5)',
          minHeight: '100vh',
          width: '100%',
          margin: 0,
        }}
      >
        <div
          className="mb-4 col-12"
          style={rxUsername && rxVerified === 0 ? { display: 'block' } : { display: 'none' }}
        >
          <Alert color="warning" className="d-flex">
            <img src={warning} alt="file_err" width="25px" height="25px" className="mr-3" />
            <div>
              Your account has not been verified yet.
              <Link to="/verify">Click here to verify your account</Link>
            </div>
          </Alert>
        </div>
        <div className="d-flex">
          <MainSideBar
            handleCheckbox={this.handleCheckbox}
            isAvailable={isAvailable}
            handleSearchBtn={this.handleSearchBtn}
            handleAddBtn={this.toggleAddBtn}
          ></MainSideBar>
          <MainContent renderCardProduct={this.renderCardProduct()}></MainContent>
          <AddModal
            isOpenAddModal={isOpenAddModal}
            toggleAddBtn={this.toggleAddBtn}
            closeToggleAddModal={this.closeToggleAddModal}
          ></AddModal>
          <EditModal
            isOpenEditModal={isOpenEditModal}
            toggleEditBtn={this.toggleEditBtn}
            closeToggleEditModal={this.closeToggleEditModal}
          ></EditModal>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ productReducer, userReducer }) => {
  return {
    rxVerified: userReducer.verified,
    rxUsername: userReducer.username,
    rxIsLoading: productReducer.isLoading,
    rxProductdb: productReducer.productdb,
    rxError: productReducer.error,
    rxProductSelected: productReducer.productSelected,
  };
};

export default connect(mapStateToProps, {
  getProductdbAction,
  deleteProductAction,
  getProductSelectedAction,
  deleteProductSelectedAction,
})(HomePage);
