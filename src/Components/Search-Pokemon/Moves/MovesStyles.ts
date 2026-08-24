import styled, { keyframes } from 'styled-components';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';

const fadeInUp = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const MovesContainer = styled(Container)`
    min-height: 80vh;
    padding: 1rem 1rem 2rem;
    animation: ${fadeInUp} 180ms ease-out forwards;
`

export const Subtitle = styled.p`
    font-size: 0.85rem;
    color: var(--text-secondary, #b0b0c0);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 0.5rem;
`

export const MoveListCard = styled.section`
    position: relative;
    padding: 1.25rem;
    overflow: hidden;
    background: #303339;
    border: 1px solid #4a4e55;
    border-radius: 22px;
    box-shadow:
        0 4px 0 #1f2226,
        0 16px 30px rgba(0, 0, 0, 0.17);

    &::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 64px;
        height: 5px;
        content: '';
        background: #d72d38;
        border-radius: 0 0 8px 0;
    }

    @media (max-width: 576px) {
        padding: 1rem 0.75rem;
        border-radius: 18px;
    }
`

export const Subtitle2 = styled.p`
    font-size: 0.85rem;
    color: var(--text-secondary, #b0b0c0);
    font-weight: 700;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 0.5rem;
`

export const Text = styled.p`
    font-size: 0.9rem;
    color: var(--text-secondary, #b0b0c0);
    text-align: center;
`

export const Text2 = styled.p`
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-primary, #f5f5f5);
    margin-bottom: 0;
`

export const Text3 = styled.p`
    font-size: 0.9rem;
    font-weight: 600;
    text-align: center;
    color: var(--text-primary, #f5f5f5);
    margin-bottom: 0;
`

export const MoveRow = styled(Link)`
    display: grid;
    grid-template-columns: 50px 1fr 1fr 60px;
    gap: 0.5rem;
    align-items: center;
    padding: 0.6rem 0.8rem;
    border: 1px solid #4a4e55;
    border-left: 4px solid currentColor;
    border-radius: 14px;
    background: #383c42;
    margin-bottom: 0.5rem;
    text-decoration: none;
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;

    &:hover {
        text-decoration: none;
        background: #41454b;
        border-color: #5b6068;
        border-left-color: currentColor;
        transform: translateY(-1px);
    }

    &:focus-visible {
        outline: 3px solid rgba(215, 45, 56, 0.2);
        outline-offset: 2px;
    }

    @media (max-width: 576px) {
        grid-template-areas:
            'level name power'
            '. type type';
        grid-template-columns: 38px minmax(0, 1fr) 42px;
        row-gap: 0.3rem;
        padding: 0.55rem 0.45rem;

        > span:nth-child(1) {
            grid-area: level;
        }

        > span:nth-child(2) {
            grid-area: name;
        }

        > span:nth-child(3) {
            grid-area: type;
        }

        > span:nth-child(4) {
            grid-area: power;
        }
    }
`

export const MoveHeader = styled.div`
    display: grid;
    grid-template-columns: 50px 1fr 1fr 60px;
    gap: 0.5rem;
    padding: 0.5rem 0.8rem 0.25rem;
    margin-bottom: 0.25rem;

    span {
        color: #aaa299;
        font-size: 0.7rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }

    @media (max-width: 576px) {
        grid-template-columns: 38px minmax(0, 1fr) 42px;
        padding: 0.5rem 0.45rem 0.25rem;

        span:nth-child(3) {
            display: none;
        }
    }
`

export const VersionControls = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    width: min(100%, 720px);
    margin: 0 auto 1.5rem;
    padding: 1rem;
    background: #303339;
    border: 1px solid #4a4e55;
    border-radius: 18px;
    box-shadow: 0 4px 0 #1f2226;
`

export const VersionLabel = styled.label`
    color: #d1cac1;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
`

export const VersionSelect = styled.select`
    min-width: 220px;
    color: #fff;
    background: #2a2d32;
    border: 2px solid #4a4e55;
    border-radius: 14px;
    padding: 0.55rem 0.75rem;

    &:focus-visible {
        outline: 3px solid rgba(215, 45, 56, 0.16);
        outline-offset: 1px;
        border-color: #d72d38;
    }
`

export const MoveType = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    min-width: 0;
    color: currentColor;
    font-size: 0.82rem;
    font-weight: 700;
`

export const MoveTypeIcon = styled.img`
    width: 25px;
    height: 25px;
    flex: 0 0 25px;
`

export const LoadMoreButton = styled.button`
    display: block;
    margin: 1rem auto 0;
    color: #fff;
    font-weight: 700;
    background: #d72d38;
    border: 2px solid #ef5963;
    border-radius: var(--button-radius);
    padding: 0.55rem 1rem;
    box-shadow: 0 4px 0 #8e1821;
    transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;

    &:hover:not(:disabled) {
        background: #e43a46;
        transform: translateY(-2px);
        box-shadow: 0 6px 0 #8e1821;
    }

    &:disabled {
        cursor: wait;
        opacity: 0.6;
    }

    &:focus-visible {
        outline: 3px solid rgba(255, 255, 255, 0.2);
        outline-offset: 3px;
    }
`

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const MoveLoading = styled.div`
    display: grid;
    min-height: 220px;
    gap: 0.75rem;
    color: var(--text-secondary);
    font-size: 0.85rem;
    text-align: center;
    place-content: center;
`

export const LoadingCol = styled.div`
    width: clamp(88px, 8vw, 112px);
    aspect-ratio: 1;
    margin: 0 auto;
`

export const LoadingImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
    animation: ${rotate} 1.1s linear infinite;
`
