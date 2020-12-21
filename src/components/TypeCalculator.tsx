import React from 'react';
import Calculator from './Calculator';
import TypeSelector from './TypeSelector';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';

type Props = {

}

type typeName = string;

const TypeCal: React.FC<Props> = () =>{
    const [type1, setType1] = React.useState<typeName>('Fire');
    const [type2, setType2] = React.useState<typeName>('Fighting');

    return (
    <Router>
      <Switch>
        <Route path="/results">
          <Container>
            <Row className="justify-content-md-start">
              <Col md="auto">
                <Link to="/">
                  <p className="calculateBtn">Back</p>
                </Link>
              </Col>
            </Row>
          </Container>
          <Calculator type1={type1} type2={type2}/>
        </Route>
        <Route path="/">
          <TypeSelector type1={type1} type2={type2} setType1={setType1} setType2={setType2}/>
          <Container className="mt-5" fluid>
            <Row className="justify-content-md-center">
              <Col md="auto">
                <Link to="/results" style={{ textDecoration: 'none' }}>
                  <div className="BtnLink">
                    <p className="calculateBtn mb-0 centered-text">Calculate</p>
                    <hr className="lines mt-0"/>
                  </div>
                </Link>
              </Col>
            </Row>
          </Container>
        </Route>
      </Switch>
    </Router>
    );
}

export default TypeCal;