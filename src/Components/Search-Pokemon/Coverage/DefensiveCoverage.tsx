import React from 'react';
import Calculator from '../../Calculator/Calculator';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {
    Title
} from './CoverageStyles';

type Props = {
    type1: string,
    type2: string,
}

const DefensiveCoverage: React.FC<Props> = ({
    type1,
    type2
}) =>{

    return (
        <div className="mt-5">
            <Row className="justify-content-center mt-2">
                <Col xs="auto">
                    <Title>Defensive Coverage:</Title>
                </Col>
            </Row>
            <Calculator type1={type1} type2={type2}/>
        </div>
    );
}

export default DefensiveCoverage;