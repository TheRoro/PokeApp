import styled from 'styled-components';
import {
    Row as BRow,
    Col as BCol,
    Container as BContainer
} from 'react-bootstrap';

export const HomeContainer = styled.div`
    height: 75%;
    width: 100%;
`

export const FooterContainer = styled.div`
    height: 15%;
    width: 100%;
`

export const Title = styled.h1`
    font-size:calc(28px + 4vw);
    font-weight: 900;
    color: #e6e6e6;
    text-align: center;
`

export const Text = styled.p`
    font-size:calc(12px + 1.3vw);
    font-weight: 200;
    color: #88868B;
    text-align: center;
`

export const FooterLink = styled.button`
    border: none;
    background: none;
    cursor: pointer;
    margin: 0;
    padding: 0;
    font-size:calc(10px + 0.6vw);
    font-weight: 200;
    color: #b8b8b8;
    &:hover{
        text-decoration: none;
        color: #F4D849;
    }
`

export const Row = styled(BRow)`
    height:100%;
`

export const Col = styled(BCol)`

`

export const Container = styled(BContainer)`
    height:100%;
`