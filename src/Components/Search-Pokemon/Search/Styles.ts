import styled, { keyframes } from 'styled-components';
import Container from 'react-bootstrap/Container';
import { Col } from 'react-bootstrap';

const fadeInUp = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
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

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-6px) scale(1.04);
  }
`;

export const SearchContainer = styled(Container)`
    width: 100%;
    min-width: 0;
    animation: ${fadeInUp} 180ms ease-out forwards;
`

export const Title = styled.h1`
    font-size: calc(20px + 1.8vw);
    font-weight: 800;
    text-align: center;
    letter-spacing: -0.035em;
    color: #fffaf1;
`

export const Text = styled.p`
    font-size: calc(11px + 0.9vw);
    color: #a0a0b0;
    text-align: center;
    letter-spacing: 0.03em;
    line-height: 1.7;
`

export const LoadingCol = styled(Col)`
    max-height: 35%;
    max-width: 35%;
    min-width: 100px;
    min-height: 100px;
`

export const Image = styled.img`
    transition: 0.3s ease-in-out;
    animation: ${rotate} 1.1s linear infinite;
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
    display: grid;
    align-items: center;
    top: 0;
    left: 0;
    transition: 0.3s ease-in-out;
`

export const Bidoof404Img = styled.img`
    height: auto;
    width: auto;
    max-width: 160px;
    max-height: 160px;
    animation: ${fadeInUp} 180ms ease-out forwards;
`

export const Icon = styled.button`
    background: rgba(255, 255, 255, 0.08);
    width: 100px;
    height: 100px;
    border-radius: 999px;
    padding: 0;
    border: 3px solid rgba(220, 10, 45, 0.4);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;

    &:hover {
        border-color: var(--pokedex-red);
        box-shadow: 0 12px 28px rgba(220, 10, 45, 0.3);
        transform: translateY(-6px) scale(1.04);
    }

    &:focus-visible {
        outline: 3px solid rgba(255, 222, 0, 0.75);
        outline-offset: 4px;
    }
`

export const ImgIcon = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 999px;
    padding: 0.4rem;
    transition: transform 0.25s ease;

    ${Icon}:hover & {
        animation: ${bounce} 0.6s ease-in-out infinite;
    }
`
