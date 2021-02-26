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

type Props = {
    pkmnName: string,
    pkmnInfo: any,
    pkmnId: number,
}

interface ParamTypes {
    name: string
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
    let {name} = useParams<ParamTypes>();
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

    const search = async () => {
        try {
            var apiUrl = 'https://pokeapi.co/api/v2/pokemon/' + name + '/';
            const resp = await axios.get(apiUrl);
            setInfo(resp.data);
            setId(resp.data.species.url.substring(42, resp.data.species.url.length - 1));
            setImg(<div><LazyImage effect="blur" src={`${resp.data.sprites.other['official-artwork'].front_default}`} alt={resp.data.name}/></div>);
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
            <Navigation left={`/search`} right={`/search/${name}/evolution`}/>
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
                                    <SubTitle className={`${type1}`}>Type 1: {type1}</SubTitle>
                                </Col>
                            </Row>
                            {type2 !== '' &&
                            <Row className="justify-content-center">
                                <Col xs="auto">
                                    <SubTitle className={`${type2}`}>Type 2: {type2}</SubTitle>
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
                        </Col>
                        <Col xs="auto" sm={12} md={6} className="mt-5 mt-md-0">
                            <Row className="justify-content-center">
                                <Col xs="auto">
                                    {img}
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