import styled from 'styled-components';

export const SelectorCard = styled.section<{
    $primaryColor: string;
    $secondaryColor: string;
}>`
    position: relative;
    width: min(100%, 620px);
    margin: 0 auto;
    padding: 1.1rem;
    overflow: hidden;
    background: #303339;
    border: 1px solid #4a4e55;
    border-radius: 22px;
    box-shadow:
        0 5px 0 #1f2226,
        0 18px 36px rgba(0, 0, 0, 0.22);

    &::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 78px;
        height: 8px;
        content: '';
        background: #d72d38;
        border-radius: 0 0 10px 0;
    }

    &::after {
        position: absolute;
        top: 0;
        right: 0;
        width: 52px;
        height: 8px;
        content: '';
        background: linear-gradient(
            90deg,
            ${({ $primaryColor }) => $primaryColor},
            ${({ $secondaryColor }) => $secondaryColor}
        );
        border-radius: 0 0 0 10px;
    }

    @media screen and (max-width: 576px) {
        padding: 1rem;
    }
`

export const SelectorRow = styled.div<{ $color: string }>`
    display: grid;
    grid-template-columns: minmax(130px, 1fr) 190px;
    gap: 1rem;
    align-items: center;
    min-height: 64px;
    padding: 0.75rem 0.9rem;
    background: #383c42;
    border: 1px solid #4a4e55;
    border-left: 5px solid ${({ $color }) => $color};
    border-radius: 14px;
    box-shadow: 0 3px 8px rgba(77, 63, 49, 0.08);

    & + & {
        margin-top: 0.75rem;
    }

    @media screen and (max-width: 576px) {
        grid-template-columns: 1fr;
        gap: 0.5rem;
        padding: 0.75rem;
    }
`

export const SelectorLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0;
    color: #d1cac1;
    font-size: 0.76rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
`

export const SelectorIconFrame = styled.span<{ $color: string }>`
    display: grid;
    width: 44px;
    height: 44px;
    padding: 4px;
    flex: 0 0 44px;
    background: #2a2d32;
    border-radius: 50%;
    place-items: center;
    box-shadow: 0 3px 8px rgba(77, 63, 49, 0.14);
`

export const SelectorIcon = styled.img`
    width: 36px;
    height: 36px;
`

export const SelectorEmptyIcon = styled.span`
    display: grid;
    width: 36px;
    height: 36px;
    color: #b8b0a6;
    font-size: 1.15rem;
    font-weight: 700;
    background: #4b4843;
    border-radius: 50%;
    place-items: center;
`

export const Select = styled.select`
    background-color: #2a2d32;
    color: #fffaf1;
    border: 2px solid #4a4e55;
    border-radius: 11px;
    width: 190px;
    height: 42px;
    padding: 0 36px 0 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    -webkit-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%235b5650' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;

    &:focus-visible {
        outline: 3px solid rgba(215, 45, 56, 0.14);
        outline-offset: 1px;
        border-color: #d72d38;
        box-shadow: none;
    }

    option {
        background: #2a2d32;
        color: #fffaf1;
    }

    @media screen and (max-width: 576px) {
        width: 100%;
    }
`
