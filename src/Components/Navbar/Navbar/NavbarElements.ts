import styled from 'styled-components';
import { NavLink as LinkR } from 'react-router-dom';

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  (isActive ? 'active' : undefined);

export const Nav = styled.nav`
  height: 10%;
  display: flex;
  justify-content: end;
  align-items: center;
  font-size: 1rem;
  background: linear-gradient(180deg, #E8413C 0%, #CC2D28 100%);
  border-bottom: 4px solid #8B1A17;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  top: 0;
  z-index: 10;
  position: relative;

  @media screen and (max-width: 960px) {
    transition: 0.8s all ease;
  }
`;

export const NavbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  z-index: 1;
  width: 100%;
  padding: 0 24px;
`;

export const NavLogo = styled(LinkR).attrs({ className: navLinkClassName })`
  color: #fff;
  opacity: 1;
  justify-self: flex-start;
  cursor: pointer;
  font-size: 1.65rem;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin-left: 0;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &::before {
    content: '';
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #7df9ff, #2196F3 70%);
    border: 2px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 10px rgba(33, 150, 243, 0.6), inset 0 -2px 4px rgba(0, 0, 0, 0.15);
    flex-shrink: 0;
  }

  &.active {
    opacity: 1;

    &:hover {
      opacity: 0.9;
    }
  }

  &:hover {
    color: #fff;
    text-decoration: none;
    transform: translateY(-1px);
  }
`;

export const MobileIcon = styled.div`
  display: none;

  @media screen and (max-width: 990px) {
    display: block;
    height: 50px;
    font-size: 1.8rem;
    cursor: pointer;
    color: #fff;
    transition: color 0.2s ease;

    &:hover {
      color: #fff;
    }
  }
`;

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
`;

export const NavItem = styled.li``;

export const NavLinks = styled(LinkR).attrs({ className: navLinkClassName })`
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  padding-bottom: 0.3rem;
  outline: none !important;
  display: flex;
  align-items: center;
  text-decoration: none;
  margin: 0 1.5rem;
  height: 100%;
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  opacity: 0.85;
  transition: color 0.2s ease, opacity 0.2s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -4px;
    width: 0;
    height: 3px;
    border-radius: 999px;
    background: #fff;
    transform: translateX(-50%);
    transition: width 0.25s ease;
  }

  &.active {
    opacity: 1;
    color: #fff;
    font-weight: 800;

    &::after {
      width: 100%;
    }

    &:hover {
      opacity: 0.92;
    }
  }

  &:hover {
    color: #fff;
    text-decoration: none;
    opacity: 1;

    &::after {
      width: 100%;
      background: #fff;
    }
  }
`;

export const NavBtn = styled.nav`
  display: flex;
  align-items: center;

  @media screen and (max-width: 990px) {
    display: none;
  }
`;
