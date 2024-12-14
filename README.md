# FoundryVTT - Elemental (Unofficial) system

This is an unofficial foundry system for the Elemental RPG from [Gildor Games.](https://www.gildorgames.com/)

# Features

This is still a work in progress, but it is probably at a playable state

Features:
- Character sheets with XP control
- Compendiums with skills, flaws that you can drag and dop into characters (no descriptions)
- Compendiums with most items from the Complete Guide (no descriptions)
- Derived stats, maximum auto-calculated from attributes
- Stat checks
- Attribute rolls, not only from attributes themselves but also from skills and weapons
- Initiative
- Difficulty and opposed rolls, with results.
- Attack rolls from weapons, with opposed defense rolls.
- Damage rolls, with the ability for the gm (not players yet) to apply it accounting for armor.
- Character status, with most modifiers auto applied to rolls.

Missing things:
- Powers (although you can approximate then with skills)
- Archetypes
- Superpowers
- Setting rules.

# Contributing

Any kind of contribution is accepted and wellcome.

This project uses [tailwindcss](https://tailwindcss.com/) as a css framework. If you want to change anything related to it, please familiarize yourself with it before.
As a result there are 3 css files, please add your own styles to `elemental.css` as the other two are used to generate the tailwind output.

This projects also uses github actions for release. Any change to CHANGELOG.MD will trigger a release. So no need to add your changes to that file, just use clear, descriptive commit messages.

# Screenshots

![Character Sheet](imgs/Character%20Sheet.png)

![Weapons Shhet](imgs/Weapon%20sheet.png)

![Roll window](imgs/Roll%20window.png)

![Roll in chat](imgs/Chat%20roll.png)

# Licenses

Content from Elemental RPG game is property of Gildor Games and used with permission. **All rights reserved by Gildor Games**

The code is licensed under GPLv3, check the LICENSE file.

