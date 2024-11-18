import PieceJointe from "../models/piece_jointe";

export const pieceJointeService = {
  async create(data: {
    messageId: number;
    filename: string;
    originalName: string;
    path: string;
    mimetype: string;
    size: number;
  }) {
    return await PieceJointe.create({
      ...data,
      path: `/files/${data.filename}`,
    });
  },

  async findByMessageId(messageId: number) {
    return await PieceJointe.findAll({
      where: { messageId },
    });
  },

  async delete(id: number) {
    return await PieceJointe.destroy({
      where: { id },
    });
  },

  async findById(id: number) {
    return await PieceJointe.findByPk(id);
  },
};
