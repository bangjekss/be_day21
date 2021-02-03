import React, { Component } from 'react';
import {
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarText,
  NavbarToggler,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  Button,
} from 'reactstrap';
import { logoYuchase, avaDefault } from '../spritedb';
// import { LoginPage, RegisterPage } from '../pagedb';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutAction } from '../redux/action';

class Header extends Component {
  state = {
    isOpen: false,
  };
  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };
  handleLogout = () => {
    console.log('ea');
    const { logoutAction } = this.props;
    logoutAction();
  };
  render() {
    const { rxUsername } = this.props;
    return (
      <div
        style={{
          boxShadow: '0px 1px 10px 1px rgba(0,0,0,0.3)',
          width: '100%',
          position: 'sticky',
          zIndex: '1',
        }}
        className=""
      >
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">
            <img src={logoYuchase} alt="file_err" height="60" width="80" />
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink>
                  <Link to="/chat">
                    <div>Chat</div>
                  </Link>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  <Link to="/chat-cord">
                    <div>Chat Cord</div>
                  </Link>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Options
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>Option 1</DropdownItem>
                  <DropdownItem>Option 2</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>Reset</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>

            {rxUsername ? (
              <Nav className="d-flex align-items-center">
                <NavItem className="mx-1">{rxUsername}</NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    <img src={avaDefault} alt="file_err" width="50" height="50" />
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>Option 1</DropdownItem>
                    <DropdownItem>Option 2</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem onClick={this.handleLogout}>Logout</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            ) : (
              <Nav>
                <NavItem className="mx-1">
                  <Link to="/login">
                    <Button color="warning" style={{ width: '90px' }}>
                      Login
                    </Button>
                  </Link>
                </NavItem>
                <NavItem className="mx-1">
                  <Link to="/register">
                    <Button color="warning" style={{ width: '90px' }}>
                      Sign up
                    </Button>
                  </Link>
                </NavItem>
              </Nav>
            )}
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = ({ userReducer }) => {
  return {
    rxUsername: userReducer.username,
  };
};

export default connect(mapStateToProps, { logoutAction })(Header);
