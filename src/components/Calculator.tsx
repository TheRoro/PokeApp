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

type EffectType = string[][];

const Calc: React.FC<CalculatorProps> = ({ type1, type2 }) =>{
    const [index1, setIndex1] = React.useState<IndexType>();
    const [index2, setIndex2] = React.useState<IndexType>();
    //effects[0] -> Immunities array
    //Effects[1] -> 0.25 array
    //Efects[2] -> 0.50 array
    //Effects[3] -> Normal Damage array
    //Effects[4] -> 2X Damage array
    //Effects[5] -> 4X Damage array
    const [effects, setEffects] = React.useState<EffectType>();

    const getIndex = (type: string) => {
        if (type) {
            return TypeMap.get(type);
        }
       return undefined;
    }

    const findEffects = (values: ResultType) => {
        let effects0 = [];
        let effects1 = [];
        let effects2 = [];
        let effects3 = [];
        let effects4 = [];
        let effects5 = [];
        let final = [];
        if (values) {
            for (let i = 0; i < TOTAL_TYPES; i++) {
                if (values[i][0] === 0) {
                    effects0.push(values[i][1]);
                }
                if (values[i][0] === 0.25) {
                    effects1.push(values[i][1]);
                }
                if (values[i][0] === 0.5) {
                    effects2.push(values[i][1]);
                }
                if (values[i][0] === 1) {
                    effects3.push(values[i][1]);
                }
                if (values[i][0] === 2) {
                    effects4.push(values[i][1]);
                }
                if (values[i][0] === 4) {
                    effects5.push(values[i][1]);
                }
            }
            final.push(effects0);
            final.push(effects1);
            final.push(effects2);
            final.push(effects3);
            final.push(effects4);
            final.push(effects5);
            setEffects(final);
        }
    }

    const computeTypeCoverage = (type1: string, type2: string, index1: IndexType, index2: IndexType) => {
        if(type1 === "" && type2 === ""){
            alert("Pon un tipo ps wbn");
            return undefined;
        }
        let temp = [];
        var pair: [number, string];
        var value: number;
        if(type1 === "" && typeof index2 === "number"){
            for (let i = 0; i < TOTAL_TYPES; i++) {
                value = TypeChart[i][index2]*0.5;
                pair = [value, TypeList[i]];
                temp.push(pair);
            }
            findEffects(temp);
            return temp;
        }
        if(type2 === "" && typeof index1 === "number"){
            for (let i = 0; i < TOTAL_TYPES; i++) {
                value = TypeChart[i][index1]*0.5;
                pair = [value, TypeList[i]];
                temp.push(pair);
            }
            findEffects(temp);
            return temp;
        }
        if(type1 === type2 && typeof index1 === "number") {
            for (let i = 0; i < TOTAL_TYPES; i++) {
                value = TypeChart[i][index1]*0.5;
                pair = [value, TypeList[i]];
                temp.push(pair);
            }
            findEffects(temp);
            return temp;
        }
        else if (type1 !== type2 && typeof index1 === "number" && typeof index2 === "number"){
            for (let i = 0; i < TOTAL_TYPES; i++) {
                value = TypeChart[i][index1]*TypeChart[i][index2]*0.25;
                pair = [value, TypeList[i]]
                temp.push(pair);
            }
            findEffects(temp);
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
        if(Array.isArray(computeTypeCoverage(type1, type2, index1, index2)))
            computeTypeCoverage(type1, type2, index1, index2);
    }, [setIndex1, setIndex2, index1, index2, type1, type2]);

    let immunities = <div></div>;
    let damage025 = <div></div>;
    let damage050 = <div></div>;
    let normalDamage = <div></div>;
    let damage2 = <div></div>;
    let damage4 = <div></div>;

    if(Array.isArray(effects)) {
        if(Array.isArray(effects[0]) && effects[0].length !== 0) {
            immunities = <div>
                <h1>Immunities</h1>
                {effects[0].map((type, index) => (
                    <p key={index}> {type}</p>
                ))}
            </div>
        }
        if(Array.isArray(effects[1]) && effects[1].length !== 0) {
            damage025 = <div>
                <h2>Resitances x0.25</h2>
                {effects[1].map((type, index) => (
                    <p key={index}> {type}</p>
                ))}
            </div>
        }
        if(Array.isArray(effects[2]) && effects[2].length !== 0) {
            damage050 = <div>
                <h2>Resitances x0.50</h2>
                    {effects[2].map((type, index) => (
                    <p key={index}> {type}</p>
                ))}      
            </div>
        }
        if(Array.isArray(effects[3]) && effects[3].length !== 0) {
            normalDamage = <div>
                <h2>Normal Damage</h2>
                    {effects[3].map((type, index) => (
                    <p key={index}> {type}</p>
                ))} 
            </div>
        }
        if(Array.isArray(effects[4]) && effects[4].length !== 0) {
            damage2 = <div>
                <h2>Effective X2</h2>
                {effects[4].map((type, index) => (
                    <p key={index}> {type}</p>
                ))} 
            </div>
        }
        if(Array.isArray(effects[5]) && effects[5].length !== 0) {
            damage4 = <div>
                <h2>Effective X4</h2> 
                {effects[5].map((type, index) => (
                    <p key={index}> {type}</p>
                ))} 
            </div>
        }
    }
    return(
    <div>
        <h1 className="title2">Types Result:</h1>
        {immunities}
        {damage025}
        {damage050}
        {normalDamage}
        {damage2}
        {damage4}
    </div>
    )
  };

export default Calc;