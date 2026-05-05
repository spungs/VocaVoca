import type { Deck, Word } from '@/lib/db';

/**
 * 호주 슬랭 종합 덱.
 * 다른 시나리오 덱에 분산돼 있던 슬랭 외에, 일반적인 호주 회화에서
 * 친구·동료·이웃과의 대화에 색을 입히는 표현을 모음.
 * 알아듣기는 쉽지만 외국인이 직접 쓰면 어색한 단어도 포함 — 듣기 우선.
 */

const words: Word[] = [
  // ── 사람 / 캐릭터 (9) ──
  {
    id: 'slang-bloke',
    term: 'bloke',
    ipa: '/bloʊk/',
    meaningKo: '남자 / 사내. mate보다 약간 거리감, "a bloke" 형태.',
    partOfSpeech: 'slang',
    examples: [
      { en: "He's a good bloke.", ko: '걘 좋은 사람이야.' },
    ],
    tags: ['slang', 'people', 'aussie'],
    frequency: 88,
  },
  {
    id: 'slang-sheila',
    term: 'sheila',
    ipa: '/ˈʃiːlə/',
    meaningKo: '여자 (옛날 슬랭). 요즘은 약간 구식·연배 있는 사람이 씀.',
    partOfSpeech: 'slang',
    examples: [
      { en: 'A few sheilas at the pub.', ko: '펍에 여자 몇 명 있더라.' },
    ],
    tags: ['slang', 'people', 'aussie'],
    frequency: 50,
  },
  {
    id: 'slang-ace',
    term: 'ace',
    meaningKo: '최고 / 대단한 사람·것.',
    partOfSpeech: 'slang',
    examples: [
      { en: 'You did ace, mate.', ko: '진짜 잘했어.' },
    ],
    tags: ['slang', 'aussie'],
    frequency: 60,
  },
  {
    id: 'slang-battler',
    term: 'battler',
    meaningKo: '열심히 살아가는 평범한 사람. 호주 정신의 표상.',
    partOfSpeech: 'slang',
    examples: [
      { en: "He's just a Aussie battler.", ko: '걍 평범하게 열심히 사는 호주 아저씨야.' },
    ],
    tags: ['slang', 'people', 'aussie'],
    frequency: 55,
  },
  {
    id: 'slang-larrikin',
    term: 'larrikin',
    ipa: '/ˈlærɪkɪn/',
    meaningKo: '재미있고 장난기 많은 사람. 호주에선 칭찬에 가까움.',
    partOfSpeech: 'slang',
    examples: [
      { en: "He's a bit of a larrikin.", ko: '걘 좀 장난꾸러기야.' },
    ],
    tags: ['slang', 'people', 'aussie'],
    frequency: 55,
  },
  {
    id: 'slang-digger',
    term: 'digger',
    meaningKo: '호주 군인 / 친구. 1차 대전 호주 군인을 지칭한 데서 옴.',
    partOfSpeech: 'slang',
    examples: [
      { en: "G'day, digger.", ko: '안녕, 친구.' },
    ],
    tags: ['slang', 'people', 'aussie'],
    frequency: 45,
  },
  {
    id: 'slang-dag',
    term: 'dag',
    meaningKo: '구식이거나 조금 어수룩한 사람. 친근한 비웃음.',
    partOfSpeech: 'slang',
    examples: [
      { en: "You're such a dag.", ko: '너 진짜 어수룩하네.' },
    ],
    tags: ['slang', 'people', 'aussie'],
    frequency: 50,
  },
  {
    id: 'slang-drongo',
    term: 'drongo',
    ipa: '/ˈdrɒŋɡoʊ/',
    meaningKo: '바보 / 멍청이. 가벼운 비난.',
    partOfSpeech: 'slang',
    examples: [
      { en: "What a drongo!", ko: '진짜 바보네!' },
    ],
    tags: ['slang', 'people', 'aussie'],
    frequency: 50,
  },
  {
    id: 'slang-ranga',
    term: 'ranga',
    ipa: '/ˈræŋɡə/',
    meaningKo: '빨강머리 사람. orangutan에서 유래, 친근한 별명.',
    partOfSpeech: 'slang',
    examples: [
      { en: "Ed Sheeran is a famous ranga.", ko: '에드 시런이 유명한 빨강머리야.' },
    ],
    tags: ['slang', 'people', 'aussie'],
    frequency: 45,
  },

  // ── 감정 / 상태 (10) ──
  {
    id: 'slang-rapt',
    term: 'rapt',
    ipa: '/ræpt/',
    meaningKo: '정말 기쁜 / 황홀한.',
    partOfSpeech: 'adjective',
    examples: [
      { en: "I'm rapt with the result.", ko: '결과에 정말 만족해.' },
    ],
    tags: ['slang', 'emotion', 'aussie'],
    frequency: 60,
  },
  {
    id: 'slang-spewing',
    term: 'spewing',
    meaningKo: '엄청 열받은 / 화난.',
    partOfSpeech: 'slang',
    examples: [
      { en: "I'm spewing about it.", ko: '그것 때문에 진짜 열받았어.' },
    ],
    tags: ['slang', 'emotion', 'aussie'],
    frequency: 60,
  },
  {
    id: 'slang-ropable',
    term: 'ropable',
    ipa: '/ˈroʊpəbəl/',
    meaningKo: '격노한 / 묶어둬야 할 만큼 화난.',
    partOfSpeech: 'adjective',
    examples: [
      { en: 'The boss was ropable.', ko: '사장이 진짜 화났어.' },
    ],
    tags: ['slang', 'emotion', 'aussie'],
    frequency: 45,
  },
  {
    id: 'slang-chuffed',
    term: 'chuffed',
    ipa: '/tʃʌft/',
    meaningKo: '뿌듯한 / 기쁜.',
    partOfSpeech: 'adjective',
    examples: [
      { en: "I'm chuffed with the news.", ko: '소식 듣고 기뻐.' },
    ],
    tags: ['slang', 'emotion', 'aussie'],
    frequency: 55,
  },
  {
    id: 'slang-pissed',
    term: 'pissed',
    meaningKo: '취한 (호주식). 미국식은 "화난"이라 헷갈림 주의.',
    partOfSpeech: 'slang',
    examples: [
      { en: 'He got pissed on Saturday.', ko: '걔 토요일에 술 취했어.' },
    ],
    tags: ['slang', 'emotion', 'aussie'],
    frequency: 70,
  },
  {
    id: 'slang-on-edge',
    term: 'on edge',
    meaningKo: '예민한 / 긴장한.',
    partOfSpeech: 'idiom',
    examples: [
      { en: "I've been on edge all day.", ko: '하루 종일 예민해 있어.' },
    ],
    tags: ['slang', 'emotion'],
    frequency: 55,
  },
  {
    id: 'slang-beat',
    term: 'beat',
    meaningKo: '완전히 지친. (= knackered, stuffed)',
    partOfSpeech: 'adjective',
    examples: [
      { en: "I'm beat after that shift.", ko: '근무 끝나고 완전 지쳤어.' },
    ],
    tags: ['slang', 'emotion'],
    frequency: 65,
  },
  {
    id: 'slang-gutted',
    term: 'gutted',
    meaningKo: '실망한 / 망연자실한.',
    partOfSpeech: 'adjective',
    examples: [
      { en: "I'm gutted we lost.", ko: '져서 진짜 슬퍼.' },
    ],
    tags: ['slang', 'emotion', 'aussie'],
    frequency: 60,
  },
  {
    id: 'slang-pumped',
    term: 'pumped',
    meaningKo: '들뜬 / 신나는.',
    partOfSpeech: 'adjective',
    examples: [
      { en: "I'm pumped for the trip.", ko: '여행 가는 거 신나.' },
    ],
    tags: ['slang', 'emotion'],
    frequency: 65,
  },
  {
    id: 'slang-stoked',
    term: 'stoked',
    meaningKo: '엄청 신난 / 만족한. 서핑 문화에서 출발.',
    partOfSpeech: 'adjective',
    examples: [
      { en: "I'm stoked you came!", ko: '와줘서 정말 기뻐!' },
    ],
    tags: ['slang', 'emotion', 'aussie'],
    frequency: 75,
  },

  // ── 일상 행동 (11) ──
  {
    id: 'slang-chuck-a-sickie',
    term: 'chuck a sickie',
    meaningKo: '꾀병으로 결근. 호주 직장 클래식.',
    partOfSpeech: 'idiom',
    examples: [
      { en: "I'm chucking a sickie tomorrow.", ko: '내일 꾀병 부려야지.' },
    ],
    tags: ['slang', 'action', 'work', 'aussie'],
    frequency: 65,
  },
  {
    id: 'slang-chuck-a-uy',
    term: 'chuck a U-y',
    meaningKo: '유턴하다 (chuck a u-turn 줄임).',
    partOfSpeech: 'idiom',
    examples: [
      { en: "Chuck a U-y here.", ko: '여기서 유턴해.' },
    ],
    tags: ['slang', 'action', 'driving', 'aussie'],
    frequency: 50,
  },
  {
    id: 'slang-have-a-yarn',
    term: 'have a yarn',
    meaningKo: '수다 떨다 / 길게 대화하다.',
    partOfSpeech: 'idiom',
    examples: [
      { en: "Pop in for a yarn.", ko: '들러서 수다 떨자.' },
    ],
    tags: ['slang', 'action', 'aussie'],
    frequency: 55,
  },
  {
    id: 'slang-spit-the-dummy',
    term: 'spit the dummy',
    meaningKo: '성질 부리다 / 어른답지 못하게 굴다. (dummy = 공갈 젖꼭지)',
    partOfSpeech: 'idiom',
    examples: [
      { en: "Don't spit the dummy.", ko: '성질 좀 부리지 마.' },
    ],
    tags: ['slang', 'action', 'aussie'],
    frequency: 50,
  },
  {
    id: 'slang-get-crook',
    term: 'get crook',
    meaningKo: '아프다 / 병나다.',
    partOfSpeech: 'idiom',
    examples: [
      { en: 'I got crook last week.', ko: '지난주 아팠어.' },
    ],
    tags: ['slang', 'action', 'medical', 'aussie'],
    frequency: 55,
  },
  {
    id: 'slang-carry-on',
    term: 'carry on',
    meaningKo: '난리치다 / 호들갑 떨다. (cf. crack on = 시작하다)',
    partOfSpeech: 'phrasal-verb',
    examples: [
      { en: "Stop carrying on, mate.", ko: '난리 좀 치지 마.' },
    ],
    tags: ['slang', 'action', 'aussie'],
    frequency: 60,
  },
  {
    id: 'slang-give-it-a-burl',
    term: 'give it a burl',
    meaningKo: '한번 시도해보다. (= give it a go의 호주식)',
    partOfSpeech: 'idiom',
    examples: [
      { en: "Give it a burl, mate.", ko: '한번 해봐.' },
    ],
    tags: ['slang', 'action', 'aussie'],
    frequency: 50,
  },
  {
    id: 'slang-fang-it',
    term: 'fang it',
    meaningKo: '빠르게 가다 / 속도 내다.',
    partOfSpeech: 'idiom',
    examples: [
      { en: "We had to fang it to make it on time.", ko: '시간 맞추려고 빨리 갔어.' },
    ],
    tags: ['slang', 'action', 'driving', 'aussie'],
    frequency: 50,
  },
  {
    id: 'slang-bail',
    term: 'bail',
    meaningKo: '떠나다 / 약속 취소하다.',
    partOfSpeech: 'verb',
    examples: [
      { en: "I'm gonna bail early.", ko: '나 일찍 빠질게.' },
    ],
    tags: ['slang', 'action'],
    frequency: 75,
  },
  {
    id: 'slang-walkabout',
    term: 'walkabout',
    ipa: '/ˈwɔːkəbaʊt/',
    meaningKo: '잠시 떠나다 / 사라지다. 원주민 어원, 일상에선 "사람이 안 보임".',
    partOfSpeech: 'noun',
    examples: [
      { en: 'My phone has gone walkabout.', ko: '내 폰 어디 갔는지 모르겠어.' },
    ],
    tags: ['slang', 'action', 'aussie'],
    frequency: 50,
  },
  {
    id: 'slang-knock-back',
    term: 'knock back',
    meaningKo: '거절하다 / 물리치다. (cf. cafe의 knock off = 퇴근하다와 다름)',
    partOfSpeech: 'phrasal-verb',
    examples: [
      { en: 'She knocked back the offer.', ko: '걔 그 제안 거절했어.' },
    ],
    tags: ['slang', 'action', 'aussie'],
    frequency: 60,
  },

  // ── 강조 / 정도 (10) ──
  {
    id: 'slang-bloody',
    term: 'bloody',
    ipa: '/ˈblʌdi/',
    meaningKo: '엄청 / 진짜 (강조). 호주에서 욕설보단 강조어로 자주 씀.',
    partOfSpeech: 'adjective',
    examples: [
      { en: "It's bloody hot today.", ko: '오늘 진짜 더워.' },
    ],
    tags: ['slang', 'aussie'],
    frequency: 90,
  },
  {
    id: 'slang-chockers',
    term: 'chockers',
    meaningKo: '꽉 찬 / 가득 찬. (cf. choc-a-block 변형)',
    partOfSpeech: 'adjective',
    examples: [
      { en: 'The train was chockers.', ko: '기차 꽉 찼었어.' },
    ],
    tags: ['slang', 'aussie'],
    frequency: 55,
  },
  {
    id: 'slang-not-too-shabby',
    term: 'not too shabby',
    meaningKo: '나쁘지 않은 / 꽤 괜찮은.',
    partOfSpeech: 'idiom',
    examples: [
      { en: 'Not too shabby!', ko: '나쁘지 않은데!' },
    ],
    tags: ['slang', 'idiom'],
    frequency: 55,
  },
  {
    id: 'slang-bonzer',
    term: 'bonzer',
    ipa: '/ˈbɒnzər/',
    meaningKo: '훌륭한 / 멋진. 약간 옛스러운 호주식.',
    partOfSpeech: 'adjective',
    examples: [
      { en: "What a bonzer day.", ko: '진짜 멋진 날이네.' },
    ],
    tags: ['slang', 'aussie'],
    frequency: 45,
  },
  {
    id: 'slang-beaut',
    term: 'beaut',
    ipa: '/bjuːt/',
    meaningKo: '예쁜 / 아주 좋은. (= beauty 줄임)',
    partOfSpeech: 'adjective',
    examples: [
      { en: 'A beaut of a sunset.', ko: '아주 멋진 노을이네.' },
    ],
    tags: ['slang', 'aussie'],
    frequency: 50,
  },
  {
    id: 'slang-bloody-oath',
    term: 'bloody oath',
    meaningKo: '진짜야 / 당연하지. 강한 동의.',
    partOfSpeech: 'phrase',
    examples: [
      { en: 'Bloody oath, mate!', ko: '당연하지!' },
    ],
    tags: ['slang', 'aussie'],
    frequency: 55,
  },
  {
    id: 'slang-spot-on',
    term: 'spot on',
    meaningKo: '정확한 / 딱 맞는.',
    partOfSpeech: 'idiom',
    examples: [
      { en: 'Your guess is spot on.', ko: '추측 정확해.' },
    ],
    tags: ['slang', 'idiom'],
    frequency: 70,
  },
  {
    id: 'slang-onya',
    term: 'onya',
    meaningKo: '잘했어! (= good on you 줄임).',
    partOfSpeech: 'phrase',
    examples: [
      { en: "Onya, mate!", ko: '잘했어, 친구!' },
    ],
    tags: ['slang', 'aussie'],
    frequency: 60,
  },
  {
    id: 'slang-fair-enough',
    term: 'fair enough',
    meaningKo: '그럴 만해 / 이해돼. 동의·수용.',
    partOfSpeech: 'phrase',
    examples: [
      { en: 'Fair enough, no problem.', ko: '이해돼, 괜찮아.' },
    ],
    tags: ['slang', 'frozen-phrase'],
    frequency: 80,
  },
  {
    id: 'slang-ridgy-didge',
    term: 'ridgy-didge',
    meaningKo: '진짜의 / 정통의. (= the real deal)',
    partOfSpeech: 'adjective',
    examples: [
      { en: "It's the ridgy-didge stuff.", ko: '진짜 정통이야.' },
    ],
    tags: ['slang', 'aussie'],
    frequency: 40,
  },

  // ── 시간 / 이벤트 (8) ──
  {
    id: 'slang-weekender',
    term: 'weekender',
    meaningKo: '주말여행. 또는 주말용 사람·옷.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Going on a weekender to Byron.', ko: '주말여행 바이런 가.' },
    ],
    tags: ['slang', 'time', 'aussie'],
    frequency: 50,
  },
  {
    id: 'slang-long-weekend',
    term: 'long weekend',
    meaningKo: '긴 주말 (월·금이 공휴일이라 3일 연휴).',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Plans for the long weekend?', ko: '긴 주말 계획 있어?' },
    ],
    tags: ['slang', 'time'],
    frequency: 70,
  },
  {
    id: 'slang-dust-up',
    term: 'dust-up',
    meaningKo: '말다툼 / 작은 싸움.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'They had a bit of a dust-up.', ko: '쟤네 좀 다퉜어.' },
    ],
    tags: ['slang', 'aussie'],
    frequency: 45,
  },
  {
    id: 'slang-sarvo',
    term: "s'arvo",
    meaningKo: '이번 오후 (= this arvo). 카톡식 줄임.',
    partOfSpeech: 'slang',
    examples: [
      { en: "See you s'arvo.", ko: '이따 오후에 봐.' },
    ],
    tags: ['slang', 'time', 'aussie'],
    frequency: 50,
  },
  {
    id: 'slang-all-nighter',
    term: 'all-nighter',
    meaningKo: '밤 새다 / 철야.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'I pulled an all-nighter.', ko: '밤샜어.' },
    ],
    tags: ['slang', 'time'],
    frequency: 55,
  },
  {
    id: 'slang-sparrows-fart',
    term: "sparrow's fart",
    meaningKo: '아주 이른 새벽. (= crack of dawn) 호주식 표현.',
    partOfSpeech: 'idiom',
    examples: [
      { en: 'Up at sparrow’s fart.', ko: '새벽같이 일어났어.' },
    ],
    tags: ['slang', 'time', 'aussie', 'idiom'],
    frequency: 40,
  },
  {
    id: 'slang-sundowner',
    term: 'sundowner',
    meaningKo: '해질녘 한잔. 호주식 음주 전통.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'A sundowner on the deck.', ko: '데크에서 해질녘 한잔.' },
    ],
    tags: ['slang', 'time', 'food', 'aussie'],
    frequency: 50,
  },
  {
    id: 'slang-dawn-patrol',
    term: 'dawn patrol',
    meaningKo: '새벽 서핑 / 이른 아침 활동. 서퍼 슬랭에서.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Dawn patrol at Bondi.', ko: '본다이에서 새벽 서핑.' },
    ],
    tags: ['slang', 'time', 'aussie'],
    frequency: 45,
  },

  // ── 장소 / 지명 (10) ──
  {
    id: 'slang-straya',
    term: 'Straya',
    ipa: '/ˈstreɪə/',
    meaningKo: '호주 (Australia 줄임). 자조·애정 섞인 표현.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Welcome to Straya!', ko: '호주에 온 걸 환영!' },
    ],
    tags: ['slang', 'place', 'aussie'],
    frequency: 60,
  },
  {
    id: 'slang-tassie',
    term: 'Tassie',
    ipa: '/ˈtæzi/',
    meaningKo: '태즈매니아. 체리 시즌·관광지로 인기.',
    partOfSpeech: 'noun',
    examples: [
      { en: "I'm flying to Tassie.", ko: '태즈매니아 가.' },
    ],
    tags: ['slang', 'place', 'aussie'],
    frequency: 65,
  },
  {
    id: 'slang-brizzy',
    term: 'Brizzy',
    meaningKo: '브리즈번. (= Brisbane)',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Brizzy is warm year-round.', ko: '브리즈번은 1년 내내 따뜻해.' },
    ],
    tags: ['slang', 'place', 'aussie'],
    frequency: 55,
  },
  {
    id: 'slang-melbs',
    term: 'Melbs',
    meaningKo: '멜번. (= Melbourne)',
    partOfSpeech: 'noun',
    examples: [
      { en: "Melbs has the best coffee.", ko: '멜번 커피가 최고야.' },
    ],
    tags: ['slang', 'place', 'aussie'],
    frequency: 55,
  },
  {
    id: 'slang-the-west',
    term: 'the West',
    meaningKo: '서호주 (WA). 퍼스 중심 광활한 지역.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Driving across to the West.', ko: '서호주로 횡단 운전 가.' },
    ],
    tags: ['slang', 'place', 'aussie'],
    frequency: 50,
  },
  {
    id: 'slang-top-end',
    term: 'the Top End',
    meaningKo: 'NT 북단 (다윈 일대). 망고 시즌·우기 유명.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Wet season in the Top End.', ko: '톱엔드 우기야.' },
    ],
    tags: ['slang', 'place', 'aussie'],
    frequency: 50,
  },
  {
    id: 'slang-outback',
    term: 'Outback',
    ipa: '/ˈaʊtbæk/',
    meaningKo: '오지 / 호주 내륙. 사막·초원 광범위.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Roadtrip through the Outback.', ko: '오지로 로드트립.' },
    ],
    tags: ['slang', 'place', 'aussie'],
    frequency: 70,
  },
  {
    id: 'slang-the-goldie',
    term: 'the Goldie',
    meaningKo: '골드 코스트. (= Gold Coast). 서핑·관광.',
    partOfSpeech: 'noun',
    examples: [
      { en: "Heading to the Goldie.", ko: '골드 코스트 가.' },
    ],
    tags: ['slang', 'place', 'aussie'],
    frequency: 55,
  },
  {
    id: 'slang-back-of-beyond',
    term: 'back of beyond',
    meaningKo: '아주 외진 곳 / 시골 끝자락.',
    partOfSpeech: 'idiom',
    examples: [
      { en: 'They live back of beyond.', ko: '걔네 진짜 외진 데 살아.' },
    ],
    tags: ['slang', 'place', 'aussie', 'idiom'],
    frequency: 45,
  },
  {
    id: 'slang-sticks',
    term: 'the sticks',
    meaningKo: '시골 / 외딴 곳.',
    partOfSpeech: 'idiom',
    examples: [
      { en: 'Out in the sticks.', ko: '시골에 있어.' },
    ],
    tags: ['slang', 'place', 'aussie'],
    frequency: 50,
  },

  // ── 음식 / 음료 (10) ──
  {
    id: 'slang-coldie',
    term: 'coldie',
    meaningKo: '시원한 맥주. (= cold one).',
    partOfSpeech: 'slang',
    examples: [
      { en: 'Crack a coldie!', ko: '맥주 한 잔 따자!' },
    ],
    tags: ['slang', 'food', 'aussie'],
    frequency: 70,
  },
  {
    id: 'slang-tinnie',
    term: 'tinnie',
    meaningKo: '캔맥주. (한편 작은 알루미늄 보트도 같은 단어)',
    partOfSpeech: 'slang',
    examples: [
      { en: 'Grab us a tinnie.', ko: '캔맥주 하나 줘.' },
    ],
    tags: ['slang', 'food', 'aussie'],
    frequency: 70,
  },
  {
    id: 'slang-stubbie',
    term: 'stubbie',
    meaningKo: '작은 병맥주 (보통 375ml).',
    partOfSpeech: 'slang',
    examples: [
      { en: 'Six pack of stubbies.', ko: '병맥주 6개팩.' },
    ],
    tags: ['slang', 'food', 'aussie'],
    frequency: 60,
  },
  {
    id: 'slang-brewskie',
    term: 'brewskie',
    meaningKo: '맥주 (slangy).',
    partOfSpeech: 'slang',
    examples: [
      { en: 'Time for some brewskies.', ko: '맥주 한잔 할 시간.' },
    ],
    tags: ['slang', 'food'],
    frequency: 50,
  },
  {
    id: 'slang-cuppa',
    term: 'cuppa',
    ipa: '/ˈkʌpə/',
    meaningKo: '차 한 잔 / 커피 한 잔. (= cup of)',
    partOfSpeech: 'slang',
    examples: [
      { en: "Fancy a cuppa?", ko: '차 한 잔 할래?' },
    ],
    tags: ['slang', 'food', 'aussie'],
    frequency: 75,
  },
  {
    id: 'slang-bickie',
    term: 'bickie',
    ipa: '/ˈbɪki/',
    meaningKo: '비스킷 / 쿠키.',
    partOfSpeech: 'slang',
    examples: [
      { en: 'Tea and bickies.', ko: '차랑 비스킷.' },
    ],
    tags: ['slang', 'food', 'aussie'],
    frequency: 65,
  },
  {
    id: 'slang-chips',
    term: 'chips',
    meaningKo: '감자튀김 (호주·영국). 미국식 chips는 호주에선 crisps.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Fish and chips.', ko: '피쉬 앤 칩스.' },
    ],
    tags: ['slang', 'food', 'aussie'],
    frequency: 88,
  },
  {
    id: 'slang-chook',
    term: 'chook',
    ipa: '/tʃʊk/',
    meaningKo: '닭 (호주식). (= chicken)',
    partOfSpeech: 'slang',
    examples: [
      { en: 'Roast chook for dinner.', ko: '저녁은 통닭이야.' },
    ],
    tags: ['slang', 'food', 'aussie'],
    frequency: 65,
  },
  {
    id: 'slang-vegie',
    term: 'vegie',
    ipa: '/ˈvedʒi/',
    meaningKo: '채소 (vegetable 줄임).',
    partOfSpeech: 'slang',
    examples: [
      { en: 'Vegie patch in the backyard.', ko: '뒷마당 채소밭.' },
    ],
    tags: ['slang', 'food', 'aussie'],
    frequency: 60,
  },
  {
    id: 'slang-anzac-biscuit',
    term: 'Anzac biscuit',
    meaningKo: 'ANZAC 비스킷. 1차 대전 호주 군인 부인들이 만든 귀리 쿠키.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'A tin of Anzac biscuits.', ko: 'ANZAC 비스킷 한 통.' },
    ],
    tags: ['slang', 'food', 'culture', 'aussie'],
    frequency: 55,
  },

  // ── 호주 문화 / 기타 (12) ──
  {
    id: 'slang-anzac',
    term: 'ANZAC',
    ipa: '/ˈænzæk/',
    meaningKo: '호주·뉴질랜드 군인. ANZAC Day(4/25) 추모일.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Anzac Day is a public holiday.', ko: 'ANZAC 데이는 공휴일이야.' },
    ],
    tags: ['slang', 'culture', 'aussie'],
    frequency: 60,
  },
  {
    id: 'slang-sunday-session',
    term: 'Sunday session',
    meaningKo: '일요일 오후 펍 음주 모임. 호주 주말 의식.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Joining the Sunday session?', ko: '일요일 펍 모임 올래?' },
    ],
    tags: ['slang', 'culture', 'aussie'],
    frequency: 55,
  },
  {
    id: 'slang-hills-hoist',
    term: 'Hills hoist',
    meaningKo: '회전식 빨래줄. 호주 가정의 클래식 풍경.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Hills hoist in the backyard.', ko: '뒷마당에 회전 빨래줄 있어.' },
    ],
    tags: ['slang', 'culture', 'aussie'],
    frequency: 40,
  },
  {
    id: 'slang-vegemite',
    term: 'Vegemite',
    ipa: '/ˈvedʒimaɪt/',
    meaningKo: '베지마이트. 호주 국민 발효 효모 스프레드.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Vegemite on toast for brekkie.', ko: '아침은 베지마이트 토스트.' },
    ],
    tags: ['slang', 'food', 'culture', 'aussie'],
    frequency: 75,
  },
  {
    id: 'slang-tim-tam',
    term: 'Tim Tam',
    meaningKo: '호주 국민 비스킷. Tim Tam Slam 마법.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Pack of Tim Tams, please.', ko: '팀탐 한 봉지 주세요.' },
    ],
    tags: ['slang', 'food', 'culture', 'aussie'],
    frequency: 78,
  },
  {
    id: 'slang-milo',
    term: 'Milo',
    ipa: '/ˈmaɪloʊ/',
    meaningKo: '호주 국민 코코아 분말 음료.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'A hot Milo before bed.', ko: '자기 전 따뜻한 밀로.' },
    ],
    tags: ['slang', 'food', 'culture', 'aussie'],
    frequency: 65,
  },
  {
    id: 'slang-aussie-rules',
    term: 'Aussie rules',
    meaningKo: '호주식 풋볼 (AFL). 멜번·SA·WA에서 인기.',
    partOfSpeech: 'noun',
    examples: [
      { en: "Watching Aussie rules tonight.", ko: '오늘 밤 AFL 봐.' },
    ],
    tags: ['slang', 'culture', 'aussie'],
    frequency: 60,
  },
  {
    id: 'slang-footy',
    term: 'footy',
    ipa: '/ˈfʊti/',
    meaningKo: '풋볼. AFL 또는 럭비 (지역에 따라).',
    partOfSpeech: 'slang',
    examples: [
      { en: 'Going to the footy.', ko: '경기 보러 가.' },
    ],
    tags: ['slang', 'culture', 'aussie'],
    frequency: 75,
  },
  {
    id: 'slang-dunny',
    term: 'dunny',
    ipa: '/ˈdʌni/',
    meaningKo: '화장실 (변소). 옛스러운 호주 슬랭.',
    partOfSpeech: 'slang',
    examples: [
      { en: "Where's the dunny?", ko: '화장실 어디?' },
    ],
    tags: ['slang', 'aussie'],
    frequency: 55,
  },
  {
    id: 'slang-brolly',
    term: 'brolly',
    ipa: '/ˈbrɒli/',
    meaningKo: '우산 (umbrella).',
    partOfSpeech: 'slang',
    examples: [
      { en: 'Bring a brolly, mate.', ko: '우산 챙겨.' },
    ],
    tags: ['slang', 'aussie'],
    frequency: 60,
  },
  {
    id: 'slang-crikey',
    term: 'Crikey!',
    ipa: '/ˈkraɪki/',
    meaningKo: '와! 어머나! 놀람 감탄. Steve Irwin이 클래식.',
    partOfSpeech: 'phrase',
    examples: [
      { en: 'Crikey, that’s a big spider!', ko: '와, 거미 진짜 크다!' },
    ],
    tags: ['slang', 'culture', 'aussie'],
    frequency: 55,
  },
  {
    id: 'slang-strewth',
    term: 'strewth',
    ipa: '/struːθ/',
    meaningKo: '아이고 / 세상에. 놀람·짜증의 완곡 감탄.',
    partOfSpeech: 'phrase',
    examples: [
      { en: 'Strewth, what a day.', ko: '아이고, 정말 힘든 하루야.' },
    ],
    tags: ['slang', 'culture', 'aussie'],
    frequency: 50,
  },
];

const deck: Deck = {
  id: 'slang',
  title: '호주 슬랭',
  description: '사람·감정·행동·강조·장소·음식·문화 슬랭. 호주 회화에 색을 입히는 표현.',
  scenarioOrder: 7,
  estimatedHours: 5,
  wordIds: words.map((w) => w.id),
};

export const slangDeck = { deck, words };
