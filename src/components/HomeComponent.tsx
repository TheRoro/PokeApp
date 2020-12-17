import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
type State = {

}

type Props = {

}

class Home extends React.Component<Props,State> {

  render() {
    return (
      <div className="home">
          <Container>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <h1 className="title1">PokeApp</h1>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <p className="text1">The Pokemon Web App, you've been waiting for...</p>
                    </Col>
                </Row>
          </Container>
      </div>
    );
  }
}

export default Home;