// Built-in reference drinks. Read-only — users can't edit or delete these,
// only add their own presets alongside them (see PresetsContext).
export const BUILT_IN_PRESETS = [
  { id: 'b1', name: 'Lager', category: 'beer', calories: 150, abv: 4.5, isCustom: false },
  { id: 'b2', name: 'IPA', category: 'beer', calories: 210, abv: 6.5, isCustom: false },
  { id: 'b3', name: 'Stout', category: 'beer', calories: 210, abv: 5.0, isCustom: false },
  { id: 'b4', name: 'Wheat beer', category: 'beer', calories: 155, abv: 5.0, isCustom: false },

  { id: 'w1', name: 'Red wine', category: 'wine', calories: 125, abv: 13, isCustom: false },
  { id: 'w2', name: 'White wine', category: 'wine', calories: 120, abv: 12, isCustom: false },
  { id: 'w3', name: 'Rosé', category: 'wine', calories: 120, abv: 12, isCustom: false },
  { id: 'w4', name: 'Sparkling wine', category: 'wine', calories: 95, abv: 12, isCustom: false },

  { id: 'c1', name: 'Margarita', category: 'cocktail', calories: 170, abv: 15, isCustom: false },
  { id: 'c2', name: 'Mojito', category: 'cocktail', calories: 145, abv: 10, isCustom: false },
  { id: 'c3', name: 'Old fashioned', category: 'cocktail', calories: 180, abv: 32, isCustom: false },
  { id: 'c4', name: 'Vodka soda', category: 'spirit', calories: 100, abv: 12, isCustom: false },
  { id: 'c5', name: 'Whiskey shot', category: 'spirit', calories: 105, abv: 40, isCustom: false },

  { id: 'j1', name: 'Orange juice', category: 'other', calories: 110, abv: null, isCustom: false },
  { id: 'j2', name: 'Iced tea', category: 'other', calories: 90, abv: null, isCustom: false },
  { id: 'j3', name: 'Soda', category: 'other', calories: 140, abv: null, isCustom: false },
];

export const CATEGORIES = ['beer', 'wine', 'cocktail', 'spirit', 'other'];
