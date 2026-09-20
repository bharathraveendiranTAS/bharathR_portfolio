export interface ProductItem {
  id: string;
  stageIndex: number;
  category: string;
  kanjiCategory: string;
  title: string;
  subtitle: string;
  description: string;
  specs: {
    scaleOrFormat: string;
    material: string;
    editionLimit: string;
    chakraAffinity: string;
    price: string;
    dimensions: string;
  };
  rarityBadge: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
}

export interface ShowcaseAudioEngine {
  isSupported: boolean;
  soundEnabled: boolean;
  toggleSound: () => void;
  playKunaiTap: () => void;
  playPaperRustle: () => void;
  playChakraHum: () => void;
  playSealActivate: () => void;
  onScrollVelocity: (velocity: number) => void;
}
