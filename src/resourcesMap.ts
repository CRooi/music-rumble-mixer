interface Tracks {
    [key: string]: string[]
}

export const tracks: Tracks = {
    '8bit': ['8bit_early_drums', '8bit_early_main', '8bit_late_drums', '8bit_late_main'],
    'country': ['country_early_drums', 'country_early_main', 'country_late_drums', 'country_late_main'],
    'death': ['death_1', 'death_2', 'death_3', 'death_4', 'death_5', 'death_6'],
    'disco': ['disco_early_drums', 'disco_early_main', 'disco_late_drums', 'disco_late_main'],
    'edm': ['edm_early_drums', 'edm_early_main', 'edm_late_drums', 'edm_late_main'],
    'emo': ['emo_early_drums', 'emo_early_main', 'emo_late_drums', 'emo_late_main'],
    'heartsteel': ['heartsteel_early_drums', 'heartsteel_early_main', 'heartsteel_early_secondary', 'heartsteel_late_drums', 'heartsteel_late_main', 'heartsteel_late_secondary'],
    'hyperpop': ['hyperpop_early', 'hyperpop_late', 'hyperpop_late_drums'],
    'illbeats': ['illbeats_early', 'illbeats_late'],
    'jazz': ['jazz_early_main', 'jazz_late_main'],
    'kda': ['kda_early_drums', 'kda_early_main', 'kda_early_secondary', 'kda_late_drums', 'kda_late_main', 'kda_late_secondary'],
    'maestro': ['maestro_early', 'maestro_late'],
    'mixmaster': ['mixmaster_early', 'mixmaster_late'],
    'pentakill': ['pentakill_early_drums', 'pentakill_early_main', 'pentakill_early_secondary', 'pentakill_late_drums', 'pentakill_late_main', 'pentakill_late_secondary'],
    'piano': ['piano_early', 'piano_late'],
    'punk': ['punk_early_drums', 'punk_early_main', 'punk_late_drums', 'punk_late_main'],
    'starting': ['starting_carousel'],
    'truedamage': ['truedamage_early_drums', 'truedamage_early_main', 'truedamage_early_secondary', 'truedamage_late_drums', 'truedamage_late_main', 'truedamage_late_secondary']
}  

interface Translations {
    [key: string]: string
}

export const translations: Translations = {
    '8bit': '8比特',
    'country': '乡村乐',
    'death': '淘汰',
    'disco': '迪斯科',
    'edm': '电子舞曲',
    'emo': 'EMO',
    'heartsteel': '心之刚',
    'hyperpop': '高能流行',
    'illbeats': '大触打击乐',
    'jazz': '爵士乐',
    'kda': 'K/DA',
    'maestro': '戏命师',
    'mixmaster': 'DJ娑娜',
    'pentakill': '五杀摇滚',
    'piano': '无羁绊',
    'punk': '朋克',
    'starting': '开局',
    'carousel': '传送门',
    'truedamage': '真实伤害',
    'early': '前期',
    'late': '后期',
    'drums': '鼓组',
    'main': '主音',
    'secondary': '背景音',
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6'
}