import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import MoveInfo from './MoveInfo';
import Autocomplete from '../Tools/SearchEngine/SearchEngine';
import moveList from '../Tools/MoveList';
import PokeBall from '../../Assets/pokeapp.png';
import ApiError, { ApiErrorInfo } from '../Tools/ApiError/ApiError';
import { describeApiError } from '../Tools/ApiError/apiErrors';

import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import {
  Text,
  Title,
  SearchContainer,
  LoadingCol,
  LoadingImg,
} from './SearchMoveStyles';

const SearchMove: React.FC = () => {
  const max = moveList.length;
  const rand = Math.floor(Math.random() * Math.floor(max));
  const initialMove = moveList[rand];
  const navigate = useNavigate();
  const [prettyName, setPrettyName] = React.useState<string>(() => {
    let temp = '';
    for (let i = 0; i < initialMove.length; i++) {
      if (i === 0) {
        temp += initialMove[0].toUpperCase();
      } else if (initialMove[i] === '-') {
        temp += ' ';
      } else if (i !== 0 && initialMove[i - 1] === '-') {
        temp += initialMove[i].toUpperCase();
      } else {
        temp += initialMove[i];
      }
    }
    return temp;
  });
  const [moveInfo, setmoveInfo] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<ApiErrorInfo | null>(null);
  const [lastSearch, setLastSearch] = React.useState(initialMove);
  const controllerRef = React.useRef<AbortController>();

  React.useEffect(() => () => controllerRef.current?.abort(), []);

  const formatName = (value: string) => {
    let temp = '';
    for (let i = 0; i < value.length; i++) {
      if (value[i] === ' ' && i !== value.length - 1) {
        temp += '-';
      } else if (value[i] !== ' ') {
        temp += value[i];
      }
    }
    return temp.toLowerCase();
  };

  const formatPretty = (value: string) => {
    let temp = '';
    for (let i = 0; i < value.length; i++) {
      if (i === 0) {
        temp += value[0].toUpperCase();
      } else if (value[i] === '-') {
        temp += ' ';
      } else if (i !== 0 && value[i - 1] === '-') {
        temp += value[i].toUpperCase();
      } else {
        temp += value[i];
      }
    }
    return temp;
  };

  const searchMove = async (name: string) => {
    const apiName = formatName(name);
    if (!apiName) return;

    setLastSearch(apiName);
    setError(null);
    setLoading(true);
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    try {
      const apiUrl = 'https://pokeapi.co/api/v2/move/' + apiName + '/';
      const resp = await axios.get(apiUrl, { signal: controller.signal });
      setmoveInfo(resp.data);
      setPrettyName(formatPretty(resp.data.name));
      navigate('info');
    } catch (err) {
      if (axios.isCancel(err)) return;
      setError(describeApiError(err, 'move'));
    } finally {
      if (controllerRef.current === controller) setLoading(false);
    }
  };

  const onValueChange = (val: string, code: number) => {
    const apiName = formatName(val);
    setPrettyName(formatPretty(val));
    setError(null);
    if (code === 13) {
      void searchMove(apiName);
    }
  };

  return (
    <SearchContainer>
      <Routes>
        <Route
          path="info"
          element={moveInfo
            ? <MoveInfo moveInfo={moveInfo} moveName={prettyName} />
            : <Navigate to="/move" replace />}
        />
        <Route
          index
          element={
            <Container className="full-height">
              <Row className="full-height mt-5 mt-sm-4 mt-lg-5">
                <Col xs={12}>
                  <Row className="justify-content-center mt-0 mt-lg-5">
                    <Col xs="auto">
                      <Title>Search for a Move:</Title>
                    </Col>
                  </Row>
                  <Row className="justify-content-center">
                    <Col xs="auto">
                      <Text>(Eg: Tackle, Thunder Shock)</Text>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mt-4">
                    <Col xs="auto">
                      <Autocomplete
                        options={moveList}
                        onChangeValue={onValueChange}
                        val={prettyName}
                        label="Search moves"
                      />
                    </Col>
                  </Row>
                  {loading &&
                    <Row className="justify-content-center mt-5" role="status" aria-label="Loading move">
                      <LoadingCol xs="auto">
                        <LoadingImg src={PokeBall} alt="" />
                      </LoadingCol>
                    </Row>}
                  {error && <ApiError error={error} onRetry={() => void searchMove(lastSearch)} />}
                </Col>
              </Row>
            </Container>
          }
        />
      </Routes>
    </SearchContainer>
  );
};

export default SearchMove;
