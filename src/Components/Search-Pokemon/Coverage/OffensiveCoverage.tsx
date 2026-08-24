import React from 'react';
import OffensiveCalculator from '../../Type-Calculator/Calc/OffensiveCalculator';
import {
    CoverageHeader,
    CoverageSection,
    CoverageStack,
    Title,
} from './CoverageStyles';

type Props = {
    type1: string,
    type2: string,
}

const OffensiveCoverage: React.FC<Props> = ({
    type1,
    type2
}) =>{

    return (
        <CoverageSection className="offensive">
            <CoverageHeader>
                <Title>Offensive matchups</Title>
            </CoverageHeader>
            <CoverageStack>
                <OffensiveCalculator type1={type1}/>
                {type2 !== 'None' && <OffensiveCalculator type1={type2}/>}
            </CoverageStack>
        </CoverageSection>
    );
}

export default OffensiveCoverage;