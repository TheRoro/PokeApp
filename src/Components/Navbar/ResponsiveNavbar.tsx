import React from 'react';
import Navbar from './Navbar/Navbar';
import Sidebar from './Sidebar/Sidebar';

type Props = {}

const NavBar: React.FC<Props> = () => {

    const [isOpen, setIsOpen] = React.useState(false);

    const toggle = () => {
        setIsOpen(current => !current);
    };

    return (
        <>
            <Sidebar isOpen={isOpen} toggle={toggle}/>
            <Navbar isOpen={isOpen} toggle={toggle}/>
        </>
    );
}
export default NavBar;