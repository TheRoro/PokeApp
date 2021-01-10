import styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import {Link} from 'react-router-dom';

export const TypeCalDiv = styled.div`
    height: 90%;
    min-width: 282px;
`

export const ResultsContainer = styled(Container)`
    height: 90%;
`

export const TypeContainer = styled(Container)`
    height: 80%;
`

export const LastRow = styled(Row)`
    min-height: 120px;
`

export const Title = styled.h1`
    font-size:calc(30px + 2vw);
    font-weight: 700;
    text-align: center;
`

export const Button = styled(Link)`
    color: #fff;
    height: 80%;
    border: #fff 1px solid;
    padding: 8px 13px;
    font-size: 20px;
    border-radius: 15px;
    &:hover{
        color: #000;
        background-color: #fff;
        text-decoration: none;
        opacity: 0.8;
        transition: 0.15s ease-in-out;
    }
`