import React,{useEffect, useCallback} from 'react';
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
    Text2,
    Text3,
    Subtitle,
    Subtitle2,
    LoadingCol,
    LoadingImg
} from './MovesStyles';

type Props = {
    pkmnInfo: any,
}

interface ParamTypes {
    name: string
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
    let {name} = useParams<ParamTypes>();
    const [maLevel, setMaLevel] = React.useState<LvlType[]>();
    const [loading, setLoading] = React.useState(true);

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
    const everything = useCallback(() => {
        let promises = [];
        for(let i = 0; i < pkmnInfo.moves.length; i++){
            let url = pkmnInfo.moves[i].move.url;
            promises.push(axios.get(url));
        }
        Promise.all(promises).then((responses) => {
            let levelUp: LvlType[] = [];
            for (let i = 0; i < responses.length; i++) {
                let size = pkmnInfo.moves[i].version_group_details.length;
                let learn_method = pkmnInfo.moves[i].version_group_details[size - 1].move_learn_method.name;
                let lvl = pkmnInfo.moves[i].version_group_details[size - 1].level_learned_at;
                let name = pretty(responses[i].data.name);
                let power = responses[i].data.power;
                let type = pretty(responses[i].data.type.name);
                if(learn_method === "level-up") {
                    let temp: LvlType = {
                        lvl: lvl,
                        name: name,
                        power: power,
                        type: type
                    }; 
                    levelUp.push(temp);
                }
            }
            levelUp.sort((a: LvlType, b: LvlType) => a.lvl - b.lvl);
            setMaLevel(levelUp);
            setLoading(false);
        });
    },[pkmnInfo.moves]);

    useEffect(() => {
        everything();
    },[everything]);

    return (
        <MovesContainer>
            <Navigation left={`/search/${name}/evolution`} right=""/>
            <Row className="align-items-center full-height">
                <Col xs={12} className="mb-5">
                    <Row className="justify-content-center">
                        <Col xs="auto">
                            <Title>Moves:</Title>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col xs="auto">
                            <Text>(Some recent pokemon might not have moves)</Text>
                        </Col>
                    </Row>
                    {loading && <Row className="justify-content-center">
                        <LoadingCol xs="auto">
                            <LoadingImg src={PokeBall} alt="pokeball"></LoadingImg>
                        </LoadingCol>
                    </Row>}
                    {!loading &&
                    <>
                    <Row className="mt-5 align-items-center justify-content-center">
                        <h1>By Leveling up:</h1>
                    </Row>
                    <Row className="mt-5 align-items-center justify-content-center">
                        <div className="full-width">
                            <Row className="justify-content-center">
                                <Col xs={3} sm={3} md={2}>
                                    <Subtitle2>Level</Subtitle2>
                                </Col>
                                <Col xs={3} sm={3} md={2}>
                                    <Subtitle>Name</Subtitle>
                                </Col>
                                <Col xs={3} sm={3} md={2}>
                                    <Subtitle>Type</Subtitle>
                                </Col>
                                <Col xs={3} sm={3} md={1}>
                                    <Subtitle>Power</Subtitle>
                                </Col>
                            </Row>
                            {maLevel && maLevel.length>0 && maLevel.map((move, index) =>
                            <Row className="justify-content-center" key={index}>
                                <Col xs={3} sm={3} md={2}>
                                    <Text3>{move.lvl}</Text3>
                                </Col>
                                <Col xs={3} sm={3} md={2}>
                                    <Text2 className={move.type}>{move.name}</Text2>
                                </Col>
                                <Col xs={3} sm={3} md={2}>
                                    <Text2 className={move.type}>{move.type}</Text2>
                                </Col>
                                <Col xs={3} sm={3} md={1}>
                                    {move.power !== undefined ? 
                                    <Text2>{move.power}</Text2>
                                    : 
                                    <Text2>-</Text2>
                                    }
                                </Col>
                            </Row>
                            )}
                        </div>
                    </Row>
                    </>}
                </Col>
            </Row>
        </MovesContainer>
    );
}

export default Moves;