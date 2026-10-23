import type { ReactNode } from "react";

type AccountIconName = "user" | "mail" | "key" | "card" | "plug" | "devices" | "logout" | "check" | "chevron";

const paths: Record<AccountIconName, ReactNode> = {
  user: <><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></>,
  key: <><circle cx="8" cy="15" r="4" /><path d="m11 12 8-8m-3 3 3 3m-6 0 3 3" /></>,
  card: <><rect x="3" y="5.5" width="18" height="13" rx="3" /><path d="M3 10h18M7 15h3" /></>,
  plug: <path d="M9 3v5m6-5v5M6.5 8h11v3a5.5 5.5 0 0 1-11 0zM12 16.5V21" />,
  devices: <><rect x="3" y="4" width="14" height="10" rx="2" /><path d="M8 19h4m-2-5v5" /><rect x="17" y="9" width="4" height="9" rx="1" /></>,
  logout: <path d="M10 4H6.5A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20H10m5-12 4 4-4 4m4-4H9.5" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  chevron: <path d="m9 5 7 7-7 7" />,
};

export function AccountIcon({ name }: { name: AccountIconName }) {
  return <svg className="ui3-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">{paths[name]}</svg>;
}
