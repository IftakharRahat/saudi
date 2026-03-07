-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "supportPhone" VARCHAR(50) NOT NULL,
    "whatsappPhone" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
