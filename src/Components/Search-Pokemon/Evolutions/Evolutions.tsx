import React, { useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import Navigation from '../../Tools/Navigation/Navigation';
import Bidoof404 from '../../../Assets/404-bidoof.png';
import PokeBall from '../../../Assets/pokeapp.png';
import { useParams } from "react-router-dom";
import 'react-lazy-load-image-component/src/effects/blur.css';
import {
    SubTitle,
    Title,
    EvolutionsContainer,
    LoadingCol,
    LoadingImg,
    LazyImage
} from './Styles';

type Props = {
    pkmnName: string,
}

interface ParamTypes {
    name: string
}

const Evolutions: React.FC<Props> = ({
    pkmnName
}) => {
    let {name} = useParams<ParamTypes>();
    const [pkName, setpkName] = React.useState('hola');
    const [stage1, setStage1] = React.useState(
    <LoadingCol xs="auto">
        <LoadingImg src={PokeBall} alt="pokeball"></LoadingImg>
    </LoadingCol>)
    const [stage2, setStage2] = React.useState(<div></div>)
    const [stage3, setStage3] = React.useState(<div></div>)
    useEffect(() => {
        if(pkName !== pkmnName.toLowerCase()){
            const fetchInfo = async () => {
                setpkName(pkmnName.toLowerCase());
                try {
                    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/' + name + '/';
                    const resp = await axios.get(apiUrl);
                    const url = resp.data.species.url;
                    const species = await axios.get(url);
                    const evolution = await axios.get(species.data.evolution_chain.url);
                    
                    const stage1 = <Col xs={12} className="mb-4">
                        <Row className="justify-content-center">
                            <SubTitle>{evolution.data.chain.species.name}</SubTitle>
                        </Row>
                        <Row className="justify-content-center">
                            <LazyImage effect="blur" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolution.data.chain.species.url.slice(42, -1)}.png`} alt={evolution.data.chain.species.name}/>
                        </Row>
                    </Col>;
                    setStage1(
                    <Col xs={12} md={12}>
                        <Row className="align-items-center">
                            {stage1}
                        </Row>
                    </Col>
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
                                    <SubTitle>{species[0]}</SubTitle>
                                </Row>
                                <Row className="justify-content-center">
                                    <LazyImage effect="blur" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${species[1]}.png`} alt={species[0]}/>
                                </Row>
                                <Row className="justify-content-center">
                                    {/* <p className="text1">{species[2]}</p> */}
                                </Row>
                            </Col>
                        );
                        setStage1(
                            <Col xs={12} md={6}>
                                <Row className="align-items-center">
                                    {stage1}
                                </Row>
                            </Col>
                        );
                        setStage2(
                            <Col xs={12} md={6}>
                                <Row className="align-items-center">
                                    {listSpecies}
                                </Row>
                            </Col>
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
                                        <SubTitle>{species[0]}</SubTitle>
                                    </Row>
                                    <Row className="justify-content-center">
                                        <LazyImage effect="blur" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${species[1]}.png`} alt={species[0]}/>
                                    </Row>
                                    <Row className="justify-content-center">
                                        {/* <p className="text1">{species[2]}</p> */}
                                    </Row>
                                </Col>
                            );
                            setStage1(
                                <Col xs={12} md={4}>
                                    <Row className="align-items-center">
                                        {stage1}
                                    </Row>
                                </Col>
                            );
                            setStage2(
                                <Col xs={12} md={4}>
                                    <Row className="align-items-center">
                                        {listSpecies}
                                    </Row>
                                </Col>
                            );
                            setStage3(
                                <Col xs={12} md={4}>
                                    <Row className="align-items-center">
                                        {listSpecies3}                  
                                    </Row>
                                </Col>
                            );
                        }
                    }
                }
                catch(err) {
                    setStage1(
                        <Col xs={12} md={12}>
                            <Row className="align-items-center">
                                <Col xs={12} className="mb-4">
                                    <Row className="justify-content-center">
                                        <SubTitle>We currently don't have any info about that specie :(</SubTitle>
                                    </Row>
                                    <Row className="justify-content-center">
                                        <LazyImage effect="blur" src={Bidoof404} alt="Biddof 404"/>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    );
                }
            };
            fetchInfo();
        }
      }, [pkName, pkmnName, name]);

    return(
        <EvolutionsContainer>
            <Navigation left={`/search/${name}`} right={`/search/${name}/moves`}/>
            <Row className="align-items-center full-height">
                <Col xs={12} className="mb-5">
                    <Row className="justify-content-center">
                        <Col xs="auto">
                            <Title>Evolution Line:</Title>
                        </Col>
                    </Row>
                    <Row className="mt-5 align-items-center justify-content-center">
                        {stage1}
                        {stage2}
                        {stage3}
                    </Row>
                </Col>
            </Row>
        </EvolutionsContainer>
    );
}
export default Evolutions;