import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AllTypes from '../../../Assets/allTypes';

import {Title, Select} from './Styles';

const typeColorMap: Record<string, string> = {
    Bug: '#C0E11D', Dark: '#705898', Dragon: '#6200EA', Electric: '#FFFF00',
    Fairy: '#FF6FDE', Fighting: '#B42400', Fire: '#FF9200', Flying: '#9FA8DA',
    Ghost: '#9575CD', Grass: '#00D12F', Ground: '#C4A96A', Ice: '#18FFFF',
    Normal: '#EFEBE9', Poison: '#AA00FF', Psychic: '#FF00C5', Rock: '#A8814C',
    Steel: '#9E9E9E', Water: '#304FFE', None: 'transparent',
};

type Props = {
    type1: string,
    type2: string,
    setType1: any,
    setType2: any,
}

const TypeSelector: React.FC<Props> = ({type1, type2, setType1, setType2}) =>{
    const handleChangeType1 = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value;
        setType1(newType.toString());
        if (newType === type2) setType2('None');
    }

    const handleChangeType2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value;
        if (newType === type1) {
            setType2('None');
        } else {
            setType2(newType.toString());
        }
    }

    const color1 = typeColorMap[type1] || 'transparent';
    const color2 = typeColorMap[type2] || 'transparent';

    return(
        <Row className="align-items-center full-height">
            <Col xs={12}>
                <Row className="justify-content-center mb-4">
                    <Col md="auto">
                        <Title>Type Calculator</Title>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-3">
                    <Col xs={12} sm={10} md={8} lg={6}>
                        <div style={{
                            background: 'linear-gradient(145deg, #352020 0%, #2A2D32 40%)',
                            borderRadius: '16px',
                            border: '2px solid rgba(220, 10, 45, 0.3)',
                            padding: '2rem 1.5rem',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            {/* Pokédex-style indicator lights */}
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                marginBottom: '1.25rem',
                                paddingLeft: '4px',
                            }}>
                                <span style={{
                                    width: '12px', height: '12px', borderRadius: '50%',
                                    background: color1 !== 'transparent' ? color1 : '#555',
                                    boxShadow: color1 !== 'transparent' ? `0 0 8px ${color1}` : 'none',
                                    transition: 'all 0.3s ease',
                                }} />
                                <span style={{
                                    width: '12px', height: '12px', borderRadius: '50%',
                                    background: color2 !== 'transparent' ? color2 : '#555',
                                    boxShadow: color2 !== 'transparent' ? `0 0 8px ${color2}` : 'none',
                                    transition: 'all 0.3s ease',
                                }} />
                                <span style={{
                                    width: '8px', height: '8px', borderRadius: '50%',
                                    background: '#4CAF50', alignSelf: 'center', marginLeft: '4px',
                                }} />
                            </div>

                            {/* Type 1 row */}
                            <Row className="align-items-center mb-3" style={{
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '10px',
                                padding: '0.75rem 1rem',
                                borderLeft: `3px solid ${color1}`,
                                transition: 'border-color 0.3s ease',
                            }}>
                                <Col xs="auto">
                                    <label htmlFor="primary-type" style={{
                                        fontSize: '0.85rem', fontWeight: 700,
                                        color: '#a0a0b0', textTransform: 'uppercase',
                                        letterSpacing: '0.08em',
                                    }}>Type 1</label>
                                </Col>
                                <Col xs="auto" className="ms-auto">
                                    <Select id="primary-type" value={type1} onChange={handleChangeType1}>
                                    {AllTypes.map((option, index) => (
                                        <option value={option.value} key={index}>{option.label}</option>
                                    ))}
                                    </Select>
                                </Col>
                            </Row>

                            {/* Type 2 row */}
                            <Row className="align-items-center" style={{
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '10px',
                                padding: '0.75rem 1rem',
                                borderLeft: `3px solid ${color2}`,
                                transition: 'border-color 0.3s ease',
                            }}>
                                <Col xs="auto">
                                    <label htmlFor="secondary-type" style={{
                                        fontSize: '0.85rem', fontWeight: 700,
                                        color: '#a0a0b0', textTransform: 'uppercase',
                                        letterSpacing: '0.08em',
                                    }}>Type 2</label>
                                </Col>
                                <Col xs="auto" className="ms-auto">
                                    <Select id="secondary-type" value={type2} onChange={handleChangeType2}>
                                    {AllTypes.map((option, index) => (
                                        <option value={option.value} key={index}>{option.label}</option>
                                    ))}
                                    </Select>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                {/* Selected type display with color accents */}
                <Row className="justify-content-center mt-4" style={{ gap: '12px' }}>
                    {type1 !== 'None' && (
                        <Col xs="auto">
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                background: 'rgba(54, 58, 64, 0.6)',
                                border: `1px solid ${color1}40`,
                                borderRadius: '20px', padding: '0.4rem 1rem',
                                fontSize: '0.9rem', fontWeight: 700, color: color1,
                                boxShadow: `0 0 12px ${color1}20`,
                            }}>
                                <span style={{
                                    width: '8px', height: '8px', borderRadius: '50%',
                                    background: color1, boxShadow: `0 0 6px ${color1}`,
                                }} />
                                {type1}
                            </span>
                        </Col>
                    )}
                    {type2 !== 'None' && (
                        <Col xs="auto">
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                background: 'rgba(54, 58, 64, 0.6)',
                                border: `1px solid ${color2}40`,
                                borderRadius: '20px', padding: '0.4rem 1rem',
                                fontSize: '0.9rem', fontWeight: 700, color: color2,
                                boxShadow: `0 0 12px ${color2}20`,
                            }}>
                                <span style={{
                                    width: '8px', height: '8px', borderRadius: '50%',
                                    background: color2, boxShadow: `0 0 6px ${color2}`,
                                }} />
                                {type2}
                            </span>
                        </Col>
                    )}
                </Row>
            </Col>
        </Row>
    );
}

export default TypeSelector;
