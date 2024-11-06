import Activite from "../models/activite";

export const getActivitesByWorkPackageId = async (workPackageId: number) => {
  return await Activite.findAll({
    where: { workPackageId },
    order: [["createdAt", "DESC"]],
  });
};

export const createActivite = async (data: Partial<Activite>) => {
  return await Activite.create(data);
};

export const updateActivite = async (id: number, data: Partial<Activite>) => {
  const activite = await Activite.findByPk(id);
  if (!activite) throw new Error("Activite not found");
  return await activite.update(data);
};

export const deleteActivite = async (id: number) => {
  const activite = await Activite.findByPk(id);
  if (!activite) throw new Error("Activite not found");
  await activite.destroy();
};
