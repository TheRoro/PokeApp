import styled from 'styled-components';
import {
    Row as BRow,
    Col as BCol
} from 'react-bootstrap';

export const OlderContainer = styled.div`
    height: 90%;
`

export const FooterContainer = styled.div`
    height: 15%;
    width: 100%;
`

export const Title = styled.h1`
    font-size:calc(26px + 2.8vw);
    font-weight: 900;
    color: #e6e6e6;
    text-align: center;
`

export const Text = styled.p`
    font-size:calc(10px + 1vw);
    color: #666666;
    text-align: center;
`

export const Link = styled.a`
    font-size:calc(10px + 0.6vw);
    font-weight: 200;
    color: #b8b8b8;
    text-decoration: none;
    &:hover{
        text-decoration: none;
        opacity: 0.8;
    }
`

export const Row = styled(BRow)`
    height:100%;
`

export const Col = styled(BCol)`

`

export const Image = styled.img`
    height: 25vw;
    width: 40vw;
    min-width: 210px;
    min-height: 150px;
    max-width: 400px;
    max-height: 250px;
    border-radius: 10px;
`