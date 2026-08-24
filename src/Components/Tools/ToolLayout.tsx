import React from 'react';
import styled from 'styled-components';

export const ToolPage = styled.main`
  min-height: calc(100vh - 80px);
  padding: clamp(2.5rem, 7vh, 4.5rem) 1rem 4rem;

  @media (max-width: 640px) {
    padding-top: 2rem;
  }
`;

export const ToolPanel = styled.section`
  padding: clamp(1.25rem, 4vw, 2rem);
  background: linear-gradient(145deg, #352020 0%, #2a2d32 42%);
  border: 1px solid rgba(232, 65, 60, 0.38);
  border-radius: 18px;
  box-shadow: var(--shadow-soft);
`;

const Header = styled.header`
  max-width: 760px;
  margin: 0 auto clamp(1.5rem, 4vw, 2.5rem);
  text-align: center;
`;

const Eyebrow = styled.p`
  margin: 0 0 0.45rem;
  color: #ff8799;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(2.25rem, 7vw, 4.75rem);
  font-weight: 850;
  letter-spacing: -0.04em;
`;

const Description = styled.p<{ $wrap: boolean }>`
  position: relative;
  left: ${({ $wrap }) => ($wrap ? 'auto' : '50%')};
  width: ${({ $wrap }) => ($wrap ? 'auto' : 'max-content')};
  max-width: ${({ $wrap }) => ($wrap ? '760px' : 'none')};
  margin: 0.65rem 0 0;
  color: var(--text-secondary);
  font-size: clamp(0.95rem, 2.5vw, 1.08rem);
  line-height: 1.6;
  white-space: ${({ $wrap }) => ($wrap ? 'normal' : 'nowrap')};
  transform: ${({ $wrap }) => ($wrap ? 'none' : 'translateX(-50%)')};

  @media (max-width: 760px) {
    left: auto;
    width: auto;
    max-width: 620px;
    margin-right: auto;
    margin-left: auto;
    white-space: normal;
    transform: none;
  }
`;

type ToolPageHeaderProps = {
  description: React.ReactNode;
  eyebrow?: string;
  title: React.ReactNode;
  wrapDescription?: boolean;
};

export const ToolPageHeader: React.FC<ToolPageHeaderProps> = ({
  description,
  eyebrow = 'PokéApp tool',
  title,
  wrapDescription = false,
}) => (
  <Header>
    <Eyebrow>{eyebrow}</Eyebrow>
    <Title>{title}</Title>
    <Description $wrap={wrapDescription}>{description}</Description>
  </Header>
);
