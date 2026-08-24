import React, { useEffect, useCallback } from 'react';
import TypeChart from '../../../Assets/typeChart';
import TypeMap from '../../../Assets/typeMap';
import TypeList from '../../../Assets/typeList';

import {
    CoverageCard,
    CategoryLabel,
    OffensiveTypeHeader,
    OffensiveTypeIcon,
    OffensiveTypeLabel,
    OffensiveTypeName,
    OffensiveTypeText,
    TypeBadge,
    TypeIcon
} from './Styles';
import typeIcons from '../../../Assets/type-icons';
import { getTypeColor } from '../../Tools/TypeBadge';

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
        <CoverageCard>
            <OffensiveTypeHeader $color={getTypeColor(type1)}>
                <OffensiveTypeIcon src={typeIcons[type1]} alt="" />
                <OffensiveTypeText>
                    <OffensiveTypeLabel>Using {type1} moves</OffensiveTypeLabel>
                    <OffensiveTypeName>{type1}</OffensiveTypeName>
                </OffensiveTypeText>
            </OffensiveTypeHeader>
            {Array.isArray(effects) && (
                <>
                    {effects[3]?.length > 0 && (
                        <div>
                            <CategoryLabel>Strong against (2× damage)</CategoryLabel>
                            <div>
                                {effects[3].map((type, index) => (
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
                            <CategoryLabel>Cannot affect (0× damage)</CategoryLabel>
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
                    {effects[1]?.length > 0 && (
                        <div>
                            <CategoryLabel>Not very effective against (0.5× damage)</CategoryLabel>
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
                </>
            )}
        </CoverageCard>
    );
};

export default Calc;
