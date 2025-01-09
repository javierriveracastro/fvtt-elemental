// Journal Management
/* globals game */

export async function show_journal(name) {
  const pack = game.packs.get("fvtt-elemental.AttackOptions");
  const journal = await pack.getDocuments();
  const page = journal[0].pages.get(name);
  page.sheet.render(true);
}
