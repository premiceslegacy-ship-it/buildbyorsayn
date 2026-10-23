import Image from "next/image";
import styles from "./AppChromePlaceholder.module.css";

export function AppChromePlaceholder({ active = "Aujourd’hui" }: { active?: string }) {
  const items = ["Aujourd’hui", "Programme", "Skills", "Nouveautés"];
  return (
    <div className={styles.chrome} aria-hidden="true" inert>
      <div className={styles.bar}>
        <Image className={styles.logo} src="/da/logo-sombre.svg" alt="" width={112} height={28} priority />
        <div className={styles.links}>{items.map((item) => <span className={item === active ? styles.active : undefined} key={item}>{item}</span>)}</div>
        <div className={styles.tools}><span className={styles.tool} /><span className={styles.tool} /><span className={styles.avatar} /></div>
      </div>
      <div className={styles.tabbar}>{items.map((item) => <span className={styles.tab} key={item}><i />{item}</span>)}</div>
    </div>
  );
}
