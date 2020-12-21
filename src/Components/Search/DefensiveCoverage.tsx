import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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