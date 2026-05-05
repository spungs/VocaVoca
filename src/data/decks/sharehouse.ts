import type { Deck, Word } from '@/lib/db';

/**
 * 셰어하우스 시나리오.
 * 호주 워홀러가 백패커 호스텔에서 나와 본격적으로 정착할 때 마주치는 표현.
 * 집 찾기·계약·청구서·청소 당번·수리·이웃 사교 등 한 집에 같이 사는 일상.
 */

const words: Word[] = [
  // ── 집 찾기 / 인스펙션 (10) ──
  {
    id: 'sharehouse-inspection',
    term: 'inspection',
    ipa: '/ɪnˈspekʃən/',
    meaningKo: '집 둘러보기 / 공식 점검. 입주 전·도중·퇴거 전 모두 사용.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'When can I do an inspection?', ko: '언제 집 보러 가도 돼요?' },
      { en: 'The agent does inspections every 3 months.', ko: '중개인이 3개월마다 점검 와.' },
    ],
    tags: ['sharehouse', 'rental'],
    frequency: 92,
  },
  {
    id: 'sharehouse-room-available',
    term: 'room available',
    meaningKo: '방 있음. 광고 글의 단골 표현.',
    partOfSpeech: 'phrase',
    examples: [
      { en: 'Room available from 1st June.', ko: '6월 1일부터 방 있음.' },
    ],
    tags: ['sharehouse', 'rental', 'frozen-phrase'],
    frequency: 85,
  },
  {
    id: 'sharehouse-gumtree',
    term: 'gumtree',
    meaningKo: '호주 중고/구인/방 광고 사이트.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Found it on Gumtree.', ko: '검트리에서 찾았어.' },
    ],
    tags: ['sharehouse', 'rental', 'aussie'],
    frequency: 78,
  },
  {
    id: 'sharehouse-flatmates',
    term: 'flatmates.com.au',
    meaningKo: '룸메이트 매칭 사이트. 광고 + 매칭 메시지 위주.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'I posted on flatmates.com.au.', ko: 'flatmates.com.au에 글 올렸어.' },
    ],
    tags: ['sharehouse', 'rental', 'aussie'],
    frequency: 75,
  },
  {
    id: 'sharehouse-listing',
    term: 'listing',
    meaningKo: '매물 목록 / 광고 글.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'The listing has photos.', ko: '광고에 사진 있어.' },
    ],
    tags: ['sharehouse', 'rental'],
    frequency: 70,
  },
  {
    id: 'sharehouse-vacancy',
    term: 'vacancy',
    ipa: '/ˈveɪkənsi/',
    meaningKo: '빈 자리. 방·일자리 모두 사용.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Is the vacancy still open?', ko: '아직 자리 있어요?' },
    ],
    tags: ['sharehouse', 'rental'],
    frequency: 65,
  },
  {
    id: 'sharehouse-short-term',
    term: 'short-term',
    meaningKo: '단기. 보통 3개월 미만 임대.',
    partOfSpeech: 'adjective',
    examples: [
      { en: "I'm looking for short-term.", ko: '단기로 찾고 있어.' },
    ],
    tags: ['sharehouse', 'rental'],
    frequency: 70,
  },
  {
    id: 'sharehouse-long-term',
    term: 'long-term',
    meaningKo: '장기. 6개월 이상이면 가격 협상 여지.',
    partOfSpeech: 'adjective',
    examples: [
      { en: 'Long-term welcome.', ko: '장기 환영.' },
    ],
    tags: ['sharehouse', 'rental'],
    frequency: 70,
  },
  {
    id: 'sharehouse-furnished',
    term: 'furnished',
    ipa: '/ˈfɜːnɪʃt/',
    meaningKo: '가구 포함. (반대: unfurnished = 빈집)',
    partOfSpeech: 'adjective',
    examples: [
      { en: 'Fully furnished room.', ko: '풀옵션 방.' },
    ],
    tags: ['sharehouse', 'rental'],
    frequency: 88,
  },
  {
    id: 'sharehouse-viewing',
    term: 'viewing',
    meaningKo: '집 보기 / 인스펙션의 캐주얼 표현.',
    partOfSpeech: 'noun',
    examples: [
      { en: "Can I book a viewing?", ko: '집 보러 갈 수 있어요?' },
    ],
    tags: ['sharehouse', 'rental'],
    frequency: 75,
  },

  // ── 임대 / 계약 시스템 (10) ──
  {
    id: 'sharehouse-lease',
    term: 'lease',
    ipa: '/liːs/',
    meaningKo: '임대 계약 (서). 보통 6/12개월 단위.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Sign the lease tomorrow.', ko: '내일 계약서에 서명해.' },
    ],
    tags: ['sharehouse', 'rental'],
    frequency: 90,
  },
  {
    id: 'sharehouse-bond',
    term: 'bond',
    ipa: '/bɒnd/',
    meaningKo: '보증금. 보통 4주치 월세. 정부 기관 보관 (RTBA 등).',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Bond is 4 weeks rent.', ko: '보증금은 4주치 월세야.' },
    ],
    tags: ['sharehouse', 'rental', 'aussie'],
    frequency: 95,
  },
  {
    id: 'sharehouse-rent',
    term: 'rent',
    meaningKo: '월세. 호주는 주 단위 가격 표기 ("$300 per week" 등).',
    partOfSpeech: 'noun',
    examples: [
      { en: "What's the rent?", ko: '월세 얼마예요?' },
    ],
    tags: ['sharehouse', 'rental'],
    frequency: 95,
  },
  {
    id: 'sharehouse-weekly-rent',
    term: 'weekly rent',
    meaningKo: '주당 월세. $250pw 같은 형식.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Weekly rent is $280.', ko: '주당 월세는 280달러야.' },
    ],
    tags: ['sharehouse', 'rental', 'aussie'],
    frequency: 88,
  },
  {
    id: 'sharehouse-fortnightly',
    term: 'fortnightly',
    meaningKo: '2주마다. 호주 임금·결제 주기로 흔함.',
    partOfSpeech: 'adjective',
    examples: [
      { en: 'I pay rent fortnightly.', ko: '월세 2주 단위로 내.' },
    ],
    tags: ['sharehouse', 'rental', 'aussie'],
    frequency: 80,
  },
  {
    id: 'sharehouse-bond-cleaning',
    term: 'bond cleaning',
    meaningKo: '퇴거 청소. 보증금 받기 위해 전문 청소 부르는 경우 많음.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Bond cleaning costs about $300.', ko: '퇴거 청소는 보통 300달러.' },
    ],
    tags: ['sharehouse', 'rental', 'aussie'],
    frequency: 75,
  },
  {
    id: 'sharehouse-condition-report',
    term: 'condition report',
    meaningKo: '입주 시 집 상태 기록서. 퇴거 시 보증금 분쟁 방지용.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Fill out the condition report carefully.', ko: '컨디션 리포트 꼼꼼히 작성해.' },
    ],
    tags: ['sharehouse', 'rental'],
    frequency: 65,
  },
  {
    id: 'sharehouse-notice',
    term: 'notice',
    ipa: '/ˈnoʊtɪs/',
    meaningKo: '통지 (퇴거·종료). 보통 2~4주 사전 통지 필요.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Two weeks notice, please.', ko: '2주 전 통지 부탁해요.' },
    ],
    tags: ['sharehouse', 'rental'],
    frequency: 78,
  },
  {
    id: 'sharehouse-rental-ledger',
    term: 'rental ledger',
    meaningKo: '임대료 납부 기록. 다음 집 신청 시 증빙으로 자주 요구.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'They asked for my rental ledger.', ko: '임대료 납부 기록 요청 받았어.' },
    ],
    tags: ['sharehouse', 'rental', 'aussie'],
    frequency: 60,
  },
  {
    id: 'sharehouse-rental-application',
    term: 'rental application',
    meaningKo: '임대 신청서. references·payslip 등 동봉.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'I submitted the rental application.', ko: '임대 신청서 냈어.' },
    ],
    tags: ['sharehouse', 'rental'],
    frequency: 70,
  },

  // ── 공간 / 가구 (8) ──
  {
    id: 'sharehouse-master-bedroom',
    term: 'master bedroom',
    meaningKo: '안방. 보통 가장 크고 비쌈, 화장실 딸린 경우 많음.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'The master bedroom is taken.', ko: '안방은 이미 나갔어.' },
    ],
    tags: ['sharehouse', 'space'],
    frequency: 75,
  },
  {
    id: 'sharehouse-single-bed',
    term: 'single bed',
    meaningKo: '싱글 침대. 1인용 매트리스.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'The room comes with a single bed.', ko: '방에 싱글 침대 있어.' },
    ],
    tags: ['sharehouse', 'space'],
    frequency: 70,
  },
  {
    id: 'sharehouse-queen-bed',
    term: 'queen bed',
    meaningKo: '퀸 사이즈 침대. 호주 가장 흔한 더블 사이즈.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Queen bed in the room.', ko: '방에 퀸 침대 있어.' },
    ],
    tags: ['sharehouse', 'space'],
    frequency: 65,
  },
  {
    id: 'sharehouse-balcony',
    term: 'balcony',
    ipa: '/ˈbælkəni/',
    meaningKo: '발코니.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'The unit has a small balcony.', ko: '집에 작은 발코니 있어.' },
    ],
    tags: ['sharehouse', 'space'],
    frequency: 65,
  },
  {
    id: 'sharehouse-lounge-room',
    term: 'lounge room',
    meaningKo: '거실. (= living room). 호주식 표현.',
    partOfSpeech: 'noun',
    examples: [
      { en: "Let's watch in the lounge room.", ko: '거실에서 보자.' },
    ],
    tags: ['sharehouse', 'space', 'aussie'],
    frequency: 80,
  },
  {
    id: 'sharehouse-backyard',
    term: 'backyard',
    meaningKo: '뒷마당. BBQ·빨래줄 자주 있음.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'There’s a big backyard.', ko: '뒷마당 넓어.' },
    ],
    tags: ['sharehouse', 'space'],
    frequency: 70,
  },
  {
    id: 'sharehouse-driveway',
    term: 'driveway',
    meaningKo: '진입로 / 차고 진입공간.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Park in the driveway.', ko: '진입로에 주차해.' },
    ],
    tags: ['sharehouse', 'space'],
    frequency: 55,
  },
  {
    id: 'sharehouse-mattress',
    term: 'mattress',
    ipa: '/ˈmætrɪs/',
    meaningKo: '매트리스.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'The mattress is brand new.', ko: '매트리스 새것이야.' },
    ],
    tags: ['sharehouse', 'space'],
    frequency: 70,
  },

  // ── 룸메이트 / 관계 (8) ──
  {
    id: 'sharehouse-housemate',
    term: 'housemate',
    meaningKo: '룸메이트 / 같이 사는 사람.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'My housemate is super tidy.', ko: '내 룸메 진짜 깔끔해.' },
    ],
    tags: ['sharehouse', 'people'],
    frequency: 92,
  },
  {
    id: 'sharehouse-flatmate',
    term: 'flatmate',
    meaningKo: '룸메이트 (호주·영국식). 아파트 단위.',
    partOfSpeech: 'noun',
    examples: [
      { en: "I'm looking for a flatmate.", ko: '룸메 구하고 있어.' },
    ],
    tags: ['sharehouse', 'people', 'aussie'],
    frequency: 85,
  },
  {
    id: 'sharehouse-head-tenant',
    term: 'head tenant',
    meaningKo: '대표 입주자. 다른 룸메한테서 월세 모으는 책임.',
    partOfSpeech: 'noun',
    examples: [
      { en: "I'm the head tenant here.", ko: '여기 대표 입주자야.' },
    ],
    tags: ['sharehouse', 'people', 'aussie'],
    frequency: 70,
  },
  {
    id: 'sharehouse-co-tenant',
    term: 'co-tenant',
    meaningKo: '공동 입주자 / 계약 공동인.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'All co-tenants sign the lease.', ko: '공동 입주자 모두 계약서 서명.' },
    ],
    tags: ['sharehouse', 'people'],
    frequency: 50,
  },
  {
    id: 'sharehouse-landlord',
    term: 'landlord',
    ipa: '/ˈlændlɔːrd/',
    meaningKo: '집주인.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'The landlord is decent.', ko: '집주인 괜찮은 사람이야.' },
    ],
    tags: ['sharehouse', 'people'],
    frequency: 80,
  },
  {
    id: 'sharehouse-real-estate-agent',
    term: 'real estate agent',
    meaningKo: '부동산 중개인. 호주는 직거래보단 중개 비중 높음.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Talk to the real estate agent.', ko: '부동산 중개인한테 말해.' },
    ],
    tags: ['sharehouse', 'people'],
    frequency: 75,
  },
  {
    id: 'sharehouse-references',
    term: 'references',
    meaningKo: '추천인 / 추천서. 임대 신청 시 이전 집주인·고용주 연락처.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Have your references ready.', ko: '레퍼런스 미리 준비해.' },
    ],
    tags: ['sharehouse', 'rental'],
    frequency: 70,
  },
  {
    id: 'sharehouse-application-form',
    term: 'application form',
    meaningKo: '신청서. 임대 외 일자리·은행 등 광범위.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Fill in the application form.', ko: '신청서 작성해.' },
    ],
    tags: ['sharehouse', 'rental'],
    frequency: 78,
  },

  // ── 청구 / 비용 (10) ──
  {
    id: 'sharehouse-bills-included',
    term: 'bills included',
    meaningKo: '공과금 포함. 광고에서 흔히 보는 표현.',
    partOfSpeech: 'phrase',
    examples: [
      { en: 'Bills included in the rent.', ko: '월세에 공과금 포함.' },
    ],
    tags: ['sharehouse', 'bills', 'frozen-phrase'],
    frequency: 88,
  },
  {
    id: 'sharehouse-utilities',
    term: 'utilities',
    ipa: '/juːˈtɪlətiz/',
    meaningKo: '공과금 (전기·가스·수도 통칭).',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Utilities are split four ways.', ko: '공과금은 4명이 나눠 내.' },
    ],
    tags: ['sharehouse', 'bills'],
    frequency: 80,
  },
  {
    id: 'sharehouse-electricity-bill',
    term: 'electricity bill',
    meaningKo: '전기요금 고지서.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Electricity bill came in today.', ko: '전기요금 오늘 왔어.' },
    ],
    tags: ['sharehouse', 'bills'],
    frequency: 80,
  },
  {
    id: 'sharehouse-gas-bill',
    term: 'gas bill',
    meaningKo: '가스요금 고지서. 보통 분기별.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Gas bill is quarterly.', ko: '가스 요금은 분기마다 와.' },
    ],
    tags: ['sharehouse', 'bills'],
    frequency: 70,
  },
  {
    id: 'sharehouse-internet-bill',
    term: 'internet bill',
    meaningKo: '인터넷 요금. NBN 가입자가 대부분.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Internet bill is $80 a month.', ko: '인터넷 한 달 80달러야.' },
    ],
    tags: ['sharehouse', 'bills'],
    frequency: 75,
  },
  {
    id: 'sharehouse-water-bill',
    term: 'water bill',
    meaningKo: '수도요금. 호주는 임차인이 사용량분만 내는 경우 많음.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Water bill arrived.', ko: '수도요금 왔어.' },
    ],
    tags: ['sharehouse', 'bills'],
    frequency: 65,
  },
  {
    id: 'sharehouse-council-rates',
    term: 'council rates',
    meaningKo: '시청 지방세 (집주인 부담이지만 sharehouse 광고에 등장).',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Council rates are paid by the owner.', ko: '지방세는 집주인이 내.' },
    ],
    tags: ['sharehouse', 'bills', 'aussie'],
    frequency: 50,
  },
  {
    id: 'sharehouse-splitting-bills',
    term: 'splitting bills',
    meaningKo: '공과금 나눠 내기.',
    partOfSpeech: 'phrase',
    examples: [
      { en: 'How are we splitting bills?', ko: '공과금 어떻게 나눌까?' },
    ],
    tags: ['sharehouse', 'bills'],
    frequency: 75,
  },
  {
    id: 'sharehouse-direct-debit',
    term: 'direct debit',
    meaningKo: '자동이체.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Set up direct debit for rent.', ko: '월세 자동이체 걸어.' },
    ],
    tags: ['sharehouse', 'bills', 'payment'],
    frequency: 70,
  },
  {
    id: 'sharehouse-bpay',
    term: 'BPAY',
    ipa: '/ˈbiːpeɪ/',
    meaningKo: '호주 표준 청구서 결제 시스템 (biller code + ref number).',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Pay via BPAY.', ko: 'BPAY로 결제해.' },
    ],
    tags: ['sharehouse', 'bills', 'payment', 'aussie'],
    frequency: 80,
  },

  // ── 청소 / 가사 (10) ──
  {
    id: 'sharehouse-cleaning-roster',
    term: 'cleaning roster',
    meaningKo: '청소 당번표. 갈등 방지의 핵심.',
    partOfSpeech: 'noun',
    examples: [
      { en: "We're making a cleaning roster.", ko: '청소 당번표 만들고 있어.' },
    ],
    tags: ['sharehouse', 'chore'],
    frequency: 78,
  },
  {
    id: 'sharehouse-vacuum',
    term: 'vacuum',
    ipa: '/ˈvækjuːm/',
    meaningKo: '진공청소기 / 청소하다.',
    partOfSpeech: 'verb',
    examples: [
      { en: "I'll vacuum the lounge.", ko: '내가 거실 청소할게.' },
    ],
    tags: ['sharehouse', 'chore'],
    frequency: 80,
  },
  {
    id: 'sharehouse-mop',
    term: 'mop',
    ipa: '/mɒp/',
    meaningKo: '걸레 / 걸레질.',
    partOfSpeech: 'verb',
    examples: [
      { en: 'Can you mop the floor?', ko: '바닥 좀 닦아줄래?' },
    ],
    tags: ['sharehouse', 'chore'],
    frequency: 70,
  },
  {
    id: 'sharehouse-take-the-bins-out',
    term: 'take the bins out',
    meaningKo: '쓰레기통 내놓기. 호주는 wheelie bin 단위.',
    partOfSpeech: 'phrase',
    examples: [
      { en: "Don't forget to take the bins out tonight.", ko: '오늘 밤 쓰레기 내놓는 거 잊지마.' },
    ],
    tags: ['sharehouse', 'chore', 'aussie'],
    frequency: 85,
  },
  {
    id: 'sharehouse-recycling',
    term: 'recycling',
    ipa: '/riːˈsaɪklɪŋ/',
    meaningKo: '재활용. 호주는 노란 뚜껑 통.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Yellow bin is for recycling.', ko: '노란 통이 재활용이야.' },
    ],
    tags: ['sharehouse', 'chore'],
    frequency: 70,
  },
  {
    id: 'sharehouse-dishwasher',
    term: 'dishwasher',
    ipa: '/ˈdɪʃwɒʃər/',
    meaningKo: '식기세척기.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Stack the dishwasher, please.', ko: '식기세척기에 넣어줘.' },
    ],
    tags: ['sharehouse', 'chore'],
    frequency: 70,
  },
  {
    id: 'sharehouse-clothesline',
    term: 'clothesline',
    meaningKo: '빨래줄. 호주는 외부 건조 흔함 (Hills hoist 클래식).',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Hang it on the clothesline.', ko: '빨래줄에 널어.' },
    ],
    tags: ['sharehouse', 'chore', 'aussie'],
    frequency: 65,
  },
  {
    id: 'sharehouse-laundry-day',
    term: 'laundry day',
    meaningKo: '빨래하는 날. 룸메끼리 시간 겹치지 않게 배분.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Sunday is my laundry day.', ko: '일요일이 내 빨래 날이야.' },
    ],
    tags: ['sharehouse', 'chore'],
    frequency: 60,
  },
  {
    id: 'sharehouse-shared-spaces',
    term: 'shared spaces',
    meaningKo: '공용 공간 (거실·부엌·욕실 등).',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Keep shared spaces clean.', ko: '공용 공간은 깨끗이 써.' },
    ],
    tags: ['sharehouse', 'chore', 'space'],
    frequency: 65,
  },
  {
    id: 'sharehouse-pet-hair',
    term: 'pet hair',
    meaningKo: '반려동물 털. 알레르기·청소 갈등 흔한 원인.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Heaps of pet hair on the couch.', ko: '소파에 동물털 잔뜩이야.' },
    ],
    tags: ['sharehouse', 'chore'],
    frequency: 50,
  },

  // ── 문제 / 수리 (10) ──
  {
    id: 'sharehouse-mould',
    term: 'mould',
    ipa: '/moʊld/',
    meaningKo: '곰팡이. 욕실·창틀 단골.',
    partOfSpeech: 'noun',
    examples: [
      { en: "There's mould in the bathroom.", ko: '욕실에 곰팡이 있어.' },
    ],
    tags: ['sharehouse', 'repair'],
    frequency: 75,
  },
  {
    id: 'sharehouse-leak',
    term: 'leak',
    ipa: '/liːk/',
    meaningKo: '누수.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'The tap has a leak.', ko: '수도꼭지 새.' },
    ],
    tags: ['sharehouse', 'repair'],
    frequency: 80,
  },
  {
    id: 'sharehouse-blocked-drain',
    term: 'blocked drain',
    meaningKo: '막힌 배수구.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Blocked drain in the shower.', ko: '샤워실 배수구 막혔어.' },
    ],
    tags: ['sharehouse', 'repair'],
    frequency: 65,
  },
  {
    id: 'sharehouse-hot-water-system',
    term: 'hot water system',
    meaningKo: '온수기. 호주 단독주택의 핵심 설비.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'The hot water system is broken.', ko: '온수기 고장났어.' },
    ],
    tags: ['sharehouse', 'repair', 'aussie'],
    frequency: 70,
  },
  {
    id: 'sharehouse-fix',
    term: 'fix',
    meaningKo: '고치다 / 수리하다.',
    partOfSpeech: 'verb',
    examples: [
      { en: 'Can you fix the door?', ko: '문 좀 고쳐줄래?' },
    ],
    tags: ['sharehouse', 'repair'],
    frequency: 90,
  },
  {
    id: 'sharehouse-repair',
    term: 'repair',
    ipa: '/rɪˈpeər/',
    meaningKo: '수리. 명사·동사 모두.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'The agent will arrange repairs.', ko: '중개인이 수리 잡아줄 거야.' },
    ],
    tags: ['sharehouse', 'repair'],
    frequency: 75,
  },
  {
    id: 'sharehouse-faulty',
    term: 'faulty',
    ipa: '/ˈfɔːlti/',
    meaningKo: '결함 있는 / 고장난.',
    partOfSpeech: 'adjective',
    examples: [
      { en: 'The heater is faulty.', ko: '히터 고장났어.' },
    ],
    tags: ['sharehouse', 'repair'],
    frequency: 65,
  },
  {
    id: 'sharehouse-plumber',
    term: 'plumber',
    ipa: '/ˈplʌmər/',
    meaningKo: '배관공.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'We need a plumber.', ko: '배관공 불러야 해.' },
    ],
    tags: ['sharehouse', 'repair'],
    frequency: 70,
  },
  {
    id: 'sharehouse-electrician',
    term: 'electrician',
    ipa: '/ɪˌlekˈtrɪʃən/',
    meaningKo: '전기 기술자.',
    partOfSpeech: 'noun',
    examples: [
      { en: "Call an electrician.", ko: '전기 기술자 불러.' },
    ],
    tags: ['sharehouse', 'repair'],
    frequency: 60,
  },
  {
    id: 'sharehouse-callout-fee',
    term: 'callout fee',
    meaningKo: '출장비. 기술자 부르는 기본 요금.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Callout fee is $90.', ko: '출장비 90달러야.' },
    ],
    tags: ['sharehouse', 'repair', 'bills'],
    frequency: 50,
  },

  // ── 사교 / 이웃 (14) ──
  {
    id: 'sharehouse-housewarming',
    term: 'housewarming',
    meaningKo: '집들이.',
    partOfSpeech: 'noun',
    examples: [
      { en: "We're having a housewarming Saturday.", ko: '토요일 집들이 해.' },
    ],
    tags: ['sharehouse', 'social'],
    frequency: 70,
  },
  {
    id: 'sharehouse-house-party',
    term: 'house party',
    meaningKo: '하우스 파티.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'House party at our place.', ko: '우리 집에서 파티 해.' },
    ],
    tags: ['sharehouse', 'social'],
    frequency: 70,
  },
  {
    id: 'sharehouse-neighbour',
    term: 'neighbour',
    ipa: '/ˈneɪbər/',
    meaningKo: '이웃. (미국 neighbor의 영국식 철자)',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Our neighbours are quiet.', ko: '이웃들 조용해.' },
    ],
    tags: ['sharehouse', 'social', 'aussie'],
    frequency: 80,
  },
  {
    id: 'sharehouse-noise-complaint',
    term: 'noise complaint',
    meaningKo: '소음 민원. 이웃이나 경찰이 와서 조용히 해달라고 함.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'We got a noise complaint last night.', ko: '어젯밤 소음 민원 받았어.' },
    ],
    tags: ['sharehouse', 'social'],
    frequency: 65,
  },
  {
    id: 'sharehouse-pop-over',
    term: 'pop over',
    meaningKo: '잠깐 들르다.',
    partOfSpeech: 'phrasal-verb',
    examples: [
      { en: "I'll pop over after work.", ko: '퇴근 후 잠깐 들를게.' },
    ],
    tags: ['sharehouse', 'social', 'aussie'],
    frequency: 70,
  },
  {
    id: 'sharehouse-have-people-over',
    term: 'have people over',
    meaningKo: '사람들 부르다 / 손님 모이다.',
    partOfSpeech: 'phrase',
    examples: [
      { en: 'Mind if I have people over?', ko: '사람들 좀 불러도 돼?' },
    ],
    tags: ['sharehouse', 'social'],
    frequency: 72,
  },
  {
    id: 'sharehouse-pets-allowed',
    term: 'pets allowed',
    meaningKo: '반려동물 가능. 광고에서 자주 봄.',
    partOfSpeech: 'phrase',
    examples: [
      { en: 'Pets allowed — small dogs only.', ko: '반려동물 가능 — 소형견만.' },
    ],
    tags: ['sharehouse', 'rental', 'frozen-phrase'],
    frequency: 65,
  },
  {
    id: 'sharehouse-smoke-free',
    term: 'smoke-free',
    meaningKo: '금연. 광고·집 내 룰.',
    partOfSpeech: 'adjective',
    examples: [
      { en: 'Smoke-free house.', ko: '금연 하우스.' },
    ],
    tags: ['sharehouse', 'rental'],
    frequency: 75,
  },
  {
    id: 'sharehouse-couch',
    term: 'couch',
    ipa: '/kaʊtʃ/',
    meaningKo: '소파. (= sofa)',
    partOfSpeech: 'noun',
    examples: [
      { en: "Crash on the couch tonight?", ko: '오늘 소파에서 자도 돼?' },
    ],
    tags: ['sharehouse', 'space'],
    frequency: 80,
  },
  {
    id: 'sharehouse-group-chat',
    term: 'group chat',
    meaningKo: '단톡방. 보통 룸메끼리 WhatsApp/Messenger.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Drop it in the group chat.', ko: '단톡방에 올려.' },
    ],
    tags: ['sharehouse', 'social'],
    frequency: 80,
  },
  {
    id: 'sharehouse-invite',
    term: 'invite',
    meaningKo: '초대 / 초대하다.',
    partOfSpeech: 'verb',
    examples: [
      { en: 'Should I invite the neighbours?', ko: '이웃도 초대할까?' },
    ],
    tags: ['sharehouse', 'social'],
    frequency: 75,
  },
  {
    id: 'sharehouse-night-out',
    term: 'night out',
    meaningKo: '밤 외출 / 놀이.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Big night out planned!', ko: '오늘 밤 거하게 놀 거야!' },
    ],
    tags: ['sharehouse', 'social'],
    frequency: 70,
  },
  {
    id: 'sharehouse-chill-night',
    term: 'chill night',
    meaningKo: '조용히 쉬는 밤. 영화 보거나 집에서 노는 정도.',
    partOfSpeech: 'phrase',
    examples: [
      { en: "Just a chill night in tonight.", ko: '오늘 밤은 그냥 집에서 쉴래.' },
    ],
    tags: ['sharehouse', 'social'],
    frequency: 65,
  },
  {
    id: 'sharehouse-get-together',
    term: 'get-together',
    meaningKo: '소규모 모임 / 만남.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Small get-together this weekend.', ko: '이번 주말 작은 모임 있어.' },
    ],
    tags: ['sharehouse', 'social'],
    frequency: 60,
  },
];

const deck: Deck = {
  id: 'sharehouse',
  title: '셰어하우스',
  description: '집 찾기·계약·청구서·청소·수리·이웃 — 호주 셰어하우스 일상.',
  scenarioOrder: 5,
  estimatedHours: 7,
  wordIds: words.map((w) => w.id),
};

export const sharehouseDeck = { deck, words };
