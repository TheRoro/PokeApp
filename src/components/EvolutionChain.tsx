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
    const [pkName, setpkName] = React.useState('');
    const [stage1, setStage1] = React.useState(<Col><p className="text1">Loading...</p></Col>)
    const [stage2, setStage2] = React.useState(<div></div>)
    const [stage3, setStage3] = React.useState(<div></div>)
    useEffect(() => {
        if(pkName !== pkmnName.toLowerCase()){
            const fetchInfo = async () => {
                setpkName(pkmnName.toLowerCase());
                const species = await axios.get(speciesUrl + pkmnName.toLowerCase() +'/');
                // console.log(species.data);
                setChainUrl(species.data.evolution_chain.url);
                // console.log(species.data.evolution_chain.url);
                const evolution = await axios.get(species.data.evolution_chain.url);

                setStage1(
                <Row className="align-items-center">
                    <Col xs={12} className="mb-4">
                        <Row className="justify-content-center">
                            <h1 className="text1">{evolution.data.chain.species.name}</h1>
                        </Row>
                        <Row className="justify-content-center">
                            <img className="poke-chain" src={`https://pokeres.bastionbot.org/images/pokemon/${evolution.data.chain.species.url.slice(42, -1)}.png`} alt={evolution.data.chain.species.name}/>
                        </Row>
                    </Col>
                </Row>
                );
                
                if(evolution.data.chain.evolves_to.length !== 0) {
                    const stage2 = [];
                    for(let i = 0; i < evolution.data.chain.evolves_to.length; i++){
                        const temp = [];
                        temp.push(evolution.data.chain.evolves_to[i].species.name)
                        temp.push(evolution.data.chain.evolves_to[i].species.url.slice(42, -1));
                        temp.push(JSON.stringify(evolution.data.chain.evolves_to[i].evolution_details[0]));
                        stage2.push(temp);
                    }
                    const listSpecies = stage2.map((species) =>
                        <Col key={species[1]} xs={12} className="mb-4">
                            <Row className="justify-content-center">
                                <h1 className="text1">{species[0]}</h1>
                            </Row>
                            <Row className="justify-content-center">
                                <img className="poke-chain" src={`https://pokeres.bastionbot.org/images/pokemon/${species[1]}.png`} alt={species[0]}/>
                            </Row>
                            <Row className="justify-content-center">
                                {/* <p className="text1">{species[2]}</p> */}
                            </Row>
                        </Col>
                    );
                    setStage2(
                        <Row className="align-items-center">
                            {listSpecies}
                        </Row>
                    );
                    if(evolution.data.chain.evolves_to[0].evolves_to.length !== 0) {
                        const stage3 = [];
                        for(let i = 0; i < evolution.data.chain.evolves_to[0].evolves_to.length; i++){
                            const temp = [];
                            temp.push(evolution.data.chain.evolves_to[0].evolves_to[i].species.name)
                            temp.push(evolution.data.chain.evolves_to[0].evolves_to[i].species.url.slice(42, -1));
                            temp.push(evolution.data.chain.evolves_to[0].evolves_to[i].evolution_details[0]);
                            stage3.push(temp);
                        }
                        const listSpecies3 = stage3.map((species) =>
                            <Col key={species[1]} xs={12} className="mb-4">
                                <Row className="justify-content-center">
                                    <h1 className="text1">{species[0]}</h1>
                                </Row>
                                <Row className="justify-content-center">
                                    <img className="poke-chain" src={`https://pokeres.bastionbot.org/images/pokemon/${species[1]}.png`} alt={species[0]}/>
                                </Row>
                                <Row className="justify-content-center">
                                    {/* <p className="text1">{species[2]}</p> */}
                                </Row>
                            </Col>
                        );
                        setStage3(
                            <Row className="align-items-center">
                                {listSpecies3}                  
                            </Row>
                        );
                    }
                }
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
            <Row className="mt-4 align-items-center">
                <Col xs={12} md={4}>
                    {stage1}
                </Col>
                <Col xs={12} md={4}>
                    {stage2}
                </Col>
                <Col xs={12} md={4}>
                    {stage3}
                </Col>
            </Row>
        </Container>
    );
}
export default EvolutionChain;