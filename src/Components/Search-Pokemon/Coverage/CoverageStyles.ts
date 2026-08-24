import styled from 'styled-components';

export const CoverageSection = styled.section<{ $first?: boolean }>`
    margin-top: ${({ $first }) => ($first ? '3rem' : '2.5rem')};
`

export const CoverageHeader = styled.header`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0 0 1rem;
`

export const Title = styled.h2`
    display: flex;
    align-items: center;
    gap: 0.7rem;
    margin: 0;
    color: #e7e3dd;
    font-size: 0.92rem;
    font-weight: 800;
    text-align: left;
    letter-spacing: 0.1em;
    text-transform: uppercase;

    &::before {
        width: 28px;
        height: 4px;
        content: '';
        background: #d72d38;
        border-radius: 999px;
        box-shadow: 0 2px 0 #831921;
    }
`

export const CoverageStack = styled.div`
    display: grid;
    gap: 1rem;
`
