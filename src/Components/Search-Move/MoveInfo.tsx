import React, { useEffect }  from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navigation from '../Tools/Navigation';

type Props = {
    moveInfo: any,
}

const PokemonStats: React.FC<Props> = ({
    moveInfo,
}) =>{
    const [type1, setType1] = React.useState<string>('Electric');
    const [type2, setType2] = React.useState<string>('None');

    const capitalize = ((s: string) => {
        let temp = s[0].toUpperCase() + s.slice(1);
        return temp
    })

    useEffect(() => {
    },);

    return(
        <Container className="stats">
            <Navigation left="/move" right="/move/???"/>
            <Row className="align-items-center">
                <Col xs={12} className="mb-5">
                    <Row className="justify-content-center">
                        <Col xs="auto">
                            <h1 className="title2 centered-text">{moveInfo.name}</h1>
                        </Col>
                    </Row>
                    <Row className="justify-content-center align-items-center mt-4">
                        <Col xs={12} sm={12} md={6}>
                            {JSON.stringify(moveInfo.power)}
                        </Col>
                        <Col xs={12} sm={12} md={6}>
                            {JSON.stringify(moveInfo.pp)}
                        </Col>
                        <Col xs={12} sm={12} md={6}>
                            {JSON.stringify(moveInfo.type.name)}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );

}

export default PokemonStats;