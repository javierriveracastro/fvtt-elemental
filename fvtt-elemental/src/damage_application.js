// Damage application to actors.
/* global game, ui, canvas, renderTemplate, ChatMessage, console, fromUuid, Dialog */

export function apply_damage(damage, target, damage_stat) {
  const adjusted_damage_stat = damage_stat || "current_health";
  let targets;
  if (target) {
    targets = [target];
  } else {
    targets = get_damage_target();
  }
  const damage_log = [];
  for (const actor of targets) {
    damage_log.push(damage_actor(damage, actor, adjusted_damage_stat));
  }
  let title = game.i18n.localize("ElementalL.DamageLog.DamageTitle");
  let hide_armor = false;
  if (damage_stat === "current_spirit") {
    title = game.i18n.localize("Elemental.DamageLog.SpiritTitle");
    hide_armor = true;
  }
  show_damage_log(damage_log, title, hide_armor).catch((err) =>
    console.error(`Unable to show damage log: ${err}`),
  );
}

function get_targets_from_array(array) {
  const targets = [];
  for (const target of array) {
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

function damage_actor(damage, actor, adjusted_damage_stat) {
  const previous_health = actor.system[adjusted_damage_stat];
  let final_damage = damage;
  if (adjusted_damage_stat === "current_health") {
    final_damage -= actor.armor;
  }
  final_damage = Math.max(final_damage, 0);
  const new_health = Math.max(previous_health - final_damage, 0);
  if (new_health <= 0) {
    actor
      .toggleStatusEffect("dead", { active: true, overlay: true })
      .catch((err) => {
        console.error(`Error while toggling status: ${err}`);
      });
  }
  const key = `system.${adjusted_damage_stat}`;
  actor.update({ [key]: new_health });
  return {
    name: actor.name,
    initial: previous_health,
    damage: damage,
    armor: actor.armor,
    final: new_health,
    actor_uuid: actor.uuid,
    damage_stat: adjusted_damage_stat,
  };
}

/** Shows the damage log
 ** @param damage:log: Array of damages
 **/
async function show_damage_log(damage_log, title, hide_armor) {
  const html = await renderTemplate(
    "systems/fvtt-elemental/templates/damage_log.hbs",
    {
      log: damage_log,
      theme: game.elemental.current_theme,
      title: title,
      hide_armor: hide_armor,
    },
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
  const key = `system.${ev.currentTarget.dataset.damageStat}`;
  actor.update({ [key]: initial_health });
  if (initial_health > 0) {
    actor.toggleStatusEffect("dead", { active: false });
  }
  ev.currentTarget.disabled = true;
  ev.currentTarget.classList.add("twel:hidden");
  ev.currentTarget.parentElement.parentElement.classList.add("line-through");
  await message.update({
    id: message.id,
    content: ev.currentTarget.closest(".message-content").innerHTML,
  });
}

export function modify_damage_dialog(base_damage) {
  let content = "<div class='elemental-css'><div class='flex m-2 gap-2'>";
  content += `<label for="damage-input" class="self-center w-3/4">${game.i18n.localize("Elemental.DamageDialog.Prompt")}</label>`;
  content += `<input id='damage-input' value="0" class="w-1/4">`;
  content += "</div></div>";
  new Dialog({
    title: game.i18n.localize("Elemental.DamageDialog.Title"),
    content: content,
    buttons: {
      one: {
        label: game.i18n.localize("Elemental.DamageDialog.Apply"),
        callback: (html) => {
          const modifier = parseInt(html.find("#damage-input")[0].value);
          if (modifier) {
            apply_damage(base_damage + modifier);
          } else {
            ui.notifications.error(
              game.i18n.localize("Elemental.DamageDialog.Invalid"),
            );
          }
        },
      },
      two: {
        label: game.i18n.localize("Elemental.DamageDialog.Cancel"),
      },
    },
  }).render(true);
}
