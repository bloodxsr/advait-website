const fs = require('fs');
const path = require('path');

// 1. Clean app/admin/page.tsx
let adminCode = fs.readFileSync('app/admin/page.tsx', 'utf8');
adminCode = adminCode.replace('<span style={{ fontSize: "32px" }}>🔒</span>', '<span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", color: "#ef4444", fontWeight: 800 }}>[RESTRICTED ACCESS]</span>');
adminCode = adminCode.replace('<span style={{ color: "#c084fc", fontSize: "14px" }}>✦</span>', '<span style={{ color: "#c084fc", fontSize: "14px" }}>+</span>');
adminCode = adminCode.replace('<span>⚡ Active Division Filter:</span>', '<span>Active Division Filter:</span>');
adminCode = adminCode.replace('<span className={styles.emptyIcon}>✓</span>', '<span className={styles.emptyIcon}>[ALL CLEAR]</span>');
adminCode = adminCode.replace('? "✓ APPROVE (+15 PTS)"', '? "APPROVE (+15 PTS)"');
adminCode = adminCode.replace('? "✓ APPROVE (+25 PTS)"', '? "APPROVE (+25 PTS)"');
adminCode = adminCode.replace(': "✓ APPROVE (+3 PTS)"}', ': "APPROVE (+3 PTS)"}');
adminCode = adminCode.replace('✕ REJECT', 'REJECT');
adminCode = adminCode.replace(/🗑 Delete Event/g, '[DELETE EVENT]');
adminCode = adminCode.replace(/🗑 Delete/g, '[DELETE]');
adminCode = adminCode.replace('📍 {ev.location || "Main Campus"}', 'Location: {ev.location || "Main Campus"}');
adminCode = adminCode.replace('<span className={styles.emptyIcon}>📷</span>', '<span className={styles.emptyIcon}>[EMPTY]</span>');
adminCode = adminCode.replace(/★ Lead/g, '[LEAD]');
adminCode = adminCode.replace(/★/g, '[LEAD]');
adminCode = adminCode.replace(/✕/g, '[CLOSE]');
fs.writeFileSync('app/admin/page.tsx', adminCode, 'utf8');
console.log('Cleaned app/admin/page.tsx');

// 2. Clean app/dashboard/edit/page.tsx
let dashEdit = fs.readFileSync('app/dashboard/edit/page.tsx', 'utf8');
dashEdit = dashEdit.replace(/Saved! ✓/g, 'Saved');
fs.writeFileSync('app/dashboard/edit/page.tsx', dashEdit, 'utf8');
console.log('Cleaned app/dashboard/edit/page.tsx');

// 3. Clean app/events/page.tsx
let eventsCode = fs.readFileSync('app/events/page.tsx', 'utf8');
eventsCode = eventsCode.replace('✓ RSVP REGISTERED ON DOCKET', 'RSVP REGISTERED ON DOCKET');
eventsCode = eventsCode.replace('<span style={{ color: "#c084fc", fontSize: "14px" }}>✦</span>', '<span style={{ color: "#c084fc", fontSize: "14px" }}>+</span>');
eventsCode = eventsCode.replace('✦ POST ANYTHING / STUDIO', '+ POST ANYTHING / STUDIO');
eventsCode = eventsCode.replace('✦ DISPATCH / SUBMIT', '+ DISPATCH / SUBMIT');
eventsCode = eventsCode.replace('⚡ Schedule New Gathering (Admin Direct)', 'Schedule New Gathering (Admin Direct)');
eventsCode = eventsCode.replace(/📁 Browse/g, 'Browse');
eventsCode = eventsCode.replace('✓ Publish Event to Calendar', 'Publish Event to Calendar');
eventsCode = eventsCode.replace(/✕/g, '[CLOSE]');
fs.writeFileSync('app/events/page.tsx', eventsCode, 'utf8');
console.log('Cleaned app/events/page.tsx');

// 4. Clean app/hall-of-builders/page.tsx
let hobCode = fs.readFileSync('app/hall-of-builders/page.tsx', 'utf8');
hobCode = hobCode.replace('★ {c.multiplier}', '{c.multiplier}');
fs.writeFileSync('app/hall-of-builders/page.tsx', hobCode, 'utf8');
console.log('Cleaned app/hall-of-builders/page.tsx');

// 5. Clean app/hall-of-flames/page.tsx
let hofCode = fs.readFileSync('app/hall-of-flames/page.tsx', 'utf8');
hofCode = hofCode.replace('⚡ + Write & Publish Essay (Studio)', '+ Write & Publish Essay (Studio)');
hofCode = hofCode.replace('⚡ + Write & Publish Essay (Admin)', '+ Write & Publish Essay (Admin)');
hofCode = hofCode.replace('⚡ Direct Publish Essay (Admin)', 'Direct Publish Essay (Admin)');
hofCode = hofCode.replace(/📁 Upload Cover Image/g, 'Upload Cover Image');
hofCode = hofCode.replace('📷 + Insert Image into Post', '+ Insert Image into Post');
hofCode = hofCode.replace('✓ Publish Essay Immediately', 'Publish Essay Immediately');
hofCode = hofCode.replace(/✕/g, '[CLOSE]');
fs.writeFileSync('app/hall-of-flames/page.tsx', hofCode, 'utf8');
console.log('Cleaned app/hall-of-flames/page.tsx');

// 6. Clean app/hall-of-flames/[slug]/page.tsx
let hofSlug = fs.readFileSync('app/hall-of-flames/[slug]/page.tsx', 'utf8');
hofSlug = hofSlug.replace('<span style={{ fontSize: "36px" }}>📜</span>', '<span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", color: "#a1a1aa" }}>[ESSAY ARCHIVE]</span>');
hofSlug = hofSlug.replace('<span>🔗</span>', '<span style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>[LINK]</span>');
fs.writeFileSync('app/hall-of-flames/[slug]/page.tsx', hofSlug, 'utf8');
console.log('Cleaned app/hall-of-flames/[slug]/page.tsx');

// 7. Clean app/login/page.tsx
let loginCode = fs.readFileSync('app/login/page.tsx', 'utf8');
loginCode = loginCode.replace('⚡ ENTER AS MEMBER', 'ENTER AS MEMBER');
loginCode = loginCode.replace('🛡️ ENTER AS ADMIN', 'ENTER AS ADMIN');
fs.writeFileSync('app/login/page.tsx', loginCode, 'utf8');
console.log('Cleaned app/login/page.tsx');

// 8. Clean app/projects/page.tsx
let projCode = fs.readFileSync('app/projects/page.tsx', 'utf8');
projCode = projCode.replace('★ {p.stars}', '{p.stars} stars');
projCode = projCode.replace('⚡ + Publish Project (Creator Studio)', '+ Publish Project (Creator Studio)');
projCode = projCode.replace('⚡ Direct Publish Project (Admin)', 'Direct Publish Project (Admin)');
projCode = projCode.replace(/✕/g, '[CLOSE]');
fs.writeFileSync('app/projects/page.tsx', projCode, 'utf8');
console.log('Cleaned app/projects/page.tsx');

// 9. Clean app/resources/page.tsx
let resCode = fs.readFileSync('app/resources/page.tsx', 'utf8');
resCode = resCode.replace('⚡ + Add Resource (Creator Studio)', '+ Add Resource (Creator Studio)');
resCode = resCode.replace(/✕/g, '[CLOSE]');
fs.writeFileSync('app/resources/page.tsx', resCode, 'utf8');
console.log('Cleaned app/resources/page.tsx');

// 10. Clean components/CountdownTimer.tsx
let timerCode = fs.readFileSync('components/CountdownTimer.tsx', 'utf8');
timerCode = timerCode.replace('⚡ LIVE COUNTDOWN PREVIEW', 'LIVE COUNTDOWN PREVIEW');
fs.writeFileSync('components/CountdownTimer.tsx', timerCode, 'utf8');
console.log('Cleaned components/CountdownTimer.tsx');
