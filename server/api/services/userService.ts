import User from "../models/user";
import { CreateUserDTO, UpdateUserDTO } from "@/types/user";

export const userService = {
  createUser: async (userData: CreateUserDTO) => {
    return await User.create(userData as any);
  },

  getAllUsers: async () => {
    return await User.findAll({
      attributes: { exclude: ["password"] },
    });
  },

  getUserById: async (id: number) => {
    return await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
  },

  updateUser: async (id: number, data: UpdateUserDTO) => {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");
    return await user.update(data);
  },

  deleteUser: async (id: number) => {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");
    await user.destroy();
  },
};
