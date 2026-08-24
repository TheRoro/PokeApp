import React, { useEffect, useMemo, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navigation from '../../Tools/Navigation/Navigation';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PokeBall from '../../../Assets/pokeapp.png';
import { toPokemonApiSlug } from '../../Tools/pokemonNames';
import ApiError, { ApiErrorInfo } from '../../Tools/ApiError/ApiError';
import { describeApiError } from '../../Tools/ApiError/apiErrors';
import { ToolPageHeader } from '../../Tools/ToolLayout';
import typeIcons from '../../../Assets/type-icons';
import {
    getLevelUpMoves,
    getLevelUpVersionGroups,
    LevelUpMove,
    mapWithConcurrency,
    PokemonMove,
} from './moveData';
import {
    MovesContainer,
    Text,
    Subtitle,
    MoveListCard,
    MoveRow,
    MoveHeader,
    MoveType,
    MoveTypeIcon,
    LoadingCol,
    LoadingImg,
    MoveLoading,
    LoadMoreButton,
    VersionControls,
    VersionLabel,
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
    name: string;
    moves: PokemonMove[];
};

type DisplayMove = {
    level: number;
    type: string;
    power: number | null;
    name: string;
    slug: string;
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
    const [error, setError] = useState<ApiErrorInfo | null>(null);
    const [retry, setRetry] = useState(0);
    const [resolvedName, setResolvedName] = useState(pokemonName);

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
            setError(null);
            setPokemonMoves([]);
            setDisplayMoves([]);
            setResolvedName(pokemonName);
            try {
                const data = await cachedPokemon(pokemonName);
                if (!active) return;

                const groups = getLevelUpVersionGroups(data.moves);
                setResolvedName(data.name);
                setPokemonMoves(data.moves);
                setSelectedVersion(groups[0]?.name ?? '');
                setVisibleCount(MOVE_BATCH_SIZE);
            } catch (requestError) {
                if (active) setError(describeApiError(requestError, 'moves'));
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
            setError(null);
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
                            slug: detail.name,
                            type: pretty(detail.type.name),
                        };
                    },
                );
                if (active) setDisplayMoves(details);
            } catch (requestError) {
                if (active) setError(describeApiError(requestError, 'move details'));
            } finally {
                if (active) setLoading(false);
            }
        }

        void loadMoveDetails();
        return () => {
            active = false;
        };
    }, [levelUpMoves, selectedVersion, visibleCount, retry]);

    const hasMore = displayMoves.length < levelUpMoves.length;
    const displayName = /^\d+$/.test(resolvedName)
        ? 'Pokémon'
        : pretty(resolvedName);

    return (
        <MovesContainer>
            <div style={{ paddingTop: '0.5rem' }}>
                <Navigation
                    left={`/search/${resolvedName}/evolution`}
                    right=""
                    leftLabel="Back to evolutions"
                />
            </div>
            <ToolPageHeader
                eyebrow="Pokédex move data"
                title={`${displayName} moves`}
                description="Browse level-up moves by game version."
            />

            {versionGroups.length > 0 &&
            <VersionControls>
                <VersionLabel htmlFor="move-version">
                    Game version group
                </VersionLabel>
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
            <MoveLoading role="status" aria-label="Loading moves">
                <LoadingCol>
                    <LoadingImg src={PokeBall} alt=""></LoadingImg>
                </LoadingCol>
                <span>Loading level-up moves...</span>
            </MoveLoading>}

            {error &&
            <ApiError error={error} onRetry={() => setRetry(value => value + 1)} />}

            {!error && !loading && selectedVersion && levelUpMoves.length === 0 &&
            <Text>This Pokémon has no level-up moves in {pretty(selectedVersion)}.</Text>}

            {!error && !loading && versionGroups.length === 0 &&
            <Text>No level-up move data is available for this Pokémon.</Text>}

            {displayMoves.length > 0 &&
            <Row className="justify-content-center mt-4">
                <Col xs={12} md={10} lg={8}>
                    <MoveListCard>
                        <Subtitle style={{ textAlign: 'center', fontSize: '1rem', marginBottom: '1rem' }}>
                            By leveling up · {pretty(selectedVersion)}
                        </Subtitle>
                        <MoveHeader>
                            <span style={{ textAlign: 'center' }}>Lvl</span>
                            <span>Name</span>
                            <span>Type</span>
                            <span style={{ textAlign: 'center' }}>Pwr</span>
                        </MoveHeader>
                        {displayMoves.map(move => (
                            <MoveRow
                                key={`${move.level}-${move.name}`}
                                className={move.type}
                                to={`/move/${move.slug}`}
                                aria-label={`View ${move.name} move details`}
                            >
                                <span style={{ textAlign: 'center', fontWeight: 700, color: '#fffaf1' }}>{move.level}</span>
                                <span style={{ fontWeight: 700, color: '#fffaf1' }}>{move.name}</span>
                                <MoveType>
                                    <MoveTypeIcon src={typeIcons[move.type]} alt="" />
                                    {move.type}
                                </MoveType>
                                <span style={{ textAlign: 'center', fontWeight: 600, color: '#aaa299' }}>{move.power ?? '—'}</span>
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
                    </MoveListCard>
                </Col>
            </Row>}
        </MovesContainer>
    );
}

export default Moves;
