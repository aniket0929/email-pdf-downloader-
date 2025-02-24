# Email PDF Downloader

## Overview

This application allows users to configure one or more email accounts (IMAP, POP3, Gmail API, or Outlook/Graph API) and automatically download PDF attachments from incoming emails. The downloaded PDFs are saved locally, and metadata about the emails (sender, date, subject, and attachment filename) is stored in a PostgreSQL database.

---

## Features

1. **Email Configuration**:
   - Add, edit, and remove email account configurations.
   - Supports IMAP, POP3, Gmail API, and Outlook/Graph API.

2. **Automatic PDF Download**:
   - Periodically checks the inbox for new emails with PDF attachments.
   - Downloads PDF attachments to a local folder (`./pdfs/`).

3. **Metadata Storage**:
   - Stores email metadata (sender, date, subject, attachment filename) in a PostgreSQL database.

4. **User Interface**:
   - Simple UI for managing email configurations and triggering inbox checks.

---

## Tech Stack

- **Frontend**: Next.js (React) with Tailwind CSS for styling.
- **Backend**: Next.js API routes.
- **Database**: PostgreSQL with Prisma ORM.
- **Email Handling**: `imapflow` for IMAP/POP3 connections.

---

## Prerequisites

Before setting up the project, ensure you have the following installed:

1. **Node.js** (v18 or higher).
2. **PostgreSQL** (or a PostgreSQL-compatible database like Neon DB).
3. **Git** (optional, for version control).

---

## Setup Instructions

### 1. Clone the Repository

If you have the project in a Git repository, clone it:

```bash
git clone <repository-url>
cd email-pdf-app


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



---

### **How to Use**

1. Clone the project
2. Create a new file named `README.md` in the root of your project.
3. Install dependencies using npm run dev
4. Save the file.

Now, your project has a detailed and professional documentation that you can share with others! 🚀