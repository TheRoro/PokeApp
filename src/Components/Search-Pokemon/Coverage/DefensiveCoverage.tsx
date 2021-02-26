import React from 'react';
import Calculator from '../../Type-Calculator/Calc/DefensiveCalculator';
import Row from 'react-bootstrap/Row';
import { Title, TitleCol } from './CoverageStyles';

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
            <Row className="justify-content-start mt-2 p-2">
                <TitleCol xs="auto">
                    <Title>Defensive Coverage:</Title>
                </TitleCol>
            </Row>
            <Calculator type1={type1} type2={type2}/>
        </div>
    );
}

export default DefensiveCoverage;