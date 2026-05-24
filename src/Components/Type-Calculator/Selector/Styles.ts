import styled from 'styled-components';

export const Title = styled.h1`
    font-size: calc(20px + 1.8vw);
    font-weight: 900;
    color: #fff;
    text-align: center;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    text-shadow: 0 0 10px rgba(220, 10, 45, 0.3);
`

export const SubTitle = styled.div`
    font-size: 1rem;
    font-weight: 700;
    text-align: center;
    color: var(--text-secondary, #b0b0c0);
    text-transform: uppercase;
    letter-spacing: 0.08em;
`

export const Text = styled.div`
    font-size: 1.1rem;
    font-weight: 600;
    text-align: center;
    color: var(--text-secondary, #b0b0c0);
`

export const Select = styled.select`
    background-color: var(--bg-surface, #363A40);
    color: #f0f0f0;
    border: 2px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    width: 180px;
    height: 40px;
    padding: 0 36px 0 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    -webkit-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23f0f0f0' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;

    &:focus-visible {
        outline: 3px solid rgba(255, 222, 0, 0.65);
        outline-offset: 2px;
        border-color: var(--pokedex-red, #DC0A2D);
        box-shadow: 0 0 0 3px rgba(220, 10, 45, 0.15);
    }

    option {
        background: #363A40;
        color: #f0f0f0;
    }
`
