import styled, {css} from 'styled-components';
import {NavLink as LinkR} from 'react-router-dom';

export const Nav = styled.nav`
    height: 10%;
    display: flex;
    justify-content: end;
    align-items: center;
    font-size: 1rem;
    background: #121212;
    /* position: sticky; */
    top: 0;
    z-index: 10;

    @media screen and (max-width: 960px) {
        transition: 0.8s all ease;
    }
`

export const NavbarContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
    z-index: 1;
    width: 100%;
    padding: 0 24px;
`

const glowColor = '#FFF';

const glow = css`
    color: #fafafa;
    text-shadow: 0 0 1px ${glowColor}, 0 0 1px ${glowColor}, 0 0 1px ${glowColor}, 0 0 1px ${glowColor}, 0 0 1px ${glowColor}, 0 0 1px ${glowColor}, 0 0 4px ${glowColor};
`;

export const NavLogo = styled(LinkR)`
    color: #fafafa;
    justify-self: flex-start;
    cursor: pointer;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    margin-left: 0;
    font-weight: bold;
    text-decoration: none;
    border-bottom: 1px solid #121212;
    transition: all .2s ease-in-out;
    &.active {
        opacity: 1;
        ${glow};
        &:hover {
            opacity: .9;
        }
    }

    &:hover {
        ${glow};
        text-decoration: none;
        opacity: 1;
    }
`

export const MobileIcon = styled.div`
    display: none;

    @media screen and (max-width: 990px) {
        display: block;
        height: 50px;
        font-size: 1.8rem;
        cursor: pointer;
        color: #fafafa;
    }
`

export const NavMenu = styled.ul`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    justify-self: flex-end;
    list-style: none;
    text-align: center;
    margin: 0;
    padding: 0;

    @media screen and (max-width: 990px) {
        display: none;
    } 
`

export const NavItem = styled.li`
    /* height: 80px; */
`

export const NavLinks = styled(LinkR)`
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    outline: none!important;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding-bottom: .1rem;
    margin: 0 1.5rem;
    height: 100%;
    font-size: 1.2rem;
    cursor: pointer;
    border-bottom: 1px solid #121212;
    color: #fafafa;
    opacity: .9;
    transition: all .2s ease-in-out;
    &.active {
        opacity: 1;
        ${glow};
        &:hover {
            opacity: .9;
        }
    }

    &:hover {
        ${glow};
        text-decoration: none;
        opacity: 1;
    }
`

export const NavBtn = styled.nav`
    display: flex;
    align-items: center;

    @media screen and (max-width: 990px) {
        display: none;
    }
`