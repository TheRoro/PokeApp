import styled, { css, keyframes } from 'styled-components';

const addPokemon = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const removePokemon = keyframes`
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(-24px) scale(0.96);
  }
`;

export const Page = styled.main`
  min-height: calc(100vh - 80px);
  padding: 2.5rem 1rem 4rem;
`;

export const Header = styled.header`
  max-width: 760px;
  margin: 0 auto 2rem;
  text-align: center;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: clamp(2.2rem, 6vw, 4.5rem);
  font-weight: 800;
`;

export const Hint = styled.p`
  margin: 0.5rem 0 0;
  color: var(--text-secondary);
`;

export const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  max-width: 1180px;
  margin: 0 auto;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const SlotCard = styled.section<{
  $animateIn: boolean;
  $removing: boolean;
}>`
  position: relative;
  min-height: 330px;
  padding: 1rem;
  overflow: hidden;
  border: 1px solid #4a4e55;
  border-radius: 22px;
  background: #303339;
  box-shadow:
    0 4px 0 #1f2226,
    0 14px 28px rgba(0, 0, 0, 0.16);

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 58px;
    height: 5px;
    content: '';
    background: #d72d38;
    border-radius: 0 0 8px 0;
  }
  ${({ $animateIn }) =>
    $animateIn &&
    css`
      animation: ${addPokemon} 320ms ease-out both;
    `}
  ${({ $removing }) =>
    $removing &&
    css`
      pointer-events: none;
      animation: ${removePokemon} 220ms ease-in both;
    `}

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 1ms;
  }
`;

export const SlotLabel = styled.label`
  display: block;
  margin-bottom: 0.4rem;
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const SearchForm = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
`;

export const InputContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
`;

export const SearchInput = styled.input`
  min-width: 0;
  width: 100%;
  min-height: 44px;
  padding: 0.65rem 0.75rem;
  color: var(--text-primary);
  background: #2a2d32;
  border: 2px solid #4a4e55;
  border-radius: 14px;

  &:focus-visible {
    outline: 3px solid rgba(215, 45, 56, 0.14);
    outline-offset: 1px;
    border-color: #d72d38;
  }
`;

export const Suggestions = styled.ul`
  position: absolute;
  z-index: 20;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  max-height: 240px;
  margin: 0;
  padding: 0.3rem;
  overflow-y: auto;
  background: #202328;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 11px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.45);
  list-style: none;
`;

export const Suggestion = styled.li<{ $active: boolean }>`
  min-height: 40px;
  padding: 0.5rem 0.65rem;
  color: #fff;
  text-align: left;
  background: ${({ $active }) =>
    $active ? 'rgba(220, 10, 45, 0.35)' : 'transparent'};
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: rgba(220, 10, 45, 0.35);
  }
`;

export const NoSuggestions = styled.div`
  position: absolute;
  z-index: 20;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  padding: 0.65rem;
  color: var(--text-secondary);
  font-size: 0.85rem;
  background: #202328;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 11px;
`;

export const SearchButton = styled.button`
  min-height: 44px;
  padding: 0.6rem 0.9rem;
  color: #fff;
  font-weight: 700;
  background: #d72d38;
  border: 2px solid #ef5963;
  border-radius: var(--button-radius);
  box-shadow: 0 4px 0 #8e1821;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;

  &:hover:not(:disabled) {
    background: #e43a46;
    transform: translateY(-2px);
    box-shadow: 0 6px 0 #8e1821;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }

  &:focus-visible {
    outline: 3px solid rgba(255, 255, 255, 0.22);
    outline-offset: 3px;
  }
`;

export const PokemonImage = styled.img`
  display: block;
  width: min(100%, 190px);
  height: 190px;
  margin: 0.75rem auto 0;
  object-fit: contain;
`;

export const PokemonName = styled.h2`
  margin: 0.25rem 0 0.5rem;
  font-size: 1.4rem;
  text-align: center;
`;

export const Types = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem;
`;

export const TypeBadge = styled.span`
  padding: 0.25rem 0.65rem;
  font-size: 0.8rem;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid currentColor;
  border-radius: var(--button-radius);
`;

export const EmptySlot = styled.p`
  display: grid;
  min-height: 210px;
  margin: 0;
  place-items: center;
  color: var(--text-secondary);
  text-align: center;
`;

export const ErrorText = styled.p`
  min-height: 1.5rem;
  margin: 0.5rem 0 0;
  color: #ff8799;
  font-size: 0.85rem;
`;

export const RemoveButton = styled.button`
  display: block;
  margin: 0.75rem auto 0;
  padding: 0.35rem 0.65rem;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--button-radius);
  cursor: pointer;

  &:hover {
    color: #fff;
    border-color: #fff;
  }

  &:focus-visible {
    outline: 3px solid rgba(255, 255, 255, 0.2);
    outline-offset: 3px;
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  margin: 1.5rem 0;
`;

export const ResetButton = styled.button`
  min-height: 44px;
  padding: 0.6rem 1.2rem;
  color: #fff;
  font-weight: 700;
  background: #d72d38;
  border: 2px solid #ef5963;
  border-radius: 999px;
  box-shadow: 0 4px 0 #8e1821;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;

  &:hover:not(:disabled) {
    background: #e43a46;
    transform: translateY(-2px);
    box-shadow: 0 6px 0 #8e1821;
  }

  &:focus-visible {
    outline: 3px solid rgba(255, 255, 255, 0.2);
    outline-offset: 3px;
  }
`;

export const Analysis = styled.section`
  position: relative;
  max-width: 1180px;
  margin: 2rem auto 0;
  padding: 1.5rem;
  overflow: hidden;
  background: #303339;
  border: 1px solid #4a4e55;
  border-radius: 22px;
  box-shadow:
    0 4px 0 #1f2226,
    0 14px 28px rgba(0, 0, 0, 0.16);

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 72px;
    height: 5px;
    content: '';
    background: #d72d38;
    border-radius: 0 0 8px 0;
  }
`;

export const AnalysisTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin: 0 0 0.35rem;
  color: #e7e3dd;
  font-size: 1.2rem;
  font-weight: 800;

  &::before {
    width: 28px;
    height: 4px;
    content: '';
    background: #d72d38;
    border-radius: 999px;
    box-shadow: 0 2px 0 #831921;
  }
`;

export const AnalysisHint = styled.p`
  color: var(--text-secondary);
`;

export const CoverageRow = styled.section`
  display: grid;
  grid-template-columns: minmax(170px, 230px) 1fr;
  gap: 1.5rem;
  padding: 1.5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

export const CoverageRowTitle = styled.h3`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const CoverageContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem 2.5rem;
`;

export const CoverageGroup = styled.div`
  flex: 1 1 280px;
`;

export const CoverageLabel = styled.h4`
  margin: 0 0 0.65rem;
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const TypeList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(185px, 1fr));
  gap: 0.55rem;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const SummaryBadge = styled.li`
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) 30px;
  align-items: center;
  gap: 0.55rem;
  min-width: 0;
  min-height: 50px;
  padding: 0.45rem 0.55rem;
  overflow: hidden;
  background: #383c42;
  border: 1px solid #4a4e55;
  border-left: 4px solid currentColor;
  border-radius: 14px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
`;

export const SummaryCount = styled.strong`
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  color: #fffaf1;
  font-size: 0.85rem;
  font-weight: 800;
  line-height: 1;
  background: #2a2d32;
  border: 1px solid #4a4e55;
  border-radius: 10px;
`;

export const SummaryText = styled.span`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const SummaryIcon = styled.img`
  width: 30px;
  height: 30px;
`;

export const SummaryType = styled.strong`
  color: currentColor;
  font-size: 0.85rem;
  font-weight: 900;
  overflow-wrap: anywhere;
`;

export const SummaryMetric = styled.span`
  color: var(--text-secondary);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.02em;
`;

export const EmptySummary = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
`;
