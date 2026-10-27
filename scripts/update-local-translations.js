const fs = require('fs');
const path = require('path');

const FRONTEND_MESSAGES_DIR = path.join(__dirname, 'frontend', 'messages');
const MOBILE_TRANSLATIONS_FILE = path.join(__dirname, 'ShramikSevaApp', 'constants', 'translations.js');

const translationsData = {
  en: {
    // Mobile keys
    add_profile_photo: "Add Profile Photo",
    change_photo: "Change Profile Photo",
    remove_photo: "Remove Photo",
    uploading: "Uploading photo...",
    photo_uploaded: "Profile photo uploaded successfully!",
    failed_to_upload_photo: "Failed to upload photo. Please try again.",
    expected_salary_range: "Expected Salary Range (₹)",
    min_salary: "Min (₹)",
    max_salary: "Max (₹)",
    monthly: "Monthly",
    daily: "Daily",
    max_salary_error: "Maximum salary must be greater than or equal to minimum salary",
    select_location_map: "Select Location on Map",

    // Frontend Auth.register keys
    profilePicture: "Profile Picture",
    uploadProfilePicture: "Upload Profile Picture (Optional)",
    profilePhotoAdded: "Profile photo added",
    photo: "Photo",
    workLocation: "Work Location (City / Area)*",
    selectedLocation: "Selected",
    loadingLocationMap: "Loading location map...",
    locationRequired: "Please select your work location (City / State)",
    expectedSalaryRange: "Expected Salary Range (₹)",
    minSalaryMonthlyPlaceholder: "Min (e.g. 15000)",
    maxSalaryMonthlyPlaceholder: "Max (e.g. 25000)",
    minSalaryDailyPlaceholder: "Min (e.g. 500)",
    maxSalaryDailyPlaceholder: "Max (e.g. 900)",
    avatarUploadFailed: "Failed to upload profile picture",

    // Frontend Admin keys
    filteredRecipients: "Filtered Recipients",
    salaryExpectation: "Salary Expectation",
    notSpecified: "Not specified",
    remove: "Remove"
  },
  hi: {
    add_profile_photo: "प्रोफ़ाइल फ़ोटो जोड़ें",
    change_photo: "फ़ोटो बदलें",
    remove_photo: "फ़ोटो हटाएं",
    uploading: "फ़ोटो अपलोड हो रही है...",
    photo_uploaded: "प्रोफ़ाइल फ़ोटो सफलतापूर्वक अपलोड हो गई!",
    failed_to_upload_photo: "फ़ोटो अपलोड करने में विफल। कृपया पुन: प्रयास करें।",
    expected_salary_range: "अपेक्षित वेतन सीमा (₹)",
    min_salary: "न्यूनतम (₹)",
    max_salary: "अधिकतम (₹)",
    monthly: "मासिक",
    daily: "दैनिक",
    max_salary_error: "अधिकतम वेतन न्यूनतम वेतन से अधिक या बराबर होना चाहिए",
    select_location_map: "मानचित्र पर स्थान चुनें",

    profilePicture: "प्रोफ़ाइल फ़ोटो",
    uploadProfilePicture: "प्रोफ़ाइल फ़ोटो अपलोड करें (वैकल्पिक)",
    profilePhotoAdded: "प्रोफ़ाइल फ़ोटो जोड़ी गई",
    photo: "फ़ोटो",
    workLocation: "कार्य स्थान (शहर / क्षेत्र)*",
    selectedLocation: "चयनित",
    loadingLocationMap: "स्थान मानचित्र लोड हो रहा है...",
    locationRequired: "कृपया अपना कार्य स्थान (शहर / राज्य) चुनें",
    expectedSalaryRange: "अपेक्षित वेतन सीमा (₹)",
    minSalaryMonthlyPlaceholder: "न्यूनतम (उदा. 15000)",
    maxSalaryMonthlyPlaceholder: "अधिकतम (उदा. 25000)",
    minSalaryDailyPlaceholder: "न्यूनतम (उदा. 500)",
    maxSalaryDailyPlaceholder: "अधिकतम (उदा. 900)",
    avatarUploadFailed: "प्रोफ़ाइल फ़ोटो अपलोड करने में विफल",

    filteredRecipients: "फ़िल्टर किए गए प्राप्तकर्ता",
    salaryExpectation: "अपेक्षित वेतन",
    notSpecified: "निर्दिष्ट नहीं",
    remove: "हटाएं"
  },
  mr: {
    add_profile_photo: "प्रोफाइल फोटो जोडा",
    change_photo: "फोटो बदला",
    remove_photo: "फोटो काढा",
    uploading: "फोटो अपलोड होत आहे...",
    photo_uploaded: "प्रोफाइल फोटो यशस्वीरित्या अपलोड केला!",
    failed_to_upload_photo: "फोटो अपलोड करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
    expected_salary_range: "अपेक्षित वेतन श्रेणी (₹)",
    min_salary: "किमान (₹)",
    max_salary: "कमाल (₹)",
    monthly: "मासिक",
    daily: "दैनिक",
    max_salary_error: "कमाल वेतन किमान वेतनापेक्षा जास्त किंवा समान असावे",
    select_location_map: "नकाशावर स्थान निवडा",

    profilePicture: "प्रोफाइल फोटो",
    uploadProfilePicture: "प्रोफाइल फोटो अपलोड करा (पर्यायी)",
    profilePhotoAdded: "प्रोफाइल फोटो जोडला",
    photo: "फोटो",
    workLocation: "कामाचे ठिकाण (शहर / परिसर)*",
    selectedLocation: "निवडलेले",
    loadingLocationMap: "स्थान नकाशा लोड होत आहे...",
    locationRequired: "कृपया तुमचे कामाचे ठिकाण (शहर / राज्य) निवडा",
    expectedSalaryRange: "अपेक्षित वेतन श्रेणी (₹)",
    minSalaryMonthlyPlaceholder: "किमान (उदा. 15000)",
    maxSalaryMonthlyPlaceholder: "कमाल (उदा. 25000)",
    minSalaryDailyPlaceholder: "किमान (उदा. 500)",
    maxSalaryDailyPlaceholder: "कमाल (उदा. 900)",
    avatarUploadFailed: "प्रोफाइल फोटो अपलोड करण्यात अयशस्वी",

    filteredRecipients: "फिल्टर केलेले प्राप्तकर्ते",
    salaryExpectation: "अपेक्षित वेतन",
    notSpecified: "निर्दिष्ट नाही",
    remove: "काढा"
  },
  bn: {
    add_profile_photo: "প্রোফাইল ছবি যোগ করুন",
    change_photo: "ছবি পরিবর্তন করুন",
    remove_photo: "ছবি সরান",
    uploading: "ছবি আপলোড হচ্ছে...",
    photo_uploaded: "প্রোফাইল ছবি সফলভাবে আপলোড হয়েছে!",
    failed_to_upload_photo: "ছবি আপলোড করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
    expected_salary_range: "প্রত্যাশিত বেতনের পরিধি (₹)",
    min_salary: "সর্বনিম্ন (₹)",
    max_salary: "সর্বোচ্চ (₹)",
    monthly: "মাসিক",
    daily: "দৈনিক",
    max_salary_error: "সর্বোচ্চ বেতন সর্বনিম্ন বেতনের সমান বা বেশি হতে হবে",
    select_location_map: "মানচিত্রে অবস্থান নির্বাচন করুন",

    profilePicture: "প্রোফাইল ছবি",
    uploadProfilePicture: "প্রোফাইল ছবি আপলোড করুন (ঐচ্ছিক)",
    profilePhotoAdded: "প্রোফাইল ছবি যোগ করা হয়েছে",
    photo: "ছবি",
    workLocation: "কাজের অবস্থান (শহর / এলাকা)*",
    selectedLocation: "নির্বাচিত",
    loadingLocationMap: "অবস্থান মানচিত্র লোড হচ্ছে...",
    locationRequired: "অনুগ্রহ করে আপনার কাজের অবস্থান (শহর / রাজ্য) নির্বাচন করুন",
    expectedSalaryRange: "প্রত্যাশিত বেতনের পরিধি (₹)",
    minSalaryMonthlyPlaceholder: "সর্বনিম্ন (যেমন 15000)",
    maxSalaryMonthlyPlaceholder: "সর্বোচ্চ (যেমন 25000)",
    minSalaryDailyPlaceholder: "সর্বনিম্ন (যেমন 500)",
    maxSalaryDailyPlaceholder: "সর্বোচ্চ (যেমন 900)",
    avatarUploadFailed: "প্রোফাইল ছবি আপলোড করতে ব্যর্থ হয়েছে",

    filteredRecipients: "ফিল্টার করা প্রাপকগণ",
    salaryExpectation: "বেতনের প্রত্যাশা",
    notSpecified: "নির্দিষ্ট নয়",
    remove: "সরান"
  },
  ta: {
    add_profile_photo: "சுயவிவரப் படத்தை சேர்க்கவும்",
    change_photo: "புகைப்படத்தை மாற்றவும்",
    remove_photo: "புகைப்படத்தை நீக்கு",
    uploading: "புகைப்படம் பதிவேற்றப்படுகிறது...",
    photo_uploaded: "சுயவிவரப் படம் வெற்றிகரமாக பதிவேற்றப்பட்டது!",
    failed_to_upload_photo: "புகைப்படத்தை பதிவேற்றுவதில் தோல்வி. மீண்டும் முயற்சிக்கவும்.",
    expected_salary_range: "எதிர்பார்க்கப்படும் சம்பள வரம்பு (₹)",
    min_salary: "குறைந்தபட்சம் (₹)",
    max_salary: "அதிகபட்சம் (₹)",
    monthly: "மாதாந்திர",
    daily: "தினசரி",
    max_salary_error: "அதிகபட்ச சம்பளம் குறைந்தபட்ச சம்பளத்தை விட அதிகமாகவோ அல்லது சமமாகவோ இருக்க வேண்டும்",
    select_location_map: "வரைபடத்தில் இருப்பிடத்தைத் தேர்ந்தெடுக்கவும்",

    profilePicture: "சுயவிவரப் படம்",
    uploadProfilePicture: "சுயவிவரப் படத்தை பதிவேற்றவும் (விருப்பமானது)",
    profilePhotoAdded: "சுயவிவரப் படம் சேர்க்கப்பட்டது",
    photo: "புகைப்படம்",
    workLocation: "வேலை இருப்பிடம் (நகரம் / பகுதி)*",
    selectedLocation: "தேர்ந்தெடுக்கப்பட்டது",
    loadingLocationMap: "இருப்பிட வரைபடம் ஏற்றப்படுகிறது...",
    locationRequired: "தயவுசெய்து உங்கள் வேலை இருப்பிடத்தை (நகரம் / மாநிலம்) தேர்ந்தெடுக்கவும்",
    expectedSalaryRange: "எதிர்பார்க்கப்படும் சம்பள வரம்பு (₹)",
    minSalaryMonthlyPlaceholder: "குறைந்தபட்சம் (எ.கா. 15000)",
    maxSalaryMonthlyPlaceholder: "அதிகபட்சம் (எ.கா. 25000)",
    minSalaryDailyPlaceholder: "குறைந்தபட்சம் (எ.கா. 500)",
    maxSalaryDailyPlaceholder: "அதிகபட்சம் (எ.கா. 900)",
    avatarUploadFailed: "சுயவிவரப் படத்தை பதிவேற்றுவதில் தோல்வி",

    filteredRecipients: "வடிகட்டப்பட்ட பெறுநர்கள்",
    salaryExpectation: "சம்பள எதிர்பார்ப்பு",
    notSpecified: "குறிப்பிடப்படவில்லை",
    remove: "நீக்கு"
  },
  te: {
    add_profile_photo: "ప్రొఫైల్ ఫోటోను జోడించండి",
    change_photo: "ఫోటోను మార్చండి",
    remove_photo: "ఫోటోను తొలగించు",
    uploading: "ఫోటో అప్‌లోడ్ అవుతోంది...",
    photo_uploaded: "ప్రొఫైల్ ఫోటో విజయవంతంగా అప్‌లోడ్ చేయబడింది!",
    failed_to_upload_photo: "ఫోటో అప్‌లోడ్ చేయడంలో విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.",
    expected_salary_range: "ఆశించిన జీతం పరిధి (₹)",
    min_salary: "కనీస (₹)",
    max_salary: "గరిష్ట (₹)",
    monthly: "నెలవారీ",
    daily: "రోజువారీ",
    max_salary_error: "గరిష్ట జీతం కనీస జీతం కంటే ఎక్కువగా లేదా సమానంగా ఉండాలి",
    select_location_map: "మ్యాప్‌లో స్థానాన్ని ఎంచుకోండి",

    profilePicture: "ప్రొఫైల్ ఫోటో",
    uploadProfilePicture: "ప్రొఫైల్ ఫోటోను అప్‌లోడ్ చేయండి (ఐచ్ఛికం)",
    profilePhotoAdded: "ప్రొఫైల్ ఫోటో జోడించబడింది",
    photo: "ఫోటో",
    workLocation: "పని స్థానం (నగరం / ప్రాంతం)*",
    selectedLocation: "ఎంచుకోబడింది",
    loadingLocationMap: "స్థాన మ్యాప్ లోడ్ అవుతోంది...",
    locationRequired: "దయచేసి మీ పని స్థానాన్ని (నగరం / రాష్ట్రం) ఎంచుకోండి",
    expectedSalaryRange: "ఆశించిన జీతం పరిధి (₹)",
    minSalaryMonthlyPlaceholder: "కనీస (ఉదా. 15000)",
    maxSalaryMonthlyPlaceholder: "గరిష్ట (ఉదా. 25000)",
    minSalaryDailyPlaceholder: "కనీస (ఉదా. 500)",
    maxSalaryDailyPlaceholder: "గరిష్ట (ఉదా. 900)",
    avatarUploadFailed: "ప్రొఫైల్ ఫోటోను అప్‌లోడ్ చేయడంలో విఫలమైంది",

    filteredRecipients: "ఫిల్టర్ చేసిన స్వీకర్తలు",
    salaryExpectation: "జీతం నిరీక్షణ",
    notSpecified: "పేర్కొనబడలేదు",
    remove: "తొలగించు"
  },
  gu: {
    add_profile_photo: "પ્રોફાઇલ ફોટો ઉમેરો",
    change_photo: "ફોટો બદલો",
    remove_photo: "ફોટો દૂર કરો",
    uploading: "ફોટો અપલોડ થઈ રહ્યો છે...",
    photo_uploaded: "પ્રોફાઇલ ફોટો સફળતાપૂર્વક અપલોડ થયો!",
    failed_to_upload_photo: "ફોટો અપલોડ કરવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.",
    expected_salary_range: "અપેક્ષિત પગાર શ્રેણી (₹)",
    min_salary: "ન્યૂનતમ (₹)",
    max_salary: "મહત્તમ (₹)",
    monthly: "માસિક",
    daily: "દૈનિક",
    max_salary_error: "મહત્તમ પગાર ન્યૂનતમ પગાર કરતાં વધુ અથવા બરાબર હોવો જોઈએ",
    select_location_map: "નકશા પર સ્થાન પસંદ કરો",

    profilePicture: "પ્રોફાઇલ ફોટો",
    uploadProfilePicture: "પ્રોફાઇલ ફોટો અપલોડ કરો (વૈકલ્પિક)",
    profilePhotoAdded: "પ્રોફાઇલ ફોટો ઉમેરાયો",
    photo: "ફોટો",
    workLocation: "કાર્ય સ્થાન (શહેર / વિસ્તાર)*",
    selectedLocation: "પસંદ કરેલ",
    loadingLocationMap: "સ્થાન નકશો લોડ થઈ રહ્યો છે...",
    locationRequired: "કૃપા કરીને તમારું કાર્ય સ્થાન (શહેર / રાજ્ય) પસંદ કરો",
    expectedSalaryRange: "અપેક્ષિત પગાર શ્રેણી (₹)",
    minSalaryMonthlyPlaceholder: "ન્યૂનતમ (દા.ત. 15000)",
    maxSalaryMonthlyPlaceholder: "મહત્તમ (દા.ત. 25000)",
    minSalaryDailyPlaceholder: "ન્યૂનતમ (દા.ત. 500)",
    maxSalaryDailyPlaceholder: "મહત્તમ (દા.ત. 900)",
    avatarUploadFailed: "પ્રોફાઇલ ફોટો અપલોડ કરવામાં નિષ્ફળ",

    filteredRecipients: "ફિલ્ટર કરેલ પ્રાપ્તકર્તાઓ",
    salaryExpectation: "પગારની અપેક્ષા",
    notSpecified: "ઉલ્લેખિત નથી",
    remove: "દૂર કરો"
  },
  kn: {
    add_profile_photo: "ಪ್ರೊಫೈಲ್ ಫೋಟೋ ಸೇರಿಸಿ",
    change_photo: "ಫೋಟೋ ಬದಲಾಯಿಸಿ",
    remove_photo: "ಫೋಟೋ ತೆಗೆದುಹಾಕಿ",
    uploading: "ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    photo_uploaded: "ಪ್ರೊಫೈಲ್ ಫೋಟೋ ಯಶಸ್ವಿಯಾಗಿ ಅಪ್‌ಲೋಡ್ ಆಗಿದೆ!",
    failed_to_upload_photo: "ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    expected_salary_range: "ನಿರೀಕ್ಷಿತ ವೇತನ ಶ್ರೇಣಿ (₹)",
    min_salary: "ಕನಿಷ್ಠ (₹)",
    max_salary: "ಗರಿಷ್ಠ (₹)",
    monthly: "ಮಾಸಿಕ",
    daily: "ದೈನಂದಿನ",
    max_salary_error: "ಗರಿಷ್ಠ ವೇತನವು ಕನಿಷ್ಠ ವೇತನಕ್ಕಿಂತ ಹೆಚ್ಚಾಗಿರಬೇಕು ಅಥವಾ ಸಮನಾಗಿರಬೇಕು",
    select_location_map: "ನಕ್ಷೆಯಲ್ಲಿ ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ",

    profilePicture: "ಪ್ರೊಫೈಲ್ ಫೋಟೋ",
    uploadProfilePicture: "ಪ್ರೊಫೈಲ್ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ (ಐಚ್ಛಿಕ)",
    profilePhotoAdded: "ಪ್ರೊಫೈಲ್ ಫೋಟೋ ಸೇರಿಸಲಾಗಿದೆ",
    photo: "ಫೋಟೋ",
    workLocation: "ಕೆಲಸದ ಸ್ಥಳ (ನಗರ / ಪ್ರದೇಶ)*",
    selectedLocation: "ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ",
    loadingLocationMap: "ಸ್ಥಳದ ನಕ್ಷೆಯನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    locationRequired: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಕೆಲಸದ ಸ್ಥಳವನ್ನು (ನಗರ / ರಾಜ್ಯ) ಆಯ್ಕೆಮಾಡಿ",
    expectedSalaryRange: "ನಿರೀಕ್ಷಿತ ವೇತನ ಶ್ರೇಣಿ (₹)",
    minSalaryMonthlyPlaceholder: "ಕನಿಷ್ಠ (ಉದಾ. 15000)",
    maxSalaryMonthlyPlaceholder: "ಗರಿಷ್ಠ (ಉದಾ. 25000)",
    minSalaryDailyPlaceholder: "ಕನಿಷ್ಠ (ಉದಾ. 500)",
    maxSalaryDailyPlaceholder: "ಗರಿಷ್ಠ (ಉದಾ. 900)",
    avatarUploadFailed: "ಪ್ರೊಫೈಲ್ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ",

    filteredRecipients: "ಫಿಲ್ಟರ್ ಮಾಡಿದ ಸ್ವೀಕೃತದಾರರು",
    salaryExpectation: "ವೇತನ ನಿರೀಕ್ಷೆ",
    notSpecified: "ನಿರ್ದಿಷ್ಟಪಡಿಸಿಲ್ಲ",
    remove: "ತೆಗೆದುಹಾಕಿ"
  },
  ml: {
    add_profile_photo: "പ്രൊഫൈൽ ഫോട്ടോ ചേർക്കുക",
    change_photo: "ഫോട്ടോ മാറ്റുക",
    remove_photo: "ഫോട്ടോ നീക്കംചെയ്യുക",
    uploading: "ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുന്നു...",
    photo_uploaded: "പ്രൊഫൈൽ ഫോട്ടോ വിജയകരമായി അപ്‌ലോഡ് ചെയ്തു!",
    failed_to_upload_photo: "ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു. ദയവായി വീണ്ടും ശ്രമിക്കുക.",
    expected_salary_range: "പ്രതീക്ഷിക്കുന്ന ശമ്പള പരിധി (₹)",
    min_salary: "കുറഞ്ഞത് (₹)",
    max_salary: "പരമാവധി (₹)",
    monthly: "പ്രതിമാസം",
    daily: "പ്രതിദിനം",
    max_salary_error: "പരമാവധി ശമ്പളം കുറഞ്ഞ ശമ്പളത്തേക്കാൾ കൂടുതലോ തുല്യമോ ആയിരിക്കണം",
    select_location_map: "മാപ്പിൽ ലൊക്കേഷൻ തിരഞ്ഞെടുക്കുക",

    profilePicture: "പ്രൊഫൈൽ ഫോട്ടോ",
    uploadProfilePicture: "പ്രൊഫൈൽ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക (ഓപ്ഷണൽ)",
    profilePhotoAdded: "പ്രൊഫൈൽ ഫോട്ടോ ചേർത്തു",
    photo: "ഫോട്ടോ",
    workLocation: "ജോലി ലൊക്കേഷൻ (നഗരം / പ്രദേശം)*",
    selectedLocation: "തിരഞ്ഞെടുത്തു",
    loadingLocationMap: "ലൊക്കേഷൻ മാപ്പ് ലോഡുചെയ്യുന്നു...",
    locationRequired: "ദയവായി നിങ്ങളുടെ ജോലി സ്ഥലം (നഗരം / സംസ്ഥാനം) തിരഞ്ഞെടുക്കുക",
    expectedSalaryRange: "പ്രതീക്ഷിക്കുന്ന ശമ്പള പരിധി (₹)",
    minSalaryMonthlyPlaceholder: "കുറഞ്ഞത് (ഉദാ. 15000)",
    maxSalaryMonthlyPlaceholder: "പരമാവധി (ഉദാ. 25000)",
    minSalaryDailyPlaceholder: "കുറഞ്ഞത് (ഉദാ. 500)",
    maxSalaryDailyPlaceholder: "പരമാവധി (ഉദാ. 900)",
    avatarUploadFailed: "പ്രൊഫൈൽ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു",

    filteredRecipients: "ഫിൽട്ടർ ചെയ്ത സ്വീകർത്താക്കൾ",
    salaryExpectation: "ശമ്പള പ്രതീക്ഷ",
    notSpecified: "വ്യക്തമാക്കിയിട്ടില്ല",
    remove: "നീക്കംചെയ്യുക"
  },
  pa: {
    add_profile_photo: "ਪ੍ਰੋਫਾਈਲ ਫੋਟੋ ਸ਼ਾਮਲ ਕਰੋ",
    change_photo: "ਫੋਟੋ ਬਦਲੋ",
    remove_photo: "ਫੋਟੋ ਹਟਾਓ",
    uploading: "ਫੋਟੋ ਅੱਪਲੋਡ ਹੋ ਰਹੀ ਹੈ...",
    photo_uploaded: "ਪ੍ਰੋਫਾਈਲ ਫੋਟੋ ਸਫਲਤਾਪੂਰਵਕ ਅੱਪਲੋਡ ਹੋ ਗਈ!",
    failed_to_upload_photo: "ਫੋਟੋ ਅੱਪਲੋਡ ਕਰਨ ਵਿੱਚ ਅਸਫਲ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    expected_salary_range: "ਉਮੀਦ ਕੀਤੀ ਤਨਖਾਹ ਸੀਮਾ (₹)",
    min_salary: "ਘੱਟੋ-ਘੱਟ (₹)",
    max_salary: "ਵੱਧ ਤੋਂ ਵੱਧ (₹)",
    monthly: "ਮਹੀਨਾਵਾਰ",
    daily: "ਰੋਜ਼ਾਨਾ",
    max_salary_error: "ਵੱਧ ਤੋਂ ਵੱਧ ਤਨਖਾਹ ਘੱਟੋ-ਘੱਟ ਤਨਖਾਹ ਤੋਂ ਵੱਧ ਜਾਂ ਬਰਾਬਰ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ",
    select_location_map: "ਨਕਸ਼ੇ 'ਤੇ ਸਥਾਨ ਚੁਣੋ",

    profilePicture: "ਪ੍ਰੋਫਾਈਲ ਫੋਟੋ",
    uploadProfilePicture: "ਪ੍ਰੋਫਾਈਲ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ (ਵਿਕਲਪਿਕ)",
    profilePhotoAdded: "ਪ੍ਰੋਫਾਈਲ ਫੋਟੋ ਸ਼ਾਮਲ ਕੀਤੀ ਗਈ",
    photo: "ਫੋਟੋ",
    workLocation: "ਕੰਮ ਦੀ ਥਾਂ (ਸ਼ਹਿਰ / ਖੇਤਰ)*",
    selectedLocation: "ਚੁਣਿਆ ਗਿਆ",
    loadingLocationMap: "ਸਥਾਨ ਨਕਸ਼ਾ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    locationRequired: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਕੰਮ ਦੀ ਥਾਂ (ਸ਼ਹਿਰ / ਰਾਜ) ਚੁਣੋ",
    expectedSalaryRange: "ਉਮੀਦ ਕੀਤੀ ਤਨਖਾਹ ਸੀਮਾ (₹)",
    minSalaryMonthlyPlaceholder: "ਘੱਟੋ-ਘੱਟ (ਜਿਵੇਂ 15000)",
    maxSalaryMonthlyPlaceholder: "ਵੱਧ ਤੋਂ ਵੱਧ (ਜਿਵੇਂ 25000)",
    minSalaryDailyPlaceholder: "ਘੱਟੋ-ਘੱਟ (ਜਿਵੇਂ 500)",
    maxSalaryDailyPlaceholder: "ਵੱਧ ਤੋਂ ਵੱਧ (ਜਿਵੇਂ 900)",
    avatarUploadFailed: "ਪ੍ਰੋਫਾਈਲ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰਨ ਵਿੱਚ ਅਸਫਲ",

    filteredRecipients: "ਫਿਲਟਰ ਕੀਤੇ ਪ੍ਰਾਪਤਕਰਤਾ",
    salaryExpectation: "ਤਨਖਾਹ ਦੀ ਉਮੀਦ",
    notSpecified: "ਦੱਸਿਆ ਨਹੀਂ ਗਿਆ",
    remove: "ਹਟਾਓ"
  },
  or: {
    add_profile_photo: "ପ୍ରୋଫାଇଲ୍ ଫଟୋ ଯୋଡନ୍ତୁ",
    change_photo: "ଫଟୋ ପରିବର୍ତ୍ତନ କରନ୍ତୁ",
    remove_photo: "ଫଟୋ ହଟାନ୍ତୁ",
    uploading: "ଫଟୋ ଅପଲୋଡ୍ ହେଉଛି...",
    photo_uploaded: "ପ୍ରୋଫାଇଲ୍ ଫଟୋ ସଫଳତାର ସହିତ ଅପଲୋଡ୍ ହୋଇଛି!",
    failed_to_upload_photo: "ଫଟୋ ଅପଲୋଡ୍ କରିବାରେ ବିଫଳ। ଦୟାକରି ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।",
    expected_salary_range: "ପ୍ରତ୍ୟାଶିତ ଦରମା ସୀମା (₹)",
    min_salary: "ସର୍ବନିମ୍ନ (₹)",
    max_salary: "ସର୍ବାଧିକ (₹)",
    monthly: "ମାସିକ",
    daily: "ଦୈନିକ",
    max_salary_error: "ସର୍ବାଧିକ ଦରମା ସର୍ବନିମ୍ନ ଦରମା ଠାରୁ ଅଧିକ କିମ୍ବା ସମାନ ହେବା ଉଚିତ",
    select_location_map: "ମାନଚିତ୍ରରେ ସ୍ଥାନ ଚୟନ କରନ୍ତୁ",

    profilePicture: "ପ୍ରୋଫାଇଲ୍ ଫଟୋ",
    uploadProfilePicture: "ପ୍ରୋଫାଇଲ୍ ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ (ଇଚ୍ଛାଧୀନ)",
    profilePhotoAdded: "ପ୍ରୋଫାଇଲ୍ ଫଟୋ ଯୋଡା ଯାଇଛି",
    photo: "ଫଟୋ",
    workLocation: "କାର୍ଯ୍ୟ ସ୍ଥାନ (ସହର / ଅଞ୍ଚଳ)*",
    selectedLocation: "ମନୋନୀତ",
    loadingLocationMap: "ସ୍ଥାନ ମାନଚିତ୍ର ଲୋଡ୍ ହେଉଛି...",
    locationRequired: "ଦୟାକରି ଆପଣଙ୍କର କାର୍ଯ୍ୟ ସ୍ଥାନ (ସହର / ରାଜ୍ୟ) ଚୟନ କରନ୍ତୁ",
    expectedSalaryRange: "ପ୍ରତ୍ୟାଶିତ ଦରମା ସୀମା (₹)",
    minSalaryMonthlyPlaceholder: "ସର୍ବନିମ୍ନ (ଯଥା 15000)",
    maxSalaryMonthlyPlaceholder: "ସର୍ବାଧିକ (ଯଥା 25000)",
    minSalaryDailyPlaceholder: "ସର୍ବନିମ୍ନ (ଯଥା 500)",
    maxSalaryDailyPlaceholder: "ସର୍ବାଧିକ (ଯଥା 900)",
    avatarUploadFailed: "ପ୍ରୋଫାଇଲ୍ ଫଟୋ ଅପଲୋଡ୍ କରିବାରେ ବିଫଳ",

    filteredRecipients: "ଫିଲ୍ଟର୍ ହୋଇଥିବା ପ୍ରାପ୍ତକର୍ତ୍ତା",
    salaryExpectation: "ଦରମା ପ୍ରତ୍ୟାଶା",
    notSpecified: "ନିର୍ଦ୍ଦିଷ୍ଟ ନାହିଁ",
    remove: "ହଟାନ୍ତୁ"
  },
  as: {
    add_profile_photo: "প্ৰফাইল ফটো যোগ কৰক",
    change_photo: "ফটো সলনি কৰক",
    remove_photo: "ফটো আঁতৰাওক",
    uploading: "ফটো আপলোড হৈ আছে...",
    photo_uploaded: "প্ৰফাইল ফটো সফলতাৰে আপলোড কৰা হৈছে!",
    failed_to_upload_photo: "ফটো আপলোড কৰাত ব্যৰ্থ হ'ল। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।",
    expected_salary_range: "প্ৰত্যাশিত দৰমহা পৰিসৰ (₹)",
    min_salary: "সৰ্বনিম্ন (₹)",
    max_salary: "সৰ্বোচ্চ (₹)",
    monthly: "মাহেকীয়া",
    daily: "দৈনিক",
    max_salary_error: "সৰ্বোচ্চ দৰমহা সৰ্বনিম্ন দৰমহাতকৈ অধিক বা সমান হ'ব লাগিব",
    select_location_map: "মানচিত্ৰত স্থান বাছক",

    profilePicture: "প্ৰফাইল ফটো",
    uploadProfilePicture: "প্ৰফাইল ফটো আপলোড কৰক (ঐচ্ছিক)",
    profilePhotoAdded: "প্ৰফাইল ফটো যোগ কৰা হ'ল",
    photo: "ফটো",
    workLocation: "কামৰ স্থান (চহৰ / অঞ্চল)*",
    selectedLocation: "বাছনি কৰা হৈছে",
    loadingLocationMap: "স্থান মানচিত্ৰ লোড হৈ আছে...",
    locationRequired: "অনুগ্ৰহ কৰি আপোনাৰ কামৰ স্থান (চহৰ / ৰাজ্য) বাছক",
    expectedSalaryRange: "প্ৰত্যাশিত দৰমহা পৰিসৰ (₹)",
    minSalaryMonthlyPlaceholder: "সৰ্বনিম্ন (উদাহৰণ 15000)",
    maxSalaryMonthlyPlaceholder: "সৰ্বোচ্চ (উদাহৰণ 25000)",
    minSalaryDailyPlaceholder: "সৰ্বনিম্ন (উদাহৰণ 500)",
    maxSalaryDailyPlaceholder: "সৰ্বোচ্চ (উদাহৰণ 900)",
    avatarUploadFailed: "প্ৰফাইল ফটো আপলোড কৰাত ব্যৰ্থ হ'ল",

    filteredRecipients: "ফিল্টাৰ কৰা প্ৰাপকসকল",
    salaryExpectation: "দৰমহাৰ প্ৰত্যাশা",
    notSpecified: "নিৰ্দিষ্ট কৰা নাই",
    remove: "আঁতৰাওক"
  }
};

// 1. Update Frontend Messages (*.json)
console.log('--- Updating Frontend JSON Messages ---');
const locales = Object.keys(translationsData);

locales.forEach(loc => {
  const filePath = path.join(FRONTEND_MESSAGES_DIR, `${loc}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const t = translationsData[loc];

  if (!data.Auth) data.Auth = {};
  if (!data.Auth.register) data.Auth.register = {};
  if (!data.Auth.register.errors) data.Auth.register.errors = {};

  // Add register keys
  data.Auth.register.profilePicture = t.profilePicture;
  data.Auth.register.uploadProfilePicture = t.uploadProfilePicture;
  data.Auth.register.profilePhotoAdded = t.profilePhotoAdded;
  data.Auth.register.photo = t.photo;
  data.Auth.register.workLocation = t.workLocation;
  data.Auth.register.selectedLocation = t.selectedLocation;
  data.Auth.register.loadingLocationMap = t.loadingLocationMap;
  data.Auth.register.expectedSalaryRange = t.expectedSalaryRange;
  data.Auth.register.monthly = t.monthly;
  data.Auth.register.daily = t.daily;
  data.Auth.register.minSalaryMonthlyPlaceholder = t.minSalaryMonthlyPlaceholder;
  data.Auth.register.maxSalaryMonthlyPlaceholder = t.maxSalaryMonthlyPlaceholder;
  data.Auth.register.minSalaryDailyPlaceholder = t.minSalaryDailyPlaceholder;
  data.Auth.register.maxSalaryDailyPlaceholder = t.maxSalaryDailyPlaceholder;

  data.Auth.register.errors.locationRequired = t.locationRequired;
  data.Auth.register.errors.maxSalaryError = t.max_salary_error;
  data.Auth.register.errors.avatarUploadFailed = t.avatarUploadFailed;

  // Add Admin.notificationCenter keys
  if (!data.Admin) data.Admin = {};
  if (!data.Admin.notificationCenter) data.Admin.notificationCenter = {};

  data.Admin.notificationCenter.filteredRecipients = t.filteredRecipients;
  data.Admin.notificationCenter.salaryExpectation = t.salaryExpectation;
  data.Admin.notificationCenter.notSpecified = t.notSpecified;
  data.Admin.notificationCenter.remove = t.remove;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
  console.log(`✓ Updated ${loc}.json`);
});

// 2. Update Mobile translations.js
console.log('\n--- Updating Mobile translations.js ---');
let mobileFileContent = fs.readFileSync(MOBILE_TRANSLATIONS_FILE, 'utf8');

locales.forEach(loc => {
  const t = translationsData[loc];
  const keysToInsert = {
    add_profile_photo: t.add_profile_photo,
    change_photo: t.change_photo,
    remove_photo: t.remove_photo,
    uploading: t.uploading,
    photo_uploaded: t.photo_uploaded,
    failed_to_upload_photo: t.failed_to_upload_photo,
    expected_salary_range: t.expected_salary_range,
    min_salary: t.min_salary,
    max_salary: t.max_salary,
    monthly: t.monthly,
    daily: t.daily,
    max_salary_error: t.max_salary_error,
    select_location_map: t.select_location_map,
  };

  // Find the locale block: e.g. "    hi: {"
  const localeRegex = new RegExp(`(\\n\\s{4}${loc}:\\s*\\{[\\s\\S]*?)(// General|welcome:|secure_payment:)`);
  const match = mobileFileContent.match(localeRegex);

  if (match) {
    let block = '';
    for (const [k, v] of Object.entries(keysToInsert)) {
      // Check if key already exists in this locale block
      const keyRegex = new RegExp(`\\b${k}\\s*:`);
      // check whole locale segment
      const fullLocRegex = new RegExp(`\\n\\s{4}${loc}:\\s*\\{([\\s\\S]*?)\\n\\s{4}\\},`);
      const fullMatch = mobileFileContent.match(fullLocRegex);
      if (!fullMatch || !keyRegex.test(fullMatch[1])) {
        block += `        ${k}: "${v.replace(/"/g, '\\"')}",\n`;
      }
    }

    if (block) {
      mobileFileContent = mobileFileContent.replace(
        localeRegex,
        `$1${block}        $2`
      );
      console.log(`✓ Injected new keys into mobile locale '${loc}'`);
    } else {
      console.log(`- All keys already exist in mobile locale '${loc}'`);
    }
  } else {
    console.warn(`Could not find header for mobile locale '${loc}'`);
  }
});

fs.writeFileSync(MOBILE_TRANSLATIONS_FILE, mobileFileContent, 'utf8');
console.log('✓ Successfully saved updated ShramikSevaApp/constants/translations.js');
