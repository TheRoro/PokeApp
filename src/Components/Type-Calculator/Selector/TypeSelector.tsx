import React from 'react';
import AllTypes from '../../../Assets/allTypes';

import {
    Select,
    SelectorCard,
    SelectorEmptyIcon,
    SelectorIcon,
    SelectorIconFrame,
    SelectorLabel,
    SelectorRow,
} from './Styles';
import { getTypeColor } from '../../Tools/TypeBadge';
import { ToolPageHeader } from '../../Tools/ToolLayout';
import typeIcons from '../../../Assets/type-icons';

type Props = {
    type1: string,
    type2: string,
    setType1: any,
    setType2: any,
}

const TypeSelector: React.FC<Props> = ({type1, type2, setType1, setType2}) =>{
    const handleChangeType1 = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value;
        setType1(newType.toString());
        if (newType === type2) setType2('None');
    }

    const handleChangeType2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value;
        if (newType === type1) {
            setType2('None');
        } else {
            setType2(newType.toString());
        }
    }

    const color1 = type1 === 'None' ? '#777b84' : getTypeColor(type1);
    const color2 = type2 === 'None' ? '#777b84' : getTypeColor(type2);

    return(
        <>
            <ToolPageHeader
                eyebrow="Pokédex matchup guide"
                title="Type Calculator"
                description="Compare defensive matchups, offensive strengths, and matching Pokémon for one or two types."
            />
            <SelectorCard $primaryColor={color1} $secondaryColor={color2}>
                <SelectorRow $color={color1}>
                    <SelectorLabel htmlFor="primary-type">
                        <SelectorIconFrame $color={color1} aria-hidden="true">
                            {type1 === 'None' ? (
                                <SelectorEmptyIcon>—</SelectorEmptyIcon>
                            ) : (
                                <SelectorIcon src={typeIcons[type1]} alt="" />
                            )}
                        </SelectorIconFrame>
                        Primary type
                    </SelectorLabel>
                    <Select id="primary-type" value={type1} onChange={handleChangeType1}>
                        {AllTypes.map(option => (
                            <option value={option.value} key={option.value}>{option.label}</option>
                        ))}
                    </Select>
                </SelectorRow>
                <SelectorRow $color={color2}>
                    <SelectorLabel htmlFor="secondary-type">
                        <SelectorIconFrame $color={color2} aria-hidden="true">
                            {type2 === 'None' ? (
                                <SelectorEmptyIcon>—</SelectorEmptyIcon>
                            ) : (
                                <SelectorIcon src={typeIcons[type2]} alt="" />
                            )}
                        </SelectorIconFrame>
                        Secondary type
                    </SelectorLabel>
                    <Select id="secondary-type" value={type2} onChange={handleChangeType2}>
                        {AllTypes.map(option => (
                            <option value={option.value} key={option.value}>{option.label}</option>
                        ))}
                    </Select>
                </SelectorRow>
            </SelectorCard>
        </>
    );
}

export default TypeSelector;
