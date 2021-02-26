import React, { useEffect, useCallback } from 'react';
import TypeChart from '../../../Assets/typeChart';
import TypeMap from '../../../Assets/typeMap';
import TypeList from '../../../Assets/typeList';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {
    TypeRow,
    Title,
    Text,
    SubTitle,
    TypeCol,
    UnderlinedRow
} from './Styles';

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

    const computeTypeCoverage = useCallback((index1: IndexType) => {
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
            return undefined;
        }
    }, []);

    useEffect(() => {
        if(typeof getIndex(type1) === "number") {
            setIndex1(getIndex(type1));
        }
        if(Array.isArray(computeTypeCoverage(index1)))
            computeTypeCoverage(index1);
    }, [setIndex1, index1, type1, computeTypeCoverage]);

    let immunities = <div></div>;
    let damage050 = <div></div>;
    let damage2 = <div></div>;

    if(Array.isArray(effects)) {
        if(Array.isArray(effects[0]) && effects[0].length !== 0) {
            immunities = 
            <Row className="mt-5 mb-5">
                <Col xs={12}>
                    <Row className="justify-content-start">
                        <Title>Immune Against:</Title>
                    </Row>
                    <TypeRow className="justify-content-start">
                        {effects[0].map((type, index) => (
                            <Col key={index} xs={12} sm={4} md={3} lg={3} xl={2}>
                                <Row className="justify-content-start">
                                    <Col xs="auto">
                                        <Text className={`${type}`} key={index}> {type}</Text>
                                    </Col>
                                </Row>
                            </Col>
                        ))} 
                    </TypeRow>
                </Col>
            </Row>
        }
        if(Array.isArray(effects[1]) && effects[1].length !== 0) {
            damage050 = 
            <Row className="mt-5 mb-5">
                <Col xs={12}>
                    <Row className="justify-content-start">
                        <Title>Not Very Effective Against:</Title>
                    </Row>
                    <TypeRow className="justify-content-start">
                        {effects[1].map((type, index) => (
                            <Col key={index} xs={12} sm={4} md={3} lg={3} xl={2}>
                                <Row className="justify-content-start">
                                    <Col xs="auto">
                                        <Text className={`${type}`} key={index}> {type}</Text>
                                    </Col>
                                </Row>
                            </Col>
                        ))} 
                    </TypeRow>
                </Col>
            </Row>
        }
        if(Array.isArray(effects[3]) && effects[3].length !== 0) {
            damage2 = 
            <Row className="mt-5 mb-5">
                <Col xs={12}>
                    <Row className="justify-content-start">
                        <Title>Super Effective Against:</Title>
                    </Row>
                    <TypeRow className="justify-content-start">
                        {effects[3].map((type, index) => (
                            <Col key={index} xs={12} sm={4} md={3} lg={3} xl={2}>
                                <Row className="justify-content-start">
                                    <Col xs="auto">
                                        <Text className={`${type}`} key={index}> {type}</Text>
                                    </Col>
                                </Row>
                            </Col>
                        ))} 
                    </TypeRow>
                </Col>
            </Row>
        }
    }
    return(
    <Row className="align-items-center full-height p-2">
        <Col xs={12}>
            <UnderlinedRow type={type1} className="justify-content-start mt-3">
                <TypeCol xs="auto">
                    <SubTitle className={`${type1}`}>{type1} type</SubTitle>
                </TypeCol>
            </UnderlinedRow>
            {damage2}
            {immunities}
            {damage050}
        </Col>
    </Row>
    )
  };

export default Calc;