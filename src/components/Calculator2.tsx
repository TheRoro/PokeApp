import React, { useEffect } from 'react';
import TypeChart from '../Assets/typeChart';
import TypeMap from '../Assets/typeMap';

type CalculatorProps = {
    type1: string,
    type2: string
}

type IndexType = number | undefined;

const Calc: React.FC<CalculatorProps> = ({ type1, type2 }) =>{
    const [index1, setIndex1] = React.useState<IndexType>();
    const [index2, setIndex2] = React.useState<IndexType>();
    const [result1, setResult1] = React.useState<Number[]>([]);
    const [result2, setResult2] = React.useState<Number[]>([]);

    const getIndex = (type: string) => {
        if (type) {
            return TypeMap.get(type);
        }
       return undefined;
    } 

    useEffect(() => {
        if(typeof getIndex(type1) === "number") {
            setIndex1(getIndex(type1));
        }
        if(typeof getIndex(type2) === "number") {
            setIndex2(getIndex(type2));
        }
        if (typeof index1 === "number") {
            setResult1(TypeChart[index1]);
        }
        if (typeof index2 === "number") {
            setResult2(TypeChart[index2]);
        }
    }, [setIndex1, setIndex2, setResult1, setResult2, index1, index2, type1, type2]);

    return(
    <div>
        <h1>{'Type 1: ' + type1}</h1>
        <h1>{'Type 2: ' + type2}</h1>
        <p>{'Results 1: ' + result1}</p>
        <p>{'Results 2: ' + result2}</p>
    </div>
    )
  };

export default Calc;