'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Lang = 'en' | 'ar';

type Dict = {
  home: string;
  services: string;
  aboutUs: string;
  contact: string;
  searchPlaceholder: string;
  callForInfo: string;

  headline: string;
  subtext: string;
  featuresTitle: string;

  feature1: string;
  feature2: string;
  feature3: string;
  feature4: string;

  sellBoxTitle: string;
  sellBoxSub: string;
  contactUs: string;

  otherServices: string;
  otherServicesSub: string;
  viewMore: string;

    heroBadge: string;
  heroTitleTop: string;
  heroTitleBlue: string;
  heroTitleRest: string;
  heroSubtitle: string;
  contactUsCta: string;

  premiumTitle: string;
  premiumSubtitle: string;
  viewAllServices: string;

  peopleSayTitle: string;
  peopleSaySub: string;
  testimonialText: string;
  testimonialName: string;

  saleTitle: string;
  saleDesc: string;
  fillForm: string;

  whyChoose: string;
  whyCard1Title: string;
  whyCard1Desc: string;
  whyCard2Title: string;
  whyCard2Desc: string;
  whyCard3Title: string;
  whyCard3Desc: string;
  whyCard4Title: string;
  whyCard4Desc: string;

  faqTitle: string;
  faqSubtitle: string;
  faqQ1: string;
  faqA1: string;
  faqQ2: string;
  faqA2: string;
  faqQ3: string;
  faqA3: string;
  faqQ4: string;
  faqA4: string;
  faqQ5: string;
  faqA5: string;
  faqQ6: string;
  faqA6: string;
  faqQ7: string;
  faqA7: string;
  faqQ8: string;
  faqA8: string;

  servicesHeroTitle1: string;
  servicesHeroTitle2a: string;
  servicesHeroCity: string;
  servicesHeroTitle2b: string;
  servicesHeroSubtitle: string;

  servicesPremiumTitle: string;
  servicesPremiumSubtitle: string;
  servicesCardDesc: string;
  service1: string;
service2: string;
service3: string;
service4: string;
service5: string;
service6: string;
service7: string;
service8: string;
service9: string;
otherService1: string;
otherService2: string;
otherService3: string;
otherService4: string;
otherService5: string;
otherService6: string;
otherService7: string;
otherService8: string;
otherService9: string;

otherServiceCardDesc: string;
serviceCardDesc: string;
viewMoreBtn: string;
testimonialRole: string;
  deliveryTitle: string;
  deliverySubtitle: string;

  area1City: string; area1Title: string; area1Desc: string;
  area2City: string; area2Title: string; area2Desc: string;
  area3City: string; area3Title: string; area3Desc: string;
  area4City: string; area4Title: string; area4Desc: string;
  area5City: string; area5Title: string; area5Desc: string;
  area6City: string; area6Title: string; area6Desc: string;


  contactTitle: string;
contactSubtitle: string;

contactBoxTitle: string;
contactBoxSubtitle: string;
contactPhoneNumberLabel: string;
contactPhoneNumberValue: string;
contactEmailLabel: string;
contactEmailValue: string;
contactLocationLabel: string;
contactLocationValue: string;

contactFormTitle: string;
contactFormSubtitle: string;
contactFullName: string;
contactMessageLabel: string;
contactSendButton: string;

aboutHeroPill: string;
aboutHeroTitleLine1: string;
aboutHeroTitleLine2a: string;
aboutHeroCity: string;
aboutHeroTitleLine2b: string;
aboutHeroSubtitle: string;

aboutTag: string;
aboutSection2Title: string;
aboutSection2Body: string;

aboutFeature1Title: string;
aboutFeature1Desc: string;
aboutFeature2Title: string;
aboutFeature2Desc: string;
aboutFeature3Title: string;
aboutFeature3Desc: string;

aboutProcessPill: string;
aboutProcessTitle: string;
aboutProcessSubtitle: string;

aboutStep1Title: string; aboutStep1Desc: string;
aboutStep2Title: string; aboutStep2Desc: string;
aboutStep3Title: string; aboutStep3Desc: string;
aboutStep4Title: string; aboutStep4Desc: string;
aboutStep5Title: string; aboutStep5Desc: string;

aboutCtaTitle: string;
aboutCtaSubtitle: string;
aboutCtaButton2: string;

  readySellTitle: string;
  readySellDesc: string;
  footerAboutTitle: string;
  footerSupportTitle: string;
  footerContactTitle: string;
  footerSubscribeTitle: string;
  footerEmailPlaceholder: string;
  footerAgree: string;
  footerSubscribe: string;
  copyright: string;
  footerDescription: string;
footerSupport1: string;
footerSupport2: string;
footerSupport3: string;
footerSupport4: string;
footerBottomCopyright: string;
};

const DICT: Record<Lang, Dict> = {
  en: {
    home: 'Home',
    services: 'Services',
    aboutUs: 'About Us',
    contact: 'Contact',
    searchPlaceholder: 'Search for any service',
    callForInfo: 'Call For Information',

    headline: 'We Buy Used Washing Machines at the Best Prices in your Location!',
    subtext:
      'Got an old or unused washing machine? Turn it into cash today! We evaluate your appliance based on its condition, age, and type — and offer you the best deal on the spot. We believe in sustainability by giving used appliances a second life, while making sure our customers always get the most value.',
    featuresTitle: 'Features of Our Services:',

    feature1: 'Best prices on the market',
    feature2: 'Fast and professional service',
    feature3: 'Free evaluation of washing machines & appliances',
    feature4: 'Free transportation & pickup service',

    sellBoxTitle: 'Do you want to sell your used washing machine or appliances?',
    sellBoxSub: 'Contact us today for a free valuation and the best prices in location!',
    contactUs: 'Contact us',

    otherServices: 'Other Services',
    otherServicesSub:
      'Looking to sell your used furniture or home appliances? We offer the best prices in Dammam and all surrounding areas — fast, easy, and reliable.',
    viewMore: 'View More',
        heroBadge: 'We Buy Used Furniture Finds At Home',
    heroTitleTop: '',
heroTitleBlue: 'We Buy Used Furniture in',
heroTitleRest: ' Dammam, Khobar, Qatif & Jubail',
    heroSubtitle:
      'Get the Best Prices on Home Appliances, Air Conditioners, and Pre-Loved Furniture! We Buy All Types Across.',
    contactUsCta: 'Contact us',

    premiumTitle: 'Our Premium Services',
    premiumSubtitle:
      'Looking to sell your used furniture or home appliances? We offer the best prices in Dammam and all surrounding areas — fast, easy, and reliable.',
    viewAllServices: 'View all services',

    peopleSayTitle: 'What do people say about us?',
    peopleSaySub: "Our customers' opinions",
    testimonialText:
      'The best company to buy used furniture in Dammam. Excellent service, fair prices, and very professional team. Highly recommended!',
    testimonialName: 'Ahmed Musa',

    saleTitle: 'Do you have used furniture for sale?',
    saleDesc:
      'We buy air conditioners, refrigerators, sofas, scrap metal, iron, and all types of used furniture at the best prices.',
    fillForm: 'Fill out the Form',

    whyChoose: 'Why choose us?',
    whyCard1Title: 'Long Experience',
    whyCard1Desc:
      'We have a lot of experience and specialize in buying used furniture and appliances with fast and reliable service.',
    whyCard2Title: 'Best Price',
    whyCard2Desc:
      'We guarantee the best prices in Dammam, Khobar, Qatif and Jubail. No hidden fees — just honest cash.',
    whyCard3Title: 'Fast Service',
    whyCard3Desc:
      'We buy your item, contact you quickly and complete pickup in the shortest time — smooth and stress-free.',
    whyCard4Title: 'Free Assessment',
    whyCard4Desc:
      'No fees for evaluation. We assess your items at your location and offer fair pricing instantly.',

    faqTitle: 'Frequently Asked Questions About Buying Used Furniture',
    faqSubtitle:
      'Learn everything you need to know about buying used furniture and used air conditioners in Dammam, Khobar, Qatif, and Jubail including information about scrap metal, household appliances, and all related services.',
    faqQ1: 'How can I sell used furniture in Dammam?',
    faqA1:
      'Contact us and share details/photos of the items. We will evaluate quickly and arrange free pickup with instant payment.',
    faqQ2: 'What are the prices for buying used air conditioners in Dammam?',
    faqA2:
      'We offer highly competitive prices with immediate payment and free pickup service from your location.',
    faqQ3: 'Do you buy used air conditioners and scrap metal?',
    faqA3:
      'Yes. We buy used air conditioners, scrap metal, iron, and many household appliances.',
    faqQ4: 'Where can I sell used furniture in Khobar and Qatif?',
    faqA4:
      'We cover Khobar, Qatif, Jubail and surrounding areas. Pickup is free and scheduling is flexible.',
    faqQ5: 'What is the difference between used furniture and scrap?',
    faqA5:
      'Used furniture can be reused/resold; scrap is purchased for material value (metal/iron/copper).',
    faqQ6: 'How can I sell my used air conditioner for the best price?',
    faqA6:
      'Keep it clean, share model/condition, and we’ll evaluate fairly. We pay instantly after pickup.',
    faqQ7: 'Do you service include all types of household appliances?',
    faqA7:
      'Yes, we buy many appliances including refrigerators, washing machines, and air conditioners.',
    faqQ8: 'Do you offer free transportation?',
    faqA8:
      'Yes, transportation and pickup service is free across our service areas.',

    readySellTitle: 'Ready to Sell? Contact Us Now and Get Instant Payment!',
    readySellDesc:
      "Don't let your old furniture and appliances take up space! We buy used furniture, air conditioners, washing machines, and all household appliances at the best price. Contact us today and turn your old items into cash!",
    
    servicesHeroTitle1: 'Used Furniture Buying',
  servicesHeroTitle2a: 'Services in ',
  servicesHeroCity: 'Jubail',
  servicesHeroTitle2b: ' at the Best Prices',
  servicesHeroSubtitle:
    'We offer comprehensive services for buying used furniture, electrical appliances, and air conditioners in Jubail and the Eastern Province. Free transportation & immediate appraisal.',

  servicesPremiumTitle: 'Premium Services',
  servicesPremiumSubtitle:
    'Looking to sell your used furniture or home appliances? We offer the best prices in Dammam and all surrounding areas — fast, easy, and reliable.',
  servicesCardDesc: 'Buy used items in Dammam at the best prices',

service1: 'Washing Machine',
service2: 'Furniture Moving',
service3: 'Dining Rooms',
service4: 'Kitchens',
service5: 'Air Coolers',
service6: 'All Types of Scraps',
service7: 'Scrap',
service8: 'Refrigerators',
service9: 'Window Air Conditioner',
otherService1: 'Central Air Conditioning',
otherService2: 'Furniture Moving',
otherService3: 'Dining Rooms',
otherService4: 'Kitchens',
otherService5: 'Air Coolers',
otherService6: 'All Types of Scraps',
otherService7: 'Scrap',
otherService8: 'Refrigerators',
otherService9: 'Window Air Conditioner',

otherServiceCardDesc:
  'Buy used central air conditioners in Dammam at the best prices',
serviceCardDesc: 'Buy used items in Dammam at the best prices',
viewMoreBtn: 'View More',
testimonialRole: 'Customer',
  deliveryTitle: 'Service Delivery Area',
  deliverySubtitle:
  'We cover all cities and governorates in the Eastern Province for buying used furniture and household appliances.',

  area1City: 'AL-KHOBAR',
  area1Title: 'Buying Used Furniture in Al Khobar',
  area1Desc: 'Best price for furniture, appliances & AC units across all Al-Khobar district',

  area2City: 'DAMMAM',
  area2Title: 'Buying Used Furniture in Dammam',
  area2Desc: 'Some-day home visits and immediate appraisals throughout Dammam',

  area3City: 'JUBAIL',
  area3Title: 'Buying Used Furniture in Jubail',
  area3Desc: 'Our primary hub—fast, reliable, and the best prices in Jubail guaranteed.',

  area4City: 'DHAHRAN & SAIHAT',
  area4Title: 'Buying Used Furniture in Dhahran and Saihat',
  area4Desc: 'Full service coverage in Dhahran and Saihat with free transportation included',

  area5City: 'AL AHSA',
  area5Title: 'Buying Used Furniture in Al-Ahsa',
  area5Desc: 'Transparent pricing and professional assessment services across Al-Ahsa',

  area6City: 'QATIF',
  area6Title: 'Buying Used Furniture in Qatif',
  area6Desc: 'Competitive offers and dedicated team visits in Qatif and surrounding areas.',
  contactTitle: 'Contact Us',
contactSubtitle:
  'Selling your old furniture or appliances has never been easier. Contact us today and get the best price — fast and hassle-free.',

contactBoxTitle: 'Contact Us',
contactBoxSubtitle: 'You can call us directly via',

contactPhoneNumberLabel: 'Phone Number',
contactPhoneNumberValue: '+000 (123) 456 889',

contactEmailLabel: 'E-mail Address',
contactEmailValue: 'support@gmail.com',

contactLocationLabel: 'Location',
contactLocationValue: '55 Main Street, Melbourne, Australia',

contactFormTitle: 'Send us a message',
contactFormSubtitle: 'Please fill out the form below and we will get back to you as soon as possible',

contactFullName: 'Full Name',
contactMessageLabel: 'Message',
contactSendButton: 'Send Message', 
  
aboutHeroPill: 'Who are we?',
aboutHeroTitleLine1: 'Used Furniture Buying',
aboutHeroTitleLine2a: 'Services in ',
aboutHeroCity: 'Al-Khobar',
aboutHeroTitleLine2b: ' at the Best Prices',
aboutHeroSubtitle:
  'We are a leading company in buying used air conditioners, scrap, and metals — with immediate payment, free pickup from your location, and over 10 years of experience.',

aboutTag: 'About Us',
aboutSection2Title: 'Who Are We?',
aboutSection2Body:
  'We are a leading company in buying used air conditioners in Al-Khobar and throughout the Eastern Province. We have over 10 years of experience purchasing used air conditioners, scrap air conditioners, and metals at the highest prices.\n\nWith immediate payment and free pickup directly from your location, our specialized team will reach you quickly to assess your air conditioners and scrap metal with complete transparency. You can view our used air conditioner buying services for more details.\n\nWe are also the first destination for buying used furniture in Dammam, including bedrooms, dining rooms, sofas, and wardrobes, at attractive prices and with immediate cash payment.',

aboutFeature1Title: 'Market Leader',
aboutFeature1Desc:
  "Whether you're in Al Khobar, Dammam, Qatif, or Al Ahsa, our specialized team reaches you quickly for a transparent, on-site assessment.",
aboutFeature2Title: 'Immediate Cash Payment',
aboutFeature2Desc:
  'We hand over cash the moment we agree on the price — no delays, no bank transfers, no waiting.',
aboutFeature3Title: 'Free Pickup Service',
aboutFeature3Desc:
  'Our team handles all transportation at zero cost to you. We come to your door, assess the items, and carry them away.',

aboutProcessPill: 'Simple Process',
aboutProcessTitle: 'How Do You Sell Your Used Furniture \nor Scrap with Us?',
aboutProcessSubtitle:
  'Selling your used furniture or scrap with us is simple and hassle-free. Just share the details of your items, get a quick price estimate, and schedule a pickup at your convenience. Our team ensures a smooth process from start to finish, saving you time while offering the best value for your items.',

aboutStep1Title: 'Contact Us',
aboutStep1Desc:
  'Reach us via phone or WhatsApp to provide initial information about the your used furniture or scrap you want to sell.',
aboutStep2Title: 'Schedule an Appointment',
aboutStep2Desc:
  'We will schedule a convenient time for the visit in Al Khobar or your area — same-day visits often available.',
aboutStep3Title: 'On-Site Inspection',
aboutStep3Desc:
  'Our team evaluates the devices or metals accurately and transparently, right at your location.',
aboutStep4Title: 'Price Offer',
aboutStep4Desc:
  'We offer the best market price with immediate payment.',
aboutStep5Title: 'Transport',
aboutStep5Desc:
  'We ensure transparent service by transporting your used furniture or scrap from your location.',

aboutCtaTitle: 'Ready to Sell? We Come to You.',
aboutCtaSubtitle:
  'Call us now for a same-day visit, honest appraisal, and immediate cash payment — anywhere in Al-Khobar or any other place.',
aboutCtaButton2: 'Our Services',

  footerAboutTitle: 'About Us',
    footerSupportTitle: 'Support And Education',
    footerContactTitle: 'Contact Us',
    footerSubscribeTitle: 'Subscribe To Our Newsletter',
    footerEmailPlaceholder: 'Enter your e-mail',
    footerAgree: 'I Agree To My Email Being Stored Receive',
    footerSubscribe: 'Subscribe',
    footerDescription:
  'We specialize in buying used furniture, electrical appliances, and scrap metal across Dammam.',

footerSupport1: 'Buying Used Air Conditioners',
footerSupport2: 'Buying Refrigerators and Washing Machines',
footerSupport3: 'Buying Sofas and Living Room Sets',
footerSupport4: 'Buying Scrap Metal and Iron',

footerBottomCopyright:
  'Copyright © 2023. All Rights Reserved.',
    copyright: '© 2026 Buying Used Furniture In Dammam. All Rights Reserved.',
  },
  ar: {
    home: 'الرئيسية',
    services: 'الخدمات',
    aboutUs: 'من نحن',
    contact: 'تواصل معنا',
    searchPlaceholder: 'ابحث عن أي خدمة',
    callForInfo: 'اتصل للاستعلام',

    headline: 'نشتري غسالات مستعملة بأفضل الأسعار في موقعك!',
    subtext:
      'هل لديك غسالة قديمة أو غير مستخدمة؟ حوّلها إلى نقد اليوم! نقيم جهازك حسب حالته وعمره ونوعه — ونقدم لك أفضل عرض فورًا. نؤمن بالاستدامة عبر منح الأجهزة المستعملة حياة ثانية مع ضمان حصول عملائنا على أفضل قيمة.',
    featuresTitle: 'مميزات خدماتنا:',

    feature1: 'أفضل الأسعار في السوق',
    feature2: 'خدمة سريعة واحترافية',
    feature3: 'تقييم مجاني للغسالات والأجهزة',
    feature4: 'نقل واستلام مجاني',

    sellBoxTitle: 'هل تريد بيع غسالتك أو أجهزتك المستعملة؟',
    sellBoxSub: 'تواصل معنا اليوم لتقييم مجاني وأفضل الأسعار!',
    contactUs: 'تواصل معنا',

    otherServices: 'خدمات أخرى',
    otherServicesSub:
      'هل ترغب في بيع أثاثك أو أجهزة منزلك المستعملة؟ نقدم أفضل الأسعار في الدمام والمناطق المحيطة — بسرعة وسهولة وموثوقية.',
    viewMore: 'عرض المزيد',
        heroBadge: 'نشتري الأثاث المستعمل بسهولة',
    heroTitleTop: '',
heroTitleBlue: 'نشتري الأثاث المستعمل في',
heroTitleRest: ' الدمام، الخبر، القطيف والجبيل',
    heroSubtitle:
      'احصل على أفضل الأسعار للأجهزة المنزلية والمكيفات والأثاث المستعمل. نشتري جميع الأنواع.',
    contactUsCta: 'تواصل معنا',

    premiumTitle: 'خدماتنا المميزة',
    premiumSubtitle:
      'هل تريد بيع أثاثك أو أجهزة منزلك المستعملة؟ نقدم أفضل الأسعار في الدمام والمناطق المحيطة — بسرعة وسهولة وموثوقية.',
    viewAllServices: 'عرض كل الخدمات',

    peopleSayTitle: 'ماذا يقول الناس عنا؟',
    peopleSaySub: 'آراء عملائنا',
    testimonialText:
      'أفضل شركة لشراء الأثاث المستعمل في الدمام. خدمة ممتازة وأسعار عادلة وفريق محترف جداً. أنصح بها!',
    testimonialName: 'أحمد موسى',

    saleTitle: 'هل لديك أثاث مستعمل للبيع؟',
    saleDesc:
      'نشتري المكيفات والثلاجات والكنب والخردة والحديد وجميع أنواع الأثاث المستعمل بأفضل الأسعار.',
    fillForm: 'املأ النموذج',

    whyChoose: 'لماذا تختارنا؟',
    whyCard1Title: 'خبرة طويلة',
    whyCard1Desc: 'خبرة كبيرة في شراء الأثاث والأجهزة مع خدمة سريعة وموثوقة.',
    whyCard2Title: 'أفضل سعر',
    whyCard2Desc: 'نضمن أفضل الأسعار بدون رسوم مخفية — دفع فوري.',
    whyCard3Title: 'خدمة سريعة',
    whyCard3Desc: 'تواصل سريع وإنهاء الاستلام في أقصر وقت بكل سلاسة.',
    whyCard4Title: 'تقييم مجاني',
    whyCard4Desc: 'تقييم مجاني في موقعك مع عرض عادل فوراً.',

    faqTitle: 'أسئلة شائعة حول شراء الأثاث المستعمل',
    faqSubtitle:
      'تعرّف على كل ما تحتاجه حول شراء الأثاث والمكيفات المستعملة في الدمام والخبر والقطيف والجبيل.',
    faqQ1: 'كيف أبيع الأثاث المستعمل في الدمام؟',
    faqA1: 'تواصل معنا وأرسل تفاصيل/صور وسنقيّم ونرتب الاستلام مجاناً مع دفع فوري.',
    faqQ2: 'ما أسعار شراء المكيفات المستعملة في الدمام؟',
    faqA2: 'نقدم أسعار منافسة جداً مع دفع فوري واستلام مجاني.',
    faqQ3: 'هل تشترون المكيفات المستعملة والخردة؟',
    faqA3: 'نعم، نشتري المكيفات والخردة والحديد والكثير من الأجهزة.',
    faqQ4: 'أين يمكنني بيع الأثاث في الخبر والقطيف؟',
    faqA4: 'نغطي الخبر والقطيف والجبيل والمناطق المحيطة مع استلام مجاني.',
    faqQ5: 'ما الفرق بين الأثاث المستعمل والخردة؟',
    faqA5: 'الأثاث يعاد استخدامه/بيعه، والخردة تُشترى لقيمتها المعدنية.',
    faqQ6: 'كيف أبيع المكيف بأفضل سعر؟',
    faqA6: 'شارك الموديل والحالة وسنقدم تقييماً عادلاً مع دفع فوري بعد الاستلام.',
    faqQ7: 'هل تشترون جميع الأجهزة المنزلية؟',
    faqA7: 'نعم، نشتري أجهزة عديدة مثل الثلاجات والغسالات والمكيفات.',
    faqQ8: 'هل توفرون نقل مجاني؟',
    faqA8: 'نعم، النقل والاستلام مجاني.',

    readySellTitle: 'جاهز للبيع؟ تواصل معنا الآن واحصل على دفع فوري!',
    readySellDesc:
      'لا تدع الأثاث والأجهزة القديمة تشغل مساحة! نشتري الأثاث والمكيفات والغسالات وكل الأجهزة بأفضل سعر.',
    
    servicesHeroTitle1: 'شراء الأثاث المستعمل',
    servicesHeroTitle2a: 'خدماتنا في ',
    servicesHeroCity: 'الجبيل',
    servicesHeroTitle2b: ' بأفضل الأسعار',
    servicesHeroSubtitle:
  'نقدم خدمات شاملة لشراء الأثاث المستعمل والأجهزة الكهربائية والمكيفات في الجبيل والمنطقة الشرقية. نقل مجاني وتقييم فوري.',

  servicesPremiumTitle: 'خدمات مميزة',
  servicesPremiumSubtitle:
    'هل تريد بيع أثاثك أو أجهزة منزلك المستعملة؟ نقدم أفضل الأسعار في الدمام والمناطق المحيطة — بسرعة وسهولة وموثوقية.',
  servicesCardDesc: 'نشتري المستعمل في الدمام بأفضل الأسعار',
service1: 'غسالات',
service2: 'نقل الأثاث',
service3: 'غرف الطعام',
service4: 'مطابخ',
service5: 'مكيفات صحراوية',
service6: 'جميع أنواع الخردة',
service7: 'خردة',
service8: 'ثلاجات',
service9: 'مكيف شباك',
otherService1: 'تكييف مركزي',
otherService2: 'نقل الأثاث',
otherService3: 'غرف الطعام',
otherService4: 'مطابخ',
otherService5: 'مكيفات صحراوية',
otherService6: 'جميع أنواع الخردة',
otherService7: 'خردة',
otherService8: 'ثلاجات',
otherService9: 'مكيف شباك',

otherServiceCardDesc:
  'نشتري التكييف المركزي المستعمل في الدمام بأفضل الأسعار',
serviceCardDesc: 'نشتري المستعمل في الدمام بأفضل الأسعار',
viewMoreBtn: 'عرض المزيد',
testimonialRole: 'عميل',
  deliveryTitle: 'مناطق تقديم الخدمة',
  deliverySubtitle:
    'نغطي جميع المدن والمحافظات في المنطقة الشرقية لشراء الأثاث المستعمل والأجهزة المنزلية.',

  area1City: 'الخبر',
  area1Title: 'شراء الأثاث المستعمل في الخبر',
  area1Desc: 'أفضل سعر للأثاث والأجهزة والمكيفات في جميع أحياء الخبر',

  area2City: 'الدمام',
  area2Title: 'شراء الأثاث المستعمل في الدمام',
  area2Desc: 'زيارات منزلية وتقييم فوري في أنحاء الدمام',

  area3City: 'الجبيل',
  area3Title: 'شراء الأثاث المستعمل في الجبيل',
  area3Desc: 'مركزنا الرئيسي — خدمة سريعة وأسعار مضمونة في الجبيل',

  area4City: 'الظهران وسيهات',
  area4Title: 'شراء الأثاث المستعمل في الظهران وسيهات',
  area4Desc: 'تغطية كاملة مع نقل مجاني في الظهران وسيهات',

  area5City: 'الأحساء',
  area5Title: 'شراء الأثاث المستعمل في الأحساء',
  area5Desc: 'تسعير واضح وتقييم احترافي في أنحاء الأحساء',

  area6City: 'القطيف',
  area6Title: 'شراء الأثاث المستعمل في القطيف',
  area6Desc: 'عروض منافسة وزيارات فريقنا للقطيف والمناطق المجاورة',

  contactTitle: 'تواصل معنا',
contactSubtitle:
  'لم يكن بيع أثاثك أو أجهزتك المستعملة أسهل من قبل. تواصل معنا اليوم واحصل على أفضل سعر — بسرعة وبدون أي متاعب.',

contactBoxTitle: 'تواصل معنا',
contactBoxSubtitle: 'يمكنك التواصل معنا مباشرة عبر',

contactPhoneNumberLabel: 'رقم الهاتف',
contactPhoneNumberValue: '+000 (123) 456 889',

contactEmailLabel: 'البريد الإلكتروني',
contactEmailValue: 'support@gmail.com',

contactLocationLabel: 'الموقع',
contactLocationValue: '55 Main Street, Melbourne, Australia',

contactFormTitle: 'أرسل لنا رسالة',
contactFormSubtitle: 'يرجى تعبئة النموذج أدناه وسنعاود التواصل معك في أقرب وقت ممكن',

contactFullName: 'الاسم الكامل',
contactMessageLabel: 'الرسالة',
contactSendButton: 'إرسال الرسالة',

aboutHeroPill: 'من نحن؟',
aboutHeroTitleLine1: 'شراء الأثاث المستعمل',
aboutHeroTitleLine2a: 'خدماتنا في ',
aboutHeroCity: 'الخبر',
aboutHeroTitleLine2b: ' بأفضل الأسعار',
aboutHeroSubtitle:
  'نحن شركة رائدة في شراء المكيفات المستعملة والخردة والمعادن — مع دفع فوري، ونقل مجاني من موقعك، وخبرة تزيد عن 10 سنوات.',

aboutTag: 'من نحن',
aboutSection2Title: 'من نحن؟',
aboutSection2Body:
  'نحن شركة رائدة في شراء المكيفات المستعملة في الخبر وجميع أنحاء المنطقة الشرقية. لدينا أكثر من 10 سنوات من الخبرة في شراء المكيفات المستعملة وخردة المكيفات والمعادن بأعلى الأسعار.\n\nمع الدفع الفوري والنقل المجاني مباشرة من موقعك، يصل إليك فريقنا المتخصص بسرعة لتقييم المكيفات والخردة بكل شفافية. يمكنك الاطلاع على خدمات شراء المكيفات لدينا لمزيد من التفاصيل.\n\nكما أننا الوجهة الأولى لشراء الأثاث المستعمل في الدمام، بما في ذلك غرف النوم وغرف الطعام والأرائك والخزائن، بأسعار مناسبة ودفع نقدي فوري.',

aboutFeature1Title: 'الريادة في السوق',
aboutFeature1Desc:
  'سواء كنت في الخبر أو الدمام أو القطيف أو الأحساء، يصل إليك فريقنا بسرعة لتقييم شفاف في موقعك.',
aboutFeature2Title: 'دفع نقدي فوري',
aboutFeature2Desc:
  'نقوم بالدفع فور الاتفاق على السعر — بدون تأخير أو تحويلات بنكية أو انتظار.',
aboutFeature3Title: 'خدمة نقل مجانية',
aboutFeature3Desc:
  'يتولى فريقنا النقل بالكامل دون أي تكلفة عليك. نصل إلى باب منزلك ونقيّم الأغراض وننقلها.',

aboutProcessPill: 'خطوات بسيطة',
aboutProcessTitle: 'كيف تبيع أثاثك المستعمل\nأو الخردة معنا؟',
aboutProcessSubtitle:
  'بيع الأثاث المستعمل أو الخردة معنا سهل وبدون متاعب. شارك تفاصيل أغراضك، احصل على تقدير سريع للسعر، وحدد موعد الاستلام بما يناسبك. نضمن لك عملية سلسة من البداية للنهاية مع أفضل قيمة.',

aboutStep1Title: 'تواصل معنا',
aboutStep1Desc:
  'تواصل معنا عبر الهاتف أو واتساب لإرسال معلومات أولية عن الأثاث أو الخردة التي ترغب ببيعها.',
aboutStep2Title: 'تحديد موعد',
aboutStep2Desc:
  'نحدد موعدًا مناسبًا للزيارة في الخبر أو منطقتك — وغالبًا تتوفر زيارات في نفس اليوم.',
aboutStep3Title: 'معاينة في الموقع',
aboutStep3Desc:
  'يقوم فريقنا بتقييم الأغراض أو المعادن بدقة وشفافية في موقعك.',
aboutStep4Title: 'تقديم السعر',
aboutStep4Desc:
  'نقدم أفضل سعر في السوق مع دفع فوري.',
aboutStep5Title: 'النقل',
aboutStep5Desc:
  'ننقل الأثاث أو الخردة من موقعك بخدمة واضحة وسلسة.',

aboutCtaTitle: 'جاهز للبيع؟ نصل إليك.',
aboutCtaSubtitle:
  'اتصل بنا الآن لزيارة في نفس اليوم وتقييم عادل ودفع نقدي فوري — في الخبر أو أي مكان آخر.',
aboutCtaButton2: 'خدماتنا',

    footerAboutTitle: 'من نحن',
    footerSupportTitle: 'الدعم والتثقيف',
    footerContactTitle: 'تواصل معنا',
    footerSubscribeTitle: 'اشترك في النشرة البريدية',
    footerEmailPlaceholder: 'أدخل بريدك الإلكتروني',
    footerAgree: 'أوافق على حفظ بريدي لاستلام الرسائل',
    footerSubscribe: 'اشتراك',
    footerDescription:
  'نحن متخصصون في شراء الأثاث المستعمل والأجهزة الكهربائية والخردة في الدمام.',

footerSupport1: 'شراء المكيفات المستعملة',
footerSupport2: 'شراء الثلاجات والغسالات',
footerSupport3: 'شراء الكنب وغرف المعيشة',
footerSupport4: 'شراء الخردة والحديد',

footerBottomCopyright:
  'حقوق النشر © 2023. جميع الحقوق محفوظة.',
    copyright: '© 2026 شراء الأثاث المستعمل في الدمام. جميع الحقوق محفوظة.',
  },
};

type I18nCtx = {
  lang: Lang;
  dir: 'ltr' | 'rtl';
  t: Dict;
  toggle: () => void;
  setLang: (l: Lang) => void;
};

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const saved = window.localStorage.getItem('lang');
    if (saved === 'en' || saved === 'ar') setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem('lang', l);
  };

  const toggle = () => setLang(lang === 'en' ? 'ar' : 'en');

  const value = useMemo<I18nCtx>(() => {
    const dir: 'ltr' | 'rtl' = lang === 'ar' ? 'rtl' : 'ltr';
    return { lang, dir, t: DICT[lang], toggle, setLang };
  }, [lang]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useI18n must be used inside I18nProvider');
  return v;
}