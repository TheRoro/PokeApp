import React, { useEffect }  from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navigation from '../Tools/Navigation';
import {
    Title,
    Text,
    MoveInfoContainer
} from './MoveInfoStyles';

type Props = {
    moveInfo: any,
    moveName: string
}

const PokemonStats: React.FC<Props> = ({
    moveInfo,
    moveName
}) =>{
    const [effect, setEffect] = React.useState<string>(moveInfo.effect_entries[0].short_effect);
    const setGoodEffect = () => {
        let temp = moveInfo.effect_entries[0].short_effect;
        let index = temp.search("effect_chance");
        while (index !== -1) {
            temp = temp.replace("$effect_chance", moveInfo.effect_chance.toString());
            index = temp.search("effect_chance");
        }
        setEffect(temp);
    }

    useEffect(() => {
        setGoodEffect();
    },);

    return(
        <MoveInfoContainer>
            <Navigation left="/move" right=""/>
            <Row className="align-items-center full-height">
                <Col xs={12} className="">
                    <Row className="justify-content-center mb-5">
                        <Col xs="auto">
                            <Title className={` ${moveInfo.type.name[0].toUpperCase() + moveInfo.type.name.slice(1)}`}>{moveName}</Title>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{ span: 6, offset: 3 }} sm={{ span: 6, offset: 3 }}>
                            <Row className="justify-content-start">
                                <Col xs="auto">
                                    <Text>Category: {moveInfo.damage_class.name[0].toUpperCase() + moveInfo.damage_class.name.slice(1)}</Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {moveInfo.power !== null ? 
                    <Row>
                        <Col xs={{ span: 6, offset: 3 }}>
                            <Row className="justify-content-start">
                                <Col xs="auto">
                                    <Text>Power: {JSON.stringify(moveInfo.power)}</Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row> 
                    : 
                    <Row>
                        <Col xs={{ span: 6, offset: 3 }}>
                            <Row className="justify-content-start">
                                <Col xs="auto">
                                    <Text>No Power</Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row> 
                    }
                    {moveInfo.accuracy !== null ? 
                    <Row>
                        <Col xs={{ span: 6, offset: 3 }}>
                            <Row className="justify-content-start">
                                <Col xs="auto">
                                    <Text>Accuracy: {JSON.stringify(moveInfo.accuracy) + "%"}</Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    :
                    <Row>
                        <Col xs={{ span: 6, offset: 3 }}>
                            <Row className="justify-content-start">
                                <Col xs="auto">
                                    <Text>Accuracy: -</Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    }
                    <Row>
                        <Col xs={{ span: 6, offset: 3 }}>
                            <Row className="justify-content-start">
                                <Col xs="auto">
                                    <Text>Type: {moveInfo.type.name[0].toUpperCase() + moveInfo.type.name.slice(1)}</Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{ span: 6, offset: 3 }}>
                            <Row className="justify-content-start">
                                <Col xs="auto">
                                    <Text>PP: {moveInfo.pp}</Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{ span: 6, offset: 3 }}>
                            <Row className="justify-content-start">
                                <Col xs="auto">
                                    <Text>{effect}</Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </MoveInfoContainer>
    );

}

export default PokemonStats;