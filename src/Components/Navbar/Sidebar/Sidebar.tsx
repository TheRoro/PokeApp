import React from 'react'
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
    return (
        <SidebarContainer isOpen={isOpen} onClick={toggle}>
            <Icon onClick={toggle}>
                <CloseIcon/>
            </Icon>
            <SidebarWrapper>
                <SidebarMenu>
                    <SidebarLink to="/search" onClick={toggle}>
                        Search Pokemon
                    </SidebarLink>
                    <SidebarLink to="/calc" onClick={toggle}>
                        Type Calculator
                    </SidebarLink>
                    <SidebarLink to="/move" onClick={toggle}>
                        Search Move
                    </SidebarLink>
                </SidebarMenu>
            </SidebarWrapper>
        </SidebarContainer>
    )
}

export default SideBar;