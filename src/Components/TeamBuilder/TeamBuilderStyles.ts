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

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.8rem;
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
  position: relative;
  max-width: 1180px;
  margin: 0 auto 1rem;
  padding: 0.9rem 1rem 0.85rem;
  overflow: hidden;
  background: #252b36;
  border: 1px solid #505b70;
  border-radius: 18px;
  box-shadow:
    0 4px 0 #171b22,
    0 14px 30px rgba(0, 0, 0, 0.2);

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    content: '';
    background: #64738c;
  }
`;

export const GeneratorHeader = styled.div`
  position: relative;
  display: flex;
  margin-bottom: 0.75rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 560px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const GeneratorTitle = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.65rem;

  > span {
    min-width: 0;
  }

  strong,
  small {
    display: block;
  }

  strong {
    color: var(--text-primary);
    font-size: 1.08rem;
    font-weight: 850;
  }

  small {
    color: #c2c8d3;
    font-size: 0.78rem;
    line-height: 1.45;
  }
`;

export const GeneratorIcon = styled.span`
  display: grid;
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  place-items: center;
  color: #f4f5f7;
  background: #364052;
  border: 1px solid #687994;
  border-radius: 11px;
  box-shadow: 0 3px 0 #1b2029;
`;

export const GeneratorBadge = styled.span`
  display: flex;
  min-width: 84px;
  padding: 0.35rem 0.55rem;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #c0c8d5;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  background: #2d3441;
  border: 1px solid #59667d;
  border-radius: 12px;

  strong {
    color: #fffaf1;
    font-size: 0.9rem;
    letter-spacing: normal;
  }
`;

export const GeneratorControls = styled.div`
  position: relative;
  display: grid;
  grid-template-columns:
    minmax(135px, 0.65fr)
    minmax(145px, 0.7fr)
    minmax(190px, 1.25fr)
    auto;
  gap: 0.55rem;
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
  color: #c7ceda;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
`;

export const ControlSelect = styled.select`
  appearance: none;
  width: 100%;
  min-height: 40px;
  padding: 0.45rem 2rem 0.45rem 0.65rem;
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: normal;
  text-transform: none;
  background-color: #2d3441;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5l5-5' fill='none' stroke='%23c7ceda' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.65rem center;
  background-size: 12px 8px;
  border: 2px solid #59667d;
  border-radius: 14px;

  &:focus-visible {
    outline: 3px solid rgba(128, 151, 190, 0.22);
    outline-offset: 1px;
    border-color: #8097be;
  }

  @media (max-width: 700px) {
    min-height: 44px;
    padding-top: 0.55rem;
    padding-bottom: 0.55rem;
  }
`;

export const GeneratorRestrictions = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.45rem;
  margin: 0.55rem 0 0;
  padding: 0.55rem 0 0;
  border: 0;
  border-top: 1px solid #3f495a;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

export const GeneratorRestrictionsTitle = styled.div`
  display: flex;
  grid-column: 1 / -1;
  min-width: 0;
  margin-bottom: 0;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  color: #e6e9ee;
  font-size: 0.78rem;
  font-weight: 850;

  small {
    color: #aeb7c5;
    font-size: 0.68rem;
    font-weight: 600;
    line-height: 1.35;
    text-align: right;
  }

  @media (max-width: 820px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.15rem;

    small {
      text-align: left;
    }
  }
`;

export const GeneratorRestriction = styled.label`
  display: flex;
  min-width: 0;
  min-height: 38px;
  padding: 0.4rem 0.55rem;
  align-items: center;
  gap: 0.45rem;
  color: #d8dde5;
  background: #29313e;
  border: 1px solid #4d5a70;
  border-radius: 11px;
  cursor: pointer;

  input {
    width: 1rem;
    height: 1rem;
    margin: 0;
    flex: 0 0 1rem;
    accent-color: #d5a43c;
  }

  strong {
    font-size: 0.75rem;
  }

  &:has(input:focus-visible) {
    outline: 3px solid rgba(128, 151, 190, 0.22);
    outline-offset: 1px;
    border-color: #8097be;
  }
`;

export const PresetPanel = styled.section`
  display: grid;
  grid-template-columns: minmax(190px, 0.65fr) minmax(250px, 1fr);
  gap: 0.65rem 0.8rem;
  max-width: 1180px;
  margin: 0 auto 1rem;
  padding: 0.85rem;
  background: #25353b;
  border: 1px solid #425e66;
  border-radius: 18px;
  box-shadow:
    0 4px 0 #172327,
    0 14px 28px rgba(0, 0, 0, 0.18);

  ${ControlField} {
    color: #bdcdd0;
  }

  ${ControlSelect} {
    background-color: #1f2d32;
    border-color: #405b63;

    &:focus-visible {
      outline-color: rgba(115, 162, 170, 0.22);
      border-color: #73a2aa;
    }
  }

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
    color: #bdcdd0;
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
  gap: 0.45rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const PresetMetaItem = styled.div`
  min-width: 0;
  padding: 0.48rem 0.6rem;
  background: #1f2d32;
  border: 1px solid #405b63;
  border-radius: 12px;

  span,
  strong {
    display: block;
  }

  span {
    margin-bottom: 0.15rem;
    color: #b9c9cd;
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
  min-height: 260px;
  padding: 0.85rem;
  overflow: hidden;
  border: 1px solid ${({ $selected }) => ($selected ? '#7d848e' : '#4c525b')};
  border-radius: 16px;
  background: #1f2227;
  box-shadow:
    0 4px 0 #15171a,
    0 14px 28px rgba(0, 0, 0, 0.16);

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: ${({ $selected }) => ($selected ? '100%' : '58px')};
    height: 5px;
    content: '';
    background: #626973;
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

export const SlotHeading = styled.div`
  display: flex;
  min-height: 32px;
  padding-right: 9.5rem;
  align-items: center;
  gap: 0.5rem;
`;

export const SlotLabel = styled.span`
  display: block;
  color: #c2c6cd;
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
  align-items: center;
  background: #3a3324;
  border: 1px solid #75623c;
  border-radius: 18px;
  box-shadow: 0 4px 0 #211c13;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const PickerHeader = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;

  strong {
    color: #fff3d7;
    font-size: 1rem;
    font-weight: 850;
  }
`;

export const PickerHint = styled.span`
  color: #d8c9a7;
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

export const RecommendationPanel = styled.div`
  display: flex;
  grid-column: 1 / -1;
  align-items: center;
  gap: 0.65rem;

  > span {
    flex: 0 0 auto;
    color: #d8c9a7;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  @media (max-width: 700px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const RecommendationList = styled.div`
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

export const RecommendationButton = styled.button`
  display: flex;
  min-height: 36px;
  padding: 0.35rem 0.55rem;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  color: #fff3d7;
  background: #2d281e;
  border: 1px solid #78643c;
  border-radius: 10px;
  cursor: pointer;

  strong,
  small {
    display: block;
  }

  strong {
    font-size: 0.72rem;
  }

  small {
    color: #d8c9a7;
    font-size: 0.61rem;
  }

  &:hover:not(:disabled) {
    background: #453a24;
    border-color: #d9ad4e;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }

  &:focus-visible {
    outline: 3px solid rgba(229, 185, 86, 0.24);
    outline-offset: 2px;
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
  background: #2d281e;
  border: 2px solid #78643c;
  border-radius: 14px;

  &:focus-visible {
    outline: 3px solid rgba(229, 185, 86, 0.18);
    outline-offset: 1px;
    border-color: #d9ad4e;
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
  background: #2d281e;
  border: 1px solid #78643c;
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
    $active ? 'rgba(217, 173, 78, 0.24)' : 'transparent'};
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: rgba(217, 173, 78, 0.24);
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
  background: #2d281e;
  border: 1px solid #78643c;
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
  position: relative;
  min-height: 1.25rem;
  margin: 0.7rem 0 0;
  color: #c2c6cd;
  font-size: 0.76rem;

  &:empty {
    display: none;
  }
`;

export const LoadingSpinner = styled.span`
  display: inline-block;
  width: 0.9rem;
  height: 0.9rem;
  flex: 0 0 0.9rem;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 1.6s;
  }
`;

export const PokemonImage = styled.img`
  display: block;
  width: min(100%, 136px);
  height: 136px;
  margin: 0 auto;
  object-fit: contain;
  transition: transform 0.18s ease;
`;

export const PokemonImageLink = styled.a`
  display: block;
  width: fit-content;
  margin: 0.1rem auto 0;
  border-radius: 14px;

  &:hover ${PokemonImage} {
    transform: translateY(-2px) scale(1.025);
  }

  &:focus-visible {
    outline: 3px solid rgba(255, 222, 0, 0.75);
    outline-offset: 3px;
  }
`;

export const ShinyBadge = styled.span`
  display: inline-flex;
  min-height: 24px;
  padding: 0.22rem 0.45rem;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  color: #211600;
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  line-height: 1;
  text-align: center;
  text-transform: uppercase;
  background: linear-gradient(135deg, #ffe36a, #e5a932);
  border: 1px solid #fff0a8;
  border-radius: 999px;
  box-shadow: 0 2px 8px rgba(229, 169, 50, 0.35);
`;

export const PokemonName = styled.h2`
  margin: 0.05rem 0 0.35rem;
  font-size: 1.15rem;
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
  grid-template-columns: repeat(2, minmax(0, 102px));
  justify-content: center;
  gap: 0.35rem;

  > :only-child {
    grid-column: 1 / -1;
    width: 102px;
    justify-self: center;
  }
`;

export const TeamTypeBadge = styled.span<{ $color: string }>`
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  min-height: 34px;
  padding: 0.25rem 0.4rem;
  align-items: center;
  gap: 0.35rem;
  background: #272b31;
  border: 1px solid #454b54;
  border-left: 4px solid ${({ $color }) => $color};
  border-radius: 10px;
`;

export const TeamTypeIcon = styled.img`
  width: 22px;
  height: 22px;
`;

export const TeamTypeName = styled.strong`
  overflow: hidden;
  color: #fffaf1;
  font-size: 0.68rem;
  font-weight: 850;
  text-overflow: ellipsis;
`;

export const CompetitiveDetails = styled.details`
  margin-top: 0.6rem;
  padding: 0.5rem 0.55rem;
  color: var(--text-primary);
  background: #272b31;
  border: 1px solid #454b54;
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
    background: #202328;
    border-radius: 8px;
  }
`;

export const EmptySlot = styled.p`
  display: flex;
  min-height: 207px;
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
    $selected ? '#34383f' : '#272b31'};
  border: 2px dashed ${({ $selected }) => ($selected ? '#7d848e' : '#4c525b')};
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
    color: #a4a9b1;
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
    background: #34383f;
    border-color: #747b85;
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid rgba(255, 222, 0, 0.75);
    outline-offset: 3px;
  }
`;

export const ErrorText = styled.p`
  grid-column: 2;
  margin: -0.35rem 0 0;
  color: #ff8799;
  font-size: 0.85rem;

  @media (max-width: 700px) {
    grid-column: 1;
  }
`;

export const CardControls = styled.div`
  position: absolute;
  z-index: 2;
  top: 0.55rem;
  right: 0.55rem;
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
  background: #272b31;
  border: 1px solid #454b54;
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
  background: #302735;
  border: 1px solid #604f68;
  border-radius: 22px;
  box-shadow:
    0 4px 0 #201923,
    0 14px 28px rgba(0, 0, 0, 0.16);

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 72px;
    height: 5px;
    content: '';
    background: #9370a0;
    border-radius: 0 0 8px 0;
  }
`;

export const AnalysisTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin: 0 0 0.35rem;
  color: #f1e9f3;
  font-size: 1.2rem;
  font-weight: 800;

  &::before {
    width: 28px;
    height: 4px;
    content: '';
    background: #9370a0;
    border-radius: 999px;
    box-shadow: 0 2px 0 #533b5b;
  }
`;

export const AnalysisHint = styled.p`
  color: #cabfd0;
`;

export const CoverageRow = styled.section`
  display: grid;
  grid-template-columns: minmax(170px, 230px) 1fr;
  gap: 1.5rem;
  padding: 1.5rem 0;
  border-top: 1px solid rgba(207, 185, 216, 0.16);

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
  color: #cabfd0;
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
  background: #3a3040;
  border: 1px solid #594b60;
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
  background: #291f2e;
  border: 1px solid #594b60;
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
  color: #c3b5c9;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.02em;
`;

export const EmptySummary = styled.p`
  margin: 0;
  color: #c3b5c9;
  font-size: 0.9rem;
`;
