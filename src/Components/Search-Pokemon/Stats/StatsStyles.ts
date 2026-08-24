import styled, { keyframes } from 'styled-components';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const fadeInUp = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg) scale(1);
  }

  50% {
    transform: rotate(180deg) scale(1.04);
  }

  to {
    transform: rotate(360deg) scale(1);
  }
`;

export const StatsContainer = styled(Container)`
    min-height: 95%;
    animation: ${fadeInUp} 180ms ease-out forwards;
    padding: 1rem 1rem 3rem;

    > .row.align-items-center {
        position: relative;
        overflow: hidden;
        background: #303339;
        border: 1px solid #4a4e55;
        border-radius: 22px;
        box-shadow:
            0 4px 0 #1f2226,
            0 18px 36px rgba(0, 0, 0, 0.2);
        padding: 1.5rem 1rem;
        margin-top: 0;
    }

    > .row.align-items-center::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 72px;
        height: 5px;
        content: '';
        background: #d72d38;
        border-radius: 0 0 8px 0;
    }

    @media screen and (max-width: 576px) {
        height: auto;
        padding: 0 0.5rem 2rem;

        > .row.align-items-center {
            padding: 1.25rem 0.75rem;
            border-radius: 18px;
            margin-top: 0.5rem;
        }
    }
`

export const Title = styled.h1`
    font-size: calc(30px + 3vw);
    font-weight: 900;
    text-align: center;
    letter-spacing: 0.03em;
    color: #fffaf1;

    @media screen and (max-width: 576px) {
        font-size: calc(24px + 2vw);
    }
`

export const SubTitle = styled.h2`
    font-size: 1rem;
    font-weight: 700;
    padding: 0.4rem 0.9rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid currentColor;
    color: inherit;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 0.25rem 0;
    width: 200px;
    max-width: 200px;
    white-space: nowrap;

    &::before {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: currentColor;
        box-shadow: 0 0 6px currentColor;
    }

    @media screen and (max-width: 576px) {
        font-size: 0.85rem;
        width: 160px;
        max-width: 160px;
        padding: 0.35rem 0.7rem;
    }
`

export const Id = styled.h1`
    font-size: calc(16px + 1vw);
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #a0a0b0;
`

export const PokemonTypes = styled.div`
    display: grid;
    gap: 0.65rem;
    width: min(100%, 310px);
    margin: 0 auto 1.5rem;
`

export const PokemonTypeCard = styled.div<{ $color: string }>`
    display: grid;
    grid-template-columns: 40px minmax(0, 1fr);
    align-items: center;
    gap: 0.7rem;
    min-height: 54px;
    padding: 0.55rem 0.75rem;
    background: #383c42;
    border: 1px solid #4a4e55;
    border-left: 4px solid ${({ $color }) => $color};
    border-radius: 14px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.13);
`

export const PokemonTypeIcon = styled.img`
    width: 40px;
    height: 40px;
`

export const PokemonTypeText = styled.span`
    display: flex;
    flex-direction: column;
`

export const PokemonTypeRole = styled.span`
    color: #aaa299;
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
`

export const PokemonTypeName = styled.strong`
    margin-top: 0.15rem;
    color: #fffaf1;
    font-size: 0.95rem;
`

export const CryControls = styled.div`
    display: grid;
    justify-items: center;
    gap: 0.5rem;
    margin: -0.55rem auto 1.35rem;
`

export const CryButton = styled.button`
    display: inline-flex;
    min-height: 40px;
    padding: 0.45rem 0.9rem;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    color: #fff;
    font-size: 0.82rem;
    font-weight: 800;
    background: #d72d38;
    border: 2px solid #ef5963;
    border-radius: var(--button-radius);
    box-shadow: 0 3px 0 #8e1821;
    cursor: pointer;
    transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;

    svg {
        width: 0.7rem;
        height: 0.7rem;
    }

    &:hover {
        background: #e43a46;
        transform: translateY(-1px);
        box-shadow: 0 4px 0 #8e1821;
    }

    &:active {
        transform: translateY(2px);
        box-shadow: 0 1px 0 #8e1821;
    }

    &:focus-visible {
        outline: 3px solid rgba(255, 255, 255, 0.2);
        outline-offset: 3px;
    }
`

export const CryMessage = styled.p`
    margin: 0;
    color: #ff9aa7;
    font-size: 0.75rem;
    text-align: center;
`

export const HiddenAudio = styled.audio`
    display: none;
`

export const StatTotal = styled.div`
    min-width: 150px;
    padding: 0.75rem 1.25rem;
    color: #fffaf1;
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: #383c42;
    border: 1px solid #4a4e55;
    border-left: 4px solid #d72d38;
    border-radius: 14px;
`

export const LazyImage = styled(LazyLoadImage)`
    height: 100%;
    width: 100%;
    max-width: 400px;
    max-height: 400px;
    border-radius: 28px;
    padding: 1rem;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.04) 0%, transparent 70%);
    filter: drop-shadow(0 18px 32px rgba(0, 0, 0, 0.28));

    @media screen and (max-width: 576px) {
        max-width: 260px;
        max-height: 260px;
        padding: 0.5rem;
    }
`

export const LoadingCol = styled(Col)`
    width: clamp(88px, 8vw, 112px);
    height: auto;
    max-width: none;
    flex: 0 0 auto;
    aspect-ratio: 1;
`

export const Image = styled.img`
    height: 100%;
    width: 100%;
    max-width: 400px;
    max-height: 400px;
    border-radius: 28px;
    padding: 1rem;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.04) 0%, transparent 70%);
    filter: drop-shadow(0 18px 32px rgba(0, 0, 0, 0.28));
`

export const LoadingImg = styled.img`
    height: 100%;
    width: 100%;
    object-fit: contain;
    animation: ${rotate} 1.1s linear infinite;
`

export const Loading = styled.aside`
    position: fixed;
    z-index: 999;
    width: 100%;
    height: 100%;
    background: rgba(42, 45, 50, 0.92);
    backdrop-filter: blur(8px);
    display: grid;
    align-items: center;
    top: 0;
    left: 0;
    transition: 0.3s ease-in-out;
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
