import styled, { keyframes } from 'styled-components';
import { Col } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';

export const MovesContainer = styled(Container)`
    height: 95%;
`

export const Title = styled.h1`
    font-size:calc(30px + 3vw);
    font-weight: 900;
    text-align: center;
`
export const Subtitle = styled.p`
    font-size:calc(10px + 1vw);
    color: #666666;
    font-weight: 600;
`

export const Subtitle2 = styled.p`
    font-size:calc(10px + 1vw);
    color: #666666;
    font-weight: 600;
    text-align: center;
`

export const Text = styled.p`
    font-size:calc(10px + 1vw);
    color: #666666;
    text-align: center;
`

export const Text2 = styled.p`
    font-size:calc(10px + 0.6vw);
    font-weight: 500;
`

export const Text3 = styled.p`
    font-size:calc(10px + 0.6vw);
    font-weight: 500;
    text-align: center;
`

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
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
    transition: 0.3s ease-in-out;
    animation: ${rotate} 1s linear infinite;
    height: 100%;
    width: 100%;
    max-width: 400px;
    max-height: 400px;
`