import React from 'react';
import TypeSelector from './TypeSelector';
import NoTypesAlert from './NoTypesAlert';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DefensiveCoverage from '../Search-Pokemon/Coverage/DefensiveCoverage';
import OffensiveCoverage from '../Search-Pokemon/Coverage/OffensiveCoverage';
import Navigation from '../Tools/Navigation';

import {
    Switch,
    Route,
    useRouteMatch,
    Link,
    Redirect
} from 'react-router-dom';

type typeName = string;

const TypeCal: React.FC<{}> = () =>{
    let match = useRouteMatch();
    const [type1, setType1] = React.useState<typeName>('Water');
    const [type2, setType2] = React.useState<typeName>('Poison');

    return (
      <Switch>
        {(type1 !== "None" || type2 !== "None") &&
        <Route path={`${match.path}/results`}>
          <div className="typecal">
            <Container className="results">
              <Navigation left="/calc" right=""/>
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
        </Route>}
        <Route path={`${match.path}/results`}>
          <Redirect to={`${match.path}/`} />
        </Route>
        <Route path={`${match.path}/`}>
          <div className="typecal">
            <Container className="type">
            <TypeSelector type1={type1} type2={type2} setType1={setType1} setType2={setType2}/>
            {type1 === "None" && type2 === "None" && <NoTypesAlert/>}
              {(type1 !== "None" || type2 !== "None") && <Row className="justify-content-center align-items-end lastrow">
                <Col xs="auto" className="hover">
                  <Link to={`${match.path}/results`} style={{ textDecoration: 'none' }}>
                      <p className="text4 mb-0">Calculate</p>
                      <hr className="lines mt-0"/>
                  </Link>
                </Col>
              </Row>}
            </Container>
          </div>
        </Route>
      </Switch>
    );
}

export default TypeCal;