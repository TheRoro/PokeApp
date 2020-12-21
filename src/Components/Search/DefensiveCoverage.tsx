import React from 'react';
import Calculator from '../Calculator/Calculator';

type Props = {
    type1: string,
    type2: string,
}

const DefensiveCoverage: React.FC<Props> = ({
    type1,
    type2
}) =>{

    return (
        <div className="defensive">
            <Calculator type1={type1} type2={type2}/>
        </div>
    );
}

export default DefensiveCoverage;