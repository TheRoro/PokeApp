import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Bidoof404 from '../../Assets/404-bidoof.png';
import EvolutionChain from './EvolutionChain';
import PokemonStats from './PokemonStats';
import pkmnInfoInit from '../../Assets/pkmnInfoInit.json';

import {
    Switch,
    Route,
    useRouteMatch,
    useHistory
} from "react-router-dom";

type Props = {}

type pokemonName = string[];
type pokemonInfo = {};

const SearchPokemon: React.FC<Props> = () =>{
    let match = useRouteMatch();
    const history = useHistory();
    const [pkmnName, setpkmnName] = React.useState<pokemonName>(['Luxray', 'luxray']);
    const [pkmnInfo, setpkmnInfo] = React.useState<pokemonInfo>(pkmnInfoInit);
    const [pkmnId, setpkmnId] = React.useState<number>(405);
    const [pkmnImg, setpkmnImg] = React.useState(<img className="poke-image" src={`https://pokeres.bastionbot.org/images/pokemon/405.png`} alt={'luxray'}/>);
    const [loading, setLoading] = React.useState(<div></div>);

    const handleChangeName = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let temp = [];
        let formatName = '';
        let value = '';
        value = e.target.value.toString().toLowerCase();
        if(value.length > 0) {
            formatName = value[0].toUpperCase() + value.slice(1, value.length);
        }
        temp.push(formatName);
        temp.push(value);
        setpkmnName(temp);
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
            var apiUrl = 'https://pokeapi.co/api/v2/pokemon/' + pkmnName[1] + '/';
            if(pkmnName[0] === "Deoxys"){
                apiUrl = 'https://pokeapi.co/api/v2/pokemon/deoxys-normal/';
            }
            else if(pkmnName[0] === "Giratina"){
                setpkmnImg(<img className="poke-image" src={`https://pokeres.bastionbot.org/images/pokemon/487-altered.png`} alt="Giratina"/>);
                apiUrl = 'https://pokeapi.co/api/v2/pokemon/giratina-altered/';
            }
            const resp = await axios.get(apiUrl);
            setpkmnInfo(resp.data);
            setpkmnId(resp.data.id);
            if(pkmnName[1] !== "giratina"){
                setpkmnImg(<img className="poke-image" src={`https://pokeres.bastionbot.org/images/pokemon/${resp.data.id}.png`} alt={resp.data.name}/>);
            }
            setLoading(<div></div>);
            history.push(`${match.url}/stats`);
        }
        catch(err) {
            alert("Pokemon Not Found");
            setLoading(<div>
                <img className="bidoof-404" src={Bidoof404} alt={'404'}/>
            </div>);
            console.error(err);
        }
    }

    return (
        <div className="search">
            <Switch>
            <Route path={`${match.path}/stats`}>
                <PokemonStats pkmnId={pkmnId} pkmnName={pkmnName} pkmnInfo={pkmnInfo} pkmnImg={pkmnImg}/>
            </Route>
            <Route path={`${match.path}/evolution`}>
                <EvolutionChain pkmnName={pkmnName[0]}/>
            </Route>
            <Route path={`${match.path}/`}>
                <Container className="full-height">
                    <Row className="align-items-center full-height">
                        <Col xs={12}>
                            <Row className="justify-content-center">
                                <Col xs="auto">
                                    <h1 className="title2 centered-text">Search in the Pokedex:</h1>
                                </Col>
                            </Row>
                            <Row className="justify-content-center">
                                <Col xs="auto">
                                    <p className="texthint centered-text">(Eg: Pikachu, Snorlax)</p>
                                </Col>
                            </Row>
                            <Row className="justify-content-center align-self-center mt-5">
                                <Col xs="auto" className="search-text">
                                    <h1 className="title2 centered-text">{pkmnName[0]}</h1>
                                </Col>
                            </Row>
                            <Row className="justify-content-center mt-4">
                                <Col xs="auto">
                                    <input className="search-engine" value={pkmnName[0]} onChange={handleChangeName} onKeyPress={handleKeypress}>
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

export default SearchPokemon;