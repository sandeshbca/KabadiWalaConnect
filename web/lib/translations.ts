import type { LangCode } from "./i18n";

export type TKey =
  | "schedulePickup"
  | "pickupTracker"
  | "marketRates"
  | "greenImpact"
  | "history"
  | "nearbyCollectors"
  | "nearbyRecyclers"
  | "aiScan"
  | "paymentMethod"
  | "cash"
  | "upi"
  | "mobile"
  | "estimatedValue"
  | "transactions"
  | "feedback"
  | "speakPage"
  | "stopVoice"
  | "trackingNew"
  | "trackingAccepted"
  | "trackingCollected"
  | "trackingVerified"
  | "liveTracking"
  | "liveNow"
  | "home"
  | "earnings"
  | "assignToRecycler"
  | "assignSuccess"
  | "openInMaps"
  | "senderDetails"
  | "assignedCollector"
  | "newPickup"
  | "accept"
  | "markCollected"
  | "verifyPickup"
  | "complete"
  | "saving"
  | "yourRequests"
  | "noPickups"
  | "sendPickupRequest"
  | "workspaceConnecting"
  | "workspaceSynced"
  | "languageChanged"
  | "dashboardActionCitizen"
  | "dashboardActionCollector"
  | "dashboardTitleCitizen"
  | "dashboardTitleCollector"
  | "dashboardTitleRecycler"
  | "dashboardTitleAdmin"
  | "dashboardSubtitleCitizen"
  | "dashboardSubtitleCollector"
  | "dashboardSubtitleRecycler"
  | "dashboardSubtitleAdmin"
  | "pickupUpdatedLive"
  | "pickupCreatedLive"
  | "publishStock"
  | "alreadyAssignedStock";

const en: Record<TKey, string> = {
  schedulePickup: "Schedule pickup",
  pickupTracker: "Pickup tracker",
  marketRates: "Market rates",
  greenImpact: "Green impact",
  history: "History",
  nearbyCollectors: "Nearby collectors",
  nearbyRecyclers: "Nearby recyclers",
  aiScan: "AI waste scan",
  paymentMethod: "Payment method",
  cash: "Cash on pickup",
  upi: "UPI",
  mobile: "Mobile number",
  estimatedValue: "Estimated value",
  transactions: "Transactions",
  feedback: "Rating & feedback",
  speakPage: "Read page aloud",
  stopVoice: "Stop voice",
  trackingNew: "Request sent",
  trackingAccepted: "Collector assigned",
  trackingCollected: "Material collected",
  trackingVerified: "Verified & closed",
  liveTracking: "Live tracking",
  liveNow: "Live",
  home: "Home",
  earnings: "Earnings",
  assignToRecycler: "Assign to recycler now",
  assignSuccess: "Material listed for recyclers instantly",
  openInMaps: "Open in Google Maps",
  senderDetails: "Sender details",
  assignedCollector: "Assigned collector",
  newPickup: "New pickup",
  accept: "Accept",
  markCollected: "Mark collected",
  verifyPickup: "Verify pickup",
  complete: "Complete",
  saving: "Saving…",
  yourRequests: "Your requests",
  noPickups: "No pickup requests yet.",
  sendPickupRequest: "Send pickup request",
  workspaceConnecting: "Connecting to your workspace…",
  workspaceSynced: "Workspace synced — live updates on",
  languageChanged: "Language updated",
  dashboardActionCitizen: "Schedule pickup",
  dashboardActionCollector: "View pickup queue",
  dashboardTitleCitizen: "Your waste can create real value.",
  dashboardTitleCollector: "Plan a smarter, more profitable route.",
  dashboardTitleRecycler: "Reliable material supply, when you need it.",
  dashboardTitleAdmin: "Build a trusted circular city.",
  dashboardSubtitleCitizen:
    "Schedule pickup, track live status, and get paid by cash or UPI.",
  dashboardSubtitleCollector:
    "Accept jobs, open Google Maps, collect, then assign stock to recyclers.",
  dashboardSubtitleRecycler:
    "Reserve verified stock from nearby collectors in real time.",
  dashboardSubtitleAdmin:
    "Manage users, market prices, and network analytics.",
  pickupUpdatedLive: "Pickup status updated live",
  pickupCreatedLive: "New pickup added to the network",
  publishStock: "Publish collected material",
  alreadyAssignedStock: "Listed for recyclers",
};

const hi: Record<TKey, string> = {
  ...en,
  schedulePickup: "पिकअप बुक करें",
  pickupTracker: "पिकअप ट्रैकिंग",
  marketRates: "बाजार भाव",
  greenImpact: "हरित प्रभाव",
  history: "इतिहास",
  nearbyCollectors: "नज़दीकी कलेक्टर",
  nearbyRecyclers: "नज़दीकी रीसाइक्लर",
  aiScan: "AI कचरा स्कैन",
  paymentMethod: "भुगतान का तरीका",
  cash: "नकद",
  upi: "UPI",
  mobile: "मोबाइल नंबर",
  estimatedValue: "अनुमानित मूल्य",
  transactions: "लेन-देन",
  feedback: "रेटिंग और फीडबैक",
  speakPage: "पेज ज़ोर से पढ़ें",
  stopVoice: "आवाज़ बंद करें",
  trackingNew: "अनुरोध भेजा गया",
  trackingAccepted: "कलेक्टर नियुक्त",
  trackingCollected: "सामान उठाया गया",
  trackingVerified: "पुष्टि व बंद",
  liveTracking: "लाइव ट्रैकिंग",
  liveNow: "लाइव",
  home: "होम",
  earnings: "कमाई",
  assignToRecycler: "रीसाइक्लर को तुरंत असाइन करें",
  assignSuccess: "सामान रीसाइक्लर के लिए लिस्ट हो गया",
  openInMaps: "Google Maps में खोलें",
  senderDetails: "भेजने वाले का विवरण",
  assignedCollector: "नियुक्त कलेक्टर",
  newPickup: "नया पिकअप",
  accept: "स्वीकारें",
  markCollected: "कलेक्ट किया",
  verifyPickup: "पिकअप पुष्टि",
  complete: "पूर्ण",
  saving: "सेव हो रहा…",
  yourRequests: "आपके अनुरोध",
  noPickups: "अभी कोई पिकअप नहीं।",
  sendPickupRequest: "पिकअप अनुरोध भेजें",
  workspaceConnecting: "वर्कस्पेस कनेक्ट हो रहा…",
  workspaceSynced: "लाइव अपडेट चालू — डेटा सिंक",
  languageChanged: "भाषा बदल गई",
  dashboardActionCitizen: "पिकअप बुक करें",
  dashboardActionCollector: "पिकअप कतार देखें",
  dashboardTitleCitizen: "आपका कचरा असली कीमत बना सकता है।",
  dashboardTitleCollector: "स्मार्ट रूट, ज़्यादा कमाई।",
  dashboardTitleRecycler: "भरोसेमंद सामान, सही समय पर।",
  dashboardTitleAdmin: "भरोसेमंद सर्कुलर शहर बनाएं।",
  dashboardSubtitleCitizen:
    "पिकअप बुक करें, लाइव स्थिति देखें, नकद या UPI से भुगतान पाएं।",
  dashboardSubtitleCollector:
    "नौकरी स्वीकारें, Maps खोलें, कलेक्ट करें, रीसाइक्लर को असाइन करें।",
  dashboardSubtitleRecycler:
    "नज़दीकी कलेक्टरों से लाइव स्टॉक रिज़र्व करें।",
  dashboardSubtitleAdmin:
    "यूज़र, बाजार भाव और एनालिटिक्स प्रबंधित करें।",
  pickupUpdatedLive: "पिकअप स्थिति लाइव अपडेट",
  pickupCreatedLive: "नया पिकअप नेटवर्क में",
  publishStock: "कलेक्टेड सामान प्रकाशित करें",
  alreadyAssignedStock: "रीसाइक्लर के लिए लिस्टेड",
};

function cloneEn(overrides: Partial<Record<TKey, string>>): Record<TKey, string> {
  return { ...en, ...overrides };
}

const bn = cloneEn({
  schedulePickup: "পিকআপ বুক করুন",
  pickupTracker: "পিকআপ ট্র্যাকিং",
  marketRates: "বাজার দর",
  greenImpact: "সবুজ প্রভাব",
  history: "ইতিহাস",
  nearbyCollectors: "কাছের কালেক্টর",
  nearbyRecyclers: "কাছের রিসাইক্লার",
  liveTracking: "লাইভ ট্র্যাকিং",
  assignToRecycler: "অবিলম্বে রিসাইক্লারে পাঠান",
  openInMaps: "Google Maps-এ খুলুন",
  speakPage: "জোরে পড়ুন",
  languageChanged: "ভাষা পরিবর্তিত",
});

const te = cloneEn({
  schedulePickup: "పికప్ బుక్ చేయండి",
  pickupTracker: "పికప్ ట్రాకింగ్",
  marketRates: "మార్కెట్ ధరలు",
  greenImpact: "గ్రీన్ ఇంపాక్ట్",
  nearbyCollectors: "సమీప కలెక్టర్లు",
  nearbyRecyclers: "సమీప రీసైక్లర్లు",
  assignToRecycler: "వెంటనే రీసైక్లర్‌కు అప్పగించండి",
  openInMaps: "Google Maps లో తెరవండి",
  speakPage: "గట్టిగా చదవండి",
  languageChanged: "భాష మారింది",
});

const mr = cloneEn({
  schedulePickup: "पिकअप बुक करा",
  pickupTracker: "पिकअप ट्रacking",
  marketRates: "बाजार भाव",
  nearbyCollectors: "जवळचे कलेक्टर",
  nearbyRecyclers: "जवळचे रीसायकलर",
  assignToRecycler: "लगेच रीसायकलरला असाइन करा",
  openInMaps: "Google Maps मध्ये उघडा",
  speakPage: "मोठ्याने वाचा",
  languageChanged: "भाषा बदलली",
});

const ta = cloneEn({
  schedulePickup: "பிக்-அப் பதிவு",
  pickupTracker: "பிக்-அப் கண்காணிப்பு",
  marketRates: "சந்தை விலை",
  nearbyCollectors: "அருகிலுள்ள கலெக்டர்கள்",
  nearbyRecyclers: "அருகிலுள்ள ரீசைக்ளர்கள்",
  assignToRecycler: "உடனே ரீசைக்ளருக்கு ஒப்படை",
  openInMaps: "Google Maps இல் திற",
  speakPage: "சத்தமாக படிக்க",
  languageChanged: "மொழி மாற்றப்பட்டது",
});

const gu = cloneEn({
  schedulePickup: "પિકઅપ બુક કરો",
  pickupTracker: "પિકઅપ ટ્રેકિંગ",
  marketRates: "બજાર ભાવ",
  nearbyCollectors: "નજીકના કલેક્ટર",
  nearbyRecyclers: "નજીકના રીસાયકલર",
  assignToRecycler: "તરત રીસાયકલરને સોંપો",
  openInMaps: "Google Maps માં ખોલો",
  speakPage: "મોટેથી વાંચો",
  languageChanged: "ભાષા બદલાઈ",
});

const kn = cloneEn({
  schedulePickup: "ಪಿಕಪ್ ಬುಕ್ ಮಾಡಿ",
  pickupTracker: "ಪಿಕಪ್ ಟ್ರ್ಯಾಕಿಂಗ್",
  marketRates: "ಮಾರುಕಟ್ಟೆ ದರ",
  nearbyCollectors: "ಹತ್ತಿರದ ಕಲೆಕ್ಟರ்கள்",
  nearbyRecyclers: "ಹತ್ತಿರದ ರೀಸೈಕ್ಲರ್‌ಗಳು",
  assignToRecycler: "ತಕ್ಷಣ ರೀಸೈಕ್ಲರ್‌ಗೆ ನಿಯೋಜಿಸಿ",
  openInMaps: "Google Maps ತೆರೆಯಿರಿ",
  speakPage: "ಜೋರಾಗಿ ಓದಿ",
  languageChanged: "ಭಾಷೆ ಬದಲಾಯಿತು",
});

const ml = cloneEn({
  schedulePickup: "പിക്കപ്പ് ബുക്ക് ചെയ്യുക",
  pickupTracker: "പിക്കപ്പ് ട്രാക്കിംഗ്",
  marketRates: "വിപണി നിരക്ക്",
  nearbyCollectors: "സമീപ കളക്ടർമാർ",
  nearbyRecyclers: "സമീപ റീസൈക്ളർമാർ",
  assignToRecycler: " ഉടൻ റീസൈക്ളർക്ക് നൽകുക",
  openInMaps: "Google Maps തുറക്കുക",
  speakPage: " ഉറക്കെ വായിക്കുക",
  languageChanged: "ഭാഷ മാറി",
});

const pa = cloneEn({
  schedulePickup: "ਪਿਕਅਪ ਬੁੱਕ ਕਰੋ",
  pickupTracker: "ਪਿਕਅਪ ਟ੍ਰੈਕਿੰਗ",
  marketRates: "ਬਾਜ਼ਾਰ ਭਾਅ",
  nearbyCollectors: "ਨਜ਼ਦੀਕੀ ਕਲੈਕਟਰ",
  nearbyRecyclers: "ਨਜ਼ਦੀਕੀ ਰੀਸਾਈਕਲਰ",
  assignToRecycler: "ਤੁਰੰਤ ਰੀਸਾਈਕਲਰ ਨੂੰ ਸੌਂਪੋ",
  openInMaps: "Google Maps ਖੋਲ੍ਹੋ",
  speakPage: "ਉੱਚੀ ਆਵਾਜ਼ ਵਿੱਚ ਪੜ੍ਹੋ",
  languageChanged: "ਭਾਸ਼ਾ ਬਦਲੀ",
});

const or = cloneEn({
  schedulePickup: "ପିକଅପ୍ ବୁକ୍ କରନ୍ତୁ",
  pickupTracker: "ପିକଅପ୍ ଟ୍ରାକିଂ",
  marketRates: "ବଜାର ଦର",
  nearbyCollectors: "ନିକଟସ୍ଥ କଲେକ୍ଟର",
  nearbyRecyclers: "ନିକଟସ୍ଥ ରିସାଇକ୍ଲର",
  assignToRecycler: "ତୁରନ୍ତ ରିସାଇକ୍ଲରକୁ ଦିଅନ୍ତୁ",
  openInMaps: "Google Maps ଖୋଲନ୍ତୁ",
  speakPage: "ଜୋରରେ ପଢ଼ନ୍ତୁ",
  languageChanged: "ଭାଷା ବଦଳିଗଲା",
});

const as = cloneEn({
  schedulePickup: "পিকআপ বুক কৰক",
  pickupTracker: "পিকআপ ট্ৰেকিং",
  marketRates: "বজাৰ দৰ",
  nearbyCollectors: "ওচৰৰ কলেক্টৰ",
  nearbyRecyclers: "ওচৰৰ ৰিসাইক্লাৰ",
  assignToRecycler: "লগে লগে ৰিসাইক্লাৰলৈ দিয়ক",
  openInMaps: "Google Maps খোলক",
  speakPage: "কৈ পঢ়ক",
  languageChanged: "ভাষা সলনি হ'ল",
});

const ur = cloneEn({
  schedulePickup: "پک اپ بک کریں",
  pickupTracker: "پک اپ ٹریکنگ",
  marketRates: "مارکیٹ ریٹ",
  greenImpact: "سبز اثر",
  nearbyCollectors: "قریبی کلیکٹر",
  nearbyRecyclers: "قریبی ریسائکلر",
  assignToRecycler: "فوراً ریسائiklر کو تفویض کریں",
  openInMaps: "Google Maps کھولیں",
  speakPage: "بلند آواز میں پڑھیں",
  languageChanged: "زبان بدل گئی",
});

export const messages: Record<LangCode, Record<TKey, string>> = {
  en,
  hi,
  bn,
  te,
  mr,
  ta,
  gu,
  kn,
  ml,
  pa,
  or,
  as,
  ur,
};

export function translate(lang: LangCode, key: TKey): string {
  return messages[lang]?.[key] || en[key] || key;
}

export function dashboardTitleKey(role: string): TKey {
  const map: Record<string, TKey> = {
    Citizen: "dashboardTitleCitizen",
    Collector: "dashboardTitleCollector",
    Recycler: "dashboardTitleRecycler",
    Admin: "dashboardTitleAdmin",
  };
  return map[role] || "dashboardTitleCitizen";
}

export function dashboardSubtitleKey(role: string): TKey {
  const map: Record<string, TKey> = {
    Citizen: "dashboardSubtitleCitizen",
    Collector: "dashboardSubtitleCollector",
    Recycler: "dashboardSubtitleRecycler",
    Admin: "dashboardSubtitleAdmin",
  };
  return map[role] || "dashboardSubtitleCitizen";
}

export function dashboardActionKey(role: string): TKey {
  if (role === "Citizen") return "dashboardActionCitizen";
  return "dashboardActionCollector";
}
