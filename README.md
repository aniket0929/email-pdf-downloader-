Email PDF Downloader Documentation
Overview
This application allows users to configure one or more email accounts (IMAP, POP3, Gmail API, or Outlook/Graph API) and automatically download PDF attachments from incoming emails. The downloaded PDFs are saved locally, and metadata about the emails (sender, date, subject, and attachment filename) is stored in a PostgreSQL database.

Features
Email Configuration:

Add, edit, and remove email account configurations.

Supports IMAP, POP3, Gmail API, and Outlook/Graph API.

Automatic PDF Download:

Periodically checks the inbox for new emails with PDF attachments.

Downloads PDF attachments to a local folder (./pdfs/).

Metadata Storage:

Stores email metadata (sender, date, subject, attachment filename) in a PostgreSQL database.

User Interface:

Simple UI for managing email configurations and triggering inbox checks.

Tech Stack
Frontend: Next.js (React) with Tailwind CSS for styling.

Backend: Next.js API routes.

Database: PostgreSQL with Prisma ORM.

Email Handling: imapflow for IMAP/POP3 connections.

Prerequisites
Before setting up the project, ensure you have the following installed:

Node.js (v18 or higher).

PostgreSQL (or a PostgreSQL-compatible database like Neon DB).

Git (optional, for version control).

Setup Instructions
1. Clone the Repository
If you have the project in a Git repository, clone it:

bash
Copy
git clone <repository-url>
cd email-pdf-app
2. Install Dependencies
Install the required dependencies:

bash
Copy
npm install
3. Set Up the Database
Create a PostgreSQL Database:

Use a local PostgreSQL instance or a cloud provider like Neon DB.

Create a new database (e.g., email_app).

Update .env:

Create a .env file in the root of the project and add the following:

env
Copy
DATABASE_URL="postgresql://user:password@localhost:5432/email_app"
Replace user, password, and localhost with your database credentials.

Run Prisma Migrate:

Apply the database schema:

bash
Copy
npx prisma migrate dev --name init
4. Configure Email Accounts
Enable IMAP/POP3:

For Gmail, enable IMAP in your Gmail Settings.

For Outlook, enable IMAP in your Outlook Settings.

Generate App Password (for Gmail):

If you have 2-Step Verification enabled, generate an App Password from your Google Account Security.

5. Run the Application
Start the development server:

bash
Copy
npm run dev
The application will be available at http://localhost:3000.

Usage
1. Add an Email Configuration
Open the application in your browser (http://localhost:3000).

Fill out the form with the following details:

Email Address: Your full email address (e.g., example@gmail.com).

Connection Type: IMAP, POP3, Gmail API, or Outlook/Graph API.

Host: The email server host (e.g., imap.gmail.com for Gmail).

Username: Your full email address.

Password: Your email password or App Password (for Gmail).

Click Save Configuration.

2. Check Inbox
Click the Check Inbox button to manually check for new emails with PDF attachments.

The application will:

Connect to the email server.

Download PDF attachments to the ./pdfs/ folder.

Save email metadata to the database.

3. View Saved Configurations
The Saved Configurations section displays all configured email accounts.

You can delete a configuration by clicking the Delete button.

Folder Structure
Copy
email-pdf-app/
├── app/
│   ├── api/
│   │   ├── email-ingestion/
│   │   │   └── route.ts
│   │   └── email-ingestion/
│   │       └── check/
│   │           └── route.ts
│   └── page.tsx
├── prisma/
│   └── schema.prisma
├── public/
├── utils/
│   └── emailHandler.ts
├── .env
├── package.json
└── ...
Database Schema
The application uses the following Prisma schema:

prisma
Copy
model EmailIngestionConfig {
  id              Int      @id @default(autoincrement())
  emailAddress    String
  connectionType  String
  host            String
  username        String
  password        String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model PdfMetadata {
  id                  Int      @id @default(autoincrement())
  fromAddress         String   @default("unknown")
  dateReceived        DateTime @default(now())
  subject             String   @default("No Subject")
  attachmentFileName  String
  createdAt           DateTime @default(now())
}
Troubleshooting
1. Authentication Failed
Cause: Invalid email credentials.

Solution:

Double-check the username and password.

For Gmail, use an App Password if 2-Step Verification is enabled.

2. IMAP/POP3 Not Enabled
Cause: IMAP or POP3 access is disabled in the email account settings.

Solution:

Enable IMAP/POP3 in your email account settings.

3. Database Connection Issues
Cause: Incorrect database credentials or network issues.

Solution:

Verify the DATABASE_URL in the .env file.

Ensure the database server is running and accessible.

4. PDFs Not Downloading
Cause: No emails with PDF attachments found.

Solution:

Send a test email with a PDF attachment to the configured email address.

Ensure the email is in the inbox (not in spam or other folders).

Future Enhancements
Support for Multiple Attachment Types:

Extend the application to handle other attachment types (e.g., images, documents).

Scheduled Email Checks:

Automatically check for new emails at regular intervals using a cron job.

Cloud Storage Integration:

Save downloaded PDFs to cloud storage (e.g., AWS S3, Google Drive).

Advanced Filtering:

Add filters for specific senders, subjects, or date ranges.

User Authentication:

Add user authentication to protect email configurations.

Contributing
If you'd like to contribute to the project, follow these steps:

Fork the repository.

Create a new branch for your feature or bugfix.

Submit a pull request with a detailed description of your changes.

License