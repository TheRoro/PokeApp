import React,{useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navigation from '../../Tools/Navigation/Navigation';
import axios from 'axios';
import { useParams } from "react-router-dom";
import {
    MovesContainer,
    Title,
    Text
} from './MovesStyles';

type Props = {
    pkmnInfo: any,
}

interface ParamTypes {
    name: string
}

const Moves: React.FC<Props> = ({
    pkmnInfo
}) =>{
    let {name} = useParams<ParamTypes>();
    const [levelUp, setLevelUp] = React.useState(<div></div>);
    const [tutor, setTutor] = React.useState(<div></div>);
    const [mt, setMt] = React.useState(<div></div>);

    const fetchMoveDetails = async (url: string) => {
        const resp = await axios.get(url);
        // console.log(resp.data.name);
        return resp.data;
    }

    useEffect(() => {

        let levelUp = [];
        let tutor = [];
        let mt = [];
        for(let i = 0; i < pkmnInfo.moves.length; i++){
            let size = pkmnInfo.moves[i].version_group_details.length;
            let name = pkmnInfo.moves[i].move.name;
            let url = pkmnInfo.moves[i].move.url;

            let promise = fetchMoveDetails(url);
            let learn_method = pkmnInfo.moves[i].version_group_details[size - 1].move_learn_method.name;
            
            if(learn_method === "level-up") {
                let lvl = pkmnInfo.moves[i].version_group_details[size - 1].level_learned_at;
                levelUp.push([name, lvl, promise]);
            }
            else if(learn_method === "tutor") {
                tutor.push([name, url, promise]);
            }
            else{
                mt.push([name, url, promise])
            }
        }
        levelUp.sort((a, b) => a[1]-b[1]);
        let temp1 = <div></div>;
        for(let i = 0; i < levelUp.length; i++) {
            temp1 = <div className="full-width">
                {/* <li key={0} className="poke-list"><p>Lv.  Move</p></li> */}
                {levelUp.map((move) =>
                <Row className="justify-content-center" key={move[0]}>
                    <Col xs={6}>
                        <Row className="justify-content-center">
                            <Col xs="auto">
                                <p>{move[1]}</p>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={6}>
                        <Row className="justify-content-center">
                            <Col xs="auto">
                                <p>{move[0]}</p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            )}
            </div>
        }
        setLevelUp(temp1);
        let temp2 = <div></div>;
        for(let i = 0; i < tutor.length; i++) {
            temp2 = <div className="full-width">
                {tutor.map((move) =>
                <Row className="justify-content-center" key={move[0]}>
                <Col xs={6}>
                    <Row className="justify-content-center">
                        <Col xs={12}>
                            <p>{move[0]}</p>
                        </Col>
                    </Row>
                </Col>
                <Col xs={6}>
                    <p>{move[1]}</p>
                </Col>
            </Row>
            )}
            </div>
        }
        setTutor(temp2);
        let temp3 = <div></div>;
        for(let i = 0; i < mt.length; i++) {
            temp3 = <div>
                {mt.map((move) =>
                <Row className="justify-content-start" key={move[0]}>
                    <Col xs={6}>
                        <p>{move[0]}</p>
                    </Col>
                    <Col xs={6}>
                        <p>{move[1]}</p>
                    </Col>
                </Row>
            )}
            </div>
        }
        setMt(temp3);
    },[setLevelUp, setTutor, setMt, pkmnInfo.moves]);

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
                            <Text>(Updated to: Ultra-Sun and Ultra-Moon 7th Gen)</Text>
                        </Col>
                    </Row>
                    <Row className="mt-5 align-items-center justify-content-center">
                        <h1>By Leveling up:</h1>
                    </Row>
                    <Row className="mt-5 align-items-center justify-content-center">
                        {levelUp}
                    </Row>
                    <Row className="mt-5 align-items-center justify-content-center">
                        <h1>By TM/TR:</h1>
                    </Row>
                    <Row className="mt-5 align-items-center justify-content-center">
                        {mt}
                    </Row>
                    <Row className="mt-5 align-items-center justify-content-center">
                        <h1>By Tutor:</h1>
                    </Row>
                    <Row className="mt-5 align-items-center justify-content-center">
                        {tutor}
                    </Row>
                </Col>
            </Row>
        </MovesContainer>
    );
}

export default Moves;