import styled, { keyframes } from 'styled-components';
import Container from 'react-bootstrap/Container';
import { Col } from 'react-bootstrap';

export const SearchContainer = styled(Container)`
    height: 75%;
    min-width: 343px;
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
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const LoadingCol = styled(Col)`
    max-height: 35%;
    max-width: 35%;
    min-width: 100px;
    min-height: 100px;
`

export const Image = styled.img`
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

export const Bidoof404Img = styled.img`
    height: auto;
    width: auto;
    max-width: 60px;
    max-height: 60px;
`

export const Icon = styled.button`
    background-color: #bababa;
    width: 80px;
    height: 80px;
    border-radius: 50px;
    padding: 0px;
    border: none;
    &:hover {
        background-color: #dedede;
    }
`

const sprite = keyframes`
  0% {
    transform: translate(0px, 0px);;
  }

  50% {
    transform: translate(0px, 2px);;
  }
  100% {
    transform: translate(0px, 0px);;
  }
`;

export const ImgIcon = styled.img`
    width: 80px;
    height: 80px;
    border-radius: 50px;
    &:hover {
        /* opacity: 0.8; */
        animation-name: ${sprite};
        animation-duration: 0.4s;
        animation-iteration-count: infinite;
    }
`