import React, { useMemo, useState } from 'react';
import {
  ControlField,
  ControlSelect,
  GenerateButton,
  PresetActions,
  PresetLink,
  PresetMeta,
  PresetMetaItem,
  PresetPanel,
} from './TeamBuilderStyles';
import { VGC_TEAM_PRESETS, VgcTeamPreset } from './vgcTeamPresets';

type Props = {
  disabled: boolean;
  onLoad: (preset: VgcTeamPreset) => void;
};

const VgcTeamPresetLoader: React.FC<Props> = ({ disabled, onLoad }) => {
  const [selectedId, setSelectedId] = useState(VGC_TEAM_PRESETS[0].id);
  const selectedPreset = useMemo(
    () =>
      VGC_TEAM_PRESETS.find(preset => preset.id === selectedId) ??
      VGC_TEAM_PRESETS[0],
    [selectedId],
  );

  return (
    <PresetPanel>
      <div>
        <strong>Historical VGC teams</strong>
        <span>
          Load a documented tournament roster with its original competitive
          sets. World Champions are included when complete published spreads
          can be verified.
        </span>
      </div>
      <ControlField>
        Team
        <ControlSelect
          aria-label="Historical VGC team"
          value={selectedPreset.id}
          onChange={event => setSelectedId(event.target.value)}
        >
          {VGC_TEAM_PRESETS.map(preset => (
            <option value={preset.id} key={preset.id}>
              {preset.title} · {preset.player}
            </option>
          ))}
        </ControlSelect>
      </ControlField>
      <PresetMeta aria-label="Selected VGC team details">
        <PresetMetaItem>
          <span>Player</span>
          <strong>{selectedPreset.player}</strong>
        </PresetMetaItem>
        <PresetMetaItem>
          <span>Event</span>
          <strong>{selectedPreset.event}</strong>
        </PresetMetaItem>
        <PresetMetaItem>
          <span>Result</span>
          <strong>{selectedPreset.placing}</strong>
        </PresetMetaItem>
        <PresetMetaItem>
          <span>Format</span>
          <strong>{selectedPreset.format}</strong>
        </PresetMetaItem>
        <PresetMetaItem>
          <span>Mechanic</span>
          <strong>{selectedPreset.mechanic}</strong>
        </PresetMetaItem>
      </PresetMeta>
      <PresetActions>
        <PresetLink
          href={selectedPreset.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          Team report
        </PresetLink>
        {selectedPreset.pasteUrl && (
          <PresetLink
            href={selectedPreset.pasteUrl}
            target="_blank"
            rel="noreferrer"
          >
            Team data
          </PresetLink>
        )}
        <GenerateButton
          type="button"
          disabled={disabled}
          onClick={() => onLoad(selectedPreset)}
        >
          Load full team
        </GenerateButton>
      </PresetActions>
    </PresetPanel>
  );
};

export default VgcTeamPresetLoader;
