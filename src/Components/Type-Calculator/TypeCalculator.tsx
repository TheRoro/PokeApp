import React, { useEffect, useCallback } from 'react';
import TypeSelector from './Selector/TypeSelector';
import NoTypesAlert from './Alert/NoTypesAlert';
import TypeMatchPokemon from './TypeMatchPokemon';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DefensiveCoverage from '../Search-Pokemon/Coverage/DefensiveCoverage';
import OffensiveCoverage from '../Search-Pokemon/Coverage/OffensiveCoverage';
import Navigation from '../Tools/Navigation/Navigation';
import typeList from '../../Assets/typeList';
import { Navigate, Route, Routes } from 'react-router-dom';

import {
  TypeCalDiv,
  ResultsContainer,
  TypeContainer,
  Button,
  TypeLabel,
  LastRow,
} from './Styles';

type typeName = string;

const TypeCal: React.FC = () => {
  const totalTypes = typeList.length;
  const [type1, setType1] = React.useState<typeName>('Water');
  const [type2, setType2] = React.useState<typeName>('Poison');

  const generateRandom = useCallback(() => {
    const total = 2;
    const indexesSet = new Set<number>();
    while (indexesSet.size < total) {
      const max = totalTypes;
      const rand = Math.floor(Math.random() * Math.floor(max));
      indexesSet.add(rand);
    }
    const indexes = Array.from(indexesSet);
    setType1(typeList[indexes[0]]);
    setType2(typeList[indexes[1]]);
  }, [totalTypes]);

  useEffect(() => {
    generateRandom();
  }, [generateRandom]);

  return (
    <Routes>
      <Route
        path="results"
        element={
          (type1 !== 'None' || type2 !== 'None') ? (
            <TypeCalDiv>
              <ResultsContainer>
                <Navigation left="/calc" right="" />
                <Row className="justify-content-center" style={{ gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Col xs="auto"><TypeLabel className={`${type1}`}>{type1}</TypeLabel></Col>
                  {type2 !== 'None' &&
                  <Col xs="auto"><TypeLabel className={`${type2}`}>{type2}</TypeLabel></Col>}
                </Row>
                <DefensiveCoverage type1={type1} type2={type2} />
                <OffensiveCoverage type1={type1} type2={type2} />
                <TypeMatchPokemon type1={type1} type2={type2} />
              </ResultsContainer>
            </TypeCalDiv>
          ) : (
            <Navigate to="/calc" replace />
          )
        }
      />
      <Route
        index
        element={
          <TypeCalDiv>
            <TypeContainer>
              <TypeSelector type1={type1} type2={type2} setType1={setType1} setType2={setType2} />
              {type1 === 'None' && type2 === 'None' && <NoTypesAlert />}
              {(type1 !== 'None' || type2 !== 'None') &&
              <LastRow className="justify-content-center align-items-center">
                <Col xs="auto">
                  <Button to="results">
                    Calculate
                  </Button>
                </Col>
              </LastRow>}
            </TypeContainer>
          </TypeCalDiv>
        }
      />
    </Routes>
  );
};

export default TypeCal;
