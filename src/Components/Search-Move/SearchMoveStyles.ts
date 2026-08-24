import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
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

export const Bidoof404Img = styled.img`
    height: auto;
    width: auto;
    max-width: 160px;
    max-height: 160px;
`

export const SearchContainer = styled.div`
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

export const MoveLoading = styled.div`
    display: grid;
    min-height: calc(100vh - 82px);
    padding: 2rem;
    place-items: center;
`

export const LoadingCol = styled.div`
    width: clamp(88px, 8vw, 112px);
    aspect-ratio: 1;
`

export const LoadingImg = styled.img`
    height: 100%;
    width: 100%;
    object-fit: cover;
    animation: ${rotate} 1.1s linear infinite;
    max-width: 400px;
    max-height: 400px;
`
