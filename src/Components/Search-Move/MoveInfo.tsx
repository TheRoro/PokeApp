import React, { useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navigation from '../Tools/Navigation/Navigation';
import {
    Title,
    Text,
    MoveInfoContainer,
    StatsCard
} from './MoveInfoStyles';

type Props = {
    moveInfo: any,
    moveName: string
}

const typeColorMap: Record<string, string> = {
    bug: '#C0E11D', dark: '#705898', dragon: '#6200EA', electric: '#FFFF00',
    fairy: '#FF6FDE', fighting: '#B42400', fire: '#FF9200', flying: '#9FA8DA',
    ghost: '#9575CD', grass: '#00D12F', ground: '#C4A96A', ice: '#18FFFF',
    normal: '#EFEBE9', poison: '#AA00FF', psychic: '#FF00C5', rock: '#A8814C',
    steel: '#9E9E9E', water: '#304FFE',
};

const PokemonStats: React.FC<Props> = ({
    moveInfo,
    moveName
}) => {
    const [effect, setEffect] = React.useState<string>('');

    useEffect(() => {
        let temp = '';
        if (moveInfo.effect_entries.length > 0) {
            const englishEntry = moveInfo.effect_entries.find(
                (entry: any) => entry.language.name === 'en'
            );
            if (englishEntry) {
                temp = englishEntry.short_effect;
            } else {
                temp = moveInfo.effect_entries[0].short_effect;
            }
            let index = temp.search('effect_chance');
            while (index !== -1) {
                temp = temp.replace('$effect_chance', moveInfo.effect_chance?.toString() || '');
                index = temp.search('effect_chance');
            }
        }
        setEffect(temp);
    }, [moveInfo]);

    const moveType = moveInfo.type.name.toLowerCase();
    const moveTypeLabel = moveInfo.type.name[0].toUpperCase() + moveInfo.type.name.slice(1);
    const moveTypeColor = typeColorMap[moveType] || '#DC0A2D';
    const category = moveInfo.damage_class
        ? moveInfo.damage_class.name[0].toUpperCase() + moveInfo.damage_class.name.slice(1)
        : '—';
    const power = moveInfo.power !== null ? moveInfo.power : '—';
    const accuracy = moveInfo.accuracy !== null ? moveInfo.accuracy + '%' : '—';

    return (
        <MoveInfoContainer>
            <Navigation left="/move" right="" />
            <Row className="align-items-center full-height">
                <Col xs={12}>
                    <Row className="justify-content-center mb-4">
                        <Col xs="auto">
                            <Title className={` ${moveTypeLabel}`}>{moveName}</Title>
                        </Col>
                    </Row>
                    <StatsCard>
                        <div style={{
                            display: 'flex', gap: '6px', marginBottom: '1rem', paddingLeft: '2px',
                        }}>
                            <span style={{
                                width: '10px', height: '10px', borderRadius: '50%',
                                background: moveTypeColor,
                                boxShadow: `0 0 6px ${moveTypeColor}`,
                            }} />
                            <span style={{
                                width: '6px', height: '6px', borderRadius: '50%',
                                background: '#4CAF50', alignSelf: 'center',
                            }} />
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '0.5rem',
                            marginBottom: '0.75rem',
                        }}>
                            <div style={{
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '8px',
                                padding: '0.6rem 0.8rem',
                                borderLeft: `3px solid ${moveTypeColor}`,
                            }}>
                                <Text><span style={{ color: moveTypeColor, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '2px' }}>Type</span>{moveTypeLabel}</Text>
                            </div>
                            <div style={{
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '8px',
                                padding: '0.6rem 0.8rem',
                                borderLeft: `3px solid ${moveTypeColor}`,
                            }}>
                                <Text><span style={{ color: moveTypeColor, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '2px' }}>Category</span>{category}</Text>
                            </div>
                            <div style={{
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '8px',
                                padding: '0.6rem 0.8rem',
                                borderLeft: `3px solid ${moveTypeColor}`,
                            }}>
                                <Text><span style={{ color: moveTypeColor, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '2px' }}>Power</span>{power}</Text>
                            </div>
                            <div style={{
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '8px',
                                padding: '0.6rem 0.8rem',
                                borderLeft: `3px solid ${moveTypeColor}`,
                            }}>
                                <Text><span style={{ color: moveTypeColor, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '2px' }}>Accuracy</span>{accuracy}</Text>
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '8px',
                            padding: '0.6rem 0.8rem',
                            borderLeft: `3px solid ${moveTypeColor}`,
                            marginBottom: '0.75rem',
                        }}>
                            <Text><span style={{ color: moveTypeColor, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '2px' }}>PP</span>{moveInfo.pp}</Text>
                        </div>

                        {effect && (
                            <div style={{
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: '8px',
                                padding: '0.6rem 0.8rem',
                                borderTop: `2px solid ${moveTypeColor}30`,
                            }}>
                                <Text style={{ fontStyle: 'italic', color: '#d0d0d8', fontSize: '0.9rem' }}>{effect}</Text>
                            </div>
                        )}
                    </StatsCard>
                </Col>
            </Row>
        </MoveInfoContainer>
    );
}

export default PokemonStats;
