import React, { useEffect, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Evolutions from '../Evolutions/Evolutions';
import PokemonStats from '../Stats/PokemonStats';
import Moves from '../Moves/Moves';
import pokemonList from '../../Tools/PokemonList';
import SearchBar from '../../Tools/SearchEngine/SearchEngine';
import { toPokemonApiSlug } from '../../Tools/pokemonNames';

import { Route, Routes, useNavigate } from 'react-router-dom';

import {
  Title,
  Text,
  SearchContainer,
  Icon,
  ImgIcon,
} from './Styles';

type listType = any[];

const totalPkmn = 898;

const SearchPokemon: React.FC = () => {
  const navigate = useNavigate();
  const [formatedName, setFormatedName] = React.useState<string>('');
  const [list, setList] = React.useState<listType>([]);

  const generateRandom = useCallback(async () => {
    const total = 6;
    const indexesSet = new Set<number>();
    while (indexesSet.size < total) {
      const max = totalPkmn;
      const rand = Math.floor(Math.random() * Math.floor(max) + 1);
      indexesSet.add(rand);
    }
    const indexes = Array.from(indexesSet);
    const randomPkmn = [];
    for (let i = 0; i < indexes.length; i++) {
      const temp = [];
      temp.push(indexes[i]);
      temp.push(pokemonList[indexes[i] as number]);
      temp.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${indexes[i]}.png`);
      randomPkmn.push(temp);
    }
    setList(randomPkmn);
  }, []);

  const onClickName = (id: number) => {
    navigate(id.toString());
  };

  const onValueChange = (val: string, code: number) => {
    const apiName = toPokemonApiSlug(val);
    setFormatedName(apiName);
    if (code === 13) {
      navigate(apiName);
    }
  };

  useEffect(() => {
    generateRandom();
  }, [generateRandom]);

  return (
    <SearchContainer>
      <Routes>
        <Route path=":name/evolution" element={<Evolutions />} />
        <Route path=":name/moves" element={<Moves />} />
        <Route path=":name" element={<PokemonStats />} />
        <Route
          index
          element={
            <Container className="full-height">
              <Row className="full-height mt-5 mt-sm-4 mt-lg-5">
                <Col xs={12}>
                  <Row className="justify-content-center mt-0 mt-lg-5">
                    <Col xs="auto">
                      <Title>Search in the Pokedex:</Title>
                    </Col>
                  </Row>
                  <Row className="justify-content-center">
                    <Col xs="auto">
                      <Text>(Eg: Pikachu, Snorlax)</Text>
                    </Col>
                  </Row>
                  <Row className="justify-content-center align-items-center mt-4">
                    <Col xs="auto">
                      <SearchBar options={pokemonList} onChangeValue={onValueChange} val={formatedName} />
                    </Col>
                  </Row>
                  <Row className="justify-content-center align-items-center h-50 mt-4 mt-sm-0">
                    <Col xs="auto">
                      <Row className="justify-content-center align-items-center">
                        {Array.isArray(list) && list.length !== 0 && list.map((name, index) => (
                          <Col key={index} xs={6} sm={6} md={4} lg={4} xl={4} className="h-100">
                            <Row className="justify-content-center align-items-center mt-5">
                              <Col xs="auto">
                                <Icon value={name[0]} onClick={() => onClickName(name[0] as number)}>
                                  <ImgIcon src={`${name[2]}`} alt="" />
                                </Icon>
                              </Col>
                            </Row>
                          </Col>
                        ))}
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          }
        />
      </Routes>
    </SearchContainer>
  );
};

export default SearchPokemon;
