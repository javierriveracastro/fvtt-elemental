// Token HUD rendenrind

export function change_condition_menu(_, html) {
  const status_div = html.find(".status-effects");
  status_div.addClass("elemental-css");
  status_div.css("width", "20rem");
  let new_html = "";
  for (const image of status_div.children()) {
    const status_name = image.dataset.tooltip;
    image.className += " self-center";
    new_html += `<div class="twel:flex twel:m-1 twel:w-1/2">${image.outerHTML}<span class="twel:ml-1 twel:text-gray-200 twel:text-3xl twel:self-center">${status_name}</span></div>`;
  }
  new_html = `<div class='twel:grid twel:grid-cols-2 twel:gap-2 twel:w-80'>${new_html}</div>`;
  status_div.html(new_html);
}
