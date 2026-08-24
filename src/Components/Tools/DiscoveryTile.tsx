import React from 'react';
import styled, { css, keyframes } from 'styled-components';

const revealGrid = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const TileButton = styled.button`
  display: flex;
  width: 150px;
  padding: 0;
  color: #fff;
  background: transparent;
  border: 0;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid rgba(255, 222, 0, 0.75);
    outline-offset: 4px;
    border-radius: 12px;
  }
`;

const TileCircle = styled.span<{ $color: string }>`
  display: grid;
  width: 100px;
  height: 100px;
  padding: 0.5rem;
  background:
    radial-gradient(circle, ${({ $color }) => `${$color}2e`} 0%, transparent 68%),
    rgba(255, 255, 255, 0.045);
  border-radius: 50%;
  place-items: center;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
  transition: transform 0.22s ease;

  ${TileButton}:hover & {
    transform: scale(1.06);
  }
`;

const TileLabel = styled.span`
  max-width: 150px;
  min-height: 2.1rem;
  display: -webkit-box;
  overflow: hidden;
  font-size: 0.82rem;
  font-weight: 800;
  line-height: 1.25;
  text-align: center;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

export const DiscoveryContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: clamp(2.5rem, 7vh, 4.5rem) 0 2rem;

  @media (max-width: 640px) {
    padding-top: 2rem;
  }
`;

export const DiscoverySearch = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: clamp(1.75rem, 4vh, 2.75rem);
`;

export const DiscoverySearchControl = styled.div`
  position: relative;
  z-index: 10;
  width: min(54vw, 580px);
  min-width: 237px;

  .search-div,
  .search-box-curved,
  .search-box,
  ul.options,
  ul.options li,
  ul.options li.option-active,
  ul.options li.last-option {
    width: 100%;
    min-width: 0;
    max-width: none;
  }

  ul.options,
  .no-options {
    position: absolute;
    z-index: 20;
    top: 100%;
    left: 0;
    margin: 0;
  }

  .no-options {
    width: 100%;
    padding: 0.75rem 1rem;
    background: var(--bg-surface);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-top: 0;
    border-radius: 0 0 22px 22px;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  }

  .no-options p {
    margin: 0;
  }

  @media (max-width: 576px) {
    width: 80vw;
    min-width: 200px;
  }
`;

export const DiscoveryGrid = styled.div<{ $animate?: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 150px);
  justify-content: space-between;
  gap: clamp(1.35rem, 3vh, 2.25rem) clamp(2rem, 7vw, 6rem);
  ${({ $animate }) =>
    $animate &&
    css`
      animation: ${revealGrid} 240ms ease-out both;
    `}

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 150px);
    justify-content: space-around;
    gap: 1.5rem 0.5rem;
  }

  @media (max-width: 360px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const DiscoveryStatus = styled.p`
  margin: 0 0 1rem;
  color: var(--text-secondary);
  font-size: 0.85rem;
  text-align: center;
`;

export const DiscoveryLoader = styled.div`
  display: grid;
  min-height: 290px;
  color: var(--text-secondary);
  font-size: 0.85rem;
  text-align: center;
  place-content: center;
  gap: 0.75rem;

  @media (max-width: 640px) {
    min-height: 430px;
  }
`;

export const DiscoverySpinner = styled.img`
  width: 72px;
  height: 72px;
  margin: 0 auto;
  object-fit: contain;
  animation: ${spin} 1.1s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 2.5s;
  }
`;

type DiscoveryTileProps = {
  ariaLabel: string;
  children: React.ReactNode;
  color: string;
  label: string;
  onClick: () => void;
};

const DiscoveryTile: React.FC<DiscoveryTileProps> = ({
  ariaLabel,
  children,
  color,
  label,
  onClick,
}) => (
  <TileButton type="button" aria-label={ariaLabel} onClick={onClick}>
    <TileCircle $color={color} aria-hidden="true">
      {children}
    </TileCircle>
    <TileLabel>{label}</TileLabel>
  </TileButton>
);

export const DiscoveryImage = styled.img<{ $size?: number }>`
  width: ${({ $size = 72 }) => `${$size}px`};
  height: ${({ $size = 72 }) => `${$size}px`};
  object-fit: contain;
`;

export default DiscoveryTile;
