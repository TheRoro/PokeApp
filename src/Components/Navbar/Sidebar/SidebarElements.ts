import styled, { keyframes } from 'styled-components';
import { FaTimes } from 'react-icons/fa';
import {Link as LinkR} from 'react-router-dom';

type Props = {
    isOpen: boolean
}

const slideIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(-16px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

export const SidebarContainer = styled.aside`
    position: fixed;
    z-index: 999;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, #e43a46 0%, #b51f2b 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    transition: 0.3s ease-in-out;
    opacity: ${(p: Props) => (
        p.isOpen ? '100%' : '0'
    )};
    top: ${(p: Props) => (
        p.isOpen ? '0' : '-100%'
    )};
    visibility: ${(p: Props) => (p.isOpen ? 'visible' : 'hidden')};
    pointer-events: ${(p: Props) => (p.isOpen ? 'auto' : 'none')};
`

export const CloseIcon = styled(FaTimes)`
    color: #fffaf1;
`

export const Icon = styled.button`
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    padding: 0.4rem;
    background: transparent;
    border: 0;
    font-size: 2rem;
    cursor: pointer;
    transition: transform 0.2s ease, color 0.2s ease;

    &:hover {
        transform: rotate(90deg);
        color: #fff;
    }

    &:focus-visible {
        outline: 2px solid rgba(255, 255, 255, 0.28);
        outline-offset: 2px;
    }
`

export const SidebarWrapper = styled.div`
    color: #d1d1d1;
    animation: ${slideIn} 0.35s ease forwards;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

export const SidebarMenu = styled.ul`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 1.5rem;
    margin: 0;
    gap: 1rem;
    text-align: center;
    list-style: none;
`

export const SidebarLink = styled.button`
    border: 0;
    background: transparent;
    cursor: pointer;
    margin: 0;
    padding: 1rem 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.45rem;
    font-weight: 700;
    text-decoration: none;
    list-style: none;
    transition: 0.22s ease-in-out;
    color: #fffaf1;
    border-radius: var(--button-radius);
    width: 280px;
    max-width: 90vw;

    &:hover {
        color: #fff;
        background: rgba(255, 250, 241, 0.1);
        text-decoration: none;
        transform: translateY(-2px);
    }

    &:focus-visible {
        outline: 2px solid rgba(255, 255, 255, 0.28);
        outline-offset: 2px;
    }

    @media screen and (max-width: 480px) {
        font-size: 1.2rem;
        padding: 0.85rem 2rem;
        width: 240px;
    }
`

export const SideBtnWrap = styled.div`
    display: flex;
    justify-content: center;
`

export const SidebarRoute = styled(LinkR)`
    border-radius: 50px;
    background: #F4D849;
    white-space: nowrap;
    padding: 16px 64px;
    color: #010606;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;

    &:hover {
        transition: all 0.2s ease-in-out;
        background: #fff;
        color: #010606;
    }

    &:focus-visible {
        outline: 2px solid rgba(255, 255, 255, 0.28);
        outline-offset: 2px;
    }
`
