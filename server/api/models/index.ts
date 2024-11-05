import Project from "./project";
import WorkPackage from "./workpackage";
import Activite from "./activite";
import Tache from "./tache";
import PieceJointe from "./piece_jointe";
import Sprint from "./sprint";
import Pomodoro from "./pomodoro";

// Define associations
Project.hasMany(WorkPackage, {
  foreignKey: "projectId",
  as: "workPackages",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

WorkPackage.belongsTo(Project, {
  foreignKey: "projectId",
  as: "project",
});

WorkPackage.hasMany(Activite, {
  foreignKey: "workPackageId",
  as: "activities",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Activite.belongsTo(WorkPackage, {
  foreignKey: "workPackageId",
  as: "workPackage",
});

Activite.hasMany(Tache, {
  foreignKey: "activiteId",
  as: "taches",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Tache.belongsTo(Activite, {
  foreignKey: "activiteId",
  as: "activite",
});

Activite.hasMany(PieceJointe, {
  foreignKey: "activiteId",
  as: "piecesJointes",
});

PieceJointe.belongsTo(Activite, {
  foreignKey: "activiteId",
  as: "activite",
});
Sprint.hasMany(Tache, { foreignKey: "sprintId", as: "taches" });
Tache.belongsTo(Sprint, { foreignKey: "sprintId", as: "sprint" });

Tache.hasMany(Pomodoro, { foreignKey: "tacheId", as: "pomodoros" });
Pomodoro.belongsTo(Tache, { foreignKey: "tacheId", as: "tache" });

export { Project, WorkPackage, Activite, Tache, Sprint, Pomodoro, PieceJointe };
