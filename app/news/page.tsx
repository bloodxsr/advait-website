import { PageIntro } from "@/components/PageIntro";
import styles from "../page.module.css";

const news = [["04 Nov 2026","Open systems, open conversations","A small online salon for discussing the tools and ideas shaping our work."],["18 Oct 2026","Three new projects from the club","Members share what they have been making this season."],["02 Sep 2026","Welcome to Advait","Why we are building a club for thoughtful technologists."]];
export default function News() {
  return <main className={styles.page}><PageIntro label="Dispatches / What is happening" title="News & events" description="Gatherings, announcements, and notes from around the Advait community." /><section className={styles.list}>{news.map(([date,title,description],index)=><article className={styles.row} key={title}><span className={styles.number}>0{index+1}<br />{date}</span><div><h2>{title}</h2><p>{description}</p></div><span className="mono-muted">Read →</span></article>)}</section></main>;
}
