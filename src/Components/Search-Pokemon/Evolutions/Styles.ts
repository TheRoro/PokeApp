import styled, { keyframes } from 'styled-components';
import Container from 'react-bootstrap/Container';
import { Col } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const EvolutionsContainer = styled(Container)`
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
    margin-bottom: 1.5rem;
`

export const SubTitle = styled.h2`
    font-size: 1rem;
    font-weight: 700;
    text-align: center;
    color: #fff;
    text-transform: capitalize;
    margin: 0.5rem 0 0;
`

export const EvolutionCard = styled.button`
    background: linear-gradient(145deg, #352020 0%, #2A2D32 40%);
    border: 2px solid rgba(220, 10, 45, 0.3);
    border-radius: 16px;
    padding: 1.25rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 140px;
    color: inherit;
    font: inherit;
    cursor: pointer;
    transition: transform 0.2s ease, border-color 0.2s ease;

    &:hover {
        border-color: var(--pokedex-red);
        transform: translateY(-2px);
    }

    &:focus-visible {
        outline: 3px solid rgba(255, 222, 0, 0.7);
        outline-offset: 3px;
    }

    @media (max-width: 576px) {
        min-width: 120px;
        padding: 0.75rem;
        border-radius: 12px;
    }
`

export const EvolutionFlow = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;

    @media (max-width: 576px) {
        flex-direction: column;
        gap: 0.5rem;
    }
`

export const Arrow = styled.span`
    font-size: 1.5rem;
    color: var(--pokedex-red, #DC0A2D);
    font-weight: 900;

    @media (max-width: 576px) {
        transform: rotate(90deg);
        margin: 0.25rem 0;
    }
`

export const LazyImage = styled(LazyLoadImage)`
    width: 120px;
    height: 120px;
    object-fit: contain;
    border-radius: 12px;
    padding: 0.5rem;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.03) 0%, transparent 70%);
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.25));

    @media (max-width: 576px) {
        width: 90px;
        height: 90px;
    }
`

export const Image = styled.img`
    width: 100px;
    height: 100px;
    object-fit: contain;
`

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const LoadingCol = styled(Col)`
    min-width: 80px;
    min-height: 80px;
`

export const LoadingImg = styled.img`
    animation: ${rotate} 1s linear infinite;
    width: 80px;
    height: 80px;
`
