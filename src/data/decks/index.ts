import type { Deck, Word } from '@/lib/db';
import { cafeDeck } from './cafe';
import { hostelDeck } from './hostel';
import { dailyDeck } from './daily';

export interface DeckBundle {
  deck: Deck;
  words: Word[];
}

export const allDecks: DeckBundle[] = [cafeDeck, hostelDeck, dailyDeck];
