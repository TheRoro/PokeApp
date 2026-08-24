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
import { getTypeColor } from '../Tools/TypeBadge';
import typeIcons from '../../Assets/type-icons';
import {
  Navigate,
  Route,
  Routes,
  createSearchParams,
  useSearchParams,
} from 'react-router-dom';

import {
  TypeCalDiv,
  ResultsContainer,
  TypeContainer,
  Button,
  LastRow,
  ResultsDescription,
  ResultsEyebrow,
  ResultsHeader,
  ResultsTitle,
  SelectedType,
  SelectedTypeIcon,
  SelectedTypeIconFrame,
  SelectedTypeName,
  SelectedTypeRole,
  SelectedTypes,
  SelectedTypeText,
} from './Styles';

type typeName = string;

const parseType = (value: string | null): typeName | null => {
  if (!value) return null;

  if (value.toLowerCase() === 'none') return 'None';
  return typeList.find(type => type.toLowerCase() === value.toLowerCase()) ?? null;
};

const TypeCal: React.FC = () => {
  const totalTypes = typeList.length;
  const [searchParams] = useSearchParams();
  const queryType1 = searchParams.get('type1');
  const queryType2 = searchParams.get('type2');
  const [type1, setType1] = React.useState<typeName>(
    () => parseType(queryType1) ?? 'Water',
  );
  const [type2, setType2] = React.useState<typeName>(
    () => parseType(queryType2) ?? 'Poison',
  );

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
    if (!queryType1 && !queryType2) generateRandom();
  }, [generateRandom, queryType1, queryType2]);

  const resultType1 = parseType(queryType1) ?? 'None';
  const parsedResultType2 = parseType(queryType2);
  const resultType2 =
    parsedResultType2 && parsedResultType2 !== resultType1
      ? parsedResultType2
      : 'None';
  const resultSearch = createSearchParams({
    type1: type1.toLowerCase(),
    type2: type2.toLowerCase(),
  }).toString();

  return (
    <Routes>
      <Route
        path="results"
        element={
          (resultType1 !== 'None' || resultType2 !== 'None') ? (
            <TypeCalDiv>
              <ResultsContainer>
                <Navigation left="/calc" right="" />
                <ResultsHeader>
                  <ResultsEyebrow>Matchup analysis</ResultsEyebrow>
                  <ResultsTitle>Matchup results</ResultsTitle>
                  <ResultsDescription>
                    See how this typing handles incoming attacks, what each type hits well, and which Pokémon share it.
                  </ResultsDescription>
                </ResultsHeader>
                <SelectedTypes aria-label="Selected types">
                  <SelectedType
                    $color={getTypeColor(resultType1)}
                    aria-label={`Primary type: ${resultType1}`}
                  >
                    <SelectedTypeIconFrame $color={getTypeColor(resultType1)}>
                      <SelectedTypeIcon src={typeIcons[resultType1]} alt="" />
                    </SelectedTypeIconFrame>
                    <SelectedTypeText>
                      <SelectedTypeRole>Primary type</SelectedTypeRole>
                      <SelectedTypeName>{resultType1}</SelectedTypeName>
                    </SelectedTypeText>
                  </SelectedType>
                  {resultType2 !== 'None' && (
                    <SelectedType
                      $color={getTypeColor(resultType2)}
                      aria-label={`Secondary type: ${resultType2}`}
                    >
                      <SelectedTypeIconFrame $color={getTypeColor(resultType2)}>
                        <SelectedTypeIcon src={typeIcons[resultType2]} alt="" />
                      </SelectedTypeIconFrame>
                      <SelectedTypeText>
                        <SelectedTypeRole>Secondary type</SelectedTypeRole>
                        <SelectedTypeName>{resultType2}</SelectedTypeName>
                      </SelectedTypeText>
                    </SelectedType>
                  )}
                </SelectedTypes>
                <DefensiveCoverage type1={resultType1} type2={resultType2} />
                <OffensiveCoverage type1={resultType1} type2={resultType2} />
                <TypeMatchPokemon type1={resultType1} type2={resultType2} />
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
                  <Button to={`/calc/results?${resultSearch}`}>
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
