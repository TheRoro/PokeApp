import styled, { keyframes } from 'styled-components';
import { Col } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const MovesContainer = styled(Container)`
    min-height: 80vh;
    padding: 1rem 1rem 2rem;
    animation: ${fadeInUp} 0.6s ease forwards;
`

export const Title = styled.h1`
    font-size: calc(20px + 1.8vw);
    font-weight: 900;
    text-align: center;
    letter-spacing: 0.05em;
    color: #fff;
    text-transform: uppercase;
    text-shadow: 0 0 10px rgba(220, 10, 45, 0.3);
`

export const Subtitle = styled.p`
    font-size: 0.85rem;
    color: var(--text-secondary, #b0b0c0);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 0.5rem;
`

export const Subtitle2 = styled.p`
    font-size: 0.85rem;
    color: var(--text-secondary, #b0b0c0);
    font-weight: 700;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 0.5rem;
`

export const Text = styled.p`
    font-size: 0.9rem;
    color: var(--text-secondary, #b0b0c0);
    text-align: center;
`

export const Text2 = styled.p`
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-primary, #f5f5f5);
    margin-bottom: 0;
`

export const Text3 = styled.p`
    font-size: 0.9rem;
    font-weight: 600;
    text-align: center;
    color: var(--text-primary, #f5f5f5);
    margin-bottom: 0;
`

export const MoveRow = styled.div`
    display: grid;
    grid-template-columns: 50px 1fr 1fr 60px;
    gap: 0.5rem;
    align-items: center;
    padding: 0.6rem 0.8rem;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.03);
    border-left: 3px solid currentColor;
    margin-bottom: 0.35rem;
    transition: background 0.15s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.06);
    }
`

export const MoveHeader = styled.div`
    display: grid;
    grid-template-columns: 50px 1fr 1fr 60px;
    gap: 0.5rem;
    padding: 0.5rem 0.8rem 0.25rem;
    margin-bottom: 0.25rem;
`

export const VersionControls = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin: 1rem 0;
`

export const VersionSelect = styled.select`
    min-width: 220px;
    color: #fff;
    background: #2a2d32;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 8px;
    padding: 0.55rem 0.75rem;

    &:focus-visible {
        outline: 3px solid rgba(255, 222, 0, 0.7);
        outline-offset: 2px;
    }
`

export const LoadMoreButton = styled.button`
    display: block;
    margin: 1rem auto 0;
    color: #fff;
    background: rgba(220, 10, 45, 0.2);
    border: 1px solid rgba(220, 10, 45, 0.6);
    border-radius: 8px;
    padding: 0.55rem 1rem;

    &:disabled {
        cursor: wait;
        opacity: 0.6;
    }

    &:focus-visible {
        outline: 3px solid rgba(255, 222, 0, 0.7);
        outline-offset: 2px;
    }
`

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const LoadingCol = styled(Col)`
    min-width: 80px;
    min-height: 80px;
    margin-top: 2rem;
`

export const LoadingImg = styled.img`
    animation: ${rotate} 1s linear infinite;
    width: 80px;
    height: 80px;
`
