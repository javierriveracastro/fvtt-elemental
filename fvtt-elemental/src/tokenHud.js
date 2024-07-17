// Token HUD rendenrind

export function change_condition_menu(_, html) {
  const status_div = html.find(".status-effects");
  status_div.addClass("elemental-css");
  status_div.css("width", "20rem");
  let new_html = "";
  for (const image of status_div.children()) {
    const status_name = image.dataset.tooltip;
    image.className += " self-center";
    new_html += `<div class="flex m-1 w-1/2">${image.outerHTML}<span class="ml-1 text-gray-200 text-3xl self-center">${status_name}</span></div>`;
  }
  new_html = `<div class='grid grid-cols-2 gap-2 w-80'>${new_html}</div>`;
  status_div.html(new_html);
}
