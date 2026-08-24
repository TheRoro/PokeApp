import styled, { keyframes } from 'styled-components';
import Container from 'react-bootstrap/Container';
import { Col } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const fadeInUp = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const EvolutionsContainer = styled(Container)`
    min-height: 80vh;
    padding: 1rem 1rem 2rem;
    animation: ${fadeInUp} 180ms ease-out forwards;
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
    position: relative;
    overflow: hidden;
    background: #303339;
    border: 1px solid #4a4e55;
    border-radius: 18px;
    padding: 1.25rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 140px;
    color: inherit;
    font: inherit;
    cursor: pointer;
    box-shadow:
        0 4px 0 #1f2226,
        0 14px 26px rgba(0, 0, 0, 0.16);
    transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;

    &::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 52px;
        height: 5px;
        content: '';
        background: #d72d38;
        border-radius: 0 0 8px 0;
    }

    &:hover {
        background: #383c42;
        border-color: #5b6068;
        transform: translateY(-2px);
    }

    &:focus-visible {
        outline: 3px solid rgba(215, 45, 56, 0.2);
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

export const EvolutionStage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
`

export const StageLabel = styled.span`
    color: #aaa299;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
`

export const Arrow = styled.span`
    display: inline-flex;
    width: 36px;
    height: 36px;
    flex: 0 0 36px;
    align-items: center;
    justify-content: center;
    color: #fffaf1;
    background: #d72d38;
    border: 2px solid #ef5963;
    border-radius: 50%;
    box-shadow: 0 3px 0 #8e1821;

    svg {
        display: block;
        width: 15px;
        height: 15px;
    }

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
