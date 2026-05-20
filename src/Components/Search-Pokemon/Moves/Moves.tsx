import React, {useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navigation from '../../Tools/Navigation/Navigation';
import axios from 'axios';
import { useParams } from "react-router-dom";
import PokeBall from '../../../Assets/pokeapp.png';
import {
    MovesContainer,
    Title,
    Text,
    Subtitle,
    MoveRow,
    MoveHeader,
    LoadingCol,
    LoadingImg
} from './MovesStyles';

type Props = {
    pkmnInfo: any,
}

type LvlType = {
    lvl: number,
    type: string,
    power: number,
    name: string
}

const Moves: React.FC<Props> = ({
    pkmnInfo
}) =>{
    const { name = '' } = useParams<'name'>();
    const [maLevel, setMaLevel] = React.useState<LvlType[]>();
    const [loading, setLoading] = React.useState(true);

    const pretty = (value: string) => {
        return value.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
    }

    useEffect(() => {
        let cancelled = false;

        const fetchAndProcess = async () => {
            setLoading(true);
            try {
                // Always fetch fresh data from URL param
                const resp = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}/`);
                const data = resp.data;

                const promises = data.moves.map((m: any) => axios.get(m.move.url));
                const responses = await Promise.all(promises);

                if (cancelled) return;

                const levelUp: LvlType[] = [];
                for (let i = 0; i < responses.length; i++) {
                    const size = data.moves[i].version_group_details.length;
                    const learn_method = data.moves[i].version_group_details[size - 1].move_learn_method.name;
                    const lvl = data.moves[i].version_group_details[size - 1].level_learned_at;
                    const moveName = pretty(responses[i].data.name);
                    const power = responses[i].data.power;
                    const type = pretty(responses[i].data.type.name);
                    if(learn_method === "level-up") {
                        levelUp.push({ lvl, name: moveName, power, type });
                    }
                }
                levelUp.sort((a: LvlType, b: LvlType) => a.lvl - b.lvl);
                setMaLevel(levelUp);
                setLoading(false);
            } catch (err) {
                console.error(err);
                if (!cancelled) setLoading(false);
            }
        };

        fetchAndProcess();
        return () => { cancelled = true; };
    }, [name]);

    return (
        <MovesContainer>
            <div style={{ paddingTop: '0.5rem' }}>
                <Navigation left={`/search/${name}/evolution`} right=""/>
            </div>
            <Row className="justify-content-center mt-3">
                <Col xs="auto">
                    <Title>Moves</Title>
                </Col>
            </Row>
            {loading && <Row className="justify-content-center">
                <LoadingCol xs="auto">
                    <LoadingImg src={PokeBall} alt="pokeball"></LoadingImg>
                </LoadingCol>
            </Row>}
            {!loading && maLevel && maLevel.length > 0 &&
            <Row className="justify-content-center mt-4">
                <Col xs={12} md={10} lg={8}>
                    <Subtitle style={{ textAlign: 'center', fontSize: '1rem', marginBottom: '1rem' }}>By Leveling Up</Subtitle>
                    <MoveHeader>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b0b0c0', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>Lvl</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b0b0c0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Name</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b0b0c0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Type</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b0b0c0', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>Pwr</span>
                    </MoveHeader>
                    {maLevel.map((move, index) => (
                        <MoveRow key={index} className={move.type}>
                            <span style={{ textAlign: 'center', fontWeight: 600, color: '#fff' }}>{move.lvl}</span>
                            <span style={{ fontWeight: 600, color: '#fff' }}>{move.name}</span>
                            <span style={{ fontWeight: 500, color: 'currentColor' }}>{move.type}</span>
                            <span style={{ textAlign: 'center', fontWeight: 500, color: '#b0b0c0' }}>{move.power ?? '—'}</span>
                        </MoveRow>
                    ))}
                </Col>
            </Row>}
        </MovesContainer>
    );
}

export default Moves;
