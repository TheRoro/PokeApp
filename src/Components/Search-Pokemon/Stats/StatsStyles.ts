import styled, {keyframes} from 'styled-components';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export const StatsContainer = styled(Container)`
    height: 95%;
`

export const Title = styled.h1`
    font-size:calc(30px + 3vw);
    font-weight: 900;
    text-align: center;
`

export const SubTitle = styled.h1`
    font-size:calc(25px + 1.5vw);
    font-weight: 900;
`

export const Id = styled.h1`
    font-size:calc(22px + 1.3vw);
    font-weight: 900;
`

export const LazyImage = styled(LazyLoadImage)`
    height: 100%;
    width: 100%;
    max-width: 400px;
    max-height: 400px;
`

export const LoadingCol = styled(Col)`
    max-height: 35%;
    max-width: 35%;
    min-width: 100px;
    min-height: 100px;
`

export const Image = styled.img`
    height: 100%;
    width: 100%;
    max-width: 400px;
    max-height: 400px;
`

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const LoadingImg = styled.img`
    transition: 0.3s ease-in-out;
    animation: ${rotate} 1s linear infinite;
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
    background-color: #121212;
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