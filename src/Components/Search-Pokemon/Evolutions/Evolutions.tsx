import React, { useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import Navigation from '../../Tools/Navigation/Navigation';
import Bidoof404 from '../../../Assets/404-bidoof.png';
import PokeBall from '../../../Assets/pokeapp.png';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-lazy-load-image-component/src/effects/blur.css';
import {
    SubTitle,
    Title,
    EvolutionsContainer,
    EvolutionCard,
    EvolutionFlow,
    Arrow,
    LoadingCol,
    LoadingImg,
    LazyImage
} from './Styles';

type Props = {
    pkmnName: string,
}

type EvoStage = {
    name: string;
    id: string;
}

const Evolutions: React.FC<Props> = ({
    pkmnName
}) => {
    const { name = '' } = useParams<'name'>();
    const navigate = useNavigate();
    const [stages, setStages] = React.useState<EvoStage[][]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    useEffect(() => {
        const fetchEvolutions = async () => {
            try {
                const pokemonResp = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}/`);
                const speciesResp = await axios.get(pokemonResp.data.species.url);
                const evoResp = await axios.get(speciesResp.data.evolution_chain.url);

                const allStages: EvoStage[][] = [];

                const stage1: EvoStage[] = [{
                    name: evoResp.data.chain.species.name,
                    id: evoResp.data.chain.species.url.slice(42, -1)
                }];
                allStages.push(stage1);

                if (evoResp.data.chain.evolves_to.length > 0) {
                    const stage2: EvoStage[] = evoResp.data.chain.evolves_to.map((evo: any) => ({
                        name: evo.species.name,
                        id: evo.species.url.slice(42, -1)
                    }));
                    allStages.push(stage2);

                    const stage3: EvoStage[] = [];
                    for (const evo of evoResp.data.chain.evolves_to) {
                        if (evo.evolves_to.length > 0) {
                            for (const evo3 of evo.evolves_to) {
                                stage3.push({
                                    name: evo3.species.name,
                                    id: evo3.species.url.slice(42, -1)
                                });
                            }
                        }
                    }
                    if (stage3.length > 0) {
                        allStages.push(stage3);
                    }
                }

                setStages(allStages);
                setLoading(false);
            } catch (err) {
                setError(true);
                setLoading(false);
            }
        };
        fetchEvolutions();
    }, [name, pkmnName]);

    const pretty = (value: string) => {
        return value.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
    };

    return (
        <EvolutionsContainer>
            <div style={{ paddingTop: '0.5rem' }}>
                <Navigation left={`/search/${name}`} right={`/search/${name}/moves`} />
            </div>
            <Row className="justify-content-center mt-3">
                <Col xs="auto">
                    <Title>Evolutions</Title>
                </Col>
            </Row>
            {loading && (
                <Row className="justify-content-center mt-5">
                    <LoadingCol xs="auto">
                        <LoadingImg src={PokeBall} alt="pokeball" />
                    </LoadingCol>
                </Row>
            )}
            {error && (
                <Row className="justify-content-center mt-5">
                    <Col xs="auto">
                        <img src={Bidoof404} alt="404" style={{ maxWidth: '160px' }} />
                        <SubTitle>No evolution data found</SubTitle>
                    </Col>
                </Row>
            )}
            {!loading && !error && (
                <Row className="justify-content-center mt-4">
                    <Col xs={12}>
                        <EvolutionFlow>
                            {stages.map((stage, stageIdx) => (
                                <React.Fragment key={stageIdx}>
                                    {stageIdx > 0 && <Arrow>→</Arrow>}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
                                        {stage.map((pokemon) => (
                                            <EvolutionCard key={pokemon.id} onClick={() => navigate(`/search/${pokemon.name}`)} style={{ cursor: 'pointer' }}>
                                                <LazyImage
                                                    effect="blur"
                                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                                                    alt={pokemon.name}
                                                />
                                                <SubTitle>{pretty(pokemon.name)}</SubTitle>
                                            </EvolutionCard>
                                        ))}
                                    </div>
                                </React.Fragment>
                            ))}
                        </EvolutionFlow>
                    </Col>
                </Row>
            )}
        </EvolutionsContainer>
    );
}

export default Evolutions;
