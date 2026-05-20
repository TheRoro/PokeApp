import React, { useEffect, useCallback } from 'react';
import TypeChart from '../../../Assets/typeChart';
import TypeMap from '../../../Assets/typeMap';
import TypeList from '../../../Assets/typeList';

import {
    CoverageCard,
    CategoryLabel,
    TypeBadge,
    SubTitle
} from './Styles';

const TOTAL_TYPES = 18;

type CalculatorProps = {
    type1: string
}

type IndexType = number | undefined;

type ResultType = | undefined | [number, string][];

type EffectType = string[][];

const Calc: React.FC<CalculatorProps> = ({ type1 }) => {
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
    };

    const findEffects = (values: ResultType) => {
        const effects0: string[] = [];
        const effects2: string[] = [];
        const effects3: string[] = [];
        const effects4: string[] = [];
        const final: string[][] = [];

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
            final.push(effects0, effects2, effects3, effects4);
            setEffects(final);
        }
    };

    const computeTypeCoverage = useCallback((currentIndex: IndexType) => {
        const temp: [number, string][] = [];
        let pair: [number, string];
        let value: number;

        if (typeof currentIndex === 'number') {
            for (let i = 0; i < TOTAL_TYPES; i++) {
                value = TypeChart[currentIndex][i] * 0.5;
                pair = [value, TypeList[i]];
                temp.push(pair);
            }
            findEffects(temp);
            return temp;
        }

        return undefined;
    }, []);

    useEffect(() => {
        if (typeof getIndex(type1) === 'number') {
            setIndex1(getIndex(type1));
        }
        if (Array.isArray(computeTypeCoverage(index1))) {
            computeTypeCoverage(index1);
        }
    }, [setIndex1, index1, type1, computeTypeCoverage]);

    return (
        <CoverageCard style={{ marginTop: '0.75rem' }}>
            <SubTitle className={type1} style={{ marginBottom: '0.75rem' }}>{type1} type</SubTitle>
            {Array.isArray(effects) && (
                <>
                    {effects[3]?.length > 0 && (
                        <div>
                            <CategoryLabel>Super Effective (×2)</CategoryLabel>
                            <div>
                                {effects[3].map((type, index) => (
                                    <TypeBadge className={type} key={index}>{type}</TypeBadge>
                                ))}
                            </div>
                        </div>
                    )}
                    {effects[0]?.length > 0 && (
                        <div>
                            <CategoryLabel>No Effect (×0)</CategoryLabel>
                            <div>
                                {effects[0].map((type, index) => (
                                    <TypeBadge className={type} key={index}>{type}</TypeBadge>
                                ))}
                            </div>
                        </div>
                    )}
                    {effects[1]?.length > 0 && (
                        <div>
                            <CategoryLabel>Not Very Effective (×0.5)</CategoryLabel>
                            <div>
                                {effects[1].map((type, index) => (
                                    <TypeBadge className={type} key={index}>{type}</TypeBadge>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </CoverageCard>
    );
};

export default Calc;
