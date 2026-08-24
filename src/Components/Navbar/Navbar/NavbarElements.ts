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
  background: linear-gradient(180deg, #e43a46 0%, #d72d38 100%);
  border-bottom: 4px solid #8e1821;
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

  @media screen and (max-width: 480px) {
    height: 60px;
    padding: 0 16px;
  }
`;

export const NavLogo = styled(LinkR).attrs({ className: navLinkClassName })`
  color: #fffaf1;
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

  @media screen and (max-width: 480px) {
    font-size: 1.3rem;
    gap: 0.4rem;
  }

  &::before {
    content: '';
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #7df9ff, #2196F3 70%);
    border: 2px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 10px rgba(33, 150, 243, 0.6), inset 0 -2px 4px rgba(0, 0, 0, 0.15);
    flex-shrink: 0;

    @media screen and (max-width: 480px) {
      width: 14px;
      height: 14px;
    }
  }

  &.active {
    opacity: 1;

    &:hover {
      opacity: 0.9;
    }
  }

  &:hover {
    color: #fffaf1;
    text-decoration: none;
    transform: translateY(-1px);
  }
`;

export const MobileIcon = styled.button`
  display: none;
  padding: 0.4rem;
  background: transparent;
  border: 0;

  @media screen and (max-width: 990px) {
    display: block;
    height: 50px;
    font-size: 1.8rem;
    cursor: pointer;
    color: #fffaf1;
    transition: transform 0.2s ease, color 0.2s ease;

    &:hover {
      color: #fff;
      transform: scale(1.05);
    }

    &:focus-visible {
      outline: 3px solid rgba(255, 255, 255, 0.26);
      outline-offset: 3px;
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
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 0.55rem 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  margin: 0 1.15rem;
  height: 100%;
  font-size: 0.95rem;
  font-weight: 700;
  color: #fffaf1;
  opacity: 0.88;
  transition: transform 0.2s ease, color 0.2s ease, opacity 0.2s ease;
  position: relative;

  &::after {
    position: absolute;
    right: 0;
    bottom: 0.15rem;
    left: 0;
    height: 2px;
    content: '';
    background: #fffaf1;
    border-radius: 999px;
    opacity: 0;
    transform: scaleX(0.45);
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  &.active {
    opacity: 1;
    color: #fffaf1;
    font-weight: 800;

    &::after {
      opacity: 1;
      transform: scaleX(1);
    }

    &:hover {
      opacity: 1;
    }
  }

  &:hover {
    color: #fff;
    text-decoration: none;
    opacity: 1;
    transform: translateY(-1px);

    &::after {
      opacity: 1;
      transform: scaleX(1);
    }
  }

  &:focus-visible {
    outline: 3px solid rgba(255, 255, 255, 0.28);
    outline-offset: 3px;
  }
`;

export const NavBtn = styled.nav`
  display: flex;
  align-items: center;

  @media screen and (max-width: 990px) {
    display: none;
  }
`;
