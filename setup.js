const cron = require("node-cron");
const { exec } = require("child_process");

cron.schedule("2 8 * * *", () => {
  const dockerCommand = "/srv/planificationBot/rundocker.sh";

  exec(dockerCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(
        `Erreur lors de l'exécution de la commande Docker: ${error.message}`
      );
      return;
    }
  });
});
