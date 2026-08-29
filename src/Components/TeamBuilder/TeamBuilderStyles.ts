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

export const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  max-width: 1180px;
  margin: 0 auto;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    transform: none;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const TeamSummaryBar = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.65rem;
  max-width: 1180px;
  margin: 0 auto 1rem;

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const SummaryStat = styled.div`
  min-width: 0;
  padding: 0.7rem 0.85rem;
  background: #303339;
  border: 1px solid #4a4e55;
  border-radius: 14px;
`;

export const SummaryValue = styled.strong`
  display: block;
  overflow: hidden;
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 850;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SummaryLabel = styled.span`
  display: block;
  color: var(--text-secondary);
  font-size: 0.68rem;
  font-weight: 750;
  letter-spacing: 0.07em;
  text-transform: uppercase;
`;

export const BuilderToolbar = styled.div`
  display: flex;
  max-width: 1180px;
  margin: 1.25rem auto;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.65rem;
`;

export const UtilityButton = styled.button<{ $danger?: boolean }>`
  min-height: 42px;
  padding: 0.55rem 0.9rem;
  color: var(--text-primary);
  font-size: 0.76rem;
  font-weight: 800;
  background: ${({ $danger }) => ($danger ? '#5a282d' : '#484c53')};
  border: 1px solid ${({ $danger }) => ($danger ? '#a83a44' : '#686d76')};
  border-radius: var(--button-radius);
  box-shadow: 0 3px 0 ${({ $danger }) => ($danger ? '#301417' : '#24272b')};
  cursor: pointer;
  transition:
    transform 0.15s ease,
    background 0.15s ease,
    box-shadow 0.15s ease;

  &:hover:not(:disabled) {
    background: ${({ $danger }) => ($danger ? '#6a3036' : '#555a62')};
    box-shadow: 0 4px 0 ${({ $danger }) => ($danger ? '#301417' : '#24272b')};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    box-shadow: 0 1px 0 ${({ $danger }) => ($danger ? '#301417' : '#24272b')};
    transform: translateY(2px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  &:focus-visible {
    outline: 3px solid rgba(255, 222, 0, 0.75);
    outline-offset: 3px;
  }
`;

export const StatusText = styled.span`
  flex-basis: 100%;
  min-height: 1.25rem;
  color: var(--text-secondary);
  font-size: 0.78rem;
  text-align: center;
`;

export const ShowdownPanel = styled.details`
  max-width: 1180px;
  margin: 1.25rem auto 0;
  padding: 0.85rem 1rem;
  color: var(--text-primary);
  background: #303339;
  border: 1px solid #4a4e55;
  border-radius: 18px;
  box-shadow: 0 4px 0 #1f2226;

  > label {
    display: block;
    margin: 0.9rem 0 0.35rem;
    color: var(--text-secondary);
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }
`;

export const ShowdownSummary = styled.summary`
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 850;
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid rgba(255, 222, 0, 0.75);
    outline-offset: 3px;
  }
`;

export const ShowdownHint = styled.p`
  margin: 0.45rem 0 0;
  color: var(--text-secondary);
  font-size: 0.78rem;
  line-height: 1.45;
`;

export const ShowdownTextarea = styled.textarea`
  width: 100%;
  min-height: 230px;
  padding: 0.75rem;
  resize: vertical;
  color: var(--text-primary);
  font: 0.78rem/1.5 ui-monospace, SFMono-Regular, Consolas, monospace;
  background: #202328;
  border: 2px solid #4a4e55;
  border-radius: 14px;

  &:focus-visible {
    outline: 3px solid rgba(215, 45, 56, 0.14);
    outline-offset: 1px;
    border-color: #d72d38;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

export const ShowdownActions = styled.div`
  display: flex;
  margin-top: 0.65rem;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 0.65rem;

  @media (max-width: 480px) {
    > button {
      flex: 1;
    }
  }
`;

export const ShowdownMessage = styled.p<{ $error: boolean }>`
  min-height: 1.2rem;
  margin: 0.6rem 0 0;
  color: ${({ $error }) => ($error ? '#ff8799' : 'var(--text-secondary)')};
  font-size: 0.78rem;
  text-align: right;
`;

export const GeneratorPanel = styled.section`
  max-width: 1180px;
  margin: 0 auto 1.25rem;
  padding: 1rem;
  background: #303339;
  border: 1px solid #4a4e55;
  border-radius: 18px;
  box-shadow: 0 4px 0 #1f2226;
`;

export const GeneratorHeader = styled.div`
  margin-bottom: 0.8rem;

  strong {
    display: block;
    color: var(--text-primary);
    font-size: 1rem;
    font-weight: 850;
  }

  span {
    color: var(--text-secondary);
    font-size: 0.78rem;
  }
`;

export const GeneratorControls = styled.div`
  display: grid;
  grid-template-columns:
    minmax(135px, 0.65fr)
    minmax(145px, 0.7fr)
    minmax(190px, 1.25fr)
    auto;
  gap: 0.65rem;
  align-items: end;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const ControlField = styled.label`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.3rem;
  color: var(--text-secondary);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
`;

export const ControlSelect = styled.select`
  width: 100%;
  min-height: 44px;
  padding: 0.55rem 2rem 0.55rem 0.7rem;
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

export const PresetPanel = styled.section`
  display: grid;
  grid-template-columns: minmax(190px, 0.65fr) minmax(250px, 1fr);
  gap: 0.85rem 1rem;
  max-width: 1180px;
  margin: 0 auto 1.25rem;
  padding: 1rem;
  background: #303339;
  border: 1px solid #4a4e55;
  border-radius: 18px;
  box-shadow: 0 4px 0 #1f2226;

  > div:first-child {
    align-self: center;
  }

  > div:first-child strong,
  > div:first-child span {
    display: block;
  }

  > div:first-child strong {
    color: var(--text-primary);
    font-size: 1rem;
    font-weight: 850;
  }

  > div:first-child span {
    color: var(--text-secondary);
    font-size: 0.78rem;
    line-height: 1.45;
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const PresetMeta = styled.div`
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.55rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const PresetMetaItem = styled.div`
  min-width: 0;
  padding: 0.6rem 0.7rem;
  background: #292c31;
  border: 1px solid #454950;
  border-radius: 12px;

  span,
  strong {
    display: block;
  }

  span {
    margin-bottom: 0.15rem;
    color: var(--text-secondary);
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  strong {
    color: var(--text-primary);
    font-size: 0.76rem;
    line-height: 1.35;
  }
`;

export const PresetActions = styled.div`
  display: flex;
  grid-column: 1 / -1;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 0.65rem;

  button {
    margin-left: 0.35rem;
  }

  @media (max-width: 480px) {
    align-items: stretch;
    flex-direction: column;

    button {
      width: 100%;
      margin-left: 0;
    }
  }
`;

export const PresetLink = styled.a`
  color: #ff9ca4;
  font-size: 0.76rem;
  font-weight: 800;
  text-decoration: none;

  &:hover {
    color: #ffc1c6;
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 3px solid rgba(255, 222, 0, 0.75);
    outline-offset: 3px;
  }
`;

export const SlotCard = styled.section<{
  $animateIn: boolean;
  $removing: boolean;
  $selected: boolean;
}>`
  position: relative;
  min-height: 292px;
  padding: 1rem;
  overflow: hidden;
  border: 1px solid ${({ $selected }) => ($selected ? '#d72d38' : '#4a4e55')};
  border-radius: 18px;
  background: #303339;
  box-shadow:
    0 4px 0 #1f2226,
    0 14px 28px rgba(0, 0, 0, 0.16);

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: ${({ $selected }) => ($selected ? '100%' : '58px')};
    height: 5px;
    content: '';
    background: #d72d38;
    border-radius: 0 0 8px 0;
    transition: width 0.2s ease;
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

export const SlotLabel = styled.span`
  display: block;
  margin-bottom: 0.4rem;
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const PickerPanel = styled.section`
  display: grid;
  grid-template-columns: minmax(190px, 0.7fr) minmax(320px, 1.3fr);
  gap: 1rem;
  max-width: 1180px;
  margin: 0 auto 1.25rem;
  padding: 1rem;
  align-items: end;
  background: #303339;
  border: 1px solid #4a4e55;
  border-radius: 18px;
  box-shadow: 0 4px 0 #1f2226;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const PickerHeader = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;

  strong {
    color: var(--text-primary);
    font-size: 1rem;
    font-weight: 850;
  }
`;

export const PickerHint = styled.span`
  color: var(--text-secondary);
  font-size: 0.78rem;
  line-height: 1.45;
`;

export const PickerForm = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;

  @media (max-width: 480px) {
    align-items: stretch;
    flex-direction: column;
  }
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

export const GenerateButton = styled(SearchButton)`
  min-width: 155px;
`;

export const GeneratorMessage = styled.p`
  min-height: 1.25rem;
  margin: 0.7rem 0 0;
  color: var(--text-secondary);
  font-size: 0.76rem;
`;

export const PokemonImage = styled.img`
  display: block;
  width: min(100%, 155px);
  height: 155px;
  margin: 0 auto;
  object-fit: contain;
  transition: transform 0.18s ease;
`;

export const PokemonImageLink = styled.a`
  display: block;
  width: fit-content;
  margin: 0.2rem auto 0;
  border-radius: 14px;

  &:hover ${PokemonImage} {
    transform: translateY(-2px) scale(1.025);
  }

  &:focus-visible {
    outline: 3px solid rgba(255, 222, 0, 0.75);
    outline-offset: 3px;
  }
`;

export const PokemonName = styled.h2`
  margin: 0.1rem 0 0.45rem;
  font-size: 1.25rem;
  text-align: center;
`;

export const PokemonNameLink = styled.a`
  color: var(--text-primary);
  text-decoration: none;

  &:hover {
    color: #ff8799;
  }

  &:focus-visible {
    outline: 3px solid rgba(255, 222, 0, 0.75);
    outline-offset: 3px;
  }
`;

export const Types = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 118px));
  justify-content: center;
  gap: 0.5rem;

  > :only-child {
    grid-column: 1 / -1;
    width: 118px;
    justify-self: center;
  }
`;

export const TeamTypeBadge = styled.span<{ $color: string }>`
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  min-height: 42px;
  padding: 0.35rem 0.5rem;
  align-items: center;
  gap: 0.45rem;
  background: #383c42;
  border: 1px solid #4a4e55;
  border-left: 4px solid ${({ $color }) => $color};
  border-radius: 10px;
`;

export const TeamTypeIcon = styled.img`
  width: 28px;
  height: 28px;
`;

export const TeamTypeName = styled.strong`
  overflow: hidden;
  color: #fffaf1;
  font-size: 0.72rem;
  font-weight: 850;
  text-overflow: ellipsis;
`;

export const CompetitiveDetails = styled.details`
  margin-top: 0.75rem;
  padding: 0.55rem 0.6rem;
  color: var(--text-primary);
  background: #292c31;
  border: 1px solid #454950;
  border-radius: 12px;
`;

export const CompetitiveSummary = styled.summary`
  overflow: hidden;
  font-size: 0.72rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid rgba(255, 222, 0, 0.75);
    outline-offset: 3px;
  }
`;

export const CompetitiveMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.45rem;
  margin-top: 0.65rem;
`;

export const CompetitiveMetaItem = styled.div`
  min-width: 0;
  margin-top: 0.5rem;

  span,
  strong {
    display: block;
  }

  span {
    color: var(--text-secondary);
    font-size: 0.6rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  strong {
    color: var(--text-primary);
    font-size: 0.7rem;
    line-height: 1.4;
  }
`;

export const CompetitiveMoves = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.35rem;
  margin: 0.7rem 0 0;
  padding: 0;
  list-style: none;

  li {
    padding: 0.35rem 0.45rem;
    color: #fffaf1;
    font-size: 0.68rem;
    font-weight: 750;
    background: #383c42;
    border-radius: 8px;
  }
`;

export const EmptySlot = styled.p`
  display: flex;
  min-height: 235px;
  margin: 0;
`;

export const EmptySlotButton = styled.button<{ $selected: boolean }>`
  display: flex;
  width: 100%;
  padding: 1rem;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.45rem;
  color: ${({ $selected }) => ($selected ? '#fffaf1' : 'var(--text-secondary)')};
  background: ${({ $selected }) =>
    $selected ? 'rgba(215, 45, 56, 0.1)' : '#2a2d32'};
  border: 2px dashed ${({ $selected }) => ($selected ? '#d72d38' : '#4a4e55')};
  border-radius: 14px;
  cursor: pointer;
  transition:
    color 0.15s ease,
    background 0.15s ease,
    border-color 0.15s ease,
    transform 0.15s ease;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: #ff8799;
  }

  strong {
    color: var(--text-primary);
    font-size: 0.95rem;
  }

  span {
    max-width: 190px;
    font-size: 0.75rem;
    line-height: 1.45;
  }

  &:hover {
    color: var(--text-primary);
    background: #33373d;
    border-color: #686d76;
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid rgba(255, 222, 0, 0.75);
    outline-offset: 3px;
  }
`;

export const ErrorText = styled.p`
  min-height: 1.5rem;
  margin: 0.5rem 0 0;
  color: #ff8799;
  font-size: 0.85rem;
`;

export const CardControls = styled.div`
  position: absolute;
  z-index: 2;
  top: 0.65rem;
  right: 0.65rem;
  display: flex;
  gap: 0.35rem;
`;

export const CardIconButton = styled.button<{ $danger?: boolean }>`
  display: inline-grid;
  width: 32px;
  height: 32px;
  padding: 0;
  place-items: center;
  color: ${({ $danger }) => ($danger ? '#ff9aa7' : 'var(--text-secondary)')};
  background: #2a2d32;
  border: 1px solid #4a4e55;
  border-radius: 10px;
  cursor: pointer;
  transition:
    color 0.15s ease,
    background 0.15s ease,
    border-color 0.15s ease,
    transform 0.15s ease;

  &:hover:not(:disabled) {
    color: #fff;
    background: ${({ $danger }) => ($danger ? '#7f232b' : '#454a52')};
    border-color: ${({ $danger }) => ($danger ? '#d72d38' : '#686d76')};
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.35;
  }

  &:focus-visible {
    outline: 3px solid rgba(255, 222, 0, 0.75);
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
