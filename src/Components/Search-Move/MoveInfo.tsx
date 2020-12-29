import React, { useEffect }  from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navigation from '../Tools/Navigation';

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
        if(index !== -1) {
            temp = temp.replace("$effect_chance", moveInfo.effect_chance.toString());
        }
        setEffect(temp);
    }

    useEffect(() => {
        setGoodEffect();
    },);

    return(
        <Container className="stats">
            <Navigation left="/move" right=""/>
            <Row className="align-items-center full-height">
                <Col xs={12} className="">
                    <Row className="justify-content-center mb-5">
                        <Col xs="auto">
                            <h1 className={`title2 centered-text ${moveInfo.type.name[0].toUpperCase() + moveInfo.type.name.slice(1)}`}>{moveName}</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{ span: 6, offset: 3 }} sm={{ span: 6, offset: 3 }}>
                            <Row className="justify-content-start">
                                <Col xs="auto">
                                    <p className="text5">Category: {moveInfo.damage_class.name[0].toUpperCase() + moveInfo.damage_class.name.slice(1)}</p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {moveInfo.power !== null ? 
                    <Row>
                        <Col xs={{ span: 6, offset: 3 }}>
                            <Row className="justify-content-start">
                                <Col xs="auto">
                                    <p className="text5">Power: {JSON.stringify(moveInfo.power)}</p>
                                </Col>
                            </Row>
                        </Col>
                    </Row> 
                    : 
                    <Row>
                        <Col xs={{ span: 6, offset: 3 }}>
                            <Row className="justify-content-start">
                                <Col xs="auto">
                                    <p className="text5">No Power</p>
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
                                    <p className="text5">Accuracy: {JSON.stringify(moveInfo.accuracy) + "%"}</p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    :
                    <Row>
                        <Col xs={{ span: 6, offset: 3 }}>
                            <Row className="justify-content-start">
                                <Col xs="auto">
                                    <p className="text5">Accuracy: -</p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    }
                    <Row>
                        <Col xs={{ span: 6, offset: 3 }}>
                            <Row className="justify-content-start">
                                <Col xs="auto">
                                    <p className={`text5`}>Type: {moveInfo.type.name[0].toUpperCase() + moveInfo.type.name.slice(1)}</p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{ span: 6, offset: 3 }}>
                            <Row className="justify-content-start">
                                <Col xs="auto">
                                    <p className="text5">PP: {moveInfo.pp}</p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{ span: 6, offset: 3 }}>
                            <Row className="justify-content-start">
                                <Col xs="auto">
                                    <p className="text5">{effect}</p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );

}

export default PokemonStats;