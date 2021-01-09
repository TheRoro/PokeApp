import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Bidoof404 from '../../Assets/404-bidoof.png';
import moveInfoInit from '../../Assets/moveInfo.json';
import MoveInfo from './MoveInfo';
import Autocomplete from '../Tools/SearchEngine/SearchEngine';
import moveList from '../Tools/MoveList';

import {
    Switch,
    Route,
    useRouteMatch,
    useHistory
} from "react-router-dom";

import {
    Text,
    Title,
    SearchContainer,
    Bidoof404Img
} from './SearchMoveStyles'

type pokemonInfo = {};

const SearchAttack: React.FC<{}> = () =>{
    let match = useRouteMatch();
    const history = useHistory();
    const [formatedMoveName, setFormatedMoveName] = React.useState<string>('pound');
    const [moveName, setMoveName] = React.useState<string>('Pound');
    const [moveInfo, setmoveInfo] = React.useState<pokemonInfo>(moveInfoInit);
    const [loading, setLoading] = React.useState(<div></div>);

    const formatName = (value: string) => {
        let temp = "";
        for(let i = 0; i < value.length; i++) {
            if(value[i] === " " && i !== value.length - 1){
                temp+="-";
            }
            else if(value[i] !== " "){
                temp+=value[i];
            }
        }
        setFormatedMoveName(temp);
    }

    const formatPretty = (value: string) => {
        let temp = "";
        for(let i = 0; i < value.length; i++) {
            if(i === 0){
                temp+=value[0].toUpperCase();
            }
            else if(i !== 0 && value[i - 1] === " "){
                temp+=value[i].toUpperCase();
            }
            else {
                temp+=value[i];
            }
        }
        setMoveName(temp);
    }

    const searchByName = async () => {
        try {
            setLoading(
                <Row className="justify-content-center mt-5">
                    <Col xs="auto">
                        <p>Loading...</p>
                    </Col>
                </Row>);
            var apiUrl = 'https://pokeapi.co/api/v2/move/' + formatedMoveName + '/';
            const resp = await axios.get(apiUrl);
            setmoveInfo(resp.data);
            setLoading(<div></div>);
            history.push(`${match.url}/info`);
        }
        catch(err) {
            alert("Move Not Found");
            setLoading(
                <Row className="justify-content-center mt-5">
                    <Col xs="auto">
                        <Bidoof404Img src={Bidoof404} alt={'404'}/>
                    </Col>
                </Row>
                );
            console.error(err);
        }
    }

    const searchWithParam = async (name: string) => {
        try {
            setLoading(
                <Row className="justify-content-center mt-5">
                    <Col xs="auto">
                        <p>Loading...</p>
                    </Col>
                </Row>);
            var apiUrl = 'https://pokeapi.co/api/v2/move/' + name + '/';
            const resp = await axios.get(apiUrl);
            setmoveInfo(resp.data);
            setLoading(<div></div>);
            history.push(`${match.url}/info`);
        }
        catch(err) {
            alert("Move Not Found");
            setLoading(
                <Row className="justify-content-center mt-5">
                    <Col xs="auto">
                        <img className="bidoof-404" src={Bidoof404} alt={'404'}/>
                    </Col>
                </Row>
                );
            console.error(err);
        }
    }
    const onValueChange = async (val: string, code: number) => {
        formatPretty(val);
        formatName(val);
        if(code === 13) {
            searchWithParam(val);
        }
    }

    return (
        <SearchContainer>
            <Switch>
            <Route path={`${match.path}/info`}>
                <MoveInfo moveInfo={moveInfo} moveName={moveName}/>
            </Route>
            <Route path={`${match.path}/`}>
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
                                    <Autocomplete options={moveList} onChangeValue={onValueChange} val={moveName} search={searchByName}/>
                                </Col>
                            </Row>
                            <Row className="justify-content-center align-self-end mt-5">
                                <Col xs="auto">
                                    <Button variant="outline-light" size="lg" onClick={searchByName}>Search</Button>
                                </Col>
                            </Row>
                            {loading}
                        </Col>
                    </Row>
                </Container>
            </Route>
            </Switch>
        </SearchContainer>
    );
}

export default SearchAttack;