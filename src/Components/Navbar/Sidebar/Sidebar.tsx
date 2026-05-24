import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SidebarContainer,
  Icon,
  CloseIcon,
  SidebarWrapper,
  SidebarMenu,
  SidebarLink,
} from './SidebarElements';

type Props = {
  toggle: () => void,
  isOpen: boolean,
}

const SideBar: React.FC<Props> = ({
  toggle,
  isOpen,
}) => {
  const navigate = useNavigate();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') toggle();
      if (event.key !== 'Tab') return;

      const focusable = Array.from(
        sidebarRef.current?.querySelectorAll<HTMLElement>('button, a[href]') ?? [],
      ).filter(element => !element.hasAttribute('disabled'));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, toggle]);

  const clickHandler = (value: string) => {
    toggle();

    switch (value) {
      case 'search':
        navigate('/search');
        break;
      case 'move':
        navigate('/move');
        break;
      case 'calc':
        navigate('/calc');
        break;
      default:
        navigate('/teambuilder');
        break;
    }
  };

  return (
    <SidebarContainer
      id="mobile-navigation"
      ref={sidebarRef}
      isOpen={isOpen}
      aria-hidden={!isOpen}
      aria-label="Mobile navigation"
      aria-modal="true"
      role="dialog"
      onClick={event => {
        if (event.target === event.currentTarget) toggle();
      }}
    >
      <Icon ref={closeButtonRef} type="button" onClick={toggle} aria-label="Close navigation menu">
        <CloseIcon aria-hidden="true" />
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
          <SidebarLink onClick={() => clickHandler('teambuilder')}>
            TeamBuilder
          </SidebarLink>
        </SidebarMenu>
      </SidebarWrapper>
    </SidebarContainer>
  );
};

export default SideBar;