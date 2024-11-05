import { Request, Response } from "express";
import { userService } from "../services/userService";

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error: unknown) {
    res.status(400).json({
      message: "Failed to create user",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error: unknown) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(Number(req.params.id));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error: unknown) {
    res.status(500).json({
      message: "Failed to fetch user",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.updateUser(Number(req.params.id), req.body);
    res.json(user);
  } catch (error: unknown) {
    res.status(400).json({
      message: "Failed to update user",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  try {
    await userService.deleteUser(Number(req.params.id));
    res.json({ message: "User deleted successfully" });
  } catch (error: unknown) {
    res.status(400).json({
      message: "Failed to delete user",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
