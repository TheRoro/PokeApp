import styled from 'styled-components';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export const TypeRow = styled(Row)`
    margin: 0px 2% 0px 2%;
`

export const Title = styled.h1`
    font-size:calc(20px + 1vw);
    font-weight: 100;
    text-align: center;
    padding-bottom: 1.5rem;
`

export const SubTitle = styled.p`
    font-size:calc(20px + 1.5vw);
    font-weight: 500;
    margin-bottom: .1rem;
`

export const Text = styled.p`
    font-size:calc(20px + 0.5vw);
    font-weight: 700;
`
export const TypeCol = styled(Col)`
    padding: 0;
`

type UnderlineProps = {
    type: string;
}

export const UnderlinedRow = styled(Row)<UnderlineProps>`
    
    ${props => props.type === 'Bug'
    &&`
        border-bottom: 1px solid #C0E11D;
    `};
    ${props => props.type === 'Dark'
    &&`
        border-bottom: 1px solid #51453C;
    `};
    ${props => props.type === 'Dragon'
    &&`
        border-bottom: 1px solid #6200EA;
    `};
    ${props => props.type === 'Electric'
    &&`
        border-bottom: 1px solid #FFFF00;
    `};
    ${props => props.type === 'Fairy'
    &&`
        border-bottom: 1px solid #FF6FDE;
    `};
    ${props => props.type === 'Fighting'
    &&`
        border-bottom: 1px solid #B42400;
    `};
    ${props => props.type === 'Fire'
    &&`
        border-bottom: 1px solid #FF9200;
    `};
    ${props => props.type === 'Flying'
    &&`
        border-bottom: 1px solid #9FA8DA;
    `};
    ${props => props.type === 'Ghost'
    &&`
        border-bottom: 1px solid #9575CD;
    `};
    ${props => props.type === 'Grass'
    &&`
        border-bottom: 1px solid #00D12F;
    `};
    ${props => props.type === 'Ground'
    &&`
        border-bottom: 1px solid #C4A96A;
    `};
    ${props => props.type === 'Ice'
    &&`
        border-bottom: 1px solid #18FFFF;
    `};
    ${props => props.type === 'Normal'
    &&`
        border-bottom: 1px solid #EFEBE9;
    `};
    ${props => props.type === 'Poison'
    &&`
        border-bottom: 1px solid #AA00FF;
    `};
    ${props => props.type === 'Psychic'
    &&`
        border-bottom: 1px solid #FF00C5;
    `};
    ${props => props.type === 'Rock'
    &&`
        border-bottom: 1px solid #A8814C;
    `};
    ${props => props.type === 'Steel'
    &&`
        border-bottom: 1px solid #9E9E9E;
    `};
    ${props => props.type === 'Water'
    &&`
        border-bottom: 1px solid #304FFE;
    `};
`