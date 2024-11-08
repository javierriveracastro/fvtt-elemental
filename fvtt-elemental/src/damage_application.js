// Damage application to actors.
/* global game, ui, canvas */

export function apply_damage(damage) {
  const targets = get_damage_target();
  for (let actor of targets) {
    damage_actor(damage, actor);
  }
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
  const new_health = Math.max(previous_health - damage, 0);
  actor.update({ "system.current_health": new_health });
  console.log(previous_health, damage, new_health);
}
