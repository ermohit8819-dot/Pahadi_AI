import { ServiceItem, GovernmentDocument } from '../types/index.ts';

export const OFFICIAL_SERVICES: ServiceItem[] = [
  {
    id: 'income-cert',
    name: {
      hi: 'आय प्रमाण पत्र (Income Certificate)',
      en: 'Income Certificate',
      garhwali: 'आय प्रमाण पत्र (कमाइ को पर्चो)',
      kumaoni: 'आय प्रमाण पत्र (कमाइ को कागज)',
    },
    department: {
      hi: 'राजस्व विभाग, उत्तराखण्ड सरकार',
      en: 'Revenue Department, Government of Uttarakhand',
    },
    category: 'certificate',
    summary: {
      hi: 'छात्रवृत्ति, सरकारी नौकरी और योजनाओं के लिए परिवार की वार्षिक आय का 6 माह वैध सरकारी प्रमाण पत्र।',
      en: 'Official certificate certifying annual family income issued by Uttarakhand Revenue Department, valid for 6 months.',
      garhwali: 'छात्रवृत्ति और सरकारी योजना खातिर अपनी कमाई को सरकारी प्रमाण पत्र।',
      kumaoni: 'सरकारी मदद और वजीफा लिन खातिर परिवारक कमाइ को पक्का सबूत।',
    },
    eligibility: [
      'उत्तराखण्ड का स्थायी अथवा सामान्य निवासी नागरिक।',
      'परिवार की सभी स्रोतों से कुल वार्षिक आय का प्रामाणिक विवरण।',
    ],
    requiredDocuments: [
      'आधार कार्ड (Aadhaar Card)',
      'पटवारी आख्या अथवा वेतन पर्ची (Patwari Verification / Salary Slip)',
      'राशन कार्ड अथवा परिवार रजिस्टर नकल (Ration Card or Parivar Register copy)',
      'स्व-घोषणा शपथ पत्र (Self-declaration affidavit)',
      'पासपोर्ट साइज फोटो (Passport Size Photo)',
    ],
    officialFee: '₹30 (सीएससी केंद्र) | ₹0 (अपणि सरकार पोर्टल)',
    timelineDays: 15,
    officialPortalUrl: 'https://eservices.uk.gov.in',
    offlineCenter: 'निकटतम तहसील कार्यालय अथवा सीएससी / ई-डिस्ट्रिक्ट केंद्र',
    keywords: ['आय', 'income', 'salary', 'patwari', 'कमाइ', 'छात्रवृत्ति', 'aay'],
    verifiedOfficial: true,
    sampleQuestion: 'मुझे आय प्रमाण पत्र बनवाना है। इसके लिए कौन-कौन से दस्तावेज चाहिए?',
  },
  {
    id: 'caste-cert',
    name: {
      hi: 'जाति प्रमाण पत्र (Caste Certificate - SC/ST/OBC)',
      en: 'Caste Certificate (SC / ST / OBC)',
      garhwali: 'जाति प्रमाण पत्र (जाति को पर्चो)',
      kumaoni: 'जाति प्रमाण पत्र (जात को प्रमाणपत्र)',
    },
    department: {
      hi: 'राजस्व विभाग, उत्तराखण्ड सरकार',
      en: 'Revenue Department, Government of Uttarakhand',
    },
    category: 'certificate',
    summary: {
      hi: 'अनुसूचित जाति (SC), जनजाति (ST) एवं अन्य पिछड़ा वर्ग (OBC) हेतु आरक्षण व सरकारी लाभ का वैधानिक प्रमाण।',
      en: 'Official document verifying membership in SC, ST, or OBC category for reservations and state government benefits.',
      garhwali: 'आरक्षण और सरकारी सुविधा ल्युणा खातिर जाति को सरकारी दस्तावेज।',
      kumaoni: 'सरकारी नौकिरी अर आरक्षणक फायद खातिर जातिक प्रमाणपत्र।',
    },
    eligibility: [
      'उत्तराखण्ड राज्य में अधिसूचित आरक्षित श्रेणी का नागरिक।',
      'राज्य में सन् 1985 या उससे पूर्व से निरंतर निवास का साक्ष्य।',
    ],
    requiredDocuments: [
      'आवेदक का आधार कार्ड',
      'पिता या पूर्वज का जाति प्रमाण पत्र अथवा पुराना भू-अभिलेख',
      'उत्तराखण्ड मूल निवास / स्थायी निवास प्रमाण पत्र',
      'परिवार रजिस्टर की नकल',
      'ओबीसी हेतु 3 वर्ष का आय प्रमाण पत्र',
    ],
    officialFee: '₹30 (सीएससी केंद्र) | ₹0 (ऑनलाइन पोर्टल)',
    timelineDays: 15,
    officialPortalUrl: 'https://eservices.uk.gov.in',
    offlineCenter: 'सम्बन्धित उप-जिलाधिकारी (SDM) / तहसील कार्यालय',
    keywords: ['जाति', 'caste', 'obc', 'sc', 'st', 'आरक्षण', 'जात'],
    verifiedOfficial: true,
    sampleQuestion: 'What documents are required for a caste certificate in Uttarakhand?',
  },
  {
    id: 'domicile-cert',
    name: {
      hi: 'स्थायी निवास / मूल निवास प्रमाण पत्र (Permanent Residence)',
      en: 'Permanent Resident / Domicile Certificate',
      garhwali: 'मूल निवास / डांडा-कांठा को पक्का बासिंदा प्रमाण',
      kumaoni: 'मूल निवास प्रमाणपत्र (उत्तराखण्डक बासिंदा)',
    },
    department: {
      hi: 'राजस्व विभाग, उत्तराखण्ड सरकार',
      en: 'Revenue Department, Government of Uttarakhand',
    },
    category: 'certificate',
    summary: {
      hi: 'उत्तराखण्ड राज्य की नौकरियों, शिक्षण संस्थानों में प्रवेश एवं योजनाओं हेतु स्थायी बाशिंदा होने का कानूनी प्रमाण।',
      en: 'Legal proof of permanent residency in Uttarakhand, compulsory for state government jobs and education quotas.',
      garhwali: 'उत्तराखण्ड का बाशिंदा होणा को पक्का सरकारी प्रमाण।',
      kumaoni: 'हाम उत्तराखण्डक स्थायी नागरिक छू, याको सरकारी सबूत।',
    },
    eligibility: [
      'उत्तराखण्ड में जन्म अथवा न्यूनतम 15 वर्षों से निरंतर निवास।',
      'अथवा पैतृक भूमि/मकान राज्य में स्थित होना।',
    ],
    requiredDocuments: [
      'स्वयं एवं माता-पिता का आधार कार्ड',
      '15 वर्षों के निवास का साक्ष्य (शिक्षा प्रमाण पत्र / खतौनी / बिजली बिल)',
      'परिवार रजिस्टर की नकल',
      'भूमि की खतौनी या भू-अभिलेख',
      'पटवारी / तहसीलदार सत्यापन आख्या',
    ],
    officialFee: '₹30 (सीएससी केंद्र) | ₹0 (ऑनलाइन पोर्टल)',
    timelineDays: 15,
    officialPortalUrl: 'https://eservices.uk.gov.in',
    offlineCenter: 'तहसीलदार कार्यालय अथवा नजदीकी सीएससी जन सेवा केंद्र',
    keywords: ['मूल निवास', 'स्थायी निवास', 'domicile', 'permanent residence', 'niwas'],
    verifiedOfficial: true,
    sampleQuestion: 'उत्तराखण्ड में मूल निवास प्रमाण पत्र कैसे बनेगा और कितने दिन लगेंगे?',
  },
  {
    id: 'hill-area-cert',
    name: {
      hi: 'पर्वतीय क्षेत्र प्रमाण पत्र (Hill Area Certificate)',
      en: 'Hill Area / Backward Area Certificate',
      garhwali: 'पहाड़ी क्षेत्र को प्रमाण पत्र (डांडा-कांठा को पर्चो)',
      kumaoni: 'पर्वतीय क्षेत्र प्रमाणपत्र (पहाड़क नागरिक)',
    },
    department: {
      hi: 'राजस्व विभाग, उत्तराखण्ड सरकार',
      en: 'Revenue Department, Government of Uttarakhand',
    },
    category: 'certificate',
    summary: {
      hi: 'उत्तराखण्ड के पर्वतीय जनपदों के निवासियों को पुलिस, सेना, अर्द्धसैनिक बलों की भर्ती में ऊंचाई (Height) व छाती (Chest) में सरकारी छूट हेतु विशिष्ट प्रमाण पत्र।',
      en: 'Exclusive certificate for residents of hill districts to claim height, chest, and physical requirement relaxations in police, army and central paramilitary recruitment.',
      garhwali: 'सेना और पुलिस भर्ती में लम्बाई-सीना की छूट खातिर पहाड़ी क्षेत्र प्रमाणपत्र।',
      kumaoni: 'फौज और पुलिस भर्ती म हाइट की छूट लिन खातिर पर्वतीय प्रमाणपत्र।',
    },
    eligibility: [
      'उत्तराखण्ड के अधिसूचित पर्वतीय विकासखण्ड अथवा जनपद का स्थायी निवासी।',
      'समुद्र तल से निर्धारित ऊंचाई वाले पर्वतीय क्षेत्र में निवास का प्रमाण।',
    ],
    requiredDocuments: [
      'आधार कार्ड (Aadhaar Card)',
      'उत्तराखण्ड स्थायी निवास / मूल निवास प्रमाण पत्र',
      'परिवार रजिस्टर की नकल (Parivar Register copy)',
      'भूमि की खतौनी अथवा मकान का प्रमाण',
      'पटवारी जांच आख्या (Patwari Verification Report)',
    ],
    officialFee: '₹30 (सीएससी केंद्र) | ₹0 (अपणि सरकार पोर्टल)',
    timelineDays: 15,
    officialPortalUrl: 'https://eservices.uk.gov.in',
    offlineCenter: 'सम्बन्धित उप-जिलाधिकारी (SDM) / तहसील',
    keywords: ['पर्वतीय', 'hill', 'hill area', 'पहाड़ी', 'height', 'सेना', 'भर्ती', 'छूट', 'police'],
    verifiedOfficial: true,
    sampleQuestion: 'पर्वतीय क्षेत्र प्रमाण पत्र (Hill Certificate) कैसे बनता है और क्या छूट मिलती है?',
  },
  {
    id: 'parivar-register',
    name: {
      hi: 'परिवार रजिस्टर की नकल (Parivar Register Copy)',
      en: 'Parivar Register Nakal / Family Register',
      garhwali: 'परिवार रजिस्टर की नकल (कुटुंब को बही-खाता)',
      kumaoni: 'परिवार रजिस्टरक नकल (घरक सब मनखिन को नाम)',
    },
    department: {
      hi: 'पंचायती राज विभाग, उत्तराखण्ड',
      en: 'Panchayati Raj Department, Uttarakhand',
    },
    category: 'citizen',
    summary: {
      hi: 'ग्राम पंचायत के कुटुंब रजिस्टर से परिवार के सभी सदस्यों के नाम, आयु व रिश्ते का आधिकारिक दस्तावेज, जो सभी प्रमाण पत्रों की नींव है।',
      en: 'Official extract of the village family register verifying all household members, mandatory for all certificate and welfare applications.',
      garhwali: 'गाँव का परिवार रजिस्टर से अपना कुणबा को सरकारी पर्चो।',
      kumaoni: 'ग्राम पंचायतक बही है परिवारक सबुतैं कागज।',
    },
    eligibility: [
      'उत्तराखण्ड के किसी भी ग्राम पंचायत अथवा राजस्व ग्राम का निवासी।',
    ],
    requiredDocuments: [
      'मुखिया अथवा आवेदक का आधार कार्ड',
      'राशन कार्ड अथवा पुराना परिवार रजिस्टर क्रमांक',
      'ग्राम प्रधान / ग्राम विकास अधिकारी (VDO) की संस्तुति',
    ],
    officialFee: '₹2 विभागीय शुल्क (ऑनलाइन अपणि सरकार पोर्टल पर निःशुल्क)',
    timelineDays: 2,
    officialPortalUrl: 'https://eservices.uk.gov.in',
    offlineCenter: 'ग्राम विकास अधिकारी (VDO) कार्यालय / ब्लॉक विकास अधिकारी (BDO)',
    keywords: ['परिवार रजिस्टर', 'parivar register', 'nakal', 'kutumb', 'कुटुंब', 'नकल'],
    verifiedOfficial: true,
    sampleQuestion: 'परिवार रजिस्टर की नकल कैसे प्राप्त करें?',
  },
  {
    id: 'ews-cert',
    name: {
      hi: 'ईडब्ल्यूएस प्रमाण पत्र (Economically Weaker Section - EWS)',
      en: 'EWS Certificate (General Category Economically Weaker Section)',
      garhwali: 'ईडब्ल्यूएस प्रमाण पत्र (सामान्य वर्ग गरीब पर्चो)',
      kumaoni: 'ईडब्ल्यूएस प्रमाणपत्र (सामान्य वर्गक आर्थिक आरक्षण)',
    },
    department: {
      hi: 'राजस्व विभाग, उत्तराखण्ड सरकार',
      en: 'Revenue Department, Government of Uttarakhand',
    },
    category: 'certificate',
    summary: {
      hi: 'सामान्य वर्ग के आर्थिक रूप से कमजोर परिवारों को 10% सरकारी नौकरी व शैक्षणिक आरक्षण हेतु 1 वर्ष वैध प्रमाण पत्र।',
      en: '10% quota eligibility certificate for economically weaker general category citizens with annual income below ₹8 Lakh.',
      garhwali: 'सामान्य जाति का भाई-बहनों खातिर 10% आरक्षण को ईडब्ल्यूएस पर्चो।',
      kumaoni: 'सामान्य जातिक 10% आरक्षण लिन खातिर ईडब्ल्यूएस प्रमाणपत्र।',
    },
    eligibility: [
      'आवेदक सामान्य वर्ग (General) से हो (SC/ST/OBC में शामिल न हो)।',
      'परिवार की कुल वार्षिक आय ₹8 लाख से कम हो।',
      'कृषि भूमि 5 एकड़ से कम तथा आवासीय मकान 1000 वर्गफुट से कम हो।',
    ],
    requiredDocuments: [
      'आधार कार्ड एवं पैन कार्ड',
      'आय प्रमाण पत्र (सकल पारिवारिक आय)',
      'स्थायी निवास प्रमाण पत्र',
      'परिवार रजिस्टर की नकल',
      'भूमि/मकान की खतौनी एवं शपथ पत्र',
    ],
    officialFee: '₹30 (सीएससी केंद्र) | ₹0 (ऑनलाइन पोर्टल)',
    timelineDays: 15,
    officialPortalUrl: 'https://eservices.uk.gov.in',
    offlineCenter: 'तहसीलदार / उप-जिलाधिकारी (SDM) कार्यालय',
    keywords: ['ews', 'ईडब्ल्यूएस', 'general', 'आरक्षण', '10%', 'आर्थिक रूप से कमजोर'],
    verifiedOfficial: true,
    sampleQuestion: 'EWS प्रमाण पत्र बनवाने के नियम और शर्तें क्या हैं?',
  },
  {
    id: 'old-age-pension',
    name: {
      hi: 'वृद्धावस्था पेंशन योजना (Old Age Pension - ₹1500/माह)',
      en: 'Old Age Pension Scheme (₹1,500/Month)',
      garhwali: 'बजुर्ग पेंशन योजना (बुजुर्ग दाज्यू-ब्वै खातिर)',
      kumaoni: 'बुजुर्ग पेंशन (बूबू-आमा पेंशन योजना)',
    },
    department: {
      hi: 'समाज कल्याण विभाग, उत्तराखण्ड सरकार',
      en: 'Social Welfare Department, Government of Uttarakhand',
    },
    category: 'pension',
    summary: {
      hi: '60 वर्ष से अधिक आयु के वरिष्ठ नागरिकों को प्रतिमाह ₹1500 की आर्थिक सहायता सीधे बैंक खाते में (DBT)।',
      en: 'Monthly financial assistance of ₹1,500 deposited directly via DBT to senior citizens aged 60 and above.',
      garhwali: '60 साल से ज्यादा उम्र का बुजुर्गों खातिर हर मैना 1500 रुप्या पेंशन।',
      kumaoni: '60 बरस बटि जाद उम्रक बुजुर्गोंक बैंक खात में हर मैना ₹1500 सहायत।',
    },
    eligibility: [
      'आयु 60 वर्ष या उससे अधिक।',
      'बीपीएल (BPL) परिवार अथवा ग्रामीण क्षेत्र में ₹4000/माह से कम पारिवारिक आय (65 वर्ष से अधिक को आय सीमा से छूट)।',
      'अन्य सरकारी पेंशन न मिलती हो।',
    ],
    requiredDocuments: [
      'आधार कार्ड (Aadhaar Card linked with Bank Account)',
      'आयु प्रमाण पत्र (वोटर आईडी / हाईस्कूल प्रमाण पत्र / सीएमओ मेडिकल रिपोर्ट)',
      'बैंक पासबुक की प्रति (DBT सक्रिय)',
      'आय प्रमाण पत्र अथवा बीपीएल कार्ड',
      'पासपोर्ट साइज फोटो',
    ],
    officialFee: 'नि:शुल्क (Free of Cost)',
    timelineDays: 30,
    officialPortalUrl: 'https://ssp.uk.gov.in',
    offlineCenter: 'ब्लॉक विकास अधिकारी (BDO) अथवा जिला समाज कल्याण अधिकारी',
    keywords: ['पेंशन', 'वृद्धावस्था', 'old age', 'pension', 'bujurg', 'samaj kalyan', '1500'],
    verifiedOfficial: true,
    sampleQuestion: 'वृद्धावस्था पेंशन के लिए पात्रता क्या है और कितना पैसा मिलता है?',
  },
  {
    id: 'ration-card',
    name: {
      hi: 'राशन कार्ड सेवा (Ration Card - NFSA / Antyodaya)',
      en: 'Ration Card Service (NFSA / AAY)',
      garhwali: 'राशन कार्ड (सस्ता गल्ला कार्ड)',
      kumaoni: 'राशन कार्ड (सस्ती दुकान को कार्ड)',
    },
    department: {
      hi: 'खाद्य एवं नागरिक आपूर्ति विभाग',
      en: 'Department of Food, Civil Supplies & Consumer Affairs',
    },
    category: 'ration',
    summary: {
      hi: 'सस्ता गल्ला दुकान से रियायती गेहूं, चावल, चीनी प्राप्त करने हेतु नया राशन कार्ड अथवा परिवार के सदस्य का नाम जोड़ना।',
      en: 'Issuance and renewal of subsidized foodgrain ration cards under NFSA, Antyodaya Anna Yojana and State Food Scheme.',
      garhwali: 'सस्ता गल्ला और राशन दुकान से कोटा ल्युणा खातिर कार्ड।',
      kumaoni: 'सस्त गल्ले दुकान है अनाज लिन खातिर पारिवारिक कार्ड।',
    },
    eligibility: [
      'परिवार की महिला मुखिया के नाम से राशन कार्ड जारी होता है।',
      'आयकर दाता अथवा सरकारी कर्मचारी न हो (प्राथमिकता श्रेणी हेतु)।',
    ],
    requiredDocuments: [
      'परिवार के सभी सदस्यों के आधार कार्ड',
      'महिला मुखिया का बैंक खाता पासबुक',
      'परिवार रजिस्टर की नकल',
      'निवास प्रमाण पत्र अथवा बिजली/पानी बिल',
    ],
    officialFee: '₹10 - ₹20 विभागीय शुल्क',
    timelineDays: 30,
    officialPortalUrl: 'https://fcs.uk.gov.in',
    offlineCenter: 'क्षेत्रीय पूर्ति निरीक्षक (Supply Inspector) / जिला पूर्ति अधिकारी',
    keywords: ['राशन कार्ड', 'ration card', 'खाद्य', 'गेहूं', 'चावल', 'सस्ता गल्ला'],
    verifiedOfficial: true,
    sampleQuestion: 'नया राशन कार्ड बनवाने के लिए क्या नियम और दस्तावेज हैं?',
  },
  {
    id: 'farmer-schemes',
    name: {
      hi: 'किसान कल्याण योजनाएं (PM Kisan & 80% Polyhouse Subsidy)',
      en: 'Farmer Welfare Schemes (PM Kisan & Polyhouse Subsidy)',
      garhwali: 'किसान भाई-बहनों खातिर सरकारी योजनाएं',
      kumaoni: 'किसान सहायता योजना (खेती-बाड़ी सहायत)',
    },
    department: {
      hi: 'कृषि एवं कृषक कल्याण विभाग, उत्तराखण्ड',
      en: 'Department of Agriculture & Farmers Welfare, Uttarakhand',
    },
    category: 'farmer',
    summary: {
      hi: 'सालाना ₹6000 किसान सम्मान निधि के साथ पर्वतीय क्षेत्रों में पॉलीहाउस पर 80% तक का भारी सरकारी अनुदान।',
      en: 'Comprehensive support including PM-Kisan financial aid, polyhouse subsidies up to 80%, organic farming incentives in hill districts.',
      garhwali: 'पहाड़ी खेती, पॉलीहाउस और बीज-खाद खातिर सरकार तरफ से 80% सब्सिडी।',
      kumaoni: 'पहाड़क खेतान में पॉलीहाउस और औजारन पर भारी छूट अर मदद।',
    },
    eligibility: [
      'उत्तराखण्ड में कृषि भूमि का खाताधारक (खतौनी में नाम दर्ज)।',
      'ई-केवाईसी (e-KYC) और भू-अभिलेख सत्यापन पूर्ण।',
    ],
    requiredDocuments: [
      'नवीनतम भू-अभिलेख / खतौनी (Khatauni Land Record)',
      'आधार कार्ड (मोबाइल लिंक्ड)',
      'बैंक पासबुक (DBT सक्रिय)',
    ],
    officialFee: 'नि:शुल्क (Free of Cost)',
    timelineDays: 15,
    officialPortalUrl: 'https://agriculture.uk.gov.in',
    offlineCenter: 'न्याय पंचायत कृषि केंद्र अथवा मुख्य कृषि अधिकारी कार्यालय',
    keywords: ['किसान', 'farmer', 'pm kisan', 'polyhouse', 'पॉलीहाउस', 'कृषि', 'खेती'],
    verifiedOfficial: true,
    sampleQuestion: 'What government schemes are available for farmers in Uttarakhand?',
  },
  {
    id: 'csc-center-locator',
    name: {
      hi: 'नजदीकी नागरिक सेवा केंद्र (CSC / e-District Locator)',
      en: 'CSC & Apuni Sarkar Center Locator',
      garhwali: 'नजदीकी सरकारी सेवा केंद्र (सीएससी)',
      kumaoni: 'आस-पासक जन सेवा केंद्र (CSC)',
    },
    department: {
      hi: 'सूचना प्रौद्योगिकी विकास एजेंसी (ITDA), उत्तराखण्ड',
      en: 'Information Technology Development Agency (ITDA), Uttarakhand',
    },
    category: 'citizen',
    summary: {
      hi: 'उत्तराखण्ड के 13 जिलों के पर्वतीय व मैदानी क्षेत्रों में स्थित 8,000+ जन सेवा केंद्र जहां केवल ₹30 में सरकारी आवेदन किया जा सकता है।',
      en: 'Directory and assistance to locate your nearest government Common Service Center (CSC) across all 13 hill and plain districts.',
      garhwali: 'अपने ब्लॉक, तहसील और गाँव का नजदीकी सीएससी केंद्र की जानकारी।',
      kumaoni: 'अपन गांक सबुतैं नजदिक जन सेवा केंद्र पत करन खातिर।',
    },
    eligibility: [
      'उत्तराखण्ड के सभी नागरिक बिना किसी भेदभाव के सेवा प्राप्त कर सकते हैं।',
    ],
    requiredDocuments: [
      'वांछित सेवा के अनुसार आवश्यक मूल दस्तावेज एवं आधार कार्ड।',
    ],
    officialFee: 'मानक शुल्क ₹30 प्रति आवेदन (निर्धारित सरकारी दर)',
    timelineDays: 0,
    officialPortalUrl: 'https://locator.csccloud.in',
    offlineCenter: 'उत्तराखण्ड के सभी 13 जनपदों के हर ग्राम व बाजार में',
    keywords: ['सीएससी', 'csc', 'center', 'service center', 'कहाँ है', 'nearest', 'तहसील'],
    verifiedOfficial: true,
    sampleQuestion: 'Where is my nearest government service centre (CSC) in Uttarakhand?',
  },
];

export const INITIAL_GOVERNMENT_DOCUMENTS: GovernmentDocument[] = [
  {
    id: 'gov-doc-1',
    title: 'अपणि सरकार पोर्टल (Apuni Sarkar - eservices.uk.gov.in) नागरिक संदर्शिका',
    department: 'सूचना प्रौद्योगिकी विकास एजेंसी (ITDA), उत्तराखण्ड',
    category: 'citizen',
    content: `अपणि सरकार (eservices.uk.gov.in) उत्तराखण्ड सरकार का अधिकृत सिंगल-विंडो पोर्टल है।
राजस्व विभाग के अंतर्गत आय प्रमाण पत्र, जाति प्रमाण पत्र, स्थायी निवास प्रमाण पत्र, पर्वतीय क्षेत्र प्रमाण पत्र, और ईडब्ल्यूएस प्रमाण पत्र 15 कार्यदिवस में जारी किए जाते हैं।
आवेदन हेतु पोर्टल पर निःशुल्क पंजीकरण किया जा सकता है, अथवा नजदीकी सीएससी केंद्र पर ₹30 शुल्क देकर आवेदन कराया जा सकता है।
आवेदन के बाद प्राप्त 16 अंकों के संदर्भ संख्या (Reference No) से कभी भी पोर्टल पर स्थिति ट्रैक की जा सकती है।
सत्यापन के उपरांत डिजिटल हस्ताक्षरित प्रमाण पत्र सीधे पोर्टल से क्यूआर कोड सहित डाउनलोड किए जा सकते हैं।
आधिकारिक पोर्टल: https://eservices.uk.gov.in/`,
    sourceUrl: 'https://eservices.uk.gov.in',
    dateAdded: '2026-03-01',
    fileType: 'guideline',
    chunkCount: 4,
    verifiedOfficial: true,
  },
  {
    id: 'gov-doc-2',
    title: 'उत्तराखण्ड सेवा का अधिकार अधिनियम 2011 (Right to Service Act)',
    department: 'कार्मिक एवं प्रशासनिक सुधार विभाग',
    category: 'certificate',
    content: `उत्तराखण्ड सेवा का अधिकार अधिनियम 2011 के अंतर्गत:
1. आय प्रमाण पत्र: 15 कार्य दिवस (वैधता 6 माह)।
2. जाति प्रमाण पत्र (SC/ST/OBC): 15 कार्य दिवस।
3. स्थायी निवास प्रमाण पत्र: 15 कार्य दिवस।
4. पर्वतीय क्षेत्र प्रमाण पत्र: 15 कार्य दिवस।
5. परिवार रजिस्टर नकल: 2 कार्य दिवस।
नियत समय में सेवा न मिलने पर पदनामित अधिकारी पर दंड लगाने का वैधानिक प्रावधान है।
पोर्टल: https://eservices.uk.gov.in/`,
    sourceUrl: 'https://eservices.uk.gov.in',
    dateAdded: '2026-03-05',
    fileType: 'guideline',
    chunkCount: 3,
    verifiedOfficial: true,
  },
  {
    id: 'gov-doc-3',
    title: 'पर्वतीय क्षेत्र प्रमाण पत्र (Hill Area Certificate) विशेष शासनादेश',
    department: 'राजस्व विभाग, उत्तराखण्ड सरकार',
    category: 'certificate',
    content: `पर्वतीय क्षेत्र प्रमाण पत्र उत्तराखण्ड के पहाड़ी जनपदों (पौड़ी, टिहरी, चमोली, उत्तरकाशी, रुद्रप्रयाग, अल्मोड़ा, पिथौरागढ़, बागेश्वर, चम्पावत, नैनीताल के पर्वतीय भाग, देहरादून के चकराता/कालसी क्षेत्र) के नागरिकों हेतु जारी होता है।
यह प्रमाण पत्र सेना, असम राइफल्स, सीआरपीएफ, बीएसएफ, आईटीबीपी, और राज्य पुलिस भर्ती में सीना और लम्बाई (Height & Chest) में कानूनी छूट दिलाता है।
आवश्यक दस्तावेज: स्थायी निवास प्रमाण पत्र, परिवार रजिस्टर नकल, खतौनी, आधार कार्ड, पटवारी आख्या।
समय सीमा: 15 दिन। शुल्क: ₹30 सीएससी। पोर्टल: https://eservices.uk.gov.in/`,
    sourceUrl: 'https://eservices.uk.gov.in',
    dateAdded: '2026-03-10',
    fileType: 'circular',
    chunkCount: 3,
    verifiedOfficial: true,
  },
  {
    id: 'gov-doc-4',
    title: 'समाज कल्याण विभाग पेंशन योजनाएं एवं प्रत्यक्ष लाभ अंतरण (DBT)',
    department: 'समाज कल्याण विभाग, उत्तराखण्ड सरकार',
    category: 'pension',
    content: `उत्तराखण्ड समाज कल्याण विभाग द्वारा वृद्धावस्था पेंशन, विधवा पेंशन, दिव्यांग पेंशन तथा तीलू रौतेली विशेष पेंशन दी जाती है।
पेंशन राशि ₹1500 प्रतिमाह सीधे लाभार्थी के आधार-लिंक्ड बैंक खाते में भेजी जाती है।
वृद्धावस्था पेंशन हेतु 60 वर्ष आयु आवश्यक है।
आवेदन अपणि सरकार पोर्टल अथवा ssp.uk.gov.in के माध्यम से किया जा सकता है।
आधिकारिक पोर्टल: https://ssp.uk.gov.in/ और https://eservices.uk.gov.in/`,
    sourceUrl: 'https://ssp.uk.gov.in',
    dateAdded: '2026-03-15',
    fileType: 'guideline',
    chunkCount: 3,
    verifiedOfficial: true,
  },
];
