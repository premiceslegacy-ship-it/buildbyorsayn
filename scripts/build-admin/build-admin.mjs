#!/usr/bin/env node

import { basename, extname } from "node:path";
import { readFile } from "node:fs/promises";
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
  if (command === "help" || args.includes("--help")) {
    return print("video envoyer <fichier> --bloc <numéro affiché> --position <n> --titre <titre>\nvideo miniature <videoId> <fichier.jpg|png|webp>\nvideo lister [--bloc <numéro>] [--statut <statut>] [--sans-resume]\nvideo transcription <videoId> [--offset <n>] [--limite <n>]\nvideo synchroniser <videoId>\nvideo sous-titres <videoId> --fichier <fichier.vtt|fichier.srt>", json);
  }
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
  if (command === "video" && args[1] === "envoyer") {
    const file = required(args[2], "Ajoute le fichier.");
    const blocNumero = Number(required(option(args, "--bloc"), "Ajoute --bloc."));
    const position = Number(required(option(args, "--position"), "Ajoute --position."));
    const title = required(option(args, "--titre"), "Ajoute --titre.");
    if (!Number.isInteger(blocNumero) || blocNumero < 1 || blocNumero > 7) throw new Error("Numéro de bloc invalide.");
    if (!Number.isInteger(position) || position < 1) throw new Error("Position invalide.");
    return print(await uploadVideo(file, blocNumero, position, title), json);
  }
  if (command === "video" && args[1] === "lister") {
    const blocRaw = option(args, "--bloc");
    const blocNumero = blocRaw === undefined ? undefined : Number(blocRaw);
    if (blocNumero !== undefined && (!Number.isInteger(blocNumero) || blocNumero < 1 || blocNumero > 7)) throw new Error("Numéro de bloc invalide.");
    return print(await callTool("lister_videos", {
      status: option(args, "--statut"),
      blocNumero,
      sansResume: args.includes("--sans-resume"),
    }), json);
  }
  if (command === "video" && args[1] === "transcription") {
    return print(await callTool("lire_transcription", {
      videoId: required(args[2], "Ajoute l'identifiant de la vidéo."),
      offset: Number(option(args, "--offset", 0)),
      limite: Number(option(args, "--limite", 20)),
    }), json);
  }
  if (command === "video" && args[1] === "synchroniser") {
    return print(await callTool("synchroniser_video", { videoId: required(args[2], "Ajoute l'identifiant de la vidéo.") }), json);
  }
  if (command === "video" && args[1] === "sous-titres") {
    const videoId = required(args[2], "Ajoute l'identifiant de la vidéo.");
    const file = required(option(args, "--fichier"), "Ajoute --fichier.");
    if (!/\.(vtt|srt)$/iu.test(file)) throw new Error("Le fichier doit être VTT ou SRT.");
    const content = await readFile(file, "utf8");
    if (!content.trim()) throw new Error("Le fichier de sous-titres est vide.");
    return print(await callTool("deposer_sous_titres", { videoId, content }), json);
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
  if (command === "video" && args[1] === "miniature") {
    const videoId = required(args[2], "Ajoute l'identifiant de la vidéo.");
    const file = required(args[3], "Ajoute le fichier image.");
    const extension = extname(file).toLowerCase();
    const types = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
    const type = types[extension];
    if (!type) throw new Error("Le fichier doit être JPEG, PNG ou WebP.");
    const bytes = await readFile(file);
    return print(await callTool("deposer_miniature", {
      videoId,
      file: { name: basename(file), size: bytes.byteLength, type, bytesBase64: bytes.toString("base64") },
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
  throw new Error("Commande attendue : login, logout, blocs, video envoyer, video miniature, video lister, video transcription, video synchroniser, video sous-titres, chapitres, resume, miniature, publier, mail, statut ou journal.");
}

main(process.argv.slice(2)).catch((error) => {
  console.error(redactAgentToken(error instanceof Error ? error.message : "La commande a échoué."));
  process.exitCode = 1;
});
