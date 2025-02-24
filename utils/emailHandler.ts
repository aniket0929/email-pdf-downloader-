// utils/emailHandler.ts
import { PrismaClient } from "@prisma/client";
import { ImapFlow } from "imapflow";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

const prisma = new PrismaClient();
const DOWNLOAD_FOLDER = "./pdfs";

// Ensure the download folder exists
if (!fs.existsSync(DOWNLOAD_FOLDER)) {
  fs.mkdirSync(DOWNLOAD_FOLDER);
}

export async function checkEmails() {
  const configs = await prisma.emailIngestionConfig.findMany();

  for (const config of configs) {
    try {
      const client = new ImapFlow({
        host: config.host,
        port: 993,
        secure: true,
        auth: {
          user: config.username,
          pass: config.password,
        },
        logger: false, // Disable verbose logging
      });

      await client.connect();

      const lock = await client.getMailboxLock("INBOX");
      try {
        // Fetch all messages in the inbox
        for await (const message of client.fetch("1:*", { envelope: true, bodyStructure: true })) {
          // Check if the message has attachments
          if (message.bodyStructure?.childNodes) {
            for (const part of message.bodyStructure.childNodes) {
              if (part.disposition === "attachment" && part.type === "application/pdf") {
                // Fetch the attachment content
                const attachment = await client.download(message.uid.toString(), part.part);
                const filename = part.parameters || `attachment_${Date.now()}.pdf`;
                const filePath = path.join(DOWNLOAD_FOLDER, filename);

                // Save the attachment to the file system
                const writableStream = fs.createWriteStream(filePath);
                (attachment.content as Readable).pipe(writableStream);

                // Wait for the stream to finish writing
                await new Promise<void>((resolve, reject) => {
                  writableStream.on("finish", () => resolve());
                  writableStream.on("error", reject);
                });

                // Save metadata to the database
                await prisma.pdfMetadata.create({
                  data: {
                    fromAddress: message.envelope.from[0]?.address || "unknown",
                    dateReceived: message.envelope.date || new Date(),
                    subject: message.envelope.subject || "No Subject",
                    attachmentFileName: filename,
                  },
                });
              }
            }
          }
        }
      } finally {
        lock.release();
      }

      await client.logout();
    } catch (error) {
        const err = error as { authenticationFailed?: boolean };
        console.error(`Failed to connect to email: ${config.emailAddress}`, error);
        if (err.authenticationFailed) {
          console.error("Authentication failed. Please check your email credentials.");
        }
      }
    }
}