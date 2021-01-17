import React from 'react'
import { useHistory } from "react-router-dom";
import ReactGa from 'react-ga';
import { 
    SidebarContainer, 
    Icon, 
    CloseIcon,
    SidebarWrapper,
    SidebarMenu,
    SidebarLink
} from './SidebarElements';

type Props = {
    toggle: any,
    isOpen: boolean
}

const SideBar: React.FC<Props> = ({
    toggle,
    isOpen
}) => {
    const history = useHistory();
    const clickHandler = (value: string) => {
        toggle();
        switch(value) { 
            case 'search': { 
                ReactGa.event({
                    category: 'Button',
                    action: 'Search Pokemon'
                  })
                history.push(`/search`);
                break; 
            } 
            case 'move': { 
                ReactGa.event({
                    category: 'Button',
                    action: 'Search Move'
                  })
                history.push(`/move`);
                break; 
            } 
            default: { 
                ReactGa.event({
                    category: 'Button',
                    action: 'Type Calculator'
                  })
                history.push(`/calc`);
                break; 
            } 
        }
    }
    return (
        <SidebarContainer isOpen={isOpen} onClick={toggle}>
            <Icon onClick={toggle}>
                <CloseIcon/>
            </Icon>
            <SidebarWrapper>
                <SidebarMenu>
                    <SidebarLink onClick={() => clickHandler('search')}>
                        Search Pokemon
                    </SidebarLink>
                    <SidebarLink onClick={() => clickHandler('move')}>
                        Search Move
                    </SidebarLink>
                    <SidebarLink onClick={() => clickHandler('calc')}>
                        Type Calculator
                    </SidebarLink>
                </SidebarMenu>
            </SidebarWrapper>
        </SidebarContainer>
    )
}

export default SideBar;