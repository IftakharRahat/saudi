import { z } from 'zod';

const boolFromUnknown = z.preprocess((value) => {
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') {
      return true;
    }
    if (normalized === 'false') {
      return false;
    }
  }
  return value;
}, z.boolean());

const arrayFromUnknown = z.preprocess((value) => {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return [];
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      return trimmed
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return value;
}, z.array(z.string().trim().min(1).max(300)).max(30));

const sortOrderSchema = z.coerce.number().int().min(0).max(100000);
const imageUrlSchema = z.string().trim().min(1).max(2048);

export const contactSubmissionSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(30),
  email: z.string().trim().email().max(254),
  location: z.string().trim().min(2).max(160),
  message: z.string().trim().min(10).max(4000),
});

export const subscriberSchema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
});

export const adminCredentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(100),
});

export const idParamSchema = z.object({
  id: z.string().trim().min(1).max(191),
});

export const serviceCreateSchema = z.object({
  titleEn: z.string().trim().min(1).max(200),
  titleAr: z.string().trim().min(1).max(200),
  descriptionEn: z.string().trim().min(1).max(4000),
  descriptionAr: z.string().trim().min(1).max(4000),
  imageUrl: imageUrlSchema,
  sortOrder: sortOrderSchema.default(0),
  isActive: boolFromUnknown.default(true),
});

export const serviceUpdateSchema = z
  .object({
    titleEn: z.string().trim().min(1).max(200),
    titleAr: z.string().trim().min(1).max(200),
    descriptionEn: z.string().trim().min(1).max(4000),
    descriptionAr: z.string().trim().min(1).max(4000),
    imageUrl: imageUrlSchema,
    sortOrder: sortOrderSchema,
    isActive: boolFromUnknown,
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, 'At least one field is required for update.');

export const productCreateSchema = z.object({
  titleEn: z.string().trim().min(1).max(200),
  titleAr: z.string().trim().min(1).max(200),
  descriptionEn: z.string().trim().min(1).max(6000),
  descriptionAr: z.string().trim().min(1).max(6000),
  featuresEn: arrayFromUnknown.default([]),
  featuresAr: arrayFromUnknown.default([]),
  isActive: boolFromUnknown.default(true),
  images: z.array(imageUrlSchema).max(30).default([]),
});

export const productUpdateSchema = z
  .object({
    titleEn: z.string().trim().min(1).max(200),
    titleAr: z.string().trim().min(1).max(200),
    descriptionEn: z.string().trim().min(1).max(6000),
    descriptionAr: z.string().trim().min(1).max(6000),
    featuresEn: arrayFromUnknown,
    featuresAr: arrayFromUnknown,
    isActive: boolFromUnknown,
    images: z.array(imageUrlSchema).max(30),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, 'At least one field is required for update.');

export const testimonialCreateSchema = z.object({
  textEn: z.string().trim().min(1).max(3000),
  textAr: z.string().trim().min(1).max(3000),
  nameEn: z.string().trim().min(1).max(160),
  nameAr: z.string().trim().min(1).max(160),
  roleEn: z.string().trim().min(1).max(160),
  roleAr: z.string().trim().min(1).max(160),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  photoUrl: imageUrlSchema.optional(),
  isApproved: boolFromUnknown.default(false),
});

export const testimonialUpdateSchema = z
  .object({
    textEn: z.string().trim().min(1).max(3000),
    textAr: z.string().trim().min(1).max(3000),
    nameEn: z.string().trim().min(1).max(160),
    nameAr: z.string().trim().min(1).max(160),
    roleEn: z.string().trim().min(1).max(160),
    roleAr: z.string().trim().min(1).max(160),
    rating: z.coerce.number().int().min(1).max(5),
    photoUrl: imageUrlSchema,
    isApproved: boolFromUnknown,
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, 'At least one field is required for update.');

export const faqCreateSchema = z.object({
  questionEn: z.string().trim().min(1).max(500),
  questionAr: z.string().trim().min(1).max(500),
  answerEn: z.string().trim().min(1).max(5000),
  answerAr: z.string().trim().min(1).max(5000),
  sortOrder: sortOrderSchema.default(0),
  isActive: boolFromUnknown.default(true),
});

export const faqUpdateSchema = z
  .object({
    questionEn: z.string().trim().min(1).max(500),
    questionAr: z.string().trim().min(1).max(500),
    answerEn: z.string().trim().min(1).max(5000),
    answerAr: z.string().trim().min(1).max(5000),
    sortOrder: sortOrderSchema,
    isActive: boolFromUnknown,
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, 'At least one field is required for update.');

export const serviceAreaCreateSchema = z.object({
  cityEn: z.string().trim().min(1).max(150),
  cityAr: z.string().trim().min(1).max(150),
  titleEn: z.string().trim().min(1).max(250),
  titleAr: z.string().trim().min(1).max(250),
  descriptionEn: z.string().trim().min(1).max(5000),
  descriptionAr: z.string().trim().min(1).max(5000),
  sortOrder: sortOrderSchema.default(0),
  isActive: boolFromUnknown.default(true),
});

export const serviceAreaUpdateSchema = z
  .object({
    cityEn: z.string().trim().min(1).max(150),
    cityAr: z.string().trim().min(1).max(150),
    titleEn: z.string().trim().min(1).max(250),
    titleAr: z.string().trim().min(1).max(250),
    descriptionEn: z.string().trim().min(1).max(5000),
    descriptionAr: z.string().trim().min(1).max(5000),
    sortOrder: sortOrderSchema,
    isActive: boolFromUnknown,
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, 'At least one field is required for update.');
