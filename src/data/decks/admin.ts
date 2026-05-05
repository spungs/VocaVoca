import type { Deck, Word } from '@/lib/db';

/**
 * 행정·관공서 시나리오.
 * 은행 계좌 개설, 우체국, 운전면허, 비자 갱신, 의료보험, Centrelink·ATO·myGov 등
 * 호주에서 한 번씩 거쳐가야 하는 공식 절차 어휘. social 단계의 핵심 콘텐츠.
 */

const words: Word[] = [
  // ── 은행 / 계좌 (10) ──
  {
    id: 'admin-bank-account',
    term: 'bank account',
    meaningKo: '은행 계좌. 워홀러는 도착 6주 안에 여권만으로 개설 가능.',
    partOfSpeech: 'noun',
    examples: [
      { en: "I'd like to open a bank account.", ko: '계좌 개설하고 싶어요.' },
    ],
    tags: ['admin', 'bank'],
    frequency: 95,
  },
  {
    id: 'admin-savings-account',
    term: 'savings account',
    meaningKo: '저축 예금 계좌. 이자율이 일반 계좌보다 높음.',
    partOfSpeech: 'noun',
    examples: [
      { en: "Open a savings account too?", ko: '저축 계좌도 같이 개설할까요?' },
    ],
    tags: ['admin', 'bank'],
    frequency: 75,
  },
  {
    id: 'admin-everyday-account',
    term: 'everyday account',
    meaningKo: '일반 입출금 계좌. (= transaction account). 호주 4대 은행 표준.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Salary goes to your everyday account.', ko: '월급은 일반 계좌로 들어가.' },
    ],
    tags: ['admin', 'bank', 'aussie'],
    frequency: 70,
  },
  {
    id: 'admin-debit-card',
    term: 'debit card',
    meaningKo: '직불 카드. (eftpos·Visa Debit·Mastercard Debit)',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Tap the debit card.', ko: '직불 카드 태그해.' },
    ],
    tags: ['admin', 'bank', 'payment'],
    frequency: 88,
  },
  {
    id: 'admin-credit-card',
    term: 'credit card',
    meaningKo: '신용카드. 워홀러는 발급 받기 어려움 (영주권자/시민권자 우선).',
    partOfSpeech: 'noun',
    examples: [
      { en: "I don't have a credit card here.", ko: '여기서 신용카드는 없어요.' },
    ],
    tags: ['admin', 'bank', 'payment'],
    frequency: 80,
  },
  {
    id: 'admin-branch',
    term: 'branch',
    ipa: '/brɑːntʃ/',
    meaningKo: '은행 지점. 카드 수령·서류 인증 등 일부는 방문 필요.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Visit the nearest branch.', ko: '가까운 지점 방문해.' },
    ],
    tags: ['admin', 'bank'],
    frequency: 65,
  },
  {
    id: 'admin-bsb',
    term: 'BSB',
    meaningKo: '은행/지점 코드 (Bank State Branch). 6자리. 호주 송금에 필수.',
    partOfSpeech: 'noun',
    examples: [
      { en: "What's your BSB?", ko: 'BSB 번호가 어떻게 돼?' },
    ],
    tags: ['admin', 'bank', 'aussie'],
    frequency: 95,
  },
  {
    id: 'admin-account-number',
    term: 'account number',
    meaningKo: '계좌번호. BSB와 함께 입력해야 송금됨.',
    partOfSpeech: 'noun',
    examples: [
      { en: "Send me your account number.", ko: '계좌번호 보내줘.' },
    ],
    tags: ['admin', 'bank'],
    frequency: 88,
  },
  {
    id: 'admin-transfer',
    term: 'transfer',
    ipa: '/ˈtrænsfɜːr/',
    meaningKo: '송금. 인터넷뱅킹·앱으로 처리.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Bank transfer is fine.', ko: '계좌이체 괜찮아.' },
    ],
    tags: ['admin', 'bank', 'payment'],
    frequency: 85,
  },
  {
    id: 'admin-payid',
    term: 'PayID',
    meaningKo: '호주 즉시 송금 시스템. 핸드폰·이메일로 송금 가능.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Send via PayID.', ko: 'PayID로 보내.' },
    ],
    tags: ['admin', 'bank', 'payment', 'aussie'],
    frequency: 75,
  },

  // ── 우체국 / 통신 (8) ──
  {
    id: 'admin-australia-post',
    term: 'Australia Post',
    meaningKo: '호주 우체국. 우편·소포·신분 인증 서비스 다양.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Drop it off at Australia Post.', ko: '호주 우체국에 맡겨.' },
    ],
    tags: ['admin', 'post', 'aussie'],
    frequency: 80,
  },
  {
    id: 'admin-parcel',
    term: 'parcel',
    ipa: '/ˈpɑːrsəl/',
    meaningKo: '소포 / 택배.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'A parcel for you.', ko: '소포 왔어.' },
    ],
    tags: ['admin', 'post'],
    frequency: 75,
  },
  {
    id: 'admin-tracking',
    term: 'tracking',
    meaningKo: '배송 추적. tracking number로 실시간 확인.',
    partOfSpeech: 'noun',
    examples: [
      { en: "What's the tracking number?", ko: '배송조회 번호 뭐야?' },
    ],
    tags: ['admin', 'post'],
    frequency: 70,
  },
  {
    id: 'admin-pickup',
    term: 'pickup',
    meaningKo: '직접 수령. 부재 시 카드 받고 우체국에서 픽업.',
    partOfSpeech: 'noun',
    examples: [
      { en: "It's ready for pickup.", ko: '수령 가능해.' },
    ],
    tags: ['admin', 'post'],
    frequency: 70,
  },
  {
    id: 'admin-prepaid',
    term: 'prepaid',
    meaningKo: '선불제. 호주 워홀러 핸드폰의 표준.',
    partOfSpeech: 'adjective',
    examples: [
      { en: 'I have a prepaid SIM.', ko: '선불 유심 써.' },
    ],
    tags: ['admin', 'telco'],
    frequency: 78,
  },
  {
    id: 'admin-mobile-plan',
    term: 'mobile plan',
    meaningKo: '모바일 요금제. (= phone plan)',
    partOfSpeech: 'noun',
    examples: [
      { en: "What's your mobile plan?", ko: '요금제 뭐 써?' },
    ],
    tags: ['admin', 'telco'],
    frequency: 70,
  },
  {
    id: 'admin-sim-card',
    term: 'SIM card',
    meaningKo: '심 카드. 도착 시 공항이나 우체국에서 구입.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Need a SIM card.', ko: '유심 사야 해.' },
    ],
    tags: ['admin', 'telco'],
    frequency: 88,
  },
  {
    id: 'admin-telco',
    term: 'telco',
    meaningKo: '통신사 (= telecommunications 줄임). Telstra·Optus·Vodafone 등.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Switch telco for cheaper plan.', ko: '더 싼 요금제로 통신사 바꿔.' },
    ],
    tags: ['admin', 'telco', 'aussie'],
    frequency: 60,
  },

  // ── 운전 / 면허 (10) ──
  {
    id: 'admin-drivers-licence',
    term: "driver's licence",
    meaningKo: '운전면허증. 호주 철자 licence.',
    partOfSpeech: 'noun',
    examples: [
      { en: "May I see your driver's licence?", ko: '면허증 좀 보여주실래요?' },
    ],
    tags: ['admin', 'driving', 'aussie'],
    frequency: 90,
  },
  {
    id: 'admin-learner-permit',
    term: 'learner permit',
    meaningKo: '학습 허가증. 운전 시작 단계 (L 단계).',
    partOfSpeech: 'noun',
    examples: [
      { en: "I'm on a learner permit.", ko: '학습 면허로 운전해.' },
    ],
    tags: ['admin', 'driving', 'aussie'],
    frequency: 50,
  },
  {
    id: 'admin-l-plate',
    term: 'L plate',
    meaningKo: 'L 단계 (Learner) 표시. 호주 운전 학습자가 차에 부착.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'L plates on the back.', ko: 'L 표시 뒤에 붙여.' },
    ],
    tags: ['admin', 'driving', 'aussie'],
    frequency: 55,
  },
  {
    id: 'admin-p-plate',
    term: 'P plate',
    meaningKo: 'P 단계 (Provisional) 표시. 정식 면허 전 단계.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'P-plater speed limit is 100.', ko: 'P 운전자 속도제한 100이야.' },
    ],
    tags: ['admin', 'driving', 'aussie'],
    frequency: 60,
  },
  {
    id: 'admin-rego',
    term: 'rego',
    ipa: '/ˈredʒoʊ/',
    meaningKo: '차량 등록 (registration 줄임). 매년 갱신 필수.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'My rego expires next month.', ko: '내 rego 다음 달 만료.' },
    ],
    tags: ['admin', 'driving', 'aussie', 'slang'],
    frequency: 80,
  },
  {
    id: 'admin-registration',
    term: 'registration',
    ipa: '/ˌredʒɪˈstreɪʃən/',
    meaningKo: '등록 / 차량 등록증.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Vehicle registration here.', ko: '차량 등록증 여기.' },
    ],
    tags: ['admin', 'driving'],
    frequency: 70,
  },
  {
    id: 'admin-roadworthy',
    term: 'roadworthy',
    meaningKo: '도로 운행 적합 인증 (RWC). 중고차 거래·rego 갱신 시 필요할 수 있음.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Need a roadworthy certificate.', ko: 'RWC 인증서 있어야 해.' },
    ],
    tags: ['admin', 'driving', 'aussie'],
    frequency: 50,
  },
  {
    id: 'admin-speed-camera',
    term: 'speed camera',
    meaningKo: '과속 단속 카메라. 호주 도로 곳곳.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Watch for the speed camera.', ko: '과속 카메라 조심해.' },
    ],
    tags: ['admin', 'driving'],
    frequency: 65,
  },
  {
    id: 'admin-demerit-point',
    term: 'demerit point',
    meaningKo: '벌점. 과속·신호 위반 시 누적.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'I lost three demerit points.', ko: '벌점 3점 받았어.' },
    ],
    tags: ['admin', 'driving', 'aussie'],
    frequency: 55,
  },
  {
    id: 'admin-international-permit',
    term: 'international driving permit',
    meaningKo: '국제운전면허증. 호주 입국 후 일정 기간 사용 가능 (주별 다름).',
    partOfSpeech: 'noun',
    examples: [
      { en: "I'm on my international driving permit.", ko: '국제면허로 운전 중이야.' },
    ],
    tags: ['admin', 'driving'],
    frequency: 65,
  },

  // ── 비자 / 이민 (10) ──
  {
    id: 'admin-immiaccount',
    term: 'ImmiAccount',
    meaningKo: '호주 이민성 온라인 계정. 비자 신청·관리에 필수.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Log into ImmiAccount.', ko: '이미아카운트 로그인해.' },
    ],
    tags: ['admin', 'visa', 'aussie'],
    frequency: 80,
  },
  {
    id: 'admin-visa-subclass',
    term: 'visa subclass',
    meaningKo: '비자 종류 (예: 417, 482, 500 등). 숫자로 구분.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'My visa subclass is 417.', ko: '내 비자 종류는 417이야.' },
    ],
    tags: ['admin', 'visa', 'aussie'],
    frequency: 70,
  },
  {
    id: 'admin-bridging-visa',
    term: 'bridging visa',
    meaningKo: '브리징 비자. 비자 신청 처리 중 호주에 머물 수 있게 해주는 임시 비자.',
    partOfSpeech: 'noun',
    examples: [
      { en: "I'm on a bridging visa.", ko: '브리징 비자로 머물고 있어.' },
    ],
    tags: ['admin', 'visa', 'aussie'],
    frequency: 75,
  },
  {
    id: 'admin-student-visa',
    term: 'student visa',
    meaningKo: '학생 비자 (subclass 500). 워홀 후 전환 옵션.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Switch to a student visa.', ko: '학생 비자로 전환해.' },
    ],
    tags: ['admin', 'visa', 'aussie'],
    frequency: 70,
  },
  {
    id: 'admin-condition-8503',
    term: 'condition 8503',
    meaningKo: '비자 조건 8503 — 추가 체류 금지 (No Further Stay). 다른 비자 신청 불가.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Check if your visa has 8503.', ko: '비자에 8503 조건 있나 확인해.' },
    ],
    tags: ['admin', 'visa', 'aussie'],
    frequency: 50,
  },
  {
    id: 'admin-offshore-application',
    term: 'offshore application',
    meaningKo: '호주 밖에서 신청. 일부 비자는 offshore에서만 가능.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'It must be an offshore application.', ko: '호주 밖에서 신청해야 해.' },
    ],
    tags: ['admin', 'visa'],
    frequency: 55,
  },
  {
    id: 'admin-onshore-application',
    term: 'onshore application',
    meaningKo: '호주 안에서 신청.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'You can do an onshore application.', ko: '호주 내에서 신청 가능해.' },
    ],
    tags: ['admin', 'visa'],
    frequency: 55,
  },
  {
    id: 'admin-visa-fee',
    term: 'visa fee',
    meaningKo: '비자 신청 수수료. 두 번째 워홀 비자 약 $635.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Visa fee is paid online.', ko: '비자 수수료는 온라인 결제.' },
    ],
    tags: ['admin', 'visa'],
    frequency: 65,
  },
  {
    id: 'admin-biometrics',
    term: 'biometrics',
    ipa: '/ˌbaɪoʊˈmetrɪks/',
    meaningKo: '생체정보 (지문·얼굴 사진). 일부 비자 신청 시 필수.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Book your biometrics appointment.', ko: '생체정보 예약 잡아.' },
    ],
    tags: ['admin', 'visa'],
    frequency: 50,
  },
  {
    id: 'admin-police-check',
    term: 'police check',
    meaningKo: '범죄경력 조회서. 일부 직종·비자 신청 시 요구.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'They asked for a police check.', ko: '범죄경력 조회서 요청 받았어.' },
    ],
    tags: ['admin', 'visa', 'work'],
    frequency: 60,
  },

  // ── 의료 / 보험 (8) ──
  {
    id: 'admin-private-health',
    term: 'private health',
    meaningKo: '사설 의료보험. Medicare 미적용 항목 보완.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Do you have private health?', ko: '사보험 들어 있어?' },
    ],
    tags: ['admin', 'medical', 'aussie'],
    frequency: 70,
  },
  {
    id: 'admin-ambulance-cover',
    term: 'ambulance cover',
    meaningKo: '구급차 보험. NSW·VIC 등은 호출 시 비싸서 별도 가입 권장.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Ambulance cover is a must.', ko: '구급차 보험 꼭 들어.' },
    ],
    tags: ['admin', 'medical', 'aussie'],
    frequency: 60,
  },
  {
    id: 'admin-pre-existing-condition',
    term: 'pre-existing condition',
    meaningKo: '기왕증 / 가입 전부터 있던 질병. 보험 약관에 영향.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Declare any pre-existing conditions.', ko: '기왕증 있으면 신고해.' },
    ],
    tags: ['admin', 'medical'],
    frequency: 50,
  },
  {
    id: 'admin-excess',
    term: 'excess',
    ipa: '/ˈekses/',
    meaningKo: '자기부담금. 청구 시 본인이 먼저 내야 하는 금액.',
    partOfSpeech: 'noun',
    examples: [
      { en: "What's the excess on this plan?", ko: '이 보험 자기부담 얼마야?' },
    ],
    tags: ['admin', 'medical', 'bills'],
    frequency: 55,
  },
  {
    id: 'admin-claim',
    term: 'claim',
    ipa: '/kleɪm/',
    meaningKo: '보험 청구. (cf. make a claim)',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Submit your claim online.', ko: '청구는 온라인으로 해.' },
    ],
    tags: ['admin', 'medical', 'bills'],
    frequency: 65,
  },
  {
    id: 'admin-co-payment',
    term: 'co-payment',
    meaningKo: '본인 일부 부담금. (= gap fee). bulk-billed 아닌 진료 시.',
    partOfSpeech: 'noun',
    examples: [
      { en: "Co-payment is $40.", ko: '본인부담 40달러야.' },
    ],
    tags: ['admin', 'medical'],
    frequency: 55,
  },
  {
    id: 'admin-specialist',
    term: 'specialist',
    ipa: '/ˈspeʃəlɪst/',
    meaningKo: '전문의. GP 진찰 후 referral로 만남.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'You need to see a specialist.', ko: '전문의 진료 받아야 해.' },
    ],
    tags: ['admin', 'medical'],
    frequency: 65,
  },
  {
    id: 'admin-referral',
    term: 'referral',
    ipa: '/rɪˈfɜːrəl/',
    meaningKo: '진료 의뢰서 / 소견서. 전문의 진료에 필수.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'GP gives you a referral.', ko: 'GP가 의뢰서 써줘.' },
    ],
    tags: ['admin', 'medical'],
    frequency: 70,
  },

  // ── 신원 / 서류 (10) ──
  {
    id: 'admin-id',
    term: 'ID',
    meaningKo: '신분증. 술집·은행·정부기관 등에서 요구.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Got any ID?', ko: '신분증 있어?' },
    ],
    tags: ['admin', 'document'],
    frequency: 92,
  },
  {
    id: 'admin-proof-of-address',
    term: 'proof of address',
    meaningKo: '주소 증빙. 공과금 고지서나 은행 명세서로 대체 가능.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Need proof of address.', ko: '주소 증빙 필요해.' },
    ],
    tags: ['admin', 'document'],
    frequency: 75,
  },
  {
    id: 'admin-birth-certificate',
    term: 'birth certificate',
    meaningKo: '출생증명서. 일부 행정에 한국 발급본 + 영문 번역.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Bring your birth certificate.', ko: '출생증명서 가져와.' },
    ],
    tags: ['admin', 'document'],
    frequency: 55,
  },
  {
    id: 'admin-statutory-declaration',
    term: 'statutory declaration',
    meaningKo: '법정 선언서 (Stat Dec). JP 입회하에 사실 진술.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Sign a statutory declaration.', ko: '법정 선언서에 서명해.' },
    ],
    tags: ['admin', 'document', 'aussie'],
    frequency: 50,
  },
  {
    id: 'admin-jp',
    term: 'JP',
    meaningKo: '치안판사 / 무료 공증인 (Justice of the Peace). 도서관·우체국 자주 상주.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Find a JP at the library.', ko: '도서관에서 JP 만날 수 있어.' },
    ],
    tags: ['admin', 'document', 'aussie'],
    frequency: 55,
  },
  {
    id: 'admin-witness',
    term: 'witness',
    ipa: '/ˈwɪtnɪs/',
    meaningKo: '증인 / 입회인.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'A witness must sign here.', ko: '증인이 여기 서명해야 해.' },
    ],
    tags: ['admin', 'document'],
    frequency: 60,
  },
  {
    id: 'admin-form',
    term: 'form',
    meaningKo: '양식. (= form 1234, Form 80 등 번호로 자주 부름)',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Download the form first.', ko: '양식부터 받아.' },
    ],
    tags: ['admin', 'document'],
    frequency: 88,
  },
  {
    id: 'admin-date-of-birth',
    term: 'date of birth',
    meaningKo: '생년월일 (DOB). 거의 모든 양식 단골 항목.',
    partOfSpeech: 'noun',
    examples: [
      { en: "What's your date of birth?", ko: '생년월일이 어떻게 돼?' },
    ],
    tags: ['admin', 'document'],
    frequency: 90,
  },
  {
    id: 'admin-signature',
    term: 'signature',
    ipa: '/ˈsɪɡnətʃər/',
    meaningKo: '서명. 호주는 sign과 sign-off 모두 흔함.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Your signature here.', ko: '서명은 여기.' },
    ],
    tags: ['admin', 'document'],
    frequency: 85,
  },
  {
    id: 'admin-certified-copy',
    term: 'certified copy',
    meaningKo: '인증된 사본. JP가 원본 대조해 도장 + 서명.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Bring a certified copy.', ko: '인증 사본 가져와.' },
    ],
    tags: ['admin', 'document', 'aussie'],
    frequency: 55,
  },

  // ── 정부 기관 / 서비스 (10) ──
  {
    id: 'admin-centrelink',
    term: 'Centrelink',
    meaningKo: '호주 복지부. 실업·학생·가족 수당 담당.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Visit Centrelink to apply.', ko: '센터링크 가서 신청해.' },
    ],
    tags: ['admin', 'government', 'aussie'],
    frequency: 75,
  },
  {
    id: 'admin-ato',
    term: 'ATO',
    meaningKo: '호주 국세청 (Australian Taxation Office). 세금 신고는 ATO 사이트.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Lodge with the ATO.', ko: 'ATO에 신고해.' },
    ],
    tags: ['admin', 'government', 'aussie'],
    frequency: 88,
  },
  {
    id: 'admin-service-nsw',
    term: 'Service NSW',
    meaningKo: 'NSW 시민 서비스 통합 창구. 다른 주는 VicRoads, Service Vic 등.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Book at Service NSW.', ko: 'Service NSW에서 예약해.' },
    ],
    tags: ['admin', 'government', 'aussie'],
    frequency: 65,
  },
  {
    id: 'admin-council',
    term: 'council',
    ipa: '/ˈkaʊnsəl/',
    meaningKo: '시청 / 지자체. 쓰레기 수거·도로 관리·공원 등 담당.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Contact your local council.', ko: '시청에 문의해.' },
    ],
    tags: ['admin', 'government', 'aussie'],
    frequency: 70,
  },
  {
    id: 'admin-mygov',
    term: 'myGov',
    meaningKo: '호주 정부 통합 포털. Medicare·ATO·Centrelink 한 번에.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Link it via myGov.', ko: 'myGov로 연결해.' },
    ],
    tags: ['admin', 'government', 'aussie'],
    frequency: 90,
  },
  {
    id: 'admin-legal-aid',
    term: 'legal aid',
    meaningKo: '법률 구조. 저소득자 무료 법률 자문.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Try Legal Aid for free advice.', ko: '무료 법률 자문은 Legal Aid에.' },
    ],
    tags: ['admin', 'government'],
    frequency: 50,
  },
  {
    id: 'admin-ombudsman',
    term: 'ombudsman',
    ipa: '/ˈɒmbədzmən/',
    meaningKo: '옴부즈맨. 통신·은행·임대 분쟁 시 이용 가능한 중재 기관.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Take it to the ombudsman.', ko: '옴부즈맨에 신고해.' },
    ],
    tags: ['admin', 'government'],
    frequency: 50,
  },
  {
    id: 'admin-consumer-affairs',
    term: 'consumer affairs',
    meaningKo: '소비자 보호 기관. 환불·계약 분쟁.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Report it to Consumer Affairs.', ko: '소비자 보호국에 신고해.' },
    ],
    tags: ['admin', 'government', 'aussie'],
    frequency: 50,
  },
  {
    id: 'admin-police-station',
    term: 'police station',
    meaningKo: '경찰서. 범죄 신고는 000, 비응급은 131 444.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Report at the local police station.', ko: '동네 경찰서에 신고해.' },
    ],
    tags: ['admin', 'government', 'emergency'],
    frequency: 65,
  },
  {
    id: 'admin-tax-invoice',
    term: 'tax invoice',
    meaningKo: '세금계산서. GST 포함된 정식 영수증.',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Can I get a tax invoice?', ko: '세금계산서 받을 수 있어요?' },
    ],
    tags: ['admin', 'bills', 'aussie'],
    frequency: 70,
  },

  // ── 행정 액션 / 표현 (14) ──
  {
    id: 'admin-fill-in',
    term: 'fill in',
    meaningKo: '(양식을) 작성하다.',
    partOfSpeech: 'phrasal-verb',
    examples: [
      { en: 'Fill in this form.', ko: '이 양식 작성해.' },
    ],
    tags: ['admin', 'action'],
    frequency: 92,
  },
  {
    id: 'admin-submit',
    term: 'submit',
    ipa: '/səbˈmɪt/',
    meaningKo: '제출하다.',
    partOfSpeech: 'verb',
    examples: [
      { en: 'Submit the application.', ko: '신청서 제출해.' },
    ],
    tags: ['admin', 'action'],
    frequency: 88,
  },
  {
    id: 'admin-sign-here',
    term: 'sign here',
    meaningKo: '여기 서명해. 양식 단골.',
    partOfSpeech: 'phrase',
    examples: [
      { en: 'Sign here, please.', ko: '여기 서명해 주세요.' },
    ],
    tags: ['admin', 'action', 'frozen-phrase'],
    frequency: 90,
  },
  {
    id: 'admin-tick-the-box',
    term: 'tick the box',
    meaningKo: '체크박스에 체크하다.',
    partOfSpeech: 'phrase',
    examples: [
      { en: 'Tick the box if you agree.', ko: '동의하면 체크해.' },
    ],
    tags: ['admin', 'action', 'aussie'],
    frequency: 75,
  },
  {
    id: 'admin-attach',
    term: 'attach',
    ipa: '/əˈtætʃ/',
    meaningKo: '첨부하다. 이메일·신청서 모두.',
    partOfSpeech: 'verb',
    examples: [
      { en: 'Attach a copy of your visa.', ko: '비자 사본 첨부해.' },
    ],
    tags: ['admin', 'action'],
    frequency: 78,
  },
  {
    id: 'admin-upload',
    term: 'upload',
    meaningKo: '업로드하다.',
    partOfSpeech: 'verb',
    examples: [
      { en: 'Upload your documents.', ko: '서류 업로드해.' },
    ],
    tags: ['admin', 'action'],
    frequency: 80,
  },
  {
    id: 'admin-verify',
    term: 'verify',
    ipa: '/ˈverɪfaɪ/',
    meaningKo: '확인 / 인증하다.',
    partOfSpeech: 'verb',
    examples: [
      { en: 'Verify your identity.', ko: '본인 인증 해.' },
    ],
    tags: ['admin', 'action'],
    frequency: 80,
  },
  {
    id: 'admin-update',
    term: 'update',
    meaningKo: '갱신하다 / 정보 업데이트.',
    partOfSpeech: 'verb',
    examples: [
      { en: 'Update your address.', ko: '주소 업데이트 해.' },
    ],
    tags: ['admin', 'action'],
    frequency: 80,
  },
  {
    id: 'admin-enquire',
    term: 'enquire',
    ipa: '/ɪnˈkwaɪər/',
    meaningKo: '문의하다. 호주식 철자 (= inquire).',
    partOfSpeech: 'verb',
    examples: [
      { en: "I'd like to enquire about my visa.", ko: '비자 관련 문의드려요.' },
    ],
    tags: ['admin', 'action', 'aussie'],
    frequency: 70,
  },
  {
    id: 'admin-pay-a-fine',
    term: 'pay a fine',
    meaningKo: '벌금 내다.',
    partOfSpeech: 'phrase',
    examples: [
      { en: 'Pay the fine online.', ko: '벌금 온라인으로 내.' },
    ],
    tags: ['admin', 'action', 'driving'],
    frequency: 60,
  },
  {
    id: 'admin-get-a-quote',
    term: 'get a quote',
    meaningKo: '견적 받다.',
    partOfSpeech: 'phrase',
    examples: [
      { en: 'Get a quote first.', ko: '먼저 견적 받아.' },
    ],
    tags: ['admin', 'action', 'bills'],
    frequency: 65,
  },
  {
    id: 'admin-get-in-touch',
    term: 'get in touch',
    meaningKo: '연락하다.',
    partOfSpeech: 'phrase',
    examples: [
      { en: "Get in touch if you have questions.", ko: '문의 있으면 연락줘.' },
    ],
    tags: ['admin', 'action', 'frozen-phrase'],
    frequency: 78,
  },
  {
    id: 'admin-on-hold',
    term: 'on hold',
    meaningKo: '전화 대기. 호주 콜센터 단골 표현.',
    partOfSpeech: 'phrase',
    examples: [
      { en: "I've been on hold for an hour.", ko: '한 시간째 대기 중이야.' },
    ],
    tags: ['admin', 'action', 'telco'],
    frequency: 70,
  },
  {
    id: 'admin-press-1',
    term: 'press 1',
    meaningKo: '1번을 누르세요. 자동응답(IVR) 안내.',
    partOfSpeech: 'phrase',
    examples: [
      { en: 'Press 1 for English.', ko: '영어는 1번을 누르세요.' },
    ],
    tags: ['admin', 'action', 'telco'],
    frequency: 72,
  },
];

const deck: Deck = {
  id: 'admin',
  title: '행정 / 관공서',
  description: '은행·우체국·면허·비자·Medicare·myGov·Centrelink — 호주 정착에 거치는 공식 절차.',
  scenarioOrder: 6,
  estimatedHours: 6,
  wordIds: words.map((w) => w.id),
};

export const adminDeck = { deck, words };
