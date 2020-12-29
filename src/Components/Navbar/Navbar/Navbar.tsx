import React from 'react'
import {FaBars} from 'react-icons/fa';
import { 
    Nav, 
    NavbarContainer, 
    NavLogo, 
    MobileIcon, 
    NavMenu, 
    NavItem, 
    NavLinks,
    NavBtn,
    NavBtnLink
} from './NavbarElements';

type Props = {
    toggle: any
}

const Navbar: React.FC<Props> = ({
    toggle
}) => {
    return (
        <>
            <Nav>
                <NavbarContainer>
                    <NavLogo to="/">PokeApp</NavLogo>
                    <MobileIcon onClick={toggle}>
                        <FaBars/>
                    </MobileIcon>
                    <NavMenu>
                        <NavItem>
                            <NavLinks to="/search">Search Pokemon</NavLinks>
                        </NavItem>
                        <NavItem>
                            <NavLinks to="/calc">Type Calculator</NavLinks>
                        </NavItem>
                    </NavMenu>
                </NavbarContainer>
            </Nav>
        </>
    )
}

export default Navbar;
