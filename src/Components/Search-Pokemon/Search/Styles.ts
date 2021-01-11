import styled from 'styled-components';
import Container from 'react-bootstrap/Container';

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

export const Image = styled.img`
    height: 100%;
    width: 100%;
    max-width: 400px;
    max-height: 400px;
`

export const Bidoof404Img = styled.img`
    height: auto;
    width: auto;
    max-width: 60px;
    max-height: 60px;
`

export const Icon = styled.button`
    width: 80px;
    height: 80px;
    border-radius: 50px;
    &:hover {
        opacity: 0.8;
    }
`

export const ImgIcon = styled.img`
    width: 70px;
    height: 70px;
`