// Tailwind theming

export const BASE_THEME = {
  big_input:
    `twel:w-full twel:p-4 twel:text-gray-900 twel:border twel:border-gray-300 twel:rounded-lg 
    twel:bg-gray-50 twel:text-base twel:focus:ring-blue-500 twel:focus:border-blue-500`,
  small_input:
    `twel:w-10 twel:p-2 twel:text-gray-900 twel:border twel:border-gray-300 
    twel:rounded-lg twel:bg-gray-50 twel:text-base twel:focus:ring-blue-500 twel:focus:border-blue-500`,
  three_quarters_input:
    `twel:w-3/4 twel:p-2 twel:text-gray-900 twel:border twel:border-gray-300 twel:rounded-lg 
    twel:bg-gray-50 twel:text-base twel:focus:ring-blue-500 twel:focus:border-blue-500`,
  medium_select:
    `twel:w-1/3 twel:text-gray-900 twel:border twel:border-gray-300 twel:rounded-lg 
    twel:bg-gray-50 twel:text-base twel:text-sm twel:focus:ring-blue-500 twel:focus:border-blue-500`,
  tab_background:
    `twel:flex twel:flex-wrap twel:text-sm twel:font-medium twel:text-center twel:border-0
    twel:border-b twel:border-gray-200 twel:border-solid`,
  tab_active:
    `twel:no-underline twel:inline-twel:block twel:text-blue-600 twel:border-blue-600
     twel:p-2 twel:border-0 twel:border-b-2 twel:border-solid twel:rounded-t-lg twel:hover:text-blue-700 
     twel:hover:border-blue-600`,
  tab_inactive:
    `twel:no-underline twel:inline-twel:block twel:text-gray-500 twel:p-2
    twel:rounded-t-lg twel:hover:text-gray-600 twel:hover:border-gray-500`,
  text_attribute: `twel:text-lg twel:font-bold`,
  text_derived: `twel:p-1 twel:mr-2 twel:text-right twel:text-lg`,
  text_description_label: `twel:block twel:text-lg twel:font-medium`,
  text_description:
    `twel:text-gray-900 twel:border twel:border-gray-300 twel:rounded-lg twel:bg-gray-50
    twel:text-base twel:focus:ring-blue-500 twel:focus:border-blue-500`,
  info_label: `twel:p-1`,
  skill_box:
    `twel:mt-2 twel:block twel:p-2 twel:bg-stone-300 twel:border twel:border-stone-400
     twel:rounded-lg twel:shadow-sm twel:min-h-40`,
  refresh_button:
    `twel:text-white twel:bg-blue-700 twel:hover:bg-blue-800 twel:focus:ring-4
     twel:focus:ring-blue-300 twel:font-medium twel:rounded-lg twel:text-sm twel:px-2
     twel:me-2 twel:mb-2`,
  skill_button:
    `twel:w-6 twel:h-6 twel:text-white twel:bg-blue-700 twel:hover:bg-blue-800
    twel:focus:ring-4 twel:focus:ring-blue-300 twel:font-medium twel:rounded-lg 
    twel:text-sm twel:self-center`,
  skill_name: `twel:border-solid twel:border-0 twel:border-b-2 twel:border-stone-200`,
  flaw_name: `twel:border-solid twel:border-0 twel:border-b-2 twel:border-stone-200 twel:text-red-700`,
  power_name: `twel:border-solid twel:border-0 twel:border-b-2 twel:border-stone-200 twel:text-blue-700`,
  roll_button:
    `twel:text-white twel:bg-blue-700 twel:hover:bg-blue-800 twel:focus:ring-4 twel:focus:ring-blue-300
    twel:font-medium twel:rounded-lg twel:text-sm twel:p-2 twel:m-2`,
  roll_button_left:
    `twel:text-white twel:bg-blue-700 twel:hover:bg-blue-800 twel:focus:ring-4
    twel:focus:ring-blue-300 twel:font-medium twel:rounded-s-lg twel:text-sm
    twel:p-2 twel:m-2 twel:mr-0`,
  roll_button_right:
    `twel:text-white twel:bg-blue-700 twel:hover:bg-blue-800 twel:focus:ring-4
    twel:focus:ring-blue-300 twel:font-medium twel:rounded-e-lg twel:text-sm twel:p-2
    twel:m-2 twel:ml-0 twel:border-s-0 twel:w-8`,
  result_success:
    `twel:text-green-800 twel:bg-green-50 twel:font-medium twel:rounded-lg twel:text-center twel:mt-2 twel:p-1`,
  warning_badge: `twel:bg-red-300 twel:font-medium twel:rounded-lg twel:text-center twel:m-2 twel:p-1`,
  result_failure:
    `twel:text-red-800 twel:bg-red-50 twel:font-medium twel:rounded-lg twel:text-center twel:mt-2 twel:p-1`,
  result_draw:
    `twel:text-gray-800 twel:bg-gray-50 twel:font-medium twel:rounded-lg twel:text-center twel:mt-2 twel:p-1`,
  roll_title: `twel:mb-2 twel:text-gray-900 twel:text-lg twel:font-bold`,
  roll_options_card: `twel:p-2 twel:bg-white twel:border twel:border-gray-200 twel:rounded-lg twel:shadow-sm`,
  roll_options_title: `twel:mb-4 twel:text-lg twel:font-bold twel:tracking-tight twel:text-gray-900`,
  roll_option_unselected:
    `twel:bg-gray-100 twel:text-gray-800 twel:text-xs twel:me-1 twel:px-2.5 twel:py-0.5
    twel:rounded-sm twel:border twel:border-gray-500 twel:border-solid twel:whitespace-nowrap
    twel:leading-loose`,
  roll_option_selected:
    `twel:bg-blue-100 twel:text-blue-800 twel:text-xs twel:me-1 twel:px-2.5 twel:py-0.5
    twel:rounded-sm twel:border twel:border-blue-500 twel:border-solid twel:whitespace-nowrap twel:leading-loose`,
  modifier_toast:
    `twel:flex twel:items-center twel:justify-center twel:text-blue-500 twel:bg-blue-100
    twel:rounded-lg twel:shadow-sm twel:py--0.5 twel:px-2`,
  close_icon:
    `twel:ml-1 twel:bg-white twel:text-gray-400 twel:hover:twel:text-gray-900 twel:rounded-lg
    twel:focus:ring-2 twel:w-4 twel:h-4 twel:flex twel:p-0`,
  modifier_badge:
    `twel:justify-center twel:text-blue-500 twel:bg-blue-100 twel:rounded-lg twel:shadow-sm
     twel:py--0.5 twel:px-2 twel:whitespace-nowrap twel:leading-loose`,
  checkbox:
    `twel:w-4 twel:h-4 twel:text-blue-600 twel:bg-gray-100 twel:border-gray-300 
    twel:rounded-sm twel:focus:ring-blue-500 twel:focus:ring-2`,
  item_picture: `twel:w-7 twel:h-7 twel:rounded-sm`,
  item_name:
    `twel:self-center twel:border-solid twel:border-0 twel:border-b-2 twel:border-stone-200 twel:grow`,
    quantity_name: `twel:self-center`,
  undo_chat_button:
    `twel:text-white twel:bg-blue-700 twel:hover:bg-blue-800 twel:focus:ring-4
    twel:focus:ring-blue-300 twel:font-small twel:rounded-lg twel:text-sm twel:w-6 twel:ml-2`,
};
