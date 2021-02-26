import React from 'react';
import OffensiveCalculator from '../../Type-Calculator/Calc/OffensiveCalculator';
import Row from 'react-bootstrap/Row';
import { Title, TitleColOffensive } from './CoverageStyles';

type Props = {
    type1: string,
    type2: string,
}

const OffensiveCoverage: React.FC<Props> = ({
    type1,
    type2
}) =>{

    return (
        <div className="offensive">
            <Row className="justify-content-start p-2">
                <TitleColOffensive xs="auto">
                    <Title>Offensive Coverage:</Title>
                </TitleColOffensive>
            </Row>
            <OffensiveCalculator type1={type1}/>
            {type2 !== 'None' && <OffensiveCalculator type1={type2}/>}
        </div>
    );
}

export default OffensiveCoverage;