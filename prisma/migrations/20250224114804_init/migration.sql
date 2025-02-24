-- AlterTable
ALTER TABLE "PdfMetadata" ALTER COLUMN "fromAddress" SET DEFAULT 'unknown',
ALTER COLUMN "dateReceived" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "subject" SET DEFAULT 'No Subject';
