import React, { useEffect } from 'react';
import Navigation from '../Tools/Navigation/Navigation';
import { getTypeColor } from '../Tools/TypeBadge';
import { ToolPageHeader } from '../Tools/ToolLayout';
import typeIcons from '../../Assets/type-icons';
import {
    EffectCard,
    InfoCard,
    InfoGrid,
    InfoLabel,
    InfoValue,
    MoveTypeCard,
    MoveTypeIcon,
    MoveTypeName,
    MoveTypeRole,
    Text,
    MoveInfoContainer,
    StatsCard
} from './MoveInfoStyles';

type Props = {
    moveInfo: any,
    moveName: string
}

const PokemonStats: React.FC<Props> = ({
    moveInfo,
    moveName
}) => {
    const [effect, setEffect] = React.useState<string>('');

    useEffect(() => {
        let temp = '';
        if (moveInfo.effect_entries.length > 0) {
            const englishEntry = moveInfo.effect_entries.find(
                (entry: any) => entry.language.name === 'en'
            );
            if (englishEntry) {
                temp = englishEntry.short_effect;
            } else {
                temp = moveInfo.effect_entries[0].short_effect;
            }
            let index = temp.search('effect_chance');
            while (index !== -1) {
                temp = temp.replace('$effect_chance', moveInfo.effect_chance?.toString() || '');
                index = temp.search('effect_chance');
            }
        }
        setEffect(temp);
    }, [moveInfo]);

    const moveType = moveInfo.type.name.toLowerCase();
    const moveTypeLabel = moveInfo.type.name[0].toUpperCase() + moveInfo.type.name.slice(1);
    const moveTypeColor = getTypeColor(moveType);
    const category = moveInfo.damage_class
        ? moveInfo.damage_class.name[0].toUpperCase() + moveInfo.damage_class.name.slice(1)
        : '—';
    const power = moveInfo.power !== null ? moveInfo.power : '—';
    const accuracy = moveInfo.accuracy !== null ? moveInfo.accuracy + '%' : '—';

    return (
        <MoveInfoContainer>
            <Navigation left="/move" right="" />
            <ToolPageHeader
                eyebrow="Move database"
                title={moveName}
                description="Review type, category, power, accuracy, and battle effect."
            />
            <StatsCard>
                <MoveTypeCard $color={moveTypeColor}>
                    <MoveTypeIcon src={typeIcons[moveTypeLabel]} alt="" />
                    <span>
                        <MoveTypeRole>Move type</MoveTypeRole>
                        <MoveTypeName>{moveTypeLabel}</MoveTypeName>
                    </span>
                </MoveTypeCard>
                <InfoGrid>
                    <InfoCard>
                        <InfoLabel>Category</InfoLabel>
                        <InfoValue>{category}</InfoValue>
                    </InfoCard>
                    <InfoCard>
                        <InfoLabel>Power</InfoLabel>
                        <InfoValue>{power}</InfoValue>
                    </InfoCard>
                    <InfoCard>
                        <InfoLabel>Accuracy</InfoLabel>
                        <InfoValue>{accuracy}</InfoValue>
                    </InfoCard>
                    <InfoCard>
                        <InfoLabel>PP</InfoLabel>
                        <InfoValue>{moveInfo.pp}</InfoValue>
                    </InfoCard>
                </InfoGrid>
                {effect && (
                    <EffectCard>
                        <InfoLabel>Battle effect</InfoLabel>
                        <Text>{effect}</Text>
                    </EffectCard>
                )}
            </StatsCard>
        </MoveInfoContainer>
    );
}

export default PokemonStats;
