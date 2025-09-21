import { HealthScheme } from '../types';

export const healthSchemes: HealthScheme[] = [
  {
    id: 'janani-suraksha',
    name: 'Janani Suraksha Yojana',
    nameInPunjabi: 'ਜਨਨੀ ਸੁਰੱਖਿਆ ਯੋਜਨਾ',
    description: 'Financial assistance for institutional delivery',
    descriptionInPunjabi: 'ਸੰਸਥਾਗਤ ਡਿਲੀਵਰੀ ਲਈ ਵਿੱਤੀ ਸਹਾਇਤਾ',
    eligibility: 'Pregnant women below poverty line',
    eligibilityInPunjabi: 'ਗਰੀਬੀ ਰੇਖਾ ਤੋਂ ਹੇਠਾਂ ਗਰਭਵਤੀ ਔਰਤਾਂ',
    benefits: 'Rural: Rs. 700, Urban: Rs. 600, Home delivery: Rs. 500',
    benefitsInPunjabi: 'ਪੇਂਡੂ: ਰੁ. 700, ਸ਼ਹਿਰੀ: ਰੁ. 600, ਘਰੇਲੂ ਡਿਲੀਵਰੀ: ਰੁ. 500',
    category: 'maternal'
  },
  {
    id: 'shishu-suraksha',
    name: 'Shishu Suraksha Karyakram',
    nameInPunjabi: 'ਸ਼ਿਸ਼ੂ ਸੁਰੱਖਿਆ ਕਾਰਯਕ੍ਰਮ',
    description: 'Free treatment for pregnant women and children up to 1 year',
    descriptionInPunjabi: 'ਗਰਭਵਤੀ ਔਰਤਾਂ ਅਤੇ 1 ਸਾਲ ਤੱਕ ਦੇ ਬੱਚਿਆਂ ਲਈ ਮੁਫਤ ਇਲਾਜ',
    eligibility: 'All pregnant women and children up to 1 year',
    eligibilityInPunjabi: 'ਸਾਰੀਆਂ ਗਰਭਵਤੀ ਔਰਤਾਂ ਅਤੇ 1 ਸਾਲ ਤੱਕ ਦੇ ਬੱਚੇ',
    benefits: 'Free delivery, food for 3-7 days, free blood transfusion',
    benefitsInPunjabi: 'ਮੁਫਤ ਡਿਲੀਵਰੀ, 3-7 ਦਿਨ ਭੋਜਨ, ਮੁਫਤ ਖੂਨ ਚੜ੍ਹਾਉਣਾ',
    category: 'maternal'
  },
  {
    id: 'kanyak-sambhal',
    name: 'Kanyak Sambhal',
    nameInPunjabi: 'ਕੰਨਿਆਕ ਸੰਭਾਲ',
    description: 'Free treatment for girl children up to 5 years',
    descriptionInPunjabi: '5 ਸਾਲ ਤੱਕ ਦੀਆਂ ਬੱਚੀਆਂ ਲਈ ਮੁਫਤ ਇਲਾਜ',
    eligibility: 'Girl children up to 5 years of age',
    eligibilityInPunjabi: '5 ਸਾਲ ਤੱਕ ਦੀਆਂ ਬੱਚੀਆਂ',
    benefits: 'Free and zero expense treatment',
    benefitsInPunjabi: 'ਮੁਫਤ ਅਤੇ ਜ਼ੀਰੋ ਖਰਚ ਇਲਾਜ',
    category: 'child'
  },
  {
    id: 'rashtriya-bal-swasth',
    name: 'Rashtriya Bal Swasth Karyakram',
    nameInPunjabi: 'ਰਾਸ਼ਟਰੀ ਬਾਲ ਸਵਾਸਥ ਕਾਰਯਕ੍ਰਮ',
    description: 'Free treatment for 30 diseases for children 0-18 years',
    descriptionInPunjabi: '0-18 ਸਾਲ ਦੇ ਬੱਚਿਆਂ ਲਈ 30 ਬਿਮਾਰੀਆਂ ਦਾ ਮੁਫਤ ਇਲਾਜ',
    eligibility: 'Children 0-18 years registered in Anganwadi or govt schools',
    eligibilityInPunjabi: 'ਆਂਗਨਵਾੜੀ ਜਾਂ ਸਰਕਾਰੀ ਸਕੂਲਾਂ ਵਿੱਚ ਰਜਿਸਟਰਡ 0-18 ਸਾਲ ਦੇ ਬੱਚੇ',
    benefits: 'Free treatment for 30 types of diseases',
    benefitsInPunjabi: '30 ਕਿਸਮ ਦੀਆਂ ਬਿਮਾਰੀਆਂ ਦਾ ਮੁਫਤ ਇਲਾਜ',
    category: 'child'
  },
  {
    id: 'cancer-rahat',
    name: 'Mukhya Mantri Cancer Rahat Kosh Yojana',
    nameInPunjabi: 'ਮੁੱਖ ਮੰਤਰੀ ਕੈਂਸਰ ਰਾਹਤ ਕੋਸ਼ ਯੋਜਨਾ',
    description: 'Cancer treatment support up to Rs. 1.5 lakh',
    descriptionInPunjabi: 'ਕੈਂਸਰ ਦੇ ਇਲਾਜ ਲਈ 1.5 ਲੱਖ ਰੁਪਏ ਤੱਕ ਦੀ ਸਹਾਇਤਾ',
    eligibility: 'Cancer patients',
    eligibilityInPunjabi: 'ਕੈਂਸਰ ਦੇ ਮਰੀਜ਼',
    benefits: 'Treatment support up to Rs. 1.5 lakh',
    benefitsInPunjabi: '1.5 ਲੱਖ ਰੁਪਏ ਤੱਕ ਇਲਾਜ ਦੀ ਸਹਾਇਤਾ',
    category: 'general'
  },
  {
    id: 'hepatitis-c',
    name: 'Mukhya Mantri Hepatitis C Relief Fund',
    nameInPunjabi: 'ਮੁੱਖ ਮੰਤਰੀ ਹੈਪੇਟਾਈਟਿਸ ਸੀ ਰਾਹਤ ਫੰਡ',
    description: 'Free Hepatitis C treatment in district hospitals',
    descriptionInPunjabi: 'ਜ਼ਿਲ੍ਹਾ ਹਸਪਤਾਲਾਂ ਵਿੱਚ ਮੁਫਤ ਹੈਪੇਟਾਈਟਿਸ ਸੀ ਇਲਾਜ',
    eligibility: 'Hepatitis C patients',
    eligibilityInPunjabi: 'ਹੈਪੇਟਾਈਟਿਸ ਸੀ ਦੇ ਮਰੀਜ਼',
    benefits: 'Free treatment in district hospitals',
    benefitsInPunjabi: 'ਜ਼ਿਲ੍ਹਾ ਹਸਪਤਾਲਾਂ ਵਿੱਚ ਮੁਫਤ ਇਲਾਜ',
    category: 'general'
  },
  {
    id: 'sehat-bima',
    name: 'Bhagat Puran Singh Sehat Bima Yojana',
    nameInPunjabi: 'ਭਗਤ ਪੂਰਨ ਸਿੰਘ ਸਿਹਤ ਬੀਮਾ ਯੋਜਨਾ',
    description: 'Health insurance for blue card holders',
    descriptionInPunjabi: 'ਨੀਲੇ ਕਾਰਡ ਧਾਰਕਾਂ ਲਈ ਸਿਹਤ ਬੀਮਾ',
    eligibility: 'Blue card holders',
    eligibilityInPunjabi: 'ਨੀਲੇ ਕਾਰਡ ਧਾਰਕ',
    benefits: 'Free treatment up to Rs. 50,000, Insurance cover Rs. 5 lakh',
    benefitsInPunjabi: '50,000 ਰੁਪਏ ਤੱਕ ਮੁਫਤ ਇਲਾਜ, 5 ਲੱਖ ਰੁਪਏ ਬੀਮਾ ਕਵਰ',
    category: 'insurance'
  }
];