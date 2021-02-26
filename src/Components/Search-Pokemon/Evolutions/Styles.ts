import styled, { keyframes } from 'styled-components';
import Container from 'react-bootstrap/Container';
import { Col } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export const EvolutionsContainer = styled(Container)`
    height: 95%;
`

export const Title = styled.h1`
    font-size:calc(30px + 3vw);
    font-weight: 900;
    text-align: center;
`

export const SubTitle = styled.h1`
    font-size:calc(15px + 1.5vw);
    font-weight: 100;
    text-align: center;
`

export const LazyImage = styled(LazyLoadImage)`
    height: 100%;
    width: 100%;
    max-width: 400px;
    max-height: 400px;
`

export const Image = styled.img`
    height: 100%;
    width: 100%;
    max-width: 200px;
    max-height: 200px;
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
