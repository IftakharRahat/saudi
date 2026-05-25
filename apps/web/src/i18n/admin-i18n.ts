'use client';

import { useI18n } from '@/i18n/I18nProvider';

type AdminDict = {
    adminPanel: string;
    dashboard: string;
    services: string;
    products: string;
    testimonials: string;
    faqs: string;
    serviceAreas: string;
    contacts: string;
    subscribers: string;
    settings: string;
    signOut: string;
    futureCompanies: string;
    adminDashboard: string;

    // Dashboard
    overview: string;
    overviewSubtitle: string;
    quickActions: string;
    manageServices: string;
    manageProducts: string;
    manageTestimonials: string;
    manageFaqs: string;
    manageAreas: string;
    viewContacts: string;
    viewSubscribers: string;

    // Contacts page
    contactSubmissions: string;
    contactSubmissionsSub: string;
    refresh: string;
    loading: string;
    noContactSubmissions: string;
    failedLoadContacts: string;
    date: string;
    name: string;
    phone: string;
    email: string;
    location: string;
    message: string;

    // Subscribers page
    newsletterSubscribers: string;
    newsletterSubscribersSub: string;
    noSubscribers: string;
    failedLoadSubscribers: string;

    // Settings page
    siteSettings: string;
    siteSettingsSub: string;
    supportPhone: string;
    supportPhoneHint: string;
    whatsappNumber: string;
    whatsappNumberHint: string;
    contactEmail: string;
    contactEmailHint: string;
    address: string;
    addressHint: string;
    saveSettings: string;
    saving: string;
    loadingSettings: string;
    failedLoadSettings: string;

    // Account
    account: string;
    accountSub: string;
    currentEmail: string;
    newEmail: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    updateEmail: string;
    updatePassword: string;
    updating: string;
    passwordsDoNotMatch: string;
    changeLoginEmail: string;
    changePassword: string;

    // CRUD
    create: string;
    edit: string;
    delete: string;
    cancel: string;
    save: string;
    active: string;
    sortOrder: string;
    yes: string;
    no: string;

    // SEO
    seo: string;
    seoManagement: string;
    seoManagementSub: string;
    pageSlug: string;
    pageSlugHint: string;
    seoScopeHint: string;
    selectPageUrl: string;
    noUrlOptions: string;
    alreadyConfiguredShort: string;
    currentSavedUrl: string;
    websitePages: string;
    servicePages: string;
    productPages: string;
    metaTitle: string;
    metaDescription: string;
    focusKeyword: string;
    secondaryKeywords: string;
    secondaryKeywordsHint: string;
    h1Tag: string;
    h2H3Tags: string;
    headingTagsHint: string;
    imageAltText: string;
    imageAltTextHint: string;
    internalLinks: string;
    internalLinkAnchor: string;
    internalLinkUrl: string;
    addInternalLink: string;
    internalLinkValidation: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    ogUrl: string;
    schemaJsonLd: string;
    schemaJsonLdHint: string;
    advancedFields: string;
    implementationStatus: string;
    statusPending: string;
    statusInProgress: string;
    statusDone: string;
    updatedAt: string;
    urlAlreadyConfigured: string;
    contentText: string;
    pageImage: string;
    addSeoEntry: string;
    editSeoEntry: string;
    noSeoEntries: string;
    failedLoadSeo: string;
    confirmDeleteSeo: string;
    actions: string;
};

const ADMIN_DICT: Record<'en' | 'ar', AdminDict> = {
    en: {
        adminPanel: 'ADMIN PANEL',
        dashboard: 'Dashboard',
        services: 'Services',
        products: 'Products',
        testimonials: 'Testimonials',
        faqs: 'FAQs',
        serviceAreas: 'Service Areas',
        contacts: 'Contacts',
        subscribers: 'Subscribers',
        settings: 'Settings',
        signOut: 'Sign out',
        futureCompanies: 'Future Companies',
        adminDashboard: 'Admin Dashboard',

        overview: 'Overview',
        overviewSubtitle: 'Use the sections below to manage website content.',
        quickActions: 'Quick Actions',
        manageServices: 'Manage Services',
        manageProducts: 'Manage Products',
        manageTestimonials: 'Manage Testimonials',
        manageFaqs: 'Manage FAQs',
        manageAreas: 'Manage Service Areas',
        viewContacts: 'View Contact Submissions',
        viewSubscribers: 'View Subscribers',

        contactSubmissions: 'Contact Submissions',
        contactSubmissionsSub: 'Read incoming contact requests from the website.',
        refresh: 'Refresh',
        loading: 'Loading...',
        noContactSubmissions: 'No contact submissions found.',
        failedLoadContacts: 'Failed to load contact submissions.',
        date: 'Date',
        name: 'Name',
        phone: 'Phone',
        email: 'Email',
        location: 'Location',
        message: 'Message',

        newsletterSubscribers: 'Newsletter Subscribers',
        newsletterSubscribersSub: 'View all email subscriptions captured from the website.',
        noSubscribers: 'No subscribers found.',
        failedLoadSubscribers: 'Failed to load subscribers.',

        siteSettings: 'Site Settings',
        siteSettingsSub: 'Manage the floating call and WhatsApp contact buttons for the website.',
        supportPhone: 'Support Phone',
        supportPhoneHint: 'This value will be used for the call button link.',
        whatsappNumber: 'WhatsApp Number',
        whatsappNumberHint: 'Use digits only for WhatsApp, without spaces or plus sign.',
        contactEmail: 'Contact Email',
        contactEmailHint: 'Shown in the website header and footer.',
        address: 'Address',
        addressHint: 'Physical address shown in the website footer.',
        saveSettings: 'Save Settings',
        saving: 'Saving...',
        loadingSettings: 'Loading settings...',
        failedLoadSettings: 'Failed to load current settings.',

        account: 'Account',
        accountSub: 'Update your login email or password.',
        currentEmail: 'Current Email',
        newEmail: 'New Email',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmNewPassword: 'Confirm New Password',
        updateEmail: 'Update Email',
        updatePassword: 'Update Password',
        updating: 'Updating...',
        passwordsDoNotMatch: 'Passwords do not match.',
        changeLoginEmail: 'Change Login Email',
        changePassword: 'Change Password',

        create: 'Create',
        edit: 'Edit',
        delete: 'Delete',
        cancel: 'Cancel',
        save: 'Save',
        active: 'Active',
        sortOrder: 'Sort Order',
        yes: 'Yes',
        no: 'No',

        seo: 'SEO',
        seoManagement: 'SEO Management',
        seoManagementSub: 'Manage live SEO metadata and planning fields for each public URL, including service and product detail pages.',
        pageSlug: 'URL',
        pageSlugHint: 'Choose a live page URL from the dropdown. The list refreshes automatically when pages or subpages are added.',
        seoScopeHint: 'Editing SEO here updates only SEO metadata for this exact URL. It does not change the visible page content automatically.',
        selectPageUrl: 'Select a page URL',
        noUrlOptions: 'No page URLs are currently available for selection.',
        alreadyConfiguredShort: 'Already configured',
        currentSavedUrl: 'Current saved URL',
        websitePages: 'Website Pages',
        servicePages: 'Service Detail Pages',
        productPages: 'Product Detail Pages',
        metaTitle: 'Meta Title',
        metaDescription: 'Meta Description',
        focusKeyword: 'Focus Keyword',
        secondaryKeywords: 'Secondary Keywords',
        secondaryKeywordsHint: 'Enter one keyword per line or separate them with commas.',
        h1Tag: 'H1 Tag',
        h2H3Tags: 'H2 / H3 Tags',
        headingTagsHint: 'Enter one heading per line.',
        imageAltText: 'Image Alt Text',
        imageAltTextHint: 'Add one image alt text value per line.',
        internalLinks: 'Internal Links',
        internalLinkAnchor: 'Anchor Text',
        internalLinkUrl: 'Destination URL',
        addInternalLink: 'Add Internal Link',
        internalLinkValidation: 'Each internal link needs both anchor text and destination URL.',
        ogTitle: 'OG Title',
        ogDescription: 'OG Description',
        ogImage: 'OG Image URL',
        ogUrl: 'OG URL (Canonical)',
        schemaJsonLd: 'Schema (JSON-LD)',
        schemaJsonLdHint: 'Paste structured data JSON here.',
        advancedFields: 'Advanced Fields',
        implementationStatus: 'Implementation Status',
        statusPending: 'Pending',
        statusInProgress: 'In Progress',
        statusDone: 'Done',
        updatedAt: 'Updated',
        urlAlreadyConfigured: 'This URL already has an SEO entry.',
        contentText: 'Content',
        pageImage: 'Page Image URL',
        addSeoEntry: 'Add SEO Entry',
        editSeoEntry: 'Edit SEO Entry',
        noSeoEntries: 'No SEO entries found. Create one to get started.',
        failedLoadSeo: 'Failed to load SEO entries.',
        confirmDeleteSeo: 'Are you sure you want to delete this SEO entry?',
        actions: 'Actions',
    },
    ar: {
        adminPanel: 'لوحة الإدارة',
        dashboard: 'لوحة التحكم',
        services: 'الخدمات',
        products: 'المنتجات',
        testimonials: 'الشهادات',
        faqs: 'الأسئلة الشائعة',
        serviceAreas: 'مناطق الخدمة',
        contacts: 'جهات الاتصال',
        subscribers: 'المشتركون',
        settings: 'الإعدادات',
        signOut: 'تسجيل الخروج',
        futureCompanies: 'شركات المستقبل',
        adminDashboard: 'لوحة تحكم المشرف',

        overview: 'نظرة عامة',
        overviewSubtitle: 'استخدم الأقسام أدناه لإدارة محتوى الموقع.',
        quickActions: 'إجراءات سريعة',
        manageServices: 'إدارة الخدمات',
        manageProducts: 'إدارة المنتجات',
        manageTestimonials: 'إدارة الشهادات',
        manageFaqs: 'إدارة الأسئلة الشائعة',
        manageAreas: 'إدارة مناطق الخدمة',
        viewContacts: 'عرض رسائل التواصل',
        viewSubscribers: 'عرض المشتركين',

        contactSubmissions: 'رسائل التواصل',
        contactSubmissionsSub: 'اقرأ طلبات التواصل الواردة من الموقع.',
        refresh: 'تحديث',
        loading: 'جاري التحميل...',
        noContactSubmissions: 'لا توجد رسائل تواصل.',
        failedLoadContacts: 'فشل في تحميل رسائل التواصل.',
        date: 'التاريخ',
        name: 'الاسم',
        phone: 'الهاتف',
        email: 'البريد الإلكتروني',
        location: 'الموقع',
        message: 'الرسالة',

        newsletterSubscribers: 'مشتركو النشرة البريدية',
        newsletterSubscribersSub: 'عرض جميع اشتراكات البريد الإلكتروني.',
        noSubscribers: 'لا يوجد مشتركون.',
        failedLoadSubscribers: 'فشل في تحميل المشتركين.',

        siteSettings: 'إعدادات الموقع',
        siteSettingsSub: 'إدارة أزرار الاتصال والواتساب العائمة للموقع.',
        supportPhone: 'هاتف الدعم',
        supportPhoneHint: 'سيُستخدم هذا الرقم لزر الاتصال.',
        whatsappNumber: 'رقم الواتساب',
        whatsappNumberHint: 'استخدم الأرقام فقط بدون مسافات أو علامة الزائد.',
        contactEmail: 'البريد الإلكتروني للتواصل',
        contactEmailHint: 'يظهر في رأس وتذييل الموقع.',
        address: 'العنوان',
        addressHint: 'العنوان المادي المعروض في تذييل الموقع.',
        saveSettings: 'حفظ الإعدادات',
        saving: 'جاري الحفظ...',
        loadingSettings: 'جاري تحميل الإعدادات...',
        failedLoadSettings: 'فشل في تحميل الإعدادات الحالية.',

        account: 'الحساب',
        accountSub: 'تحديث البريد الإلكتروني أو كلمة المرور.',
        currentEmail: 'البريد الإلكتروني الحالي',
        newEmail: 'البريد الإلكتروني الجديد',
        currentPassword: 'كلمة المرور الحالية',
        newPassword: 'كلمة المرور الجديدة',
        confirmNewPassword: 'تأكيد كلمة المرور الجديدة',
        updateEmail: 'تحديث البريد الإلكتروني',
        updatePassword: 'تحديث كلمة المرور',
        updating: 'جاري التحديث...',
        passwordsDoNotMatch: 'كلمتا المرور غير متطابقتين.',
        changeLoginEmail: 'تغيير البريد الإلكتروني',
        changePassword: 'تغيير كلمة المرور',

        create: 'إنشاء',
        edit: 'تعديل',
        delete: 'حذف',
        cancel: 'إلغاء',
        save: 'حفظ',
        active: 'نشط',
        sortOrder: 'ترتيب',
        yes: 'نعم',
        no: 'لا',

        seo: 'تحسين محركات البحث',
        seoManagement: 'إدارة تحسين محركات البحث',
        seoManagementSub: 'إدارة بيانات SEO الحية وحقول التخطيط لكل رابط عام، بما في ذلك صفحات الخدمات والمنتجات التفصيلية.',
        pageSlug: 'الرابط',
        pageSlugHint: 'اختر رابط الصفحة من القائمة المنسدلة. يتم تحديث القائمة تلقائيًا عند إضافة صفحات أو صفحات فرعية جديدة.',
        seoScopeHint: 'التعديل هنا يحدّث بيانات SEO لهذا الرابط فقط، ولا يغيّر محتوى الصفحة الظاهر تلقائيًا.',
        selectPageUrl: 'اختر رابط الصفحة',
        noUrlOptions: 'لا توجد روابط صفحات متاحة للاختيار حاليًا.',
        alreadyConfiguredShort: 'تمت تهيئته',
        currentSavedUrl: 'الرابط المحفوظ الحالي',
        websitePages: 'صفحات الموقع',
        servicePages: 'صفحات تفاصيل الخدمات',
        productPages: 'صفحات تفاصيل المنتجات',
        metaTitle: 'عنوان الميتا',
        metaDescription: 'وصف الميتا',
        focusKeyword: 'الكلمة المفتاحية الأساسية',
        secondaryKeywords: 'الكلمات المفتاحية الثانوية',
        secondaryKeywordsHint: 'أدخل كلمة في كل سطر أو افصل بينها بفواصل.',
        h1Tag: 'وسم H1',
        h2H3Tags: 'وسوم H2 / H3',
        headingTagsHint: 'أدخل عنوانًا واحدًا في كل سطر.',
        imageAltText: 'النص البديل للصور',
        imageAltTextHint: 'أضف نصًا بديلاً واحدًا لكل سطر.',
        internalLinks: 'الروابط الداخلية',
        internalLinkAnchor: 'نص الرابط',
        internalLinkUrl: 'رابط الوجهة',
        addInternalLink: 'إضافة رابط داخلي',
        internalLinkValidation: 'يجب أن يحتوي كل رابط داخلي على نص الرابط ورابط الوجهة معًا.',
        ogTitle: 'عنوان OG',
        ogDescription: 'وصف OG',
        ogImage: 'رابط صورة OG',
        ogUrl: 'رابط OG (الرابط الأساسي)',
        schemaJsonLd: 'المخطط (JSON-LD)',
        schemaJsonLdHint: 'الصق بيانات JSON المنظمة هنا.',
        advancedFields: 'حقول متقدمة',
        implementationStatus: 'حالة التنفيذ',
        statusPending: 'قيد الانتظار',
        statusInProgress: 'قيد التنفيذ',
        statusDone: 'مكتمل',
        updatedAt: 'آخر تحديث',
        urlAlreadyConfigured: 'هذا الرابط لديه سجل SEO بالفعل.',
        contentText: 'المحتوى',
        pageImage: 'رابط صورة الصفحة',
        addSeoEntry: 'إضافة سجل SEO',
        editSeoEntry: 'تعديل سجل SEO',
        noSeoEntries: 'لا توجد سجلات SEO. أنشئ واحدًا للبدء.',
        failedLoadSeo: 'فشل في تحميل سجلات SEO.',
        confirmDeleteSeo: 'هل أنت متأكد من حذف هذا السجل؟',
        actions: 'الإجراءات',
    },
};

export function useAdminI18n() {
    const { lang, toggle, setLang } = useI18n();
    const t = ADMIN_DICT[lang];
    const dir: 'ltr' | 'rtl' = lang === 'ar' ? 'rtl' : 'ltr';
    return { lang, dir, t, toggle, setLang };
}
