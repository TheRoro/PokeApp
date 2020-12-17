import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

type State = {

}

type Props = {

}

class Home extends React.Component<Props,State> {

  render() {
    return (
      <div className="home">
        <Navbar expand="md" variant="dark" className="MyNavbar">
            <Navbar.Brand>PokeApp</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
                <Nav.Link href="#pricing" className="text-light">
                    Search Pokemon
                </Nav.Link>
                <Nav.Link href="#pricing" className="text-light">
                    Type Calculator
                </Nav.Link>
            </Navbar.Collapse>
        </Navbar>
        <h1 className="title1">PokeApp</h1>
        <p className="text1">The Pokemon Web App, you've been waiting for...</p>
      </div>
    );
  }
}

export default Home;