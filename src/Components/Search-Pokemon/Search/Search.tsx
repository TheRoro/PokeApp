import React, {useEffect, useCallback} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import PokeBall from '../../../Assets/pokeapp.png';
import Bidoof404 from '../../../Assets/404-bidoof.png';
import Evolutions from '../Evolutions/Evolutions';
import PokemonStats from '../Stats/PokemonStats';
import Moves from '../Moves/Moves';
import pkmnInfoInit from '../../../Assets/json/pkmnInfoInit.json';
import pokemonList from '../../Tools/PokemonList';
import SearchBar from '../../Tools/SearchEngine/SearchEngine';

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
    SearchContainer,
    Icon,
    ImgIcon,
    Loading,
    LoadingCol,
    Image
} from './Styles';

type pokemonInfo = {};

type listType = any[];

const totalPkmn = 898;

const SearchPokemon: React.FC<{}> = () =>{
    let match = useRouteMatch();
    const history = useHistory();
    const [formatedName, setFormatedName] = React.useState<string>('');
    const [prettyName, setPrettyName] = React.useState<string>('');
    const [pkmnInfo, setpkmnInfo] = React.useState<pokemonInfo>(pkmnInfoInit);
    const [pkmnId, setpkmnId] = React.useState<number>(405);
    const [loading, setLoading] = React.useState(<div></div>);
    const [list, setList] = React.useState<listType>([]);

    const generateRandom = useCallback(async() => {
        let total = 6;
        let indexesSet = new Set();
        while(indexesSet.size < total){
            var max = totalPkmn;
            var rand =  Math.floor(Math.random() * Math.floor(max) + 1);
            indexesSet.add(rand);
        }
        let indexes = Array.from(indexesSet);
        let randomPkmn = []
        for (let i = 0; i < indexes.length; i++) {
            let temp = [];
            temp.push(indexes[i]);
            temp.push(pokemonList[indexes[i] as number]);
            temp.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${indexes[i]}.png`);
            randomPkmn.push(temp);
        }
        setList(randomPkmn);
    }, []);

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
            setLoading(
            <Loading>
                <Row className="justify-content-center mt-5">
                    <LoadingCol xs="auto">
                        <Image src={PokeBall} alt="pokeball"></Image>
                    </LoadingCol>
                </Row>
            </Loading>);
            var apiUrl = 'https://pokeapi.co/api/v2/pokemon/' + formatedName + '/';
            const resp = await axios.get(apiUrl);
            setpkmnInfo(resp.data);
            setpkmnId(resp.data.id);
            setLoading(<div></div>);
            history.push(`${match.url}/${formatedName}`);
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
            <Loading>
                <Row className="justify-content-center mt-5">
                    <LoadingCol xs="auto">
                        <Image src={PokeBall} alt="pokeball"></Image>
                    </LoadingCol>
                </Row>
            </Loading>);
            var apiUrl = 'https://pokeapi.co/api/v2/pokemon/' + name.toLowerCase() + '/';
            const resp = await axios.get(apiUrl);
            setpkmnInfo(resp.data);
            setFormatedName(resp.data.name);
            setpkmnId(resp.data.species.url.substring(42, resp.data.species.url.length - 1));
            setLoading(<div></div>);
            history.push(`${match.url}/${name.toLowerCase()}`);
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

    const onClickName = (id: number) => {
        // console.log(id);
        // alert(e.currentTarget.innerText.toLowerCase());
        searchWithParam(id.toString());
    }

    const onValueChange = async (val: string, code: number) => {
        setFormatedName(formated(val));
        setPrettyName(pretty(val));
        if(code === 13) {
            searchWithParam(formated(val));
        }
    }

    useEffect(() => {
        generateRandom();
    },[generateRandom]);

    return (
        <SearchContainer>
            <Switch>
            <Route path={`${match.path}/:name/evolution`}>
                <Evolutions pkmnName={formatedName}/>
            </Route>
            <Route path={`${match.path}/:name/moves`}>
                <Moves pkmnInfo={pkmnInfo}/>
            </Route>
            <Route path={`${match.path}/:name`}>
                <PokemonStats pkmnId={pkmnId} pkmnName={prettyName} pkmnInfo={pkmnInfo}/>
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
                                    <SearchBar options={pokemonList} onChangeValue={onValueChange} val={formatedName} search={searchByName}/>
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
                                                        <ImgIcon src={`${name[2]}`} alt=""/>
                                                    </Icon>
                                                </Col>
                                            </Row>
                                        </Col>
                                    ))}
                                    </Row>
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