import * as bcrypt from 'bcrypt';
import short from 'short-uuid';

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
