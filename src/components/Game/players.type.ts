export enum PlayerableCharacters {
  Shinobi = 'Shinobi',
  Samurai = 'Samurai',
  Fighter = 'Fighter',
}

export enum Actions {
  Idle = 'Idle',
  Walk = 'Walk',
  Attack = 'Attack',
  Dead = 'Dead',
  Jump = 'Jump',
  Run = 'Run',
  Shield = 'Shield',
  Hurt = 'Hurt',
}

export interface CharacterActions {
  [PlayerableCharacters.Shinobi]: Actions[];
  [PlayerableCharacters.Samurai]: Actions[];
  [PlayerableCharacters.Fighter]: Actions[];
}
