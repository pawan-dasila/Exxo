import {
  UpdateProfileType,
  addressSchema,
  ChangePasswordType,
} from '../validation/user.validation.js';
import prisma from '../lib/prisma.js';
import { z } from "zod";
import { hashPassword, compareValue } from '../utils/bcrypt.js';
import {
  CloudinaryService,
  CLOUDINARY_FOLDERS,
} from '../configs/cloudinary.config.js';
import { AppError } from '../utils/AppError.js';
import { HTTPSTATUS } from '../configs/Https.config.js';
import { ErrorCodeEnum } from '../enums/error-code.enum.js';

export const USER_SAFE_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phoneNumber: true,
  profileImageUrl: true,
  role: true,
  isEmailVerified: true,
  isActive: true,
  bio: true,
  createdAt: true,
};

export class UserService {
  public static async updateProfile(
    userId: string,
    data: UpdateProfileType,
    file?: Express.Multer.File,
  ) {
    const { firstName, lastName, email, phoneNumber, bio } = data;
    let profileImageUrl = data.profileImageUrl;

    if (file) {
      const uploadResult = await CloudinaryService.uploadImageBuffer(
        file.buffer,
        CLOUDINARY_FOLDERS.PROFILE,
      );
      profileImageUrl = uploadResult.secure_url;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(
        "User not found",
        HTTPSTATUS.NOT_FOUND,
        ErrorCodeEnum.AUTH_USER_NOT_FOUND,
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email,
        profileImageUrl,
        phoneNumber,
        bio,
      },
      select: USER_SAFE_SELECT,
    });

    return updatedUser;
  }

  public static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: USER_SAFE_SELECT,
    });

    if (!user) {
      throw new AppError(
        "User not found",
        HTTPSTATUS.NOT_FOUND,
        ErrorCodeEnum.AUTH_USER_NOT_FOUND,
      );
    }

    return user;
  }

  public static async changePassword(userId: string, data: ChangePasswordType) {
    const { oldPassword, newPassword } = data;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { authProviders: true },
    });

    if (!user) {
      throw new AppError(
        "User not found",
        HTTPSTATUS.NOT_FOUND,
        ErrorCodeEnum.AUTH_USER_NOT_FOUND,
      );
    }

    const emailProvider = user.authProviders.find(
      (p) => p.provider === "EMAIL",
    );
    if (!emailProvider || !emailProvider.passwordHash) {
      throw new AppError(
        "Account does not use a password to login",
        HTTPSTATUS.BAD_REQUEST,
        ErrorCodeEnum.AUTH_INVALID_PROVIDER,
      );
    }

    const isMatch = await compareValue(oldPassword, emailProvider.passwordHash);
    if (!isMatch) {
      throw new AppError(
        "Incorrect current password",
        HTTPSTATUS.BAD_REQUEST,
        ErrorCodeEnum.AUTH_INVALID_CREDS,
      );
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.authProvider.update({
      where: { id: emailProvider.id },
      data: { passwordHash },
    });

    return { message: "Password updated successfully" };
  }

  // ADDRESS MANAGEMENT
  public static async addAddress(
    userId: string,
    data: z.infer<typeof addressSchema>,
  ) {
    return await prisma.address.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  public static async getAddresses(userId: string) {
    return await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: "desc" },
    });
  }

  public static async updateAddress(
    userId: string,
    addressId: string,
    data: Partial<z.infer<typeof addressSchema>>,
  ) {
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new AppError(
        "Address not found or unauthorized",
        HTTPSTATUS.NOT_FOUND,
        ErrorCodeEnum.RESOURCE_NOT_FOUND,
      );
    }

    return await prisma.address.update({
      where: { id: addressId },
      data: {
        ...data,
      },
    });
  }

  public static async deleteAddress(userId: string, addressId: string) {
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new AppError(
        "Address not found or unauthorized",
        HTTPSTATUS.NOT_FOUND,
        ErrorCodeEnum.RESOURCE_NOT_FOUND,
      );
    }

    return await prisma.address.delete({
      where: { id: addressId },
    });
  }
}
