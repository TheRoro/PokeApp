import React from 'react';
import Calculator from './Calculator';
import TypeSelector from './TypeSelector';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DefensiveCoverage from '../Search/DefensiveCoverage';
import OffensiveCoverage from '../Search/OffensiveCoverage';

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
        <Route exact path="/typecal/results">
          <div className="typecal">
            <Container className="results">
              <Row className="justify-content-start">
                <Col xs="auto">
                  <Link to="/typecal/select">
                    <i className="fas fa-angle-left fa-2x"></i>
                  </Link>
                </Col>
              </Row>
              {/* <Row className="justify-content-center">
                <Col xs="auto">
                  <h1 className="title2 centered-text">Results:</h1>
                </Col>
              </Row> */}
              <Row className="justify-content-center">
                  <Col xs="auto"><h1 className={`centered-text calctitle ${type1}`}>Type 1: {type1}</h1></Col>
              </Row>
              {type2 !== 'None' &&
              <Row className="justify-content-center">
                  <Col xs="auto"><h1 className={`centered-text calctitle ${type2}`}>Type 2: {type2}</h1></Col>
              </Row>}
              <DefensiveCoverage type1={type1} type2={type2}/>
              <OffensiveCoverage type1={type1} type2={type2}/>
            </Container>
          </div>
        </Route>
        <Route exact path="/typecal/select">
          <div className="typecal">
            <Container className="type">
            <TypeSelector type1={type1} type2={type2} setType1={setType1} setType2={setType2}/>
              <Row className="justify-content-center align-items-end lastrow">
                <Col xs="auto" className="hover">
                  <Link to="/typecal/results" style={{ textDecoration: 'none' }}>
                      <p className="text4 mb-0">Calculate</p>
                      <hr className="lines mt-0"/>
                  </Link>
                </Col>
              </Row>
            </Container>
          </div>
        </Route>
        <Route exact path="/">
          <div className="typecal">
            <Container className="type">
            <TypeSelector type1={type1} type2={type2} setType1={setType1} setType2={setType2}/>
              <Row className="justify-content-center align-items-end lastrow">
                <Col xs="auto" className="hover">
                  <Link to="/typecal/results" style={{ textDecoration: 'none' }}>
                      <p className="text4 mb-0">Calculate</p>
                      <hr className="lines mt-0"/>
                  </Link>
                </Col>
              </Row>
            </Container>
          </div>
        </Route>
      </Switch>
    </Router>
    );
}

export default TypeCal;