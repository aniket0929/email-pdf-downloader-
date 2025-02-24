import { PrismaClient } from "@prisma/client";
import { ImapFlow } from "imapflow";
import fs from "fs";
import path from "path";
import { Readable, pipeline } from "stream";
import { promisify } from "util";

const prisma = new PrismaClient();
const DOWNLOAD_FOLDER = "./pdfs";
const streamPipeline = promisify(pipeline);

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
        for await (const message of client.fetch("1:*", { envelope: true, bodyStructure: true })) {
          if (message.bodyStructure?.childNodes) {
            for (const part of message.bodyStructure.childNodes) {
              if (part.disposition === "attachment" && part.type === "application/pdf") {
                const attachment = await client.download(message.uid.toString(), part.part);
                const filename = (part.parameters as unknown as Record<string, string>)?.["name"] || `attachment_${Date.now()}.pdf`;
                const filePath = path.join(DOWNLOAD_FOLDER, filename);

                const writableStream = fs.createWriteStream(filePath);
                await streamPipeline(attachment.content as Readable, writableStream);

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
      console.error(`Failed to connect to email: ${config.emailAddress}`, error);
      if ((error as any).code === "AUTHENTICATIONFAILED") {
        console.error("Authentication failed. Please check your email credentials.");
      }
    }
  }
}
