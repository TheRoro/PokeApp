import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Quotes from './Quotes';
import './Home.css';

const Home: React.FC<{}> = () => {
    var max = Quotes.length;
    var rand =  Math.floor(Math.random() * Math.floor(max));
    return (
      <div className="home">
          <Container className="full-height">
            <Row className="align-items-center full-height">
              <Col>
                <Row className="justify-content-center">
                  <Col xs={12}>
                      <h1 className="homeTitle centered-text">PokeApp</h1>
                  </Col>
                  <Col xs={12}>
                      <p className="homeText centered-text">{Quotes[rand]}</p>
                      {/* {rand} */}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
      </div>
    );
}

export default Home;