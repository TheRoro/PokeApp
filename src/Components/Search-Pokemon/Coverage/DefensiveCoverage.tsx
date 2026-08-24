import React from 'react';
import Calculator from '../../Type-Calculator/Calc/DefensiveCalculator';
import { CoverageHeader, CoverageSection, Title } from './CoverageStyles';

type Props = {
    type1: string,
    type2: string,
}

const DefensiveCoverage: React.FC<Props> = ({
    type1,
    type2
}) =>{

    return (
        <CoverageSection $first>
            <CoverageHeader>
                <Title>Defensive matchups</Title>
            </CoverageHeader>
            <Calculator type1={type1} type2={type2}/>
        </CoverageSection>
    );
}

export default DefensiveCoverage;