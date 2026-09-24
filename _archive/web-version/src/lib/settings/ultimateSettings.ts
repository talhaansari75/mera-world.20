export type SettingDefinition = { id: string; category: string; type: 'boolean' | 'number' | 'string' | 'select'; defaultValue: boolean | number | string; min?: number; max?: number; options?: string[] };

const categories = ['General','Graphics','Gameplay','Audio','Controls','Accessibility','Theme','Data','Account','Notifications','Privacy','Parental','Cloud & Sync','Time & Region','Developer','Streaming','AI Settings','AI Deep Settings','Performance','Network','Security','Analytics','Modding','AI-Powered','Social Advanced','Economy','Content','Experimental','Hardware','Legal','Special Modes'];
export const ULTIMATE_SETTINGS: SettingDefinition[] = Array.from({ length: 485 }, (_, i) => {
  const category = categories[i % categories.length];
  return { id: `setting.${i + 1}`, category, type: i % 3 === 0 ? 'boolean' : i % 3 === 1 ? 'number' : 'select', defaultValue: i % 3 === 0 ? false : i % 3 === 1 ? 0 : 'default', ...(i % 3 === 1 ? { min: 0, max: 100 } : {}), ...(i % 3 === 2 ? { options: ['default', 'on', 'off'] } : {}) };
});
