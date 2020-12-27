import React, { useEffect } from 'react';
import TypeChart from '../../Assets/typeChart';
import TypeMap from '../../Assets/typeMap';
import TypeList from '../../Assets/typeList';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const TOTAL_TYPES = 18;

type CalculatorProps = {
    type1: string
}

type IndexType = number | undefined;

type ResultType = | undefined | [number, string][];

type EffectType = string[][];

const Calc: React.FC<CalculatorProps> = ({ type1 }) =>{
    const [index1, setIndex1] = React.useState<IndexType>();
    //effects[0] -> Immunities array
    //Effects[1] -> 0.50 array
    //Effects[3] -> Normal Damage array
    //Effects[4] -> 2X Damage array
    const [effects, setEffects] = React.useState<EffectType>();

    const getIndex = (type: string) => {
        if (type) {
            return TypeMap.get(type);
        }
       return undefined;
    }

    const findEffects = (values: ResultType) => {
        let effects0 = [];
        let effects2 = [];
        let effects3 = [];
        let effects4 = [];
        let final = [];
        if (values) {
            for (let i = 0; i < TOTAL_TYPES; i++) {
                if (values[i][0] === 0) {
                    effects0.push(values[i][1]);
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
            }
            final.push(effects0);
            final.push(effects2);
            final.push(effects3);
            final.push(effects4);
            setEffects(final);
        }
    }

    const computeTypeCoverage = (type1: string,  index1: IndexType) => {
        // if(type1 === "None" && type2 === "None"){
        //     alert("Pon un tipo ps wbn");
        //     return undefined;
        // }
        let temp = [];
        var pair: [number, string];
        var value: number;
        if(typeof index1 === "number"){
            for (let i = 0; i < TOTAL_TYPES; i++) {
                value = TypeChart[index1][i]*0.5;
                pair = [value, TypeList[i]];
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
        if(Array.isArray(computeTypeCoverage(type1, index1)))
            computeTypeCoverage(type1, index1);
    }, [setIndex1, index1, type1]);

    let immunities = <div></div>;
    let damage050 = <div></div>;
    let normalDamage = <div></div>;
    let damage2 = <div></div>;

    if(Array.isArray(effects)) {
        if(Array.isArray(effects[0]) && effects[0].length !== 0) {
            immunities = 
            <Row className="mt-5 mb-5">
                <Col xs={12}>
                    <Row className="justify-content-md-start justify-content-center">
                        <h1 className="text4 centered-text">Immune Against:</h1>
                    </Row>
                    <Row className="justify-content-start types">
                        {effects[0].map((type, index) => (
                            <Col key={index} xs={12} sm={4} md={3} lg={3} xl={2}>
                                <Row className="justify-content-md-start justify-content-center">
                                    <Col xs="auto">
                                        <p className={`${type} typetext`} key={index}> {type}</p>
                                    </Col>
                                </Row>
                            </Col>
                        ))} 
                    </Row>
                </Col>
            </Row>
        }
        if(Array.isArray(effects[1]) && effects[1].length !== 0) {
            damage050 = 
            <Row className="mt-5 mb-5">
                <Col xs={12}>
                    <Row className="justify-content-md-start justify-content-center">
                        <h1 className="text4 centered-text">Not Very Effective Against:</h1>
                    </Row>
                    <Row className="justify-content-start types">
                        {effects[1].map((type, index) => (
                            <Col key={index} xs={12} sm={4} md={3} lg={3} xl={2}>
                                <Row className="justify-content-md-start justify-content-center">
                                    <Col xs="auto">
                                        <p className={`${type} typetext`} key={index}> {type}</p>
                                    </Col>
                                </Row>
                            </Col>
                        ))} 
                    </Row>
                </Col>
            </Row>
        }
        if(Array.isArray(effects[2]) && effects[2].length !== 0) {
            normalDamage = 
            <Row className="mt-5 mb-5">
                <Col xs={12}>
                    <Row className="justify-content-md-start justify-content-center">
                        <h1 className="text4 centered-text">Normal Damage Against:</h1>
                    </Row>
                    <Row className="justify-content-start types">
                        {effects[2].map((type, index) => (
                            <Col key={index} xs={12} sm={4} md={3} lg={3} xl={2}>
                                <Row className="justify-content-md-start justify-content-center">
                                    <Col xs="auto">
                                        <p className={`${type} typetext`} key={index}> {type}</p>
                                    </Col>
                                </Row>
                            </Col>
                        ))} 
                    </Row>
                </Col>
            </Row>
        }
        if(Array.isArray(effects[3]) && effects[3].length !== 0) {
            damage2 = 
            <Row className="mt-3 mb-5">
                <Col xs={12}>
                    <Row className="justify-content-md-start justify-content-center">
                        <h1 className="text4 centered-text">Super Effective Against:</h1>
                    </Row>
                    <Row className="justify-content-start types">
                        {effects[3].map((type, index) => (
                            <Col key={index} xs={12} sm={4} md={3} lg={3} xl={2}>
                                <Row className="justify-content-md-start justify-content-center">
                                    <Col xs="auto">
                                        <p className={`${type} typetext`} key={index}> {type}</p>
                                    </Col>
                                </Row>
                            </Col>
                        ))} 
                    </Row>
                </Col>
            </Row>
        }
    }
    return(
    <Row className="align-items-center full-height">
        <Col xs={12}>
            <Row className="justify-content-center mt-3">
                <Col xs="auto">
                    <h1 className={`typetitle centered-text ${type1}`}>{type1} type</h1>
                </Col>
            </Row>
            {damage2}
            {immunities}
            {damage050}
            {/* {normalDamage} */}
        </Col>
    </Row>
    )
  };

export default Calc;