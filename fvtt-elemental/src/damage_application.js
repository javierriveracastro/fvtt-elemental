// Damage application to actors.
/* global game, ui, canvas, renderTemplate, ChatMessage, console, fromUuid */

export function apply_damage(damage) {
  const targets = get_damage_target();
  const damage_log = [];
  for (let actor of targets) {
    damage_log.push(damage_actor(damage, actor));
  }
  show_damage_log(damage_log).catch((err) =>
    console.error(`Unable to show damage log: ${err}`),
  );
}

function get_targets_from_array(array) {
  let targets = [];
  for (let target of array) {
    if (target.document.actor.testUserPermission(game.user, "OWNER")) {
      targets.push(target.document.actor);
    } else {
      ui.notifications.error(
        game.i18n.localize("ELEMENTAL.DamageTargetNotAllowed"),
      );
    }
  }
  return targets;
}

function get_damage_target() {
  if (game.user.targets.size > 0) {
    return get_targets_from_array(game.user.targets);
  }
  if (canvas.tokens.controlled.length > 0) {
    return get_targets_from_array(canvas.tokens.controlled);
  }
  return [];
}

function damage_actor(damage, actor) {
  const previous_health = actor.system.current_health;
  const final_damage = Math.max(damage - actor.armor, 0);
  const new_health = Math.max(previous_health - final_damage, 0);
  if (new_health <= 0) {
    actor
      .toggleStatusEffect("dead", { active: true, overlay: true })
      .catch((err) => {
        console.error(`Error while toggling status: ${err}`);
      });
  }
  actor.update(
    {
      "data.attributes.hp.value": new_health,
      "data.attributes.hp.max": new_health,
    },
    { diff: false },
  );
  actor.update({ "system.current_health": new_health });
  return {
    name: actor.name,
    initial: previous_health,
    damage: damage,
    armor: actor.armor,
    final: new_health,
    actor_uuid: actor.uuid,
  };
}

/** Shows the damage log
 ** @param damage:log: Array of damages
 **/
async function show_damage_log(damage_log) {
  const html = await renderTemplate(
    "systems/fvtt-elemental/templates/damage_log.hbs",
    { log: damage_log, theme: game.elemental.current_theme },
  );
  ChatMessage.create({
    content: html,
    flags: { "fvtt-elemental": { damage_log: true } },
  });
}

export function add_damage_log_listeners(html, message) {
  html.find(".elemental-undo-damage").click((ev) => {
    undo_damage(ev, message).catch((err) => {
      console.error(`Error while undoing damage: ${err}`);
    });
  });
}

async function undo_damage(ev, message) {
  const actor = await fromUuid(ev.currentTarget.dataset.actor);
  const initial_health = ev.currentTarget.dataset.initial;
  actor.update({ "system.current_health": initial_health });
  if (initial_health > 0) {
    actor.toggleStatusEffect("dead", { active: false });
  }
  ev.currentTarget.disabled = true;
  ev.currentTarget.classList.add("hidden");
  ev.currentTarget.parentElement.parentElement.classList.add("line-through");
  await message.update({
    id: message.id,
    content: ev.currentTarget.closest(".message-content").innerHTML,
  });
}
