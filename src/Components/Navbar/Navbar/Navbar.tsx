import React from 'react'
import { useHistory } from "react-router-dom";
import ReactGA from 'react-ga';
import {FaBars} from 'react-icons/fa';
import { 
    Nav, 
    NavbarContainer, 
    NavLogo, 
    MobileIcon, 
    NavMenu, 
    NavItem, 
    NavLinks
} from './NavbarElements';

type Props = {
    toggle: any
}

const Navbar: React.FC<Props> = ({
    toggle
}) => {
    const history = useHistory();
    const clickHandler = (value: string) => {
        switch(value) { 
            case 'search': { 
                ReactGA.event({
                    category: 'Button',
                    action: 'Search Pokemon'
                  })
                history.push(`/search`);
                break; 
            } 
            case 'move': { 
                ReactGA.event({
                    category: 'Button',
                    action: 'Search Move'
                  })
                history.push(`/move`);
                break; 
            } 
            default: { 
                ReactGA.event({
                    category: 'Button',
                    action: 'Type Calculator'
                  })
                history.push(`/calc`);
                break; 
            } 
        }
    }
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
                            <NavLinks onClick={() => clickHandler('search')}>Search Pokemon</NavLinks>
                        </NavItem>
                        <NavItem>
                            <NavLinks onClick={() => clickHandler('move')}>Search Move</NavLinks>
                        </NavItem>
                        <NavItem>
                            <NavLinks onClick={() => clickHandler('calc')}>Type Calculator</NavLinks>
                        </NavItem>
                    </NavMenu>
                </NavbarContainer>
            </Nav>
        </>
    )
}

export default Navbar;
