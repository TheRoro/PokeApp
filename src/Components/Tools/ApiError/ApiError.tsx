import React from 'react';
import styled from 'styled-components';

export type ApiErrorInfo = {
  title: string;
  message: string;
};

const Panel = styled.div`
  width: min(100%, 560px);
  margin: 1.5rem auto;
  padding: 1.25rem;
  color: var(--text-primary);
  text-align: center;
  background: rgba(54, 58, 64, 0.85);
  border: 1px solid rgba(220, 10, 45, 0.55);
  border-radius: 14px;
`;

const Title = styled.h2`
  margin: 0 0 0.35rem;
  font-size: 1.1rem;
`;

const Message = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const RetryButton = styled.button`
  min-height: 44px;
  margin-top: 1rem;
  padding: 0.55rem 1rem;
  color: #fff;
  font-weight: 700;
  background: rgba(220, 10, 45, 0.2);
  border: 1px solid var(--pokedex-red);
  border-radius: 8px;
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid rgba(255, 222, 0, 0.65);
    outline-offset: 2px;
  }
`;

type Props = {
  error: ApiErrorInfo;
  onRetry?: () => void;
};

const ApiError: React.FC<Props> = ({ error, onRetry }) => (
  <Panel role="alert">
    <Title>{error.title}</Title>
    <Message>{error.message}</Message>
    {onRetry && (
      <RetryButton type="button" onClick={onRetry}>
        Try again
      </RetryButton>
    )}
  </Panel>
);

export default ApiError;
