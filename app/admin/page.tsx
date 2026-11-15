import { PageIntro } from "@/components/PageIntro";
import styles from "../page.module.css";

export default function Admin() {
  return <main className={styles.page}><PageIntro label="Admin / Club operations" title="Admin dashboard" description="A simple control room for keeping the club's public information useful and current." /><section className={styles.list}><div className={styles.row}><span className={styles.number}>01</span><div><h2>Approval queue</h2><p>Review 3 resource recommendations and 1 member post.</p></div><span className="mono-muted">Review →</span></div><div className={styles.row}><span className={styles.number}>02</span><div><h2>News & events</h2><p>Create or update the information shown to visitors.</p></div><span className="mono-muted">Manage →</span></div><div className={styles.row}><span className={styles.number}>03</span><div><h2>Members & points</h2><p>View member activity and maintain the leaderboard.</p></div><span className="mono-muted">Manage →</span></div></section></main>;
}
