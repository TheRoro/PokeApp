import React from 'react';
import TypeSelector from './Selector/TypeSelector';
import NoTypesAlert from './Alert/NoTypesAlert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DefensiveCoverage from '../Search-Pokemon/Coverage/DefensiveCoverage';
import OffensiveCoverage from '../Search-Pokemon/Coverage/OffensiveCoverage';
import Navigation from '../Tools/Navigation/Navigation';

import {
    Switch,
    Route,
    useRouteMatch,
    Redirect
} from 'react-router-dom';

import {
  TypeCalDiv,
  ResultsContainer,
  TypeContainer,
  Button,
  Title,
  LastRow
} from './Styles';

type typeName = string;

const TypeCal: React.FC<{}> = () =>{
    let match = useRouteMatch();
    const [type1, setType1] = React.useState<typeName>('Water');
    const [type2, setType2] = React.useState<typeName>('Poison');

    return (
      <Switch>
        {(type1 !== "None" || type2 !== "None") &&
        <Route path={`${match.path}/results`}>
          <TypeCalDiv>
            <ResultsContainer>
              <Navigation left="/calc" right=""/>
              <Row className="justify-content-center">
                  <Col xs="auto"><Title className={`${type1}`}>Type 1: {type1}</Title></Col>
              </Row>
              {type2 !== 'None' &&
              <Row className="justify-content-center">
                  <Col xs="auto"><Title className={`${type2}`}>Type 2: {type2}</Title></Col>
              </Row>}
              <DefensiveCoverage type1={type1} type2={type2}/>
              <OffensiveCoverage type1={type1} type2={type2}/>
            </ResultsContainer>
          </TypeCalDiv>
        </Route>}
        <Route path={`${match.path}/results`}>
          <Redirect to={`${match.path}/`} />
        </Route>
        <Route path={`${match.path}/`}>
          <TypeCalDiv>
            <TypeContainer>
            <TypeSelector type1={type1} type2={type2} setType1={setType1} setType2={setType2}/>
            {type1 === "None" && type2 === "None" && <NoTypesAlert/>}
              {(type1 !== "None" || type2 !== "None") && 
              <LastRow className="justify-content-center align-items-center">
                <Col xs="auto">
                  <Button to={`${match.path}/results`}>
                      Calculate
                  </Button>
                </Col>
              </LastRow>}
            </TypeContainer>
          </TypeCalDiv>
        </Route>
      </Switch>
    );
}

export default TypeCal;