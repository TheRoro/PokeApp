import { Col } from 'react-bootstrap';
import styled, { keyframes } from 'styled-components';

export const Bidoof404Img = styled.img`
    height: auto;
    width: auto;
    max-width: 60px;
    max-height: 60px;
`

export const SearchContainer = styled.div`
    min-width: 268px;
`

export const Title = styled.h1`
    font-size:calc(25px + 2.5vw);
    font-weight: 800;
    text-align: center;
`

export const Text = styled.p`
    font-size:calc(10px + 1vw);
    color: #666666;
    text-align: center;
`

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

export const LoadingCol = styled(Col)`
    height: 12%;
    width: 12%;
    min-width: 100px;
    min-height: 100px;
`

export const LoadingImg = styled.img`
    height: 100%;
    width: 100%;
    object-fit: cover;
    animation: ${rotate} 1s linear infinite;
    max-width: 400px;
    max-height: 400px;
`