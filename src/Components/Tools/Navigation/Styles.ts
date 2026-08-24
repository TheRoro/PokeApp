import styled from 'styled-components';
import { Link } from "react-router-dom";

export const NavigationBar = styled.nav`
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.5rem;
`;

export const NavButton = styled(Link)`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    padding: 0.55rem 0.9rem;
    gap: 0.45rem;
    border-radius: var(--button-radius);
    background: linear-gradient(180deg, #E8413C 0%, #CC2D28 100%);
    border: 2px solid #8B1A17;
    box-shadow: 0 3px 0 #6B1411, 0 4px 8px rgba(0, 0, 0, 0.2);
    color: #fff;
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 0.03em;
    text-decoration: none;
    transition: transform 0.1s ease, box-shadow 0.1s ease;

    &:hover {
        color: #fff;
        text-decoration: none;
        transform: translateY(1px);
        box-shadow: 0 2px 0 #6B1411, 0 3px 6px rgba(0, 0, 0, 0.2);
    }

    &:active {
        transform: translateY(3px);
        box-shadow: 0 0px 0 #6B1411, 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    &:focus-visible {
        outline: 3px solid rgba(255, 222, 0, 0.8);
        outline-offset: 3px;
    }
`

export const Arrow = styled.span`
    display: inline-flex;
    width: 0.75rem;
    height: 0.75rem;
    flex: 0 0 0.75rem;
    align-items: center;
    justify-content: center;

    svg {
        width: 100%;
        height: 100%;
    }
`;
