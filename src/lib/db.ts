import Dexie, { type Table } from 'dexie';
import { State, type Card as FSRSCard, type Rating } from 'ts-fsrs';

export interface Word {
  id: string;
  term: string;
  ipa?: string;
  meaningKo: string;
  partOfSpeech?: 'noun' | 'verb' | 'phrasal-verb' | 'phrase' | 'slang' | 'idiom' | 'adjective';
  audioUrl?: string;
  imageUrl?: string;
  examples: { en: string; ko: string }[];
  tags: string[];
  frequency: number;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  scenarioOrder: number;
  estimatedHours: number;
  wordIds: string[];
}

export type Disposition = 'mastered' | 'skipped';

export interface ReviewCard {
  id: string;
  due: Date;
  stability: number;
  difficulty: number;
  scheduled_days: number;
  learning_steps: number;
  reps: number;
  lapses: number;
  state: State;
  last_review?: Date;
  firstSeenAt: number;
  lastReviewedAt?: number;
  totalReviews: number;
  /** 사용자가 큐에서 제외한 처분 상태. 미정의 = 정상 학습. */
  disposition?: Disposition;
}

export interface ReviewLog {
  id?: number;
  cardId: string;
  rating: Rating;
  reviewedAt: number;
  durationMs: number;
  scheduledDays: number;
  prevState: State;
}

export interface StudyPlan {
  id: 'main';
  /** 사용자가 정한 목표 라벨. 빈 문자열이면 미설정. */
  goalLabel: string;
  /** 학습 시작일. */
  startedAt: number;
  /** 선택적 목표일(타임스탬프). 설정 안 하면 D-day 표시 X, DAY N 카운트업. */
  targetDate?: number;
}

export interface UserSettings {
  id: 'me';
  dailyNewCards: number;
  dailyReviewCap: number;
  /** @deprecated 단어 카드의 호주/영국/미국 버튼을 직접 누르는 방식으로 대체됨. 호환을 위해 남겨둠. */
  preferredVoice?: 'en-AU' | 'en-GB' | 'en-US';
  notifyAt?: string;
  fsrsParams?: number[];
}

export class VocaVocaDB extends Dexie {
  words!: Table<Word, string>;
  decks!: Table<Deck, string>;
  cards!: Table<ReviewCard, string>;
  logs!: Table<ReviewLog, number>;
  plans!: Table<StudyPlan, 'main'>;
  settings!: Table<UserSettings, 'me'>;

  constructor() {
    super('vocavoca');
    this.version(1).stores({
      words: 'id, *tags, frequency',
      decks: 'id, scenarioOrder',
      cards: 'id, due, state, lastReviewedAt',
      logs: '++id, cardId, reviewedAt',
      plans: 'id',
      settings: 'id',
    });
  }
}

let _db: VocaVocaDB | null = null;
export function getDb(): VocaVocaDB {
  if (typeof window === 'undefined') {
    throw new Error('VocaVocaDB is browser-only — call inside client components or effects');
  }
  if (!_db) _db = new VocaVocaDB();
  return _db;
}

export function toFSRSCard(card: ReviewCard): FSRSCard {
  return {
    due: card.due,
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: 0,
    scheduled_days: card.scheduled_days,
    learning_steps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    last_review: card.last_review,
  };
}

export function fromFSRSCard(
  id: string,
  c: FSRSCard,
  meta: { firstSeenAt: number; totalReviews: number; lastReviewedAt?: number },
): ReviewCard {
  return {
    id,
    due: c.due,
    stability: c.stability,
    difficulty: c.difficulty,
    scheduled_days: c.scheduled_days,
    learning_steps: c.learning_steps,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state,
    last_review: c.last_review,
    firstSeenAt: meta.firstSeenAt,
    lastReviewedAt: meta.lastReviewedAt,
    totalReviews: meta.totalReviews,
  };
}
