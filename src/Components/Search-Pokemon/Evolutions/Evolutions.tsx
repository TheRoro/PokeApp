import React, { useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import Navigation from '../../Tools/Navigation/Navigation';
import PokeBall from '../../../Assets/pokeapp.png';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { toPokemonApiSlug } from '../../Tools/pokemonNames';
import ApiError, { ApiErrorInfo } from '../../Tools/ApiError/ApiError';
import { describeApiError } from '../../Tools/ApiError/apiErrors';
import { ToolPageHeader } from '../../Tools/ToolLayout';
import 'react-lazy-load-image-component/src/effects/blur.css';
import {
    SubTitle,
    EvolutionsContainer,
    EvolutionCard,
    EvolutionFlow,
    EvolutionStage,
    StageLabel,
    Arrow,
    LoadingCol,
    LoadingImg,
    LazyImage
} from './Styles';

type EvoStage = {
    name: string;
    id: string;
}

const Evolutions: React.FC = () => {
    const { name = '' } = useParams<'name'>();
    const navigate = useNavigate();
    const [stages, setStages] = React.useState<EvoStage[][]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<ApiErrorInfo | null>(null);
    const [retry, setRetry] = React.useState(0);
    const [resolvedName, setResolvedName] = React.useState(name);

    useEffect(() => {
        const controller = new AbortController();
        const fetchEvolutions = async () => {
            setLoading(true);
            setError(null);
            setResolvedName(name);
            try {
                const config = { signal: controller.signal };
                const pokemonResp = await axios.get(`https://pokeapi.co/api/v2/pokemon/${toPokemonApiSlug(name)}/`, config);
                setResolvedName(pokemonResp.data.name);
                const speciesResp = await axios.get(pokemonResp.data.species.url, config);
                const evoResp = await axios.get(speciesResp.data.evolution_chain.url, config);

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
                if (axios.isCancel(err)) return;
                setError(describeApiError(err, 'evolution data'));
                setLoading(false);
            }
        };
        void fetchEvolutions();
        return () => controller.abort();
    }, [name, retry]);

    const pretty = (value: string) => {
        return value.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
    };
    const displayName = /^\d+$/.test(resolvedName)
        ? 'Pokémon'
        : pretty(resolvedName);

    return (
        <EvolutionsContainer>
            <div style={{ paddingTop: '0.5rem' }}>
                <Navigation
                    left={`/search/${resolvedName}`}
                    right={`/search/${resolvedName}/moves`}
                    leftLabel="Back to Pokémon details"
                    rightLabel="View moves"
                />
            </div>
            <ToolPageHeader
                eyebrow="Pokédex progression"
                title={`${displayName} evolutions`}
                description="Explore every known stage in this Pokémon's evolution chain."
            />
            {loading && (
                <Row className="justify-content-center mt-5" role="status" aria-label="Loading evolutions">
                    <LoadingCol xs="auto">
                        <LoadingImg src={PokeBall} alt="" />
                    </LoadingCol>
                </Row>
            )}
            {error && (
                <ApiError error={error} onRetry={() => setRetry(value => value + 1)} />
            )}
            {!loading && !error && (
                <Row className="justify-content-center mt-4">
                    <Col xs={12}>
                        <EvolutionFlow>
                            {stages.map((stage, stageIdx) => (
                                <React.Fragment key={stageIdx}>
                                    {stageIdx > 0 && (
                                        <Arrow aria-hidden="true">
                                            <FaArrowRight />
                                        </Arrow>
                                    )}
                                    <EvolutionStage>
                                        <StageLabel>Stage {stageIdx + 1}</StageLabel>
                                        {stage.map((pokemon) => (
                                            <EvolutionCard
                                                type="button"
                                                key={pokemon.id}
                                                aria-label={`View ${pretty(pokemon.name)}`}
                                                onClick={() => navigate(`/search/${pokemon.name}`)}
                                            >
                                                <LazyImage
                                                    effect="blur"
                                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                                                    alt=""
                                                />
                                                <SubTitle>{pretty(pokemon.name)}</SubTitle>
                                            </EvolutionCard>
                                        ))}
                                    </EvolutionStage>
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
