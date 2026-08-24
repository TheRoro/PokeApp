import styled from 'styled-components';

type BarProps = {
    width: string;
    color: string;
}

export const StatRow = styled.div`
    display: grid;
    grid-template-columns: 128px minmax(150px, 1fr);
    align-items: center;
    gap: 0.85rem;
    width: min(100%, 440px);

    @media (max-width: 576px) {
        grid-template-columns: 105px minmax(120px, 1fr);
        gap: 0.65rem;
    }
`

export const StatLabel = styled.span`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem;
`

export const StatName = styled.span`
    color: #d1cac1;
    font-size: 0.82rem;
    font-weight: 700;
`

export const StatValue = styled.strong`
    color: #fffaf1;
    font-size: 0.9rem;
    font-weight: 800;
`

export const StatTrack = styled.span`
    display: block;
    height: 11px;
    overflow: hidden;
    background: #24272c;
    border: 1px solid #4a4e55;
    border-radius: 999px;
`

export const Bar = styled.div<BarProps>`
    height: 100%;
    border-radius: inherit;
    width: ${({width}) => width};
    
    ${props => props.color === 'BarRed'
    &&`
        background: #df5360;
    `};

    ${props => props.color === 'BarDarkOrange'
    &&`
        background: #e8794d;
    `};

    ${props => props.color === 'BarOrange'
    &&`
        background: #d8a947;
    `};

    ${props => props.color === 'BarYellow'
    &&`
        background: #b9c94b;
    `};

    ${props => props.color === 'BarGreen'
    &&`
        background: #5fbd67;
    `};

    ${props => props.color === 'BarBlue'
    &&`
        background: #63b9d0;
    `
}
`
