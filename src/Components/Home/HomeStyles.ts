import styled, { keyframes } from 'styled-components';
import {
    Row as BRow,
    Col as BCol,
    Container as BContainer
} from 'react-bootstrap';

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

export const HomeContainer = styled.div`
    height: 75%;
    width: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;

    @media screen and (max-width: 480px) {
        height: 70%;
        padding: 0 1rem;
    }
`

export const FooterContainer = styled.div`
    height: 15%;
    width: 100%;
    overflow: hidden;
    opacity: 0;
    animation: fadeIn 0.8s ease forwards;
    animation-delay: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @media screen and (max-width: 480px) {
        height: auto;
        padding: 1.5rem 0;
    }
`

export const Title = styled.h1`
    font-size: calc(38px + 4.5vw);
    font-weight: 900;
    text-align: center;
    margin-bottom: 0.5rem;
    letter-spacing: 0.04em;
    color: #fff;
    text-shadow: 2px 2px 0px var(--pokedex-red), 4px 4px 0px rgba(0,0,0,0.1);
    animation: ${fadeInUp} 0.75s ease forwards;

    @media screen and (max-width: 480px) {
        font-size: calc(32px + 3vw);
    }
`

export const Text = styled.p`
    font-size: calc(11px + 0.7vw);
    font-weight: 300;
    color: var(--text-secondary);
    text-align: center;
    line-height: 1.8;
    font-style: italic;
    max-width: 760px;
    margin: 0 auto;
    opacity: 0;
    animation: ${fadeInUp} 0.85s ease forwards;
    animation-delay: 0.15s;
`

export const FooterLink = styled.button`
    border: 2px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.05);
    cursor: pointer;
    margin: 0;
    padding: 0.5rem 1.2rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-secondary, #b0b0c0);
    border-radius: 8px;
    transition: all .2s ease-in-out;
    letter-spacing: 0.02em;

    &:hover {
        color: #fff;
        border-color: var(--pokedex-red, #DC0A2D);
        background: rgba(220, 10, 45, 0.1);
        text-decoration: none;
    }

    &:focus-visible {
        outline: 3px solid rgba(255, 222, 0, 0.75);
        outline-offset: 3px;
        box-shadow: 0 0 0 3px rgba(220, 10, 45, 0.2);
    }
`

export const Row = styled(BRow)`
    height: 100%;
    animation: ${fadeInUp} 0.65s ease forwards;
`

export const Col = styled(BCol)`
`

export const Container = styled(BContainer)`
    height: 100%;
`
