import { Col } from 'react-bootstrap';
import styled, { keyframes } from 'styled-components';

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
  0% {
    transform: rotate(0deg) scale(1);
  }

  50% {
    transform: rotate(180deg) scale(1.04);
  }

  100% {
    transform: rotate(360deg) scale(1);
  }
`;

const pulse = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 10px rgba(220, 10, 45, 0.3));
  }

  50% {
    filter: drop-shadow(0 0 20px rgba(220, 10, 45, 0.5));
  }
`;

export const Bidoof404Img = styled.img`
    height: auto;
    width: auto;
    max-width: 160px;
    max-height: 160px;
`

export const SearchContainer = styled.div`
    min-width: 268px;
    animation: ${fadeInUp} 0.7s ease forwards;
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

export const Text = styled.p`
    font-size: calc(11px + 0.9vw);
    color: #a0a0b0;
    text-align: center;
    letter-spacing: 0.03em;
    line-height: 1.7;
`

export const LoadingCol = styled(Col)`
    height: 12%;
    width: 12%;
    min-width: 100px;
    min-height: 100px;
    animation: ${pulse} 1.8s ease-in-out infinite;
`

export const LoadingImg = styled.img`
    height: 100%;
    width: 100%;
    object-fit: cover;
    animation: ${rotate} 1.1s linear infinite, ${pulse} 1.8s ease-in-out infinite;
    max-width: 400px;
    max-height: 400px;
`