import styled from 'styled-components';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export const TypeRow = styled(Row)`
    margin: 0;
    padding: 0.25rem 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0;
`

export const Title = styled.h2`
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--text-secondary, #b0b0c0);
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 0.4rem 0;
    margin-bottom: 0;
`

export const SubTitle = styled.p`
    font-size: 1.25rem;
    font-weight: 900;
    margin-bottom: 0;
    padding: 0.6rem 1.2rem;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.08);
    border-left: 5px solid currentColor;
    display: inline-flex;
    align-items: center;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
`

export const Text = styled.span`
    font-size: 1.1rem;
    font-weight: 700;
    display: inline-block;
    padding: 0.5rem 1rem;
    margin: 0.15rem 0.1rem;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
`

export const TypeCol = styled(Col)`
    padding: 0;
`

type UnderlineProps = {
    type: string;
}

export const UnderlinedRow = styled(Row)<UnderlineProps>`
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
    border-bottom: 2px solid rgba(255, 255, 255, 0.08);
`

export const CoverageCard = styled.div`
    background: linear-gradient(145deg, #352020 0%, #2A2D32 40%);
    border: 2px solid rgba(220, 10, 45, 0.2);
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 1rem;
`

export const CategoryLabel = styled.h3`
    font-size: 0.75rem;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin: 2rem 0 0.4rem;
    padding: 0;

    &:first-of-type {
        margin-top: 0.25rem;
    }
`

export const TypeBadge = styled.span`
    font-size: 0.85rem;
    font-weight: 700;
    display: inline-block;
    padding: 0.3rem 0.7rem;
    margin: 0.2rem 0.2rem 0.5rem;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
`
