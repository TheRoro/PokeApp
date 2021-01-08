import React from 'react';
import Calculator from '../Calculator/Calculator';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

type Props = {
    type1: string,
    type2: string,
}

const DefensiveCoverage: React.FC<Props> = ({
    type1,
    type2
}) =>{

    return (
        <div className="defensive mt-5">
            <Row className="justify-content-center mt-2">
                <Col xs="auto">
                    <h1 className="centered-text title4">Defensive Coverage:</h1>
                </Col>
            </Row>
            <Calculator type1={type1} type2={type2}/>
        </div>
    );
}

export default DefensiveCoverage;