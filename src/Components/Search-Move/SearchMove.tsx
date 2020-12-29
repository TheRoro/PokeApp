import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Bidoof404 from '../../Assets/404-bidoof.png';
import moveInfoInit from '../../Assets/moveInfo.json';
import MoveInfo from './MoveInfo';

import {
    Switch,
    Route,
    useRouteMatch,
    useHistory
} from "react-router-dom";

type Props = {}

type pokemonName = string[];
type pokemonInfo = {};

const SearchAttack: React.FC<Props> = () =>{
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

    const handleChangeName = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = '';
        value = e.target.value.toString().toLowerCase();
        if(value[value.length - 1] === " " && value[value.length - 2] === " ") {
            value = value.slice(0, value.length - 1);
        }
        formatName(value);
        formatPretty(value);
    }

    const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        var key  = e.key || e.keyCode;
        if (key === 'Enter' || key === 13) {
            searchByName();
        }
    };

    const searchByName = async () => {
        try {
            setLoading(<div>
                Loading...
            </div>);
            var apiUrl = 'https://pokeapi.co/api/v2/move/' + formatedMoveName + '/';
            const resp = await axios.get(apiUrl);
            setmoveInfo(resp.data);
            setLoading(<div></div>);
            history.push(`${match.url}/info`);
        }
        catch(err) {
            alert("Move Not Found");
            setLoading(<div>
                <img className="bidoof-404" src={Bidoof404} alt={'404'}/>
            </div>);
            console.error(err);
        }
    }

    return (
        <div className="search">
            <Switch>
            <Route path={`${match.path}/info`}>
                <MoveInfo moveInfo={moveInfo}/>
            </Route>
            <Route path={`${match.path}/`}>
                <Container className="full-height">
                    <Row className="align-items-center full-height">
                        <Col xs={12}>
                            <Row className="justify-content-center">
                                <Col xs="auto">
                                    <h1 className="title2 centered-text">Search for a Move:</h1>
                                </Col>
                            </Row>
                            <Row className="justify-content-center">
                                <Col xs="auto">
                                    <p className="texthint centered-text">(Eg: Tackle, Thunder Shock)</p>
                                </Col>
                            </Row>
                            <Row className="justify-content-center align-self-center mt-5">
                                <Col xs="auto" className="search-text">
                                    <h1 className="title2 centered-text">{moveName}</h1>
                                </Col>
                            </Row>
                            <Row className="justify-content-center mt-4">
                                <Col xs="auto">
                                    <input className="search-engine" value={moveName} onChange={handleChangeName} onKeyPress={handleKeypress}>
                                    </input>
                                </Col>
                                <div>{''}</div>
                            </Row>
                            <Row className="justify-content-center align-self-end mt-5">
                                <Col xs="auto">
                                    <Button variant="outline-light" size="lg" onClick={searchByName}>Search</Button>
                                </Col>
                            </Row>
                            <Row className="justify-content-center mt-5">
                                <Col xs="auto">
                                    {loading}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </Route>
            </Switch>
        </div>
    );
}

export default SearchAttack;