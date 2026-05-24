import React from 'react';
import { FaBars } from 'react-icons/fa';
import {
  Nav,
  NavbarContainer,
  NavLogo,
  MobileIcon,
  NavMenu,
  NavItem,
  NavLinks as NavLink,
} from './NavbarElements';

type Props = {
  isOpen: boolean,
  toggle: () => void,
}

const Navbar: React.FC<Props> = ({ isOpen, toggle }) => {
  return (
    <>
      <Nav>
        <NavbarContainer>
          <NavLogo end to="/">PokeApp</NavLogo>
          <MobileIcon
            type="button"
            onClick={toggle}
            aria-controls="mobile-navigation"
            aria-expanded={isOpen}
            aria-label="Open navigation menu"
          >
            <FaBars aria-hidden="true" />
          </MobileIcon>
          <NavMenu>
            <NavItem>
              <NavLink end to="/search">Search Pokemon</NavLink>
            </NavItem>
            <NavItem>
              <NavLink end to="/move">Search Move</NavLink>
            </NavItem>
            <NavItem>
              <NavLink end to="/calc">Type Calculator</NavLink>
            </NavItem>
            <NavItem>
              <NavLink end to="/teambuilder">TeamBuilder</NavLink>
            </NavItem>
          </NavMenu>
        </NavbarContainer>
      </Nav>
    </>
  );
};

export default Navbar;