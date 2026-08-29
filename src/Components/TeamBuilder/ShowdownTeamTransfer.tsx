import React, { useEffect, useState } from 'react';
import { FaCopy, FaFileImport } from 'react-icons/fa';
import { PersistedTeamMember } from './teamPersistence';
import { TeamPokemon } from './teamAnalysis';
import {
  exportShowdownTeam,
  importShowdownTeam,
  ShowdownFormatError,
} from './showdownFormat';
import {
  ShowdownActions,
  ShowdownHint,
  ShowdownMessage,
  ShowdownPanel,
  ShowdownSummary,
  ShowdownTextarea,
  UtilityButton,
} from './TeamBuilderStyles';

type Props = {
  disabled: boolean;
  team: TeamPokemon[];
  onImport: (members: PersistedTeamMember[]) => void;
};

const ShowdownTeamTransfer: React.FC<Props> = ({
  disabled,
  team,
  onImport,
}) => {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setText(exportShowdownTeam(team));
    setMessage('');
    setIsError(false);
  }, [team]);

  const importTeam = () => {
    try {
      const members = importShowdownTeam(text);
      onImport(members);
      setIsError(false);
      setMessage(
        `${members.length} Pokémon queued for import from Pokémon Showdown.`,
      );
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof ShowdownFormatError
          ? error.message
          : 'The Pokémon Showdown team could not be imported.',
      );
    }
  };

  const exportTeam = async () => {
    const exported = exportShowdownTeam(team);
    setText(exported);
    setIsError(false);
    try {
      await navigator.clipboard.writeText(exported);
      setMessage('Pokémon Showdown team copied to your clipboard.');
    } catch {
      setMessage('Pokémon Showdown text is ready to copy.');
    }
  };

  return (
    <ShowdownPanel>
      <ShowdownSummary>Pokémon Showdown import and export</ShowdownSummary>
      <ShowdownHint>
        Paste a standard Showdown export to replace the roster, or copy the
        current team for use in Showdown.
      </ShowdownHint>
      <label htmlFor="showdown-team-text">Showdown team text</label>
      <ShowdownTextarea
        id="showdown-team-text"
        value={text}
        disabled={disabled}
        placeholder={'Pikachu @ Light Ball\nAbility: Static\n...'}
        spellCheck={false}
        onChange={event => {
          setText(event.target.value);
          if (message) setMessage('');
        }}
      />
      <ShowdownActions>
        <UtilityButton
          type="button"
          disabled={disabled || text.trim().length === 0}
          onClick={importTeam}
        >
          <FaFileImport aria-hidden="true" /> Import team
        </UtilityButton>
        <UtilityButton
          type="button"
          disabled={disabled || team.length === 0}
          onClick={() => void exportTeam()}
        >
          <FaCopy aria-hidden="true" /> Copy export
        </UtilityButton>
      </ShowdownActions>
      <ShowdownMessage $error={isError} aria-live="polite">
        {message}
      </ShowdownMessage>
    </ShowdownPanel>
  );
};

export default ShowdownTeamTransfer;
