import styled, { keyframes } from 'styled-components';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import {Link} from 'react-router-dom';

const fadeInUp = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

export const TypeCalDiv = styled.div`
    min-height: auto;
    width: 100%;
    min-width: 0;
    padding: clamp(2.5rem, 7vh, 4.5rem) 0 2rem;
    animation: ${fadeInUp} 180ms ease-out forwards;

    @media (max-width: 640px) {
        padding-top: 2rem;
    }
`

export const ResultsContainer = styled(Container)`
    max-width: 1120px;
    padding: 0 1rem 3rem;
`

export const TypeContainer = styled(Container)`
    max-width: 760px;
    padding: 0 1rem;
`

export const LastRow = styled(Row)`
    min-height: 0;
    margin-top: 1.5rem;
`

export const ResultsHeader = styled.header`
    max-width: 720px;
    margin: 0 auto 1.75rem;
    text-align: center;
`

export const ResultsEyebrow = styled.p`
    margin: 0 0 0.35rem;
    color: #ff9aa7;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
`

export const ResultsTitle = styled.h1`
    margin: 0;
    color: #fffaf1;
    font-size: clamp(2.2rem, 6vw, 3.7rem);
    font-weight: 800;
    letter-spacing: -0.04em;
`

export const ResultsDescription = styled.p`
    margin: 0.5rem auto 0;
    color: #c7c4c1;
    font-size: 0.95rem;
`

export const SelectedTypes = styled.section`
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 220px));
    justify-content: center;
    gap: 1rem;
    max-width: 620px;
    margin: 0 auto 2rem;
    padding: 1rem;
    overflow: hidden;
    background: #303339;
    border: 1px solid #4a4e55;
    border-radius: 22px;
    box-shadow:
        0 5px 0 #1f2226,
        0 18px 36px rgba(0, 0, 0, 0.2);

    @media screen and (max-width: 520px) {
        grid-template-columns: 1fr;
    }
`

export const SelectedType = styled.div<{ $color: string }>`
    display: flex;
    align-items: center;
    gap: 0.85rem;
    min-height: 76px;
    padding: 0.75rem;
    background: #383c42;
    border: 1px solid #4a4e55;
    border-left: 5px solid ${({ $color }) => $color};
    border-radius: 14px;
    box-shadow: 0 3px 8px rgba(77, 63, 49, 0.08);
`

export const SelectedTypeIconFrame = styled.span<{ $color: string }>`
    display: grid;
    width: 54px;
    height: 54px;
    padding: 5px;
    flex: 0 0 54px;
    background: #2a2d32;
    border-radius: 50%;
    place-items: center;
    box-shadow: 0 3px 8px rgba(77, 63, 49, 0.14);
`

export const SelectedTypeIcon = styled.img`
    width: 44px;
    height: 44px;
`

export const SelectedTypeText = styled.span`
    display: flex;
    min-width: 0;
    flex-direction: column;
`

export const SelectedTypeRole = styled.span`
    color: #aaa299;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
`

export const SelectedTypeName = styled.strong`
    color: #fffaf1;
    font-size: 1.05rem;
`

export const Title = styled.h1`
    font-size: calc(30px + 2vw);
    font-weight: 800;
    text-align: center;
`

export const TypeLabel = styled.span`
    font-size: 1.1rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0.45rem 1rem;
    width: 160px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid currentColor;

    &::before {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: currentColor;
        box-shadow: 0 0 6px currentColor;
    }

    @media screen and (max-width: 576px) {
        font-size: 0.9rem;
        width: 130px;
        padding: 0.35rem 0.75rem;
    }
`

export const Button = styled(Link)`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    padding: 0.75rem 2rem;
    font-size: 1.05rem;
    font-weight: 700;
    border-radius: var(--button-radius);
    background: #d72d38;
    border: 2px solid #ef5963;
    text-decoration: none;
    transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
    letter-spacing: 0.02em;
    box-shadow:
        0 4px 0 #8e1821,
        0 10px 22px rgba(0, 0, 0, 0.18);

    &::after {
        display: none;
    }

    &:hover {
        color: #fff;
        text-decoration: none;
        background: #e43a46;
        transform: translateY(-2px);
        box-shadow:
            0 6px 0 #8e1821,
            0 14px 24px rgba(0, 0, 0, 0.2);
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 2px 0 #8e1821;
    }

    &:focus-visible {
        outline: 2px solid rgba(255, 255, 255, 0.2);
        outline-offset: 2px;
        box-shadow: none;
    }
`
