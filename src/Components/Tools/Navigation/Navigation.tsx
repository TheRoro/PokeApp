import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Arrow, NavButton, NavigationBar } from './Styles';

type Props = {
    left: string,
    right: string,
    leftLabel?: string,
    rightLabel?: string,
}

const Navigation: React.FC<Props> = ({
    left,
    right,
    leftLabel = 'Back',
    rightLabel = 'Next',
}) => {
    return (
      <NavigationBar>
        <NavButton to={left}>
          <Arrow aria-hidden="true"><FaChevronLeft /></Arrow>
          {leftLabel}
        </NavButton>
        {right !== '' && (
          <NavButton to={right}>
            {rightLabel}
            <Arrow aria-hidden="true"><FaChevronRight /></Arrow>
          </NavButton>
        )}
      </NavigationBar>
    );
}

export default Navigation;