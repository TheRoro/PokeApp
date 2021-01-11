import styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';

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

export const Image = styled.img`
    height: 100%;
    width: 100%;
    max-width: 400px;
    max-height: 400px;
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