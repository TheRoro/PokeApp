import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Bidoof404 from '../Assets/404-bidoof.png';
import PokemonDetails from './PokemonDetails';

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
    const [pkmnInfo, setpkmnInfo] = React.useState<pokemonInfo>();
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

    const validateName = async (name: string) => {
        if(name === "deoxys") {
            setpkmnName(["Deoxys", "deoxys-normal"]);
            return false;
        }
        if(name === "giratina") {
            setpkmnName(["Giratina", "giratina-altered"]);
            return false;
        }
        return true;
    }

    const searchByName = async () => {
        try {
            setLoading(<div>
                Loading...
            </div>);
            const ans = await validateName(pkmnName[1]);
            var apiUrl = 'https://pokeapi.co/api/v2/pokemon/' + pkmnName[1] + '/';
            if (!ans) {
                if(pkmnName[0] === "Deoxys")
                    apiUrl = 'https://pokeapi.co/api/v2/pokemon/deoxys-normal/';
                else if(pkmnName[0] === "Giratina")
                    apiUrl = 'https://pokeapi.co/api/v2/pokemon/giratina-altered/';
            }    
            const resp = await axios.get(apiUrl);
            setpkmnInfo(resp.data);
            setpkmnId(resp.data.id);
            setpkmnImg(<img className="poke-image" src={`https://pokeres.bastionbot.org/images/pokemon/${resp.data.id}.png`} alt={resp.data.name}/>);
            setLoading(<div></div>);
            history.push(`${match.url}/details`);
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
        <div className="mt-3">
            <Switch>
            <Route path={`${match.path}/details`}>
                <PokemonDetails pkmnId={pkmnId} pkmnName={pkmnName} pkmnInfo={pkmnInfo} pkmnImg={pkmnImg}/>
            </Route>
            <Route path={`${match.path}/`}>
                <Container>
                <Row className="justify-content-md-center mt-5">
                    <Col md="auto">
                        <h1 className="title2">Search in the Pokedex:</h1>
                    </Col>
                </Row>
                <Row className="justify-content-md-center mt-5">
                    <Col md="auto">
                        <h1 className="title2">{pkmnName[0]}</h1>
                    </Col>
                </Row>
                <Row className="justify-content-md-center mt-5 pt-4">
                    <Col md="auto">
                        <input value={pkmnName[0]} onChange={handleChangeName}>
                        </input>
                    </Col>
                    <div>{''}</div>
                </Row>
                <Row className="justify-content-md-center mt-5 pt-4">
                    <Col md="auto">
                        <Button variant="outline-light" size="lg" onClick={searchByName}>Search</Button>
                    </Col>
                </Row>
                <Row className="justify-content-md-center mt-5">
                    <Col md="auto">
                        {loading}
                    </Col>
                </Row>
                </Container>
            </Route>
            </Switch>
        </div>
    );
}

export default SearchPokemon;