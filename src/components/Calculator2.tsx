import React, { useEffect } from 'react';
import TypeChart from '../Assets/typeChart';
import TypeMap from '../Assets/typeMap';
import TypeList from '../Assets/typeList';

const TOTAL_TYPES = 18;

type CalculatorProps = {
    type1: string,
    type2: string
}

type IndexType = number | undefined;

type ResultType = | undefined | [number, string][];

const Calc: React.FC<CalculatorProps> = ({ type1, type2 }) =>{
    const [index1, setIndex1] = React.useState<IndexType>();
    const [index2, setIndex2] = React.useState<IndexType>();
    const [mapResult, setMap] = React.useState([]);
    const [finalResult, setFinalResult] = React.useState<ResultType>([]);

    const getIndex = (type: string) => {
        if (type) {
            return TypeMap.get(type);
        }
       return undefined;
    } 

    const computeTypeCoverage = (type1: string, type2: string, index1: IndexType, index2: IndexType) => {
        if(type1 === "" && type2 === ""){
            alert("Pon un tipo ps wbn");
            return undefined;
        }
        if(type1 === "" && typeof index2 === "number"){
            let temp = [];
            var pair: [number, string]
            for (let i = 0; i < TOTAL_TYPES; i++) {
                pair = [TypeChart[i][index2]*0.5, TypeList[i]];
                temp.push(pair);
            }
            console.log(temp);
            return temp;
        }
        if(type2 === "" && typeof index1 === "number"){
            let temp = [];
            var pair: [number, string]
            for (let i = 0; i < TOTAL_TYPES; i++) {
                pair = [TypeChart[i][index1]*0.5, TypeList[i]];
                temp.push(pair);
            }
            console.log(temp);
            return temp;
        }
        if(type1 === type2 && typeof index1 === "number") {
            let temp = [];
            var pair: [number, string]
            for (let i = 0; i < TOTAL_TYPES; i++) {
                pair = [TypeChart[i][index1]*0.5, TypeList[i]];
                temp.push(pair);
                console.log(pair);
            }
            console.log(temp);
            return temp;
        }
        else if (type1 !== type2 && typeof index1 === "number" && typeof index2 === "number"){
            let temp = [];
            var pair: [number, string]
            for (let i = 0; i < TOTAL_TYPES; i++) {
                pair = [TypeChart[i][index1]*TypeChart[i][index2]*0.25, TypeList[i]]
                temp.push(pair);
                console.log(pair);
            }
            console.log(temp);
            return temp;
        }
        else {
            //alert("La cagaste o wbn");
            return undefined;
        }
    }

    useEffect(() => {
        if(typeof getIndex(type1) === "number") {
            setIndex1(getIndex(type1));
        }
        if(typeof getIndex(type2) === "number") {
            setIndex2(getIndex(type2));
        }
        setFinalResult(computeTypeCoverage(type1, type2, index1, index2));
    }, [setIndex1, setIndex2, index1, index2, type1, type2]);

    return(
    <div>
        <h1>{'Type 1: ' + type1}</h1>
        <h1>{'Type 2: ' + type2}</h1>
        <h1>FINAL RESULT IS:</h1>
        <h3>{finalResult}</h3>
    </div>
    )
  };

export default Calc;