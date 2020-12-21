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
          <Container className="full-height">
            <Row className="align-items-center full-height">
              <Col>
                <Row className="justify-content-center">
                  <Col xs={12}>
                      <h1 className="title1 centered-text">PokeApp</h1>
                  </Col>
                  <Col xs={12}>
                      <p className="text1 centered-text">The Pokemon Web App, you've been waiting for...</p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
      </div>
    );
  }
}

export default Home;