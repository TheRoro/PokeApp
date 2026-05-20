import styled from 'styled-components';
import { Link } from "react-router-dom";

export const NavButton = styled(Link)`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: linear-gradient(180deg, #E8413C 0%, #CC2D28 100%);
    border: 2px solid #8B1A17;
    box-shadow: 0 3px 0 #6B1411, 0 4px 8px rgba(0, 0, 0, 0.2);
    color: #fff;
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

    i {
        font-size: 1.2rem;
    }
`
