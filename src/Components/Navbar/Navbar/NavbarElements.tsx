import styled from 'styled-components';
import {Link as LinkR} from 'react-router-dom';
// import {Link as LinkS} from 'react-scroll';

export const Nav = styled.nav`
    height: 10%;
    display: flex;
    justify-content: end;
    align-items: center;
    font-size: 1rem;
    background: #121212;
    position: sticky;
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

export const NavLogo = styled(LinkR)`
    color: #fff;
    justify-self: flex-start;
    cursor: pointer;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    margin-left: 24px;
    font-weight: bold;
    text-decoration: none;

    &:hover {
        color: #03dac5;
        text-decoration: none;
        /* opacity: 0.8; */
    }

    &.active {
        border-bottom: 3px solid #01bf71;
        color: green;
    }
`

export const MobileIcon = styled.div`
    display: none;

    @media screen and (max-width: 768px) {
        display: block;
        height: 50px;
        /* position: absolute; */
        /* top: 0;
        right: 0; */
        /* transform: translate(-100%, 60%); */
        font-size: 1.8rem;
        cursor: pointer;
        color: #fff;
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

    @media screen and (max-width: 768px) {
        display: none;
    } 
`

export const NavItem = styled.li`
    height: 80px;
`

export const NavLinks = styled(LinkR)`
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 1rem;
    height: 100%;
    font-size: 1.2rem;
    cursor: pointer;

    &.active {
        color: #03dac5;
    }

    &:hover {
        color: #03dac5;
        text-decoration: none;
        /* opacity: 0.8; */
    }
`

export const NavBtn = styled.nav`
    display: flex;
    align-items: center;

    @media screen and (max-width: 768px) {
        display: none;
    }
`

export const NavBtnLink = styled(LinkR)`
    border-radius: 50px;
    background: #01bf71;
    white-space: nowrap;
    padding: 10px 22px;
    color: #010606;
    font-size: 16px;
    outline: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;

    &:hover {
        transition: all 0.2s ease-in-out;
        background: #fff;
        color: #010606;
    }
`