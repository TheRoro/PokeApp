import React from 'react'
import { FaBars } from 'react-icons/fa';
import { 
    Nav, 
    NavbarContainer, 
    NavLogo, 
    MobileIcon, 
    NavMenu, 
    NavItem,
    NavLinks as NavLink
} from './NavbarElements';

type Props = {
    toggle: any
}

const Navbar: React.FC<Props> = ({ toggle }) => {
    return (
        <>
            <Nav>
                <NavbarContainer>
                    <NavLogo exact to="/">PokeApp</NavLogo>
                    <MobileIcon onClick={toggle}>
                        <FaBars/>
                    </MobileIcon>
                    <NavMenu>
                        <NavItem>
                            <NavLink exact to="/search">Search Pokemon</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink exact to="/move">Search Move</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink exact to="/calc">Type Calculator</NavLink>
                        </NavItem>
                    </NavMenu>
                </NavbarContainer>
            </Nav>
        </>
    );
}

export default Navbar;