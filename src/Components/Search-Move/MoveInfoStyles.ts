import styled from 'styled-components';
import Container from 'react-bootstrap/Container';

export const MoveInfoContainer = styled(Container)`
    padding: 1rem 1rem 3rem;
    max-width: 960px;
`

export const StatsCard = styled.div`
    position: relative;
    max-width: 720px;
    margin: 0 auto;
    padding: 1.25rem;
    overflow: hidden;
    background: #303339;
    border: 1px solid #4a4e55;
    border-radius: 22px;
    box-shadow:
        0 4px 0 #1f2226,
        0 16px 30px rgba(0, 0, 0, 0.18);

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
`

export const MoveTypeCard = styled.div<{ $color: string }>`
    display: grid;
    grid-template-columns: 48px minmax(0, 1fr);
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.85rem;
    padding: 0.65rem 0.8rem;
    background: #383c42;
    border: 1px solid #4a4e55;
    border-left: 4px solid ${({ $color }) => $color};
    border-radius: 14px;
`

export const MoveTypeIcon = styled.img`
    width: 48px;
    height: 48px;
`

export const MoveTypeRole = styled.span`
    display: block;
    color: #aaa299;
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
`

export const MoveTypeName = styled.strong`
    display: block;
    margin-top: 0.15rem;
    color: #fffaf1;
    font-size: 1.05rem;
`

export const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.65rem;

    @media (max-width: 620px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
`

export const InfoCard = styled.div`
    padding: 0.8rem;
    background: #383c42;
    border: 1px solid #4a4e55;
    border-radius: 14px;
`

export const InfoLabel = styled.span`
    display: block;
    margin-bottom: 0.25rem;
    color: #aaa299;
    font-size: 0.66rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
`

export const InfoValue = styled.strong`
    color: #fffaf1;
    font-size: 1.15rem;
`

export const EffectCard = styled.div`
    margin-top: 0.75rem;
    padding: 0.85rem 1rem;
    background: #2a2d32;
    border: 1px solid #4a4e55;
    border-radius: 14px;
`

export const Text = styled.p`
    font-size: 0.9rem;
    font-weight: 500;
    color: #d1cac1;
    margin: 0;
    line-height: 1.55;
`
