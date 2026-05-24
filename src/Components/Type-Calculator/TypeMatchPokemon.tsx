import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Bidoof404 from '../../Assets/404-bidoof.png';
import typeList from '../../Assets/typeList';
import ApiError, { ApiErrorInfo } from '../Tools/ApiError/ApiError';
import { describeApiError } from '../Tools/ApiError/apiErrors';
import {
    findDualTypeMatches,
    findMonotypeMatches,
    PokemonMatch,
    TypePokemonEntry,
} from './typeMatching';

const bidoofQuotes = [
    "Bidoof looked everywhere... no one here.",
    "Even Bidoof couldn't find that combo.",
    "This type combo is rarer than a shiny Bidoof!",
    "Bidoof is confused! No Pokémon found!",
    "Not even Arceus made this type combo.",
    "Bidoof used Search... It's not very effective.",
];

const typeCache = new Map<string, Promise<TypePokemonEntry[]>>();

function fetchTypePokemon(type: string): Promise<TypePokemonEntry[]> {
    const key = type.toLowerCase();
    const cached = typeCache.get(key);
    if (cached) return cached;

    const request = axios
        .get(`https://pokeapi.co/api/v2/type/${key}`)
        .then(response => response.data.pokemon as TypePokemonEntry[])
        .catch(error => {
            typeCache.delete(key);
            throw error;
        });
    typeCache.set(key, request);
    return request;
}

const Container = styled.div`
    margin-top: 2rem;
    padding: 1.25rem 1.5rem;
    background: linear-gradient(145deg, #352020 0%, #2A2D32 40%);
    border: 2px solid rgba(220, 10, 45, 0.2);
    border-radius: 16px;
`

const SectionTitle = styled.h3`
    font-size: 0.75rem;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 1rem;
`

const PokemonGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
`

const PokemonCard = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100px;
    color: inherit;
    font: inherit;

    &:hover {
        background: rgba(220, 10, 45, 0.1);
        border-color: rgba(220, 10, 45, 0.4);
        transform: translateY(-2px);
    }

    &:focus-visible {
        outline: 3px solid rgba(255, 222, 0, 0.7);
        outline-offset: 3px;
    }
`

const Sprite = styled.img`
    width: 60px;
    height: 60px;
    image-rendering: pixelated;
`

const Name = styled.span`
    font-size: 0.7rem;
    font-weight: 700;
    color: #fff;
    text-align: center;
    margin-top: 0.25rem;
    text-transform: capitalize;
`

type Props = {
    type1: string;
    type2: string;
}

const TypeMatchPokemon: React.FC<Props> = ({ type1, type2 }) => {
    const [matches, setMatches] = useState<PokemonMatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ApiErrorInfo | null>(null);
    const [retry, setRetry] = useState(0);
    const navigate = useNavigate();

    const selectedTypes = useMemo(
        () => [type1, type2].filter(type => type.toLowerCase() !== 'none'),
        [type1, type2],
    );

    useEffect(() => {
        let active = true;

        async function loadMatches() {
            setLoading(true);
            setError(null);
            try {
                const primaryType = selectedTypes[0];
                if (!primaryType) {
                    if (active) setMatches([]);
                    return;
                }

                const primary = await fetchTypePokemon(primaryType);
                let completeMatches: PokemonMatch[];
                if (selectedTypes.length > 1) {
                    const secondary = await fetchTypePokemon(selectedTypes[1]);
                    completeMatches = findDualTypeMatches(primary, secondary);
                } else {
                    const otherTypeEntries = await Promise.all(
                        typeList
                            .filter(type => type.toLowerCase() !== primaryType.toLowerCase())
                            .map(fetchTypePokemon),
                    );
                    completeMatches = findMonotypeMatches(primary, otherTypeEntries);
                }

                if (active) setMatches(completeMatches);
            } catch (requestError) {
                if (active) {
                    setMatches([]);
                    setError(describeApiError(requestError, 'type matches'));
                }
            } finally {
                if (active) setLoading(false);
            }
        }

        void loadMatches();
        return () => {
            active = false;
        };
    }, [selectedTypes, retry]);

    const pretty = (name: string) => name.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
    const visibleMatches = matches.slice(0, 6);
    const emptyQuoteIndex = selectedTypes
        .join('-')
        .split('')
        .reduce((sum, character) => sum + character.charCodeAt(0), 0) % bidoofQuotes.length;

    if (loading) {
        return (
            <Container role="status" aria-label="Loading matching Pokémon">
                <SectionTitle>Pokémon with this type combo</SectionTitle>
                <PokemonGrid>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Checking every match...</span>
                </PokemonGrid>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <SectionTitle>Pokémon with this type combo</SectionTitle>
                <ApiError error={error} onRetry={() => setRetry(value => value + 1)} />
            </Container>
        );
    }

    if (matches.length === 0) return (
        <Container>
            <SectionTitle>Pokémon with this type combo</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '1rem 0' }}>
                <img src={Bidoof404} alt="Bidoof found no matching Pokémon" style={{ width: '80px', opacity: 0.8 }} />
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontStyle: 'italic', textAlign: 'center' }}>
                    {bidoofQuotes[emptyQuoteIndex]}
                </span>
            </div>
        </Container>
    );

    return (
        <Container>
            <SectionTitle>
                Pokémon with this type combo · showing {visibleMatches.length} of {matches.length}
            </SectionTitle>
            <PokemonGrid>
                {visibleMatches.map((pokemon) => (
                    <PokemonCard
                        type="button"
                        key={pokemon.id}
                        aria-label={`View ${pretty(pokemon.name)}`}
                        onClick={() => navigate(`/search/${pokemon.name}`)}
                    >
                        <Sprite
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                            alt=""
                        />
                        <Name>{pretty(pokemon.name)}</Name>
                    </PokemonCard>
                ))}
            </PokemonGrid>
        </Container>
    );
};

export default TypeMatchPokemon;
