import React, { Component } from 'react';
import { Button, Card, CardText, CardTitle } from 'reactstrap';
import { api_url } from '../favordb';
import { error_img } from '../spritedb';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  root: {
    maxWidth: 300,
    transitionProperty: 'boxShadow',
    transitionDuration: '2s',
    '&:hover': {
      boxShadow: '0px 5px 10px 5px rgba(0,0,0,0.5) ',
    },
  },
});

class CardProduct extends Component {
  state = {};

  render() {
    const { nama, harga, caption, stock, handleDeleteBtn, handleEditBtn, image } = this.props;
    // const imagePath = api_url + image;
    // console.log(imagePath);
    const { classes } = this.props;
    return (
      <Card body inverse style={{ backgroundColor: '#333' }} className={classes.root}>
        <CardTitle tag="h5">{nama}</CardTitle>
        <img
          src={image ? `${api_url}${image}` : error_img}
          alt="file_err"
          style={{ maxHeight: '200px', objectFit: 'cover', height: '200px', borderRadius: '10px' }}
        />
        <CardText>{caption}</CardText>
        <CardText>Rp{harga.toLocaleString()}</CardText>
        <CardText>Stock: {stock}</CardText>
        <Button className="my-1" color="warning">
          Details
        </Button>
        <Button className="my-1" color="primary" onClick={handleEditBtn}>
          Edit
        </Button>
        <Button className="my-1" color="danger" onClick={handleDeleteBtn}>
          Delete
        </Button>
      </Card>
    );
  }
}

export default withStyles(styles, { withTheme: true })(CardProduct);
