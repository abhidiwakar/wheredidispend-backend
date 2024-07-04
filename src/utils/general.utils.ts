import * as bcrypt from 'bcrypt';
import short from 'short-uuid';
import { S3Service } from './s3.service';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  const isPasswordMatching = await bcrypt.compare(password, hashedPassword);
  return isPasswordMatching;
};

export const generateShortId = (): string => {
  const translator = short();
  return translator.generate();
};

export const modifyTransactionDoc = async (doc: any, s3Service: S3Service) => {
  if (doc && Array.isArray(doc.attachments) && doc.attachments.length > 0) {
    const urls = [];
    for (const attachment of doc.attachments) {
      const url = await s3Service.generateDownloadPresignedURL(attachment);
      urls.push(url);
    }
    doc.attachments = urls;
  }
  return doc;
};
