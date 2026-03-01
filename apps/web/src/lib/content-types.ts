export type AppLang = 'en' | 'ar';

export type ServiceRecord = {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
};

export type ProductImageRecord = {
  id: string;
  productId: string;
  imageUrl: string;
  sortOrder: number;
};

export type ProductRecord = {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  featuresEn: string[];
  featuresAr: string[];
  isActive: boolean;
  images: ProductImageRecord[];
};

export type TestimonialRecord = {
  id: string;
  textEn: string;
  textAr: string;
  nameEn: string;
  nameAr: string;
  roleEn: string;
  roleAr: string;
  rating: number;
  photoUrl: string | null;
  isApproved: boolean;
};

export type FaqRecord = {
  id: string;
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
  sortOrder: number;
  isActive: boolean;
};

export type ServiceAreaRecord = {
  id: string;
  cityEn: string;
  cityAr: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  sortOrder: number;
  isActive: boolean;
};

export type ContactSubmissionRecord = {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type SubscriberRecord = {
  id: string;
  email: string;
  createdAt: string;
};

export function pickLocalized(lang: AppLang, en: string, ar: string) {
  return lang === 'ar' ? ar : en;
}
