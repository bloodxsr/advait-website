import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import styles from "../page.module.css";

const links = [["GitHub","Projects, code, and open work","https://github.com"],["Discord","The day-to-day community","https://discord.com"],["Newsletter","A note when something is worth sharing","mailto:hello@advait.collective"]];
export default function Social() {
  return <main className={styles.page}><PageIntro label="Community / Find us elsewhere" title="Social links" description="Join the conversation wherever you prefer. No feeds to keep up with, just places to meet." /><section className={styles.list}>{links.map(([name,description,url],index)=><article className={styles.row} key={name}><span className={styles.number}>0{index+1}</span><div><h2>{name}</h2><p>{description}</p></div><Link className="text-link" href={url}>Visit ↗</Link></article>)}</section></main>;
}
