"use client";

import { useId, useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = Omit<ComponentProps<"input">, "type"> & { visibilityLabel?: string };

export function PasswordInput({ id, visibilityLabel = "le mot de passe", ...props }: Props) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [visible, setVisible] = useState(false);
  return (
    <span className="ui3-password-input">
      <input {...props} id={inputId} type={visible ? "text" : "password"} />
      <button className="ui3-password-toggle" type="button" aria-controls={inputId}
        aria-label={`${visible ? "Masquer" : "Afficher"} ${visibilityLabel}`} aria-pressed={visible}
        disabled={props.disabled} onClick={() => setVisible(!visible)}>
        {visible ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
      </button>
    </span>
  );
}
