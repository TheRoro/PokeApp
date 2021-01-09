import styled from 'styled-components';

type BarProps = {
    width: string;
    color: string;
}

export const Bar = styled.div<BarProps>`
    height: 30px;
    border-radius: 5px;
    width: ${({width}) => width};
    
    ${props => props.color === 'BarRed'
    &&`
        background: #B42400;
    `};

    ${props => props.color === 'BarDarkOrange'
    &&`
        background: #FF4D00;
    `};

    ${props => props.color === 'BarOrange'
    &&`
        background: #FFBB00;
    `};

    ${props => props.color === 'BarYellow'
    &&`
        background: #DDFF00;
    `};

    ${props => props.color === 'BarGreen'
    &&`
        background: #00D12F;
    `};

    ${props => props.color === 'BarBlue'
    &&`
        background: #18FFFF;
    `
}
`
