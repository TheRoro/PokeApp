import React from 'react';
import Quotes from './Quotes';
import {
  Title,
  Text,
  HomeContainer,
  FooterContainer,
  FooterLink,
  Row,
  Col,
  Container
} from './HomeStyles';

const Home: React.FC<{}> = () => {
    var max = Quotes.length;
    var rand =  Math.floor(Math.random() * Math.floor(max));
    return (
      <>
      <HomeContainer>
          <Container>
            <Row className="align-items-center">
              <Col>
                <Row className="justify-content-center">
                  <Col xs={12}>
                      <Title>PokeApp</Title>
                  </Col>
                  <Col xs={12}>
                      <Text>{Quotes[rand]}</Text>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
      </HomeContainer>
      <FooterContainer>
        <div className="full-height container-fluid">
          <Row className="align-items-center">
            <Col>
              <Row className="justify-content-center">
                <Col xs={12}>
                    <FooterLink to="/older-versions">Older Versions</FooterLink>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </FooterContainer>
    </>
    );
}

export default Home;