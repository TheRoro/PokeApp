export type AdventureRestrictions = {
  noDlc: boolean;
  noTrades: boolean;
  noVersionExclusives: boolean;
};

export const DEFAULT_ADVENTURE_RESTRICTIONS: AdventureRestrictions = {
  noDlc: true,
  noTrades: true,
  noVersionExclusives: true,
};
