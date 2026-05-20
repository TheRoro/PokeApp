import styled, { keyframes } from 'styled-components';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import { LazyLoadImage } from 'react-lazy-load-image-component';

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

const rotate = keyframes`
  from {
    transform: rotate(0deg) scale(1);
  }

  50% {
    transform: rotate(180deg) scale(1.04);
  }

  to {
    transform: rotate(360deg) scale(1);
  }
`;

const pulse = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 12px rgba(78, 205, 196, 0.35));
  }

  50% {
    filter: drop-shadow(0 0 28px rgba(255, 230, 109, 0.5));
  }
`;

export const StatsContainer = styled(Container)`
    height: 95%;
    animation: ${fadeInUp} 0.7s ease forwards;
    padding-bottom: 2rem;

    > .row.align-items-center {
        background: linear-gradient(145deg, #352020 0%, #2A2D32 40%);
        border: 2px solid rgba(220, 10, 45, 0.3);
        border-radius: 28px;
        box-shadow: 0 24px 48px rgba(6, 10, 30, 0.34);
        padding: 2rem 1rem;
        margin-top: 1rem;
    }

    @media screen and (max-width: 576px) {
        height: auto;
        padding: 0 0.5rem 2rem;

        > .row.align-items-center {
            padding: 1.25rem 0.75rem;
            border-radius: 20px;
            margin-top: 0.5rem;
        }
    }
`

export const Title = styled.h1`
    font-size: calc(30px + 3vw);
    font-weight: 900;
    text-align: center;
    letter-spacing: 0.03em;
    background: linear-gradient(135deg, #fff 0%, #DC0A2D 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;

    @media screen and (max-width: 576px) {
        font-size: calc(24px + 2vw);
    }
`

export const SubTitle = styled.h2`
    font-size: 1rem;
    font-weight: 700;
    padding: 0.4rem 0.9rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid currentColor;
    color: inherit;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 0.25rem 0;
    width: 200px;
    max-width: 200px;
    white-space: nowrap;

    &::before {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: currentColor;
        box-shadow: 0 0 6px currentColor;
    }

    @media screen and (max-width: 576px) {
        font-size: 0.85rem;
        width: 160px;
        max-width: 160px;
        padding: 0.35rem 0.7rem;
    }
`

export const Id = styled.h1`
    font-size: calc(16px + 1vw);
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #a0a0b0;
`

export const LazyImage = styled(LazyLoadImage)`
    height: 100%;
    width: 100%;
    max-width: 400px;
    max-height: 400px;
    border-radius: 28px;
    padding: 1rem;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.04) 0%, transparent 70%);
    filter: drop-shadow(0 18px 32px rgba(0, 0, 0, 0.28));

    @media screen and (max-width: 576px) {
        max-width: 260px;
        max-height: 260px;
        padding: 0.5rem;
    }
`

export const LoadingCol = styled(Col)`
    max-height: 35%;
    max-width: 35%;
    min-width: 100px;
    min-height: 100px;
    animation: ${pulse} 1.8s ease-in-out infinite;
`

export const Image = styled.img`
    height: 100%;
    width: 100%;
    max-width: 400px;
    max-height: 400px;
    border-radius: 28px;
    padding: 1rem;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.04) 0%, transparent 70%);
    filter: drop-shadow(0 18px 32px rgba(0, 0, 0, 0.28));
`

export const LoadingImg = styled.img`
    transition: 0.3s ease-in-out;
    animation: ${rotate} 1.1s linear infinite, ${pulse} 1.8s ease-in-out infinite;
    height: 100%;
    width: 100%;
    max-width: 400px;
    max-height: 400px;
`

export const Loading = styled.aside`
    position: fixed;
    z-index: 999;
    width: 100%;
    height: 100%;
    background: rgba(42, 45, 50, 0.92);
    backdrop-filter: blur(8px);
    display: grid;
    align-items: center;
    top: 0;
    left: 0;
    transition: 0.3s ease-in-out;
`

export const ErrorContainer = styled.div`
    height: 100%;
`

export const ErrorCol = styled(Col)`
    height: 50vw;
    width: 50vw;
    max-width: 600px;
    max-height: 600px;
    min-width: 280px;
    min-height: 280px;
`

export const Bidoof404Img = styled.img`
    height: 100%;
    width: 100%;
`
