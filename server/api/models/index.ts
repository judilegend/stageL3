import Sprint from "./sprint";
import Tache from "./tache";

// Define associations here after all models are imported
Sprint.hasMany(Tache, {
  foreignKey: "sprintId",
  as: "tasks",
});

Tache.belongsTo(Sprint, {
  foreignKey: "sprintId",
  as: "sprint",
});

export { Sprint, Tache };
