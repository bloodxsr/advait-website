import styles from "./PageIntro.module.css";

export function PageIntro({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className={styles.intro}>
      <p className="eyebrow accent-cyan">{label}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
