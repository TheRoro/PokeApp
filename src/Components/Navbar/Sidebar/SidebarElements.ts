import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';
import {Link as LinkR} from 'react-router-dom';

type Props = {
    isOpen: boolean
}

export const SidebarContainer = styled.aside`
    position: fixed;
    z-index: 999;
    width: 100%;
    height: 100%;
    background: #121212;
    display: grid;
    align-items: center;
    top: 0;
    left: 0;
    transition: 0.3s ease-in-out;
    opacity: ${(p: Props) => (
        p.isOpen ? '100%' : '0'
    )};
    top: ${(p: Props) => (
        p.isOpen ? '0' : '-100%'
    )};
`

export const CloseIcon = styled(FaTimes)`
    color: #d1d1d1;
`

export const Icon = styled.div`
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background: transparent;
    font-size: 2rem;
    cursor: pointer;
    outline: none;
`

export const SidebarWrapper = styled.div`
    color: #d1d1d1;
`

export const SidebarMenu = styled.ul`
    display: grid;
    padding: 0;
    margin: 0;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, 80px);
    text-align: center;

    @media screen and (max-width: 480px) {
        grid-template-rows: repeat(3, 80px);
    }
`

export const SidebarLink = styled.button`
    border: none;
    background: none;
    cursor: pointer;
    margin: 0;
    padding: 0;
    outline: none!important;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    text-decoration: none;
    list-style: none;
    transition: 0.2s ease-in-out;
    text-decoration: none;
    color: #d1d1d1;
    cursor: pointer;

    &:hover {
        color: #F4D849;
        text-decoration: none;
        transition: 0.2s ease-in-out;
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
    outline: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;

    &:hover {
        transition: all 0.2s ease-in-out;
        background: #fff;
        color: #010606;
    }
`