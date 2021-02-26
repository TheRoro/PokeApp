import React from 'react';
import Quotes from './Quotes';
import { useHistory } from "react-router-dom";
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
    const history = useHistory();
    var max = Quotes.length;
    var rand =  Math.floor(Math.random() * Math.floor(max));
    const clickHandler = () => {
      history.push(`/older-versions`);
    }
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
                    <FooterLink onClick={clickHandler}>Older Versions</FooterLink>
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