import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import speciesInfoInit from '../Assets/speciesInfoInit.json';

import {
    Link
} from "react-router-dom";

type Props = {
    pkmnName: string,
}

const EvolutionChain: React.FC<Props> = ({
    pkmnName
}) => {
    const [chainUrl, setChainUrl] = React.useState("https://pokeapi.co/api/v2/evolution-chain/209/");
    const [speciesUrl, setSpeciesUrl] = React.useState("https://pokeapi.co/api/v2/pokemon-species/");
    const [speciesInfo, setSpeciesInfo] = React.useState(speciesInfoInit);
    const [pkName, setpkName] = React.useState('');
    const [evolutionChainInfo, setEvoChainInfo] = React.useState(<Container>Evolution Chain:</Container>);

    useEffect(() => {
        if(pkName !== pkmnName.toLowerCase()){
            const fetchInfo = async () => {
                setpkName(pkmnName.toLowerCase());
                const species = await axios.get(speciesUrl + pkmnName.toLowerCase() +'/');
                console.log(species.data);
                setChainUrl(species.data.evolution_chain.url);
                console.log(species.data.evolution_chain.url);
                const evolution = await axios.get(species.data.evolution_chain.url);
                console.log(evolution.data.chain.species);
                console.log(evolution.data.chain.evolves_to[0].evolution_details[0].min_level);
                console.log(evolution.data.chain.evolves_to[0].species);
                console.log(evolution.data.chain.evolves_to[0].evolves_to[0].evolution_details[0].min_level);
                console.log(evolution.data.chain.evolves_to[0].evolves_to[0].species);
                setEvoChainInfo(
                <Row className="mt-4">
                    <Col>
                        <Row className="justify-content-center">
                            <h1 className="text1">{evolution.data.chain.species.name}</h1>
                        </Row>
                        <Row className="justify-content-center">
                            <img className="poke-chain" src={`https://pokeres.bastionbot.org/images/pokemon/${evolution.data.chain.species.url.slice(42, -1)}.png`} alt={evolution.data.chain.species.name}/>
                        </Row>
                    </Col>
                    <Col>
                        <Row className="justify-content-center">
                            <h1 className="text1">{evolution.data.chain.evolves_to[0].species.name}</h1>
                        </Row>
                        <Row className="justify-content-center">
                            <img className="poke-chain" src={`https://pokeres.bastionbot.org/images/pokemon/${evolution.data.chain.evolves_to[0].species.url.slice(42, -1)}.png`} alt={evolution.data.chain.species.name}/>
                        </Row>
                        <Row className="justify-content-center">
                            <p className="text1">{evolution.data.chain.evolves_to[0].evolution_details[0].min_level}</p>
                        </Row>
                    </Col>
                    <Col>
                        <Row className="justify-content-center">
                            <h1 className="text1">{evolution.data.chain.evolves_to[0].evolves_to[0].species.name}</h1>
                        </Row>
                        <Row className="justify-content-center">
                            <img className="poke-chain" src={`https://pokeres.bastionbot.org/images/pokemon/${evolution.data.chain.evolves_to[0].evolves_to[0].species.url.slice(42, -1)}.png`} alt={evolution.data.chain.species.name}/>
                        </Row> 
                        <Row className="justify-content-center">
                            <p className="text1">{evolution.data.chain.evolves_to[0].evolves_to[0].evolution_details[0].min_level}</p>
                        </Row>                    
                    </Col>
                </Row>);
            };
            fetchInfo();
        }
      }, []);

    return(
        <Container>
            <Row className="justify-content-center mt-4">
                  <Col xs="auto">
                    <Link to="/search/details" className="text-light">
                        <i className="fas fa-angle-up fa-2x"></i>
                    </Link>
                  </Col>
              </Row>
            <Row className="justify-content-center">
                <Col xs="auto">
                    <Row className="justify-content-center">
                        <Col xs="auto">
                            <h1 className="title2">Evolution Line:</h1>
                        </Col>
                    </Row>
                </Col>
            </Row>
            {evolutionChainInfo}
        </Container>
    );
}
export default EvolutionChain;