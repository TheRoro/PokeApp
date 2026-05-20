import styled from 'styled-components';
import Container from 'react-bootstrap/Container';

export const MoveInfoContainer = styled(Container)`
    padding: 1.5rem 1rem;
    max-width: 500px;
`

export const Title = styled.h1`
    font-size: calc(28px + 2.5vw);
    font-weight: 900;
    text-align: center;
    letter-spacing: 0.03em;
    color: #fff;
    margin-bottom: 1rem;
`

export const StatsCard = styled.div`
    background: linear-gradient(145deg, #352020 0%, #2A2D32 40%);
    border: 2px solid rgba(220, 10, 45, 0.3);
    border-radius: 16px;
    padding: 1.25rem 1.25rem 1rem;
    max-width: 420px;
    margin: 0 auto;
    position: relative;
`

export const Text = styled.p`
    font-size: 1rem;
    font-weight: 500;
    color: var(--text-primary, #f5f5f5);
    margin: 0;
    line-height: 1.4;
`
