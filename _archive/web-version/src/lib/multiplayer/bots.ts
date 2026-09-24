export type BotProfile={id:string;country:string;countryCode:string;names:string[];avatar:string;skill:"casual"|"steady"|"expert"};
export const BOT_PROFILES:BotProfile[]=[
{id:"pk",country:"Pakistan",countryCode:"PK",names:["Aisha","Imran","Abbas","Hina","Hamza","Mariam"],avatar:"moon",skill:"steady"},
{id:"in",country:"India",countryCode:"IN",names:["Aarav","Ananya","Kabir","Priya","Rohan","Meera"],avatar:"lotus",skill:"steady"},
{id:"bd",country:"Bangladesh",countryCode:"BD",names:["Nusrat","Arif","Sadia","Tanvir","Mim","Fahim"],avatar:"star",skill:"casual"},
{id:"ae",country:"UAE",countryCode:"AE",names:["Noor","Omar","Laila","Zayed","Maya","Sami"],avatar:"sun",skill:"expert"},
{id:"sa",country:"Saudi Arabia",countryCode:"SA",names:["Noura","Faisal","Sara","Omar","Lina","Khalid"],avatar:"desert",skill:"steady"},
{id:"tr",country:"Türkiye",countryCode:"TR",names:["Elif","Emir","Zeynep","Kerem","Derya","Arda"],avatar:"crescent",skill:"steady"},
{id:"gb",country:"United Kingdom",countryCode:"GB",names:["Olivia","James","Amelia","Harry","Sophie","Jack"],avatar:"crown",skill:"expert"},
{id:"us",country:"United States",countryCode:"US",names:["Emma","Liam","Mia","Noah","Ava","Ethan"],avatar:"comet",skill:"expert"},
{id:"ca",country:"Canada",countryCode:"CA",names:["Olivia","Lucas","Chloe","Evan","Maya","Leo"],avatar:"aurora",skill:"steady"},
{id:"au",country:"Australia",countryCode:"AU",names:["Isla","Jack","Ruby","Lachlan","Mia","Noah"],avatar:"wave",skill:"casual"},
{id:"jp",country:"Japan",countryCode:"JP",names:["Yuki","Hana","Ren","Aoi","Sora","Mei"],avatar:"sakura",skill:"expert"},
{id:"kr",country:"South Korea",countryCode:"KR",names:["Minji","Jisoo","Jiho","Sora","Hana","Jun"],avatar:"neon",skill:"expert"},
{id:"br",country:"Brazil",countryCode:"BR",names:["Ana","Lucas","Beatriz","Mateus","Julia","Rafael"],avatar:"sunset",skill:"casual"},
{id:"ng",country:"Nigeria",countryCode:"NG",names:["Ada","Emeka","Amara","Tunde","Zainab","Chidi"],avatar:"ember",skill:"steady"},
{id:"za",country:"South Africa",countryCode:"ZA",names:["Amahle","Liam","Thandi","Sibusiso","Mia","Neo"],avatar:"star",skill:"steady"},
{id:"de",country:"Germany",countryCode:"DE",names:["Lena","Jonas","Mia","Felix","Lea","Paul"],avatar:"eclipse",skill:"expert"},
{id:"fr",country:"France",countryCode:"FR",names:["Chloé","Louis","Emma","Hugo","Camille","Noah"],avatar:"lumiere",skill:"steady"},
{id:"es",country:"Spain",countryCode:"ES",names:["Lucía","Mateo","Sofía","Álvaro","Carmen","Diego"],avatar:"sol",skill:"casual"}];
export function botForCountry(code:string,seed=0){const p=BOT_PROFILES.filter(x=>x.countryCode===code.toUpperCase());const pool=p.length?p:BOT_PROFILES;return pool[Math.abs(seed)%pool.length]!}
export function botDisplayName(bot:BotProfile,seed=0){return bot.names[Math.abs(seed)%bot.names.length]!}