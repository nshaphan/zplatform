import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwtHelper";

type Gender = "Male" | "Female";

type MaritalStatus = "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED";

type DocumentType = "ID" | "PASSPORT";

type Status = "UN_VERIFIED" | "PENDING" | "VERIFICATION" | "VERIFIED";

interface UserProfileInput {
  id?: number;
  profilePhoto?: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  age: number;
  dateOfBirth: string;
  maritalStatus: MaritalStatus;
  nationality: string;
  email: string;
  password: string;
  status: Status;
  documentType: DocumentType;
  idNumber: string;
  documentAttachment: string;
  isVerification: boolean;
}

interface LoginInput {
  email: string;
  password: string;
}

interface ForgotPasswordInput {
  email: string;
}

const prisma = new PrismaClient();

const createUserProfile = async (input: UserProfileInput) => {
  const passwordHash = bcrypt.hashSync(input.password, 10);
  const user = await prisma.user.create({
    data: {
      profilePhoto: input.profilePhoto || "",
      firstName: input.firstName,
      lastName: input.lastName,
      gender: input.gender,
      age: input.age,
      dateOfBirth: input.dateOfBirth,
      maritalStatus: input.maritalStatus,
      nationality: input.nationality,
      email: input.email,
      password: passwordHash,
    },
  });

  return user;
};

const checkEmailExists = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (user) {
    return true;
  }
  return false;
};

const findUserByEmail = async (email: string): Promise<User | null> => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  return user;
};

const findUserById = async (id: number) => {
  const user = await prisma.user.findFirst({
    where: {
      id: Number(id),
    },
  });
  return user;
};

const updateUserProfile = async (input: UserProfileInput) => {
  const user = await prisma.user.update({
    where: {
      id: Number(input.id),
    },
    data: {
      profilePhoto: input.profilePhoto || undefined,
      firstName: input.firstName || undefined,
      lastName: input.lastName || undefined,
      gender: input.gender || undefined,
      age: input.age || undefined,
      dateOfBirth: input.dateOfBirth || undefined,
      maritalStatus: input.maritalStatus || undefined,
      nationality: input.nationality || undefined,
      email: input.email || undefined,
      documentType: input.documentType || undefined,
      idNumber: input.idNumber || undefined,
      documentAttachment: input.documentAttachment || undefined,
      status: input.isVerification ? "PENDING" : undefined,
    },
  });
  return user;
};

const changeStatus = (id: number, status: Status) => {
  const user = prisma.user.update({
    where: { id },
    data: {
      status,
    },
  });
  return user;
};

const generateLoginLink = async (email: string) => {
  let user = await findUserByEmail(email);
  const token = signToken(user, "15m");
  user = await prisma.user.update({
    where: {
      email,
    },
    data: {
      loginLinkToken: token,
    },
  });
  return user;
};

const revokeLoginLink = async (id: number) => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      loginLinkToken: null,
    },
  });
  return user;
};

const setPassword = async (id: number, password: string) => {
  const passwordHash = bcrypt.hashSync(password, 10);
  await prisma.user.update({
    where: { id },
    data: {
      password: passwordHash,
    },
  });
};

export {
  MaritalStatus,
  Gender,
  UserProfileInput,
  LoginInput,
  ForgotPasswordInput,
  createUserProfile,
  checkEmailExists,
  findUserByEmail,
  findUserById,
  updateUserProfile,
  changeStatus,
  generateLoginLink,
  revokeLoginLink,
  setPassword,
};
