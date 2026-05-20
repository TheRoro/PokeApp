import styled, { keyframes } from 'styled-components';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import {Link} from 'react-router-dom';

const fadeInUp = keyframes`
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

export const TypeCalDiv = styled.div`
    min-height: auto;
    min-width: 282px;
    padding: 2rem 0;
    animation: ${fadeInUp} 0.7s ease forwards;
`

export const ResultsContainer = styled(Container)`
    padding: 2rem 1.5rem;
    background: rgba(54, 58, 64, 0.6);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.06);
`

export const TypeContainer = styled(Container)`
    padding: 1.75rem 1rem;
`

export const LastRow = styled(Row)`
    min-height: 120px;
`

export const Title = styled.h1`
    font-size: calc(30px + 2vw);
    font-weight: 800;
    text-align: center;
`

export const TypeLabel = styled.span`
    font-size: 1.1rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0.45rem 1rem;
    width: 160px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid currentColor;

    &::before {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: currentColor;
        box-shadow: 0 0 6px currentColor;
    }
`

export const Button = styled(Link)`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    padding: 0.75rem 2rem;
    font-size: 1.05rem;
    font-weight: 700;
    border-radius: 10px;
    background: rgba(220, 10, 45, 0.15);
    border: 2px solid var(--pokedex-red, #DC0A2D);
    text-decoration: none;
    transition: all 0.2s ease;
    letter-spacing: 0.02em;

    &::after {
        display: none;
    }

    &:hover {
        color: #fff;
        text-decoration: none;
        background: rgba(220, 10, 45, 0.3);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(220, 10, 45, 0.25);
    }

    &:active {
        transform: translateY(0);
        box-shadow: none;
    }

    &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 3px rgba(220, 10, 45, 0.25);
    }
`
