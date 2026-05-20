import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Bidoof404 from '../../Assets/404-bidoof.png';

const bidoofQuotes = [
    "Bidoof looked everywhere... no one here.",
    "Even Bidoof couldn't find that combo.",
    "This type combo is rarer than a shiny Bidoof!",
    "Bidoof is confused! No Pokémon found!",
    "Not even Arceus made this type combo.",
    "Bidoof used Search... It's not very effective.",
];

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

const PokemonCard = styled.div`
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

    &:hover {
        background: rgba(220, 10, 45, 0.1);
        border-color: rgba(220, 10, 45, 0.4);
        transform: translateY(-2px);
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

type PokemonEntry = {
    name: string;
    id: number;
}

const TypeMatchPokemon: React.FC<Props> = ({ type1, type2 }) => {
    const [pokemon, setPokemon] = useState<PokemonEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                setLoading(true);
                const t1 = type1.toLowerCase();
                const t2 = type2.toLowerCase();

                const resp1 = await axios.get(`https://pokeapi.co/api/v2/type/${t1}`);
                const type1Pokemon = resp1.data.pokemon.map((p: any) => p.pokemon.name);

                let matches: string[];
                if (t2 === 'none') {
                    // Single type: only show pure mono-type pokemon
                    const resp1Detailed = resp1.data.pokemon.map((p: any) => p.pokemon.name);
                    // Fetch details for candidates to filter pure mono-type
                    const candidates = resp1Detailed.sort(() => 0.5 - Math.random()).slice(0, 30);
                    const pureMonotype: string[] = [];
                    for (const pName of candidates) {
                        if (pureMonotype.length >= 6) break;
                        try {
                            const pResp = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pName}`);
                            if (pResp.data.types.length === 1) {
                                pureMonotype.push(pName);
                            }
                        } catch { /* skip */ }
                    }
                    matches = pureMonotype;
                } else {
                    const resp2 = await axios.get(`https://pokeapi.co/api/v2/type/${t2}`);
                    const type2Pokemon = new Set(resp2.data.pokemon.map((p: any) => p.pokemon.name));
                    matches = type1Pokemon.filter((name: string) => type2Pokemon.has(name));
                }

                // Pick up to 6 random ones
                const shuffled = matches.sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 6);

                const entries: PokemonEntry[] = await Promise.all(
                    selected.map(async (name: string) => {
                        try {
                            const resp = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
                            return { name: resp.data.name, id: resp.data.id };
                        } catch {
                            return null;
                        }
                    })
                ).then(results => results.filter(Boolean) as PokemonEntry[]);

                setPokemon(entries);
                setLoading(false);
            } catch {
                setLoading(false);
            }
        };

        fetchPokemon();
    }, [type1, type2]);

    const pretty = (name: string) => name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

    if (loading) {
        return (
            <Container>
                <SectionTitle>Pokémon with this type combo</SectionTitle>
                <PokemonGrid>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Loading...</span>
                </PokemonGrid>
            </Container>
        );
    }

    if (pokemon.length === 0) return (
        <Container>
            <SectionTitle>Pokémon with this type combo</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '1rem 0' }}>
                <img src={Bidoof404} alt="bidoof" style={{ width: '80px', opacity: 0.8 }} />
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontStyle: 'italic', textAlign: 'center' }}>
                    {bidoofQuotes[Math.floor(Math.random() * bidoofQuotes.length)]}
                </span>
            </div>
        </Container>
    );

    return (
        <Container>
            <SectionTitle>Pokémon with this type combo</SectionTitle>
            <PokemonGrid>
                {pokemon.map((p) => (
                    <PokemonCard key={p.id} onClick={() => navigate(`/search/${p.name}`)}>
                        <Sprite
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                            alt={p.name}
                        />
                        <Name>{pretty(p.name)}</Name>
                    </PokemonCard>
                ))}
            </PokemonGrid>
        </Container>
    );
};

export default TypeMatchPokemon;
