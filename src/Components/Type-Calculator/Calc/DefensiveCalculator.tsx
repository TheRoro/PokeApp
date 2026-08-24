import React, { useEffect, useCallback } from 'react';
import TypeChart from '../../../Assets/typeChart';
import TypeMap from '../../../Assets/typeMap';
import TypeList from '../../../Assets/typeList';

import {
    CoverageCard,
    CategoryLabel,
    TypeBadge,
    TypeIcon,
} from './Styles';
import typeIcons from '../../../Assets/type-icons';

const TOTAL_TYPES = 18;

type CalculatorProps = {
    type1: string,
    type2: string
}

type IndexType = number | undefined;

type ResultType = | undefined | [number, string][];

type EffectType = string[][];

const Calc: React.FC<CalculatorProps> = ({ type1, type2 }) => {
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
    };

    const findEffects = (values: ResultType) => {
        const effects0: string[] = [];
        const effects1: string[] = [];
        const effects2: string[] = [];
        const effects3: string[] = [];
        const effects4: string[] = [];
        const effects5: string[] = [];
        const final: string[][] = [];

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

            final.push(effects0, effects1, effects2, effects3, effects4, effects5);
            setEffects(final);
        }
    };

    const computeTypeCoverage = useCallback((firstType: string, secondType: string, firstIndex: IndexType, secondIndex: IndexType) => {
        if (firstType === 'None' && secondType === 'None') {
            return undefined;
        }

        const temp: [number, string][] = [];
        let pair: [number, string];
        let value: number;

        if (firstType === 'None' && typeof secondIndex === 'number') {
            for (let i = 0; i < TOTAL_TYPES; i++) {
                value = TypeChart[i][secondIndex] * 0.5;
                pair = [value, TypeList[i]];
                temp.push(pair);
            }
            findEffects(temp);
            return temp;
        }

        if (secondType === 'None' && typeof firstIndex === 'number') {
            for (let i = 0; i < TOTAL_TYPES; i++) {
                value = TypeChart[i][firstIndex] * 0.5;
                pair = [value, TypeList[i]];
                temp.push(pair);
            }
            findEffects(temp);
            return temp;
        }

        if (firstType === secondType && typeof firstIndex === 'number') {
            for (let i = 0; i < TOTAL_TYPES; i++) {
                value = TypeChart[i][firstIndex] * 0.5;
                pair = [value, TypeList[i]];
                temp.push(pair);
            }
            findEffects(temp);
            return temp;
        }

        if (firstType !== secondType && typeof firstIndex === 'number' && typeof secondIndex === 'number') {
            for (let i = 0; i < TOTAL_TYPES; i++) {
                value = TypeChart[i][firstIndex] * TypeChart[i][secondIndex] * 0.25;
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
        if (typeof getIndex(type2) === 'number') {
            setIndex2(getIndex(type2));
        }
        if (Array.isArray(computeTypeCoverage(type1, type2, index1, index2))) {
            computeTypeCoverage(type1, type2, index1, index2);
        }
    }, [setIndex1, setIndex2, index1, index2, type1, type2, computeTypeCoverage]);

    return (
        <CoverageCard>
            {Array.isArray(effects) && (
                <>
                    {effects[5]?.length > 0 && (
                        <div>
                            <CategoryLabel>Takes 4× damage from</CategoryLabel>
                            <div>
                                {effects[5].map((type, index) => (
                                    <TypeBadge className={type} key={index}>
                                        <TypeIcon src={typeIcons[type]} alt="" />
                                        {type}
                                    </TypeBadge>
                                ))}
                            </div>
                        </div>
                    )}
                    {effects[4]?.length > 0 && (
                        <div>
                            <CategoryLabel>Weak to (2× damage)</CategoryLabel>
                            <div>
                                {effects[4].map((type, index) => (
                                    <TypeBadge className={type} key={index}>
                                        <TypeIcon src={typeIcons[type]} alt="" />
                                        {type}
                                    </TypeBadge>
                                ))}
                            </div>
                        </div>
                    )}
                    {effects[2]?.length > 0 && (
                        <div>
                            <CategoryLabel>Resists (0.5× damage)</CategoryLabel>
                            <div>
                                {effects[2].map((type, index) => (
                                    <TypeBadge className={type} key={index}>
                                        <TypeIcon src={typeIcons[type]} alt="" />
                                        {type}
                                    </TypeBadge>
                                ))}
                            </div>
                        </div>
                    )}
                    {effects[1]?.length > 0 && (
                        <div>
                            <CategoryLabel>Strongly resists (0.25× damage)</CategoryLabel>
                            <div>
                                {effects[1].map((type, index) => (
                                    <TypeBadge className={type} key={index}>
                                        <TypeIcon src={typeIcons[type]} alt="" />
                                        {type}
                                    </TypeBadge>
                                ))}
                            </div>
                        </div>
                    )}
                    {effects[0]?.length > 0 && (
                        <div>
                            <CategoryLabel>Immune to (0× damage)</CategoryLabel>
                            <div>
                                {effects[0].map((type, index) => (
                                    <TypeBadge className={type} key={index}>
                                        <TypeIcon src={typeIcons[type]} alt="" />
                                        {type}
                                    </TypeBadge>
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