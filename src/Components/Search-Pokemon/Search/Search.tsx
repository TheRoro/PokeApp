import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import Bidoof404 from '../../../Assets/404-bidoof.png';
import Evolutions from '../Evolutions/Evolutions';
import PokemonStats from '../Stats/PokemonStats';
import Moves from '../Moves/Moves';
import pkmnInfoInit from '../../../Assets/json/pkmnInfoInit.json';
import pokemonList from '../../Tools/PokemonList';
import Autocomplete from '../../Tools/SearchEngine/SearchEngine';

import {
    Switch,
    Route,
    useRouteMatch,
    useHistory
} from "react-router-dom";

import {
    Bidoof404Img,
    Title,
    Text,
    SearchContainer
} from './Styles';

type pokemonInfo = {};

const SearchPokemon: React.FC<{}> = () =>{
    var max = pokemonList.length;
    var rand =  Math.floor(Math.random() * Math.floor(max));
    let match = useRouteMatch();
    const history = useHistory();
    const [formatedName, setFormatedName] = React.useState<string>(pokemonList[rand]);
    const [prettyName, setPrettyName] = React.useState<string>(pokemonList[rand]);
    const [pkmnInfo, setpkmnInfo] = React.useState<pokemonInfo>(pkmnInfoInit);
    const [pkmnId, setpkmnId] = React.useState<number>(405);
    const [loading, setLoading] = React.useState(<div></div>);

    const formated = (value: string) => {
        let temp = "";
        temp = value;
        return temp;
    }

    const pretty = (value: string) => {
        let temp = "";
        for(let i = 0; i < value.length; i++) {
            if(i === 0){
                temp+=value[0].toUpperCase();
            }
            else if(value[i] === "-"){
                temp+=" ";
            }
            else if(i !== 0 && value[i - 1] === "-"){
                temp+=value[i].toUpperCase();
            }
            else {
                temp+=value[i];
            }
        }
        return temp;
    }

    const searchByName = async () => {
        try {
            setLoading(<div>
                Loading...
            </div>);
            var apiUrl = 'https://pokeapi.co/api/v2/pokemon/' + formatedName + '/';
            const resp = await axios.get(apiUrl);
            setpkmnInfo(resp.data);
            setpkmnId(resp.data.id);
            setLoading(<div></div>);
            history.push(`${match.url}/stats/${formatedName}`);
        }
        catch(err) {
            alert("Pokemon Not Found");
            setLoading(<div>
                <Bidoof404Img src={Bidoof404} alt={'404'}/>
            </div>);
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
            var apiUrl = 'https://pokeapi.co/api/v2/pokemon/' + name.toLowerCase() + '/';
            const resp = await axios.get(apiUrl);
            setpkmnInfo(resp.data);
            setpkmnId(resp.data.species.url.substring(42, resp.data.species.url.length - 1));
            setLoading(<div></div>);
            history.push(`${match.url}/stats/${name.toLowerCase()}`);
        }
        catch(err) {
            alert("Pokemon Not Found");
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
    const onValueChange = async (val: string, code: number) => {
        setFormatedName(formated(val));
        setPrettyName(pretty(val));
        if(code === 13) {
            searchWithParam(formated(val));
        }
    }
    return (
        <SearchContainer>
            <Switch>
            <Route path={`${match.path}/stats/:name`}>
                <PokemonStats pkmnId={pkmnId} pkmnName={prettyName} pkmnInfo={pkmnInfo}/>
            </Route>
            <Route path={`${match.path}/evolution`}>
                <Evolutions pkmnName={formatedName}/>
            </Route>
            <Route path={`${match.path}/moves`}>
                <Moves pkmnInfo={pkmnInfo}/>
            </Route>
            <Route path={`${match.path}/`}>
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
                                    <Autocomplete options={pokemonList} onChangeValue={onValueChange} val={formatedName} search={searchByName}/>
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

export default SearchPokemon;