#!/usr/bin/env node

import { callTool, redactAgentToken, removeConfig, saveConfig, uploadVideo } from "./client.mjs";

function option(args, name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
}

function required(value, message) {
  if (!value) throw new Error(message);
  return value;
}

function print(value, json) {
  if (json) console.log(JSON.stringify(value, null, 2));
  else if (typeof value === "string") console.log(value);
  else console.log(JSON.stringify(value));
}

async function main(argv) {
  const args = [...argv];
  const json = args.includes("--json");
  const command = args[0];
  if (command === "login") {
    const origin = required(option(args, "--origin", process.env.BUILD_ADMIN_ORIGIN), "Ajoute --origin.");
    const token = required(option(args, "--token", process.env.BUILD_ADMIN_TOKEN), "Ajoute --token ou BUILD_ADMIN_TOKEN.");
    const saved = await saveConfig(origin, token);
    return print({ ok: true, origin: saved.origin }, json);
  }
  if (command === "logout") {
    await removeConfig();
    return print("Session locale supprimée.", json);
  }
  if (command === "blocs") return print(await callTool("liste_blocs", {}), json);
  if (command === "upload") {
    const file = required(args[1], "Ajoute le fichier.");
    const sectionId = required(option(args, "--bloc"), "Ajoute --bloc.");
    return print(await uploadVideo(file, sectionId, option(args, "--titre")), json);
  }
  if (command === "chapitres") {
    const videoId = required(args[1], "Ajoute l'identifiant de la vidéo.");
    const chapters = JSON.parse(required(option(args, "--chapitres"), "Ajoute --chapitres avec un tableau JSON."));
    return print(await callTool("ecrire_chapitres", { videoId, chapters }), json);
  }
  if (command === "resume") {
    return print(await callTool("ecrire_resume", {
      videoId: required(args[1], "Ajoute l'identifiant de la vidéo."),
      summary: required(option(args, "--texte"), "Ajoute --texte."),
    }), json);
  }
  if (command === "miniature") {
    return print(await callTool("choisir_miniature", {
      videoId: required(args[1], "Ajoute l'identifiant de la vidéo."),
      timeSeconds: Number(required(option(args, "--temps"), "Ajoute --temps.")),
    }), json);
  }
  if (command === "publier") {
    return print(await callTool("demander_publication", { videoId: required(args[1], "Ajoute l'identifiant de la vidéo.") }), json);
  }
  if (command === "mail") {
    return print(await callTool("preparer_mail", {
      audience: option(args, "--audience", "all"),
      subject: required(option(args, "--sujet"), "Ajoute --sujet."),
      preheader: option(args, "--preheader", ""),
      body: required(option(args, "--corps"), "Ajoute --corps."),
      ctaLabel: option(args, "--cta-label", "Voir la mise à jour"),
      ctaUrl: option(args, "--cta-url", ""),
    }), json);
  }
  if (command === "statut") {
    return print(await callTool("statut_video", { videoId: required(args[1], "Ajoute l'identifiant de la vidéo.") }), json);
  }
  if (command === "journal") {
    return print(await callTool("journal", { limit: Number(option(args, "--limite", 30)) }), json);
  }
  throw new Error("Commande attendue : login, blocs, upload, chapitres, resume, miniature, publier, mail, statut, journal ou logout.");
}

main(process.argv.slice(2)).catch((error) => {
  console.error(redactAgentToken(error instanceof Error ? error.message : "La commande a échoué."));
  process.exitCode = 1;
});
