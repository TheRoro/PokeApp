import React from 'react';
import styled from 'styled-components';

export const typeColors: Record<string, string> = {
  Bug: '#b8d72b',
  Dark: '#a29288',
  Dragon: '#8b7cf6',
  Electric: '#f8d030',
  Fairy: '#f4a7d9',
  Fighting: '#e0664a',
  Fire: '#f08030',
  Flying: '#a890f0',
  Ghost: '#9b82c4',
  Grass: '#78c850',
  Ground: '#d8b45a',
  Ice: '#98d8d8',
  Normal: '#c6c6a7',
  Poison: '#b968c7',
  Psychic: '#f85888',
  Rock: '#c0aa52',
  Steel: '#b8b8d0',
  Water: '#78a0f8',
};

export const getTypeColor = (type: string) =>
  typeColors[type[0]?.toUpperCase() + type.slice(1).toLowerCase()] ?? '#ff8799';

const Badge = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.75rem;
  color: ${({ $color }) => $color};
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  background: rgba(20, 22, 26, 0.72);
  border: 1px solid ${({ $color }) => $color};
  border-radius: 999px;
  box-shadow: 0 0 14px ${({ $color }) => `${$color}20`};
`;

const Dot = styled.span<{ $color: string }>`
  width: 0.5rem;
  height: 0.5rem;
  background: ${({ $color }) => $color};
  border-radius: 50%;
  box-shadow: 0 0 7px ${({ $color }) => $color};
`;

type TypeBadgeProps = {
  ariaLabel?: string;
  label?: string;
  type: string;
};

const TypeBadge: React.FC<TypeBadgeProps> = ({ ariaLabel, label, type }) => {
  const color = getTypeColor(type);
  return (
    <Badge $color={color} aria-label={ariaLabel ?? `${type} type`}>
      <Dot $color={color} aria-hidden="true" />
      {label ?? type}
    </Badge>
  );
};

export default TypeBadge;
