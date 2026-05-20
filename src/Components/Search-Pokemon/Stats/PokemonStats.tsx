import React, { useEffect }  from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import StatBar from '../../Tools/StatBar/StatBar';
import Navigation from '../../Tools/Navigation/Navigation';
import DefensiveCoverage from '../Coverage/DefensiveCoverage';
import OffensiveCoverage from '../Coverage/OffensiveCoverage';
import PokeBall from '../../../Assets/pokeapp.png';
import Bidoof404 from '../../../Assets/404-bidoof.png';
import axios from 'axios';
import { useParams } from "react-router-dom";
import 'react-lazy-load-image-component/src/effects/blur.css';

import {
    StatsContainer,
    Title,
    SubTitle,
    Bidoof404Img,
    ErrorContainer,
    ErrorCol,
    Id,
    Loading,
    LoadingCol,
    LoadingImg,
    LazyImage
} from './StatsStyles';

const typeColorMap: Record<string, string> = {
    Bug: '#C0E11D', Dark: '#705898', Dragon: '#6200EA', Electric: '#FFFF00',
    Fairy: '#FF6FDE', Fighting: '#B42400', Fire: '#FF9200', Flying: '#9FA8DA',
    Ghost: '#9575CD', Grass: '#00D12F', Ground: '#C4A96A', Ice: '#18FFFF',
    Normal: '#EFEBE9', Poison: '#AA00FF', Psychic: '#FF00C5', Rock: '#A8814C',
    Steel: '#9E9E9E', Water: '#304FFE', None: 'transparent',
};

type Props = {
    pkmnName: string,
    pkmnInfo: any,
    pkmnId: number,
}

type infoType = {
    stats: any[],
    types: any[]
};

const PokemonStats: React.FC<Props> = ({
    pkmnName,
    pkmnInfo,
    pkmnId
}) =>{
    const [type1, setType1] = React.useState<string>('Electric');
    const [type2, setType2] = React.useState<string>('None');
    const [img, setImg] = React.useState(
        <Loading>
            <Row className="justify-content-center mt-5">
                <LoadingCol xs="auto">
                    <LoadingImg src={PokeBall} alt="pokeball"></LoadingImg>
                </LoadingCol>
            </Row>
        </Loading>);
    const [info, setInfo] = React.useState<infoType>();
    const [loading, setLoading] = React.useState(<Loading>
        <Row className="justify-content-center mt-5">
            <LoadingCol xs="auto">
                <LoadingImg src={PokeBall} alt="pokeball"></LoadingImg>
            </LoadingCol>
        </Row>
    </Loading>);
    const [stop, setStop] = React.useState<Boolean>(false);
    const [id, setId] = React.useState();
    const { name = '' } = useParams<'name'>();
    const [prettyName, setPrettyName] = React.useState(name);

    const pretty = (value: string) => {
        let temp = "";
        for(let i = 0; i < value.length; i++) {
            if(i === 0){
                temp+=value[0].toUpperCase();
            }
            else if(value[i] === "-"){
                temp+=" ";
            }
            else if(i !== 0 && value[i - 1] === "-"){
                temp+=value[i].toUpperCase();
            }
            else {
                temp+=value[i];
            }
        }
        return temp;
    }

    const capitalize = ((s: string) => {
        let temp = s[0].toUpperCase() + s.slice(1);
        return temp
    })

    const [isShiny, setIsShiny] = React.useState(false);

    const search = async () => {
        try {
            var apiUrl = 'https://pokeapi.co/api/v2/pokemon/' + name + '/';
            const resp = await axios.get(apiUrl);
            setInfo(resp.data);
            setId(resp.data.species.url.substring(42, resp.data.species.url.length - 1));
            
            // 1/100 chance of shiny!
            const shinyRoll = Math.floor(Math.random() * 100) === 0;
            const spriteUrl = shinyRoll 
                ? resp.data.sprites.other['official-artwork'].front_shiny
                : resp.data.sprites.other['official-artwork'].front_default;
            
            if (shinyRoll && spriteUrl) {
                setIsShiny(true);
            }
            
            setImg(<div><LazyImage effect="blur" src={spriteUrl || resp.data.sprites.other['official-artwork'].front_default} alt={resp.data.name}/></div>);
            if(type1 !== capitalize(resp.data.types[0].type.name)){
                setType1(capitalize(resp.data.types[0].type.name));
            }
            if(resp.data.types.length > 1) {
                setType2(capitalize(resp.data.types[1].type.name));
            }
            setPrettyName(pretty(resp.data.name));
        }
        catch(err) {
            setStop(true);
            console.error(err);
            setLoading(
                <ErrorContainer>
                    <Row className="h-100 align-items-center justify-content-center">
                        <ErrorCol xs="auto">
                            <Bidoof404Img src={Bidoof404} alt={'404'}/>
                        </ErrorCol>
                    </Row>
                </ErrorContainer>);
        }
    }

    useEffect(() => {
        if(!info && !stop){
            search();
        }
            
    });

    return(
        <>{info ?
        <StatsContainer>
            <div style={{ paddingTop: '1rem' }}>
                <Navigation left={`/search`} right={`/search/${name}/evolution`}/>
            </div>
            <Row className="align-items-center">
                <Col xs={12} className="mb-5">
                    <Row className="justify-content-center">
                        <Col xs="auto">
                            <Title>{prettyName}</Title>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col xs="auto">
                            <Id>{id}</Id>
                        </Col>
                    </Row>
                    <Row className="justify-content-center align-items-center mt-4">
                        <Col xs={12} sm={12} md={6}>
                            <Row className="justify-content-center">
                                <Col xs="auto">
                                    <SubTitle style={{ color: typeColorMap[type1] || '#EFEBE9', borderColor: typeColorMap[type1] || '#EFEBE9' }}>Type 1: {type1}</SubTitle>
                                </Col>
                            </Row>
                            {type2 !== 'None' && type2 !== '' &&
                            <Row className="justify-content-center">
                                <Col xs="auto">
                                    <SubTitle style={{ color: typeColorMap[type2] || '#EFEBE9', borderColor: typeColorMap[type2] || '#EFEBE9' }}>Type 2: {type2}</SubTitle>
                                </Col>
                            </Row>}
                            <Row className="justify-content-center mt-4">
                                <StatBar name={"HP"} value={parseInt(JSON.stringify(info.stats[0].base_stat!))}/>
                            </Row>
                            <Row className="justify-content-center mt-3">
                                <StatBar name={"Attack"} value={parseInt(JSON.stringify(info.stats[1].base_stat))}/>
                            </Row>
                            <Row className="justify-content-center mt-3">
                                <StatBar name={"Defense"} value={parseInt(JSON.stringify(info.stats[2].base_stat))}/>
                            </Row>
                            <Row className="justify-content-center mt-3">
                                <StatBar name={"Sp. Attack"} value={parseInt(JSON.stringify(info.stats[3].base_stat))}/>
                            </Row>
                            <Row className="justify-content-center mt-3">
                                <StatBar name={"Sp. Defense"} value={parseInt(JSON.stringify(info.stats[4].base_stat))}/>
                            </Row>
                            <Row className="justify-content-center mt-3">
                                <StatBar name={"Speed"}  value={parseInt(JSON.stringify(info.stats[5].base_stat))}/>
                            </Row>
                            <Row className="justify-content-center mt-4">
                                <Col>
                                    <Row className="justify-content-center">
                                        <Col xs="auto">
                                            <div style={{
                                                fontSize: '0.9rem',
                                                fontWeight: 800,
                                                letterSpacing: '0.08em',
                                                textTransform: 'uppercase' as const,
                                                color: '#fff',
                                                padding: '0.5rem 1.2rem',
                                                borderRadius: '8px',
                                                background: 'rgba(255, 255, 255, 0.06)',
                                                border: '1px solid rgba(220, 10, 45, 0.3)',
                                            }}>
                                                Total: {info.stats.reduce((sum: number, s: any) => sum + s.base_stat, 0)}
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs="auto" sm={12} md={6} className="mt-5 mt-md-0">
                            <Row className="justify-content-center">
                                <Col xs="auto" style={{ position: 'relative' }}>
                                    {img}
                                    {isShiny && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                            color: '#000',
                                            fontWeight: 900,
                                            fontSize: '0.75rem',
                                            padding: '0.3rem 0.7rem',
                                            borderRadius: '999px',
                                            letterSpacing: '0.1em',
                                            textTransform: 'uppercase',
                                            boxShadow: '0 0 20px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.3)',
                                            animation: 'shinyPulse 1.5s ease-in-out infinite',
                                        }}>
                                            ✨ Shiny!
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <DefensiveCoverage type1={type1} type2={type2}/>
            <OffensiveCoverage type1={type1} type2={type2}/>
        </StatsContainer>
        : loading }
        </>
    );
}

export default PokemonStats;