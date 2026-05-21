import React, { useEffect, useMemo, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navigation from '../../Tools/Navigation/Navigation';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PokeBall from '../../../Assets/pokeapp.png';
import { toPokemonApiSlug } from '../../Tools/pokemonNames';
import {
    getLevelUpMoves,
    getLevelUpVersionGroups,
    LevelUpMove,
    mapWithConcurrency,
    PokemonMove,
} from './moveData';
import {
    MovesContainer,
    Title,
    Text,
    Subtitle,
    MoveRow,
    MoveHeader,
    LoadingCol,
    LoadingImg,
    LoadMoreButton,
    VersionControls,
    VersionSelect,
} from './MovesStyles';

const MOVE_BATCH_SIZE = 20;
const MOVE_REQUEST_CONCURRENCY = 6;

type MoveApiResponse = {
    name: string;
    power: number | null;
    type: { name: string };
};

type PokemonApiResponse = {
    moves: PokemonMove[];
};

type DisplayMove = {
    level: number;
    type: string;
    power: number | null;
    name: string;
};

const pokemonCache = new Map<string, Promise<PokemonApiResponse>>();
const moveCache = new Map<string, Promise<MoveApiResponse>>();

function cachedPokemon(name: string): Promise<PokemonApiResponse> {
    const cached = pokemonCache.get(name);
    if (cached) return cached;

    const request = axios
        .get(`https://pokeapi.co/api/v2/pokemon/${name}/`)
        .then(response => response.data as PokemonApiResponse)
        .catch(error => {
            pokemonCache.delete(name);
            throw error;
        });
    pokemonCache.set(name, request);
    return request;
}

function cachedMove(url: string): Promise<MoveApiResponse> {
    const cached = moveCache.get(url);
    if (cached) return cached;

    const request = axios
        .get(url)
        .then(response => response.data as MoveApiResponse)
        .catch(error => {
            moveCache.delete(url);
            throw error;
        });
    moveCache.set(url, request);
    return request;
}

function pretty(value: string) {
    return value.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
}

const Moves: React.FC = () => {
    const { name = '' } = useParams<'name'>();
    const pokemonName = toPokemonApiSlug(name);
    const [pokemonMoves, setPokemonMoves] = useState<PokemonMove[]>([]);
    const [selectedVersion, setSelectedVersion] = useState('');
    const [visibleCount, setVisibleCount] = useState(MOVE_BATCH_SIZE);
    const [displayMoves, setDisplayMoves] = useState<DisplayMove[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [retry, setRetry] = useState(0);

    const versionGroups = useMemo(
        () => getLevelUpVersionGroups(pokemonMoves),
        [pokemonMoves],
    );
    const levelUpMoves = useMemo(
        () => selectedVersion ? getLevelUpMoves(pokemonMoves, selectedVersion) : [],
        [pokemonMoves, selectedVersion],
    );

    useEffect(() => {
        let active = true;

        async function loadPokemon() {
            setLoading(true);
            setError(false);
            setPokemonMoves([]);
            setDisplayMoves([]);
            try {
                const data = await cachedPokemon(pokemonName);
                if (!active) return;

                const groups = getLevelUpVersionGroups(data.moves);
                setPokemonMoves(data.moves);
                setSelectedVersion(groups[0]?.name ?? '');
                setVisibleCount(MOVE_BATCH_SIZE);
            } catch (requestError) {
                console.error(requestError);
                if (active) setError(true);
            } finally {
                if (active) setLoading(false);
            }
        }

        void loadPokemon();
        return () => {
            active = false;
        };
    }, [pokemonName, retry]);

    useEffect(() => {
        let active = true;
        if (!selectedVersion) {
            setDisplayMoves([]);
            return () => {
                active = false;
            };
        }

        async function loadMoveDetails() {
            setLoading(true);
            setError(false);
            try {
                const visibleMoves = levelUpMoves.slice(0, visibleCount);
                const details = await mapWithConcurrency<LevelUpMove, DisplayMove>(
                    visibleMoves,
                    MOVE_REQUEST_CONCURRENCY,
                    async move => {
                        const detail = await cachedMove(move.url);
                        return {
                            level: move.level,
                            name: pretty(detail.name),
                            power: detail.power,
                            type: pretty(detail.type.name),
                        };
                    },
                );
                if (active) setDisplayMoves(details);
            } catch (requestError) {
                console.error(requestError);
                if (active) setError(true);
            } finally {
                if (active) setLoading(false);
            }
        }

        void loadMoveDetails();
        return () => {
            active = false;
        };
    }, [levelUpMoves, selectedVersion, visibleCount]);

    const hasMore = displayMoves.length < levelUpMoves.length;

    return (
        <MovesContainer>
            <div style={{ paddingTop: '0.5rem' }}>
                <Navigation left={`/search/${pokemonName}/evolution`} right=""/>
            </div>
            <Row className="justify-content-center mt-3">
                <Col xs="auto">
                    <Title>Moves</Title>
                </Col>
            </Row>

            {versionGroups.length > 0 &&
            <VersionControls>
                <label htmlFor="move-version" style={{ color: '#fff', fontWeight: 700 }}>
                    Game version group
                </label>
                <VersionSelect
                    id="move-version"
                    value={selectedVersion}
                    onChange={event => {
                        setDisplayMoves([]);
                        setSelectedVersion(event.target.value);
                        setVisibleCount(MOVE_BATCH_SIZE);
                    }}
                >
                    {versionGroups.map(group => (
                        <option key={group.name} value={group.name}>{pretty(group.name)}</option>
                    ))}
                </VersionSelect>
            </VersionControls>}

            {loading && displayMoves.length === 0 &&
            <Row className="justify-content-center">
                <LoadingCol xs="auto">
                    <LoadingImg src={PokeBall} alt="Loading moves"></LoadingImg>
                </LoadingCol>
            </Row>}

            {error &&
            <Row className="justify-content-center mt-4">
                <Col xs={12} className="text-center">
                    <Text>PokeAPI could not load this learnset.</Text>
                    <LoadMoreButton type="button" onClick={() => setRetry(value => value + 1)}>
                        Try again
                    </LoadMoreButton>
                </Col>
            </Row>}

            {!error && !loading && selectedVersion && levelUpMoves.length === 0 &&
            <Text>This Pokémon has no level-up moves in {pretty(selectedVersion)}.</Text>}

            {displayMoves.length > 0 &&
            <Row className="justify-content-center mt-4">
                <Col xs={12} md={10} lg={8}>
                    <Subtitle style={{ textAlign: 'center', fontSize: '1rem', marginBottom: '1rem' }}>
                        By Leveling Up · {pretty(selectedVersion)}
                    </Subtitle>
                    <MoveHeader>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b0b0c0', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>Lvl</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b0b0c0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Name</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b0b0c0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Type</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b0b0c0', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>Pwr</span>
                    </MoveHeader>
                    {displayMoves.map(move => (
                        <MoveRow key={`${move.level}-${move.name}`} className={move.type}>
                            <span style={{ textAlign: 'center', fontWeight: 600, color: '#fff' }}>{move.level}</span>
                            <span style={{ fontWeight: 600, color: '#fff' }}>{move.name}</span>
                            <span style={{ fontWeight: 500, color: 'currentColor' }}>{move.type}</span>
                            <span style={{ textAlign: 'center', fontWeight: 500, color: '#b0b0c0' }}>{move.power ?? '—'}</span>
                        </MoveRow>
                    ))}
                    {hasMore &&
                    <LoadMoreButton
                        type="button"
                        disabled={loading}
                        onClick={() => setVisibleCount(count => count + MOVE_BATCH_SIZE)}
                    >
                        {loading ? 'Loading...' : `Load more (${levelUpMoves.length - displayMoves.length} remaining)`}
                    </LoadMoreButton>}
                </Col>
            </Row>}
        </MovesContainer>
    );
}

export default Moves;
