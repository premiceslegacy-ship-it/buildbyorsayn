import { Check, Hand } from "lucide-react";
import { KitFrame } from "./KitFrame";
import { ToolMark } from "./ToolMark";
import type { KitBaseProps } from "./types";
import styles from "./kit.module.css";

export type ChatMessage = {
  from: "person" | "agent";
  text: string;
  time: string;
};

export type ChatAction = {
  label: string;
  tool?: string;
  humanValidation?: boolean;
};

export type ChatProps = KitBaseProps & {
  platform: "Telegram" | "WhatsApp" | "Neutre";
  contact: string;
  messages: readonly ChatMessage[];
  backstageTitle?: string;
  actions: readonly ChatAction[];
};

export function Chat({ platform, contact, messages, backstageTitle = "En coulisse", actions, ...frame }: ChatProps) {
  return <KitFrame {...frame} kind="chat" keys={actions.some((action) => action.humanValidation) ? [{ swatch: "human", label: "Un humain valide avant l'envoi" }] : undefined}>
    <div className={styles.chatLayout}>
      <section className={styles.phone}>
        <header>{platform !== "Neutre" ? <ToolMark name={platform} size={36} /> : <span className={styles.neutralAvatar}>{contact.charAt(0)}</span>}<div><strong>{contact}</strong>{platform !== "Neutre" ? <span>{platform}</span> : null}</div></header>
        <div className={styles.messages}>{messages.map((message, index) => <div className={message.from === "agent" ? styles.agentBubble : styles.personBubble} key={`${message.time}-${index}`}>
          <p>{message.text}</p><time>{message.time}</time>
        </div>)}</div>
      </section>
      <section className={styles.backstage}>
        <h4>{backstageTitle}</h4>
        <ol>{actions.map((action, index) => <li className={action.humanValidation ? styles.isAccent : undefined} key={`${action.label}-${index}`}>
          <span className={styles.actionIcon}>{action.humanValidation ? <><Hand /><Check /></> : index + 1}</span>
          <p>{action.label}{action.tool ? <span className={styles.actionTool}><ToolMark name={action.tool} size={28} /></span> : null}</p>
        </li>)}</ol>
      </section>
    </div>
  </KitFrame>;
}

