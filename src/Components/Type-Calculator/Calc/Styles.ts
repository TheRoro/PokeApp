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

export const OffensiveTypeHeader = styled.div<{ $color: string }>`
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    min-width: 190px;
    margin-bottom: 0.75rem;
    padding: 0.55rem 0.8rem 0.55rem 0.55rem;
    background: #383c42;
    border: 1px solid #4a4e55;
    border-left: 4px solid ${({ $color }) => $color};
    border-radius: 14px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.13);
`

export const OffensiveTypeIcon = styled.img`
    width: 36px;
    height: 36px;
    flex: 0 0 36px;
`

export const OffensiveTypeText = styled.span`
    display: flex;
    flex-direction: column;
    line-height: 1.15;
`

export const OffensiveTypeLabel = styled.span`
    color: #aaa299;
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
`

export const OffensiveTypeName = styled.strong`
    margin-top: 0.2rem;
    color: #fffaf1;
    font-size: 1rem;
    font-weight: 800;
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
    background: #303339;
    border: 1px solid #4a4e55;
    border-radius: 20px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 0;
    box-shadow:
        0 4px 0 #1f2226,
        0 14px 28px rgba(0, 0, 0, 0.16);
`

export const CategoryLabel = styled.h3`
    font-size: 0.75rem;
    font-weight: 800;
    color: #aaa299;
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
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.65rem 0.3rem 0.35rem;
    margin: 0.2rem 0.2rem 0.5rem;
    color: #fffaf1 !important;
    border-radius: 14px;
    background: #383c42;
    border: 1px solid #4a4e55;
    box-shadow: 0 2px 4px rgba(77, 63, 49, 0.08);

    &.Normal {
        color: #fffaf1 !important;
    }
`

export const TypeIcon = styled.img`
    width: 22px;
    height: 22px;
`
