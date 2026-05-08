import { AccommodationInfo, RouteStop } from './types';

export const tripMeta = {
  title: 'Ferias Maio 2026',
  shortTitle: 'Ferias Maio',
  description: 'Roteiro compartilhado de Salvador, Los Angeles, Japao, Seul e Madri',
  dateRangeLabel: '09 mai - 31 mai 2026',
  countdownLabel: 'Conta regressiva - comeca 09/05/2026',
  countdownTarget: '2026-05-09T00:00:00',
  countdownEnd: '2026-05-31T23:59:59',
  activeTitle: 'Viagem em andamento!',
  activeSubtitle: 'Los Angeles, Japao, Seul e Madri',
  completedTitle: 'Viagem concluida!',
  completedSubtitle: 'Hora de planejar o proximo roteiro.',
  heroLines: ['Los Angeles', 'Tokyo', 'Kyoto', 'Osaka', 'Seul', 'Madri'],
  heroSubtitle: '5 pessoas - 23 dias - EUA, Japao, Coreia do Sul e Espanha',
  groupSubtitle: '5 viajantes - Maio de 2026 - roteiro compartilhado',
};

export const defaultAccommodation: AccommodationInfo = {
  losAngeles: '',
  tokyo: '',
  kyoto: '',
  osaka: '',
  seoul: '',
  madrid: '',
  phone: '',
  notes: '',
};

export const accommodationFields: Array<{
  key: keyof AccommodationInfo;
  label: string;
  placeholder: string;
}> = [
  {
    key: 'losAngeles',
    label: 'Los Angeles',
    placeholder: 'Adicionar hotel ou motel em Los Angeles...',
  },
  {
    key: 'tokyo',
    label: 'Tokyo',
    placeholder: 'Adicionar hotel em Shinjuku ou outro bairro...',
  },
  {
    key: 'kyoto',
    label: 'Kyoto',
    placeholder: 'Adicionar hospedagem em Kyoto...',
  },
  {
    key: 'osaka',
    label: 'Osaka',
    placeholder: 'Adicionar hospedagem em Osaka...',
  },
  {
    key: 'seoul',
    label: 'Seul',
    placeholder: 'Adicionar hotel ou motel em Seul...',
  },
  {
    key: 'madrid',
    label: 'Madri',
    placeholder: 'Adicionar hotel em Madri...',
  },
  {
    key: 'phone',
    label: 'Telefone da hospedagem',
    placeholder: 'Ex: +81 3 1234-5678',
  },
  {
    key: 'notes',
    label: 'Notas extras',
    placeholder: 'Check-in, codigo da porta, observacoes do grupo...',
  },
];

export const tripCityGroups = [
  { label: 'Los Angeles', match: 'Los Angeles', emoji: '🇺🇸', color: '#2563eb' },
  { label: 'San Jose', match: 'San Jose', emoji: '✈️', color: '#0ea5e9' },
  { label: 'Tokyo', match: 'Tokyo', emoji: '🗼', color: '#ef4444' },
  { label: 'Monte Fuji', match: 'Monte Fuji', emoji: '🗻', color: '#f97316' },
  { label: 'Kyoto', match: 'Kyoto', emoji: '⛩️', color: '#a855f7' },
  { label: 'Osaka', match: 'Osaka', emoji: '🎡', color: '#ec4899' },
  { label: 'Seul', match: 'Seul', emoji: '🇰🇷', color: '#059669' },
  { label: 'Madri', match: 'Madri', emoji: '🇪🇸', color: '#d97706' },
];

export const cityColorMap: Record<string, string> = {
  'Los Angeles 🇺🇸': '#2563eb',
  'San Jose ✈️': '#0ea5e9',
  'Tokyo 🇯🇵': '#ef4444',
  'Monte Fuji 🗻': '#f97316',
  'Kyoto ⛩️': '#a855f7',
  'Osaka 🎡': '#ec4899',
  'Seul 🇰🇷': '#059669',
  'Madri 🇪🇸': '#d97706',
};

export const routePresets: Record<string, Array<Omit<RouteStop, 'id'>>> = {
  'Los Angeles': [
    { label: '🏨 Motel em Los Angeles', address: '' },
    { label: '🌴 Beverly Hills', address: 'Beverly Hills, Los Angeles, CA' },
    { label: '🛍️ Rodeo Drive', address: 'Rodeo Drive, Beverly Hills, CA' },
    { label: '🎡 Santa Monica Pier', address: 'Santa Monica Pier, Santa Monica, CA' },
    { label: '🎬 Lake Hollywood Park', address: 'Lake Hollywood Park, Los Angeles, CA' },
    { label: '⭐ Calcada da Fama', address: 'Hollywood Walk of Fame, Los Angeles, CA' },
    { label: '✈️ LAX', address: 'Los Angeles International Airport, Los Angeles, CA' },
  ],
  Tokyo: [
    { label: '🏨 Hotel em Shinjuku', address: '' },
    { label: '⛩️ Santuario Meiji', address: 'Meiji Jingu, Tokyo, Japan' },
    { label: '🛍️ Takeshita Street', address: 'Takeshita Street, Tokyo, Japan' },
    { label: '🏬 Omotesando Hills', address: 'Omotesando Hills, Tokyo, Japan' },
    { label: '🐕 Estatua de Hachiko', address: 'Hachiko Memorial Statue, Tokyo, Japan' },
    { label: '🚦 Shibuya Crossing', address: 'Shibuya Scramble Crossing, Tokyo, Japan' },
    { label: '🌆 Shibuya Sky', address: 'Shibuya Sky, Tokyo, Japan' },
    { label: '🏮 Omoide Yokocho', address: 'Omoide Yokocho, Tokyo, Japan' },
    { label: '🛕 Senso-ji', address: 'Senso-ji, Tokyo, Japan' },
    { label: '🛍️ Ameyoko Market', address: 'Ameyoko Shopping District, Tokyo, Japan' },
  ],
  Kyoto: [
    { label: '🏨 Hotel em Kyoto', address: '' },
    { label: '🍣 Mercado Nishiki', address: 'Nishiki Market, Kyoto, Japan' },
    { label: '✨ Kinkaku-ji', address: 'Kinkaku-ji, Kyoto, Japan' },
    { label: '🎍 Arashiyama', address: 'Arashiyama Bamboo Forest, Kyoto, Japan' },
    { label: '🦊 Fushimi Inari', address: 'Fushimi Inari Taisha, Kyoto, Japan' },
    { label: '🏯 Kiyomizudera', address: 'Kiyomizu-dera, Kyoto, Japan' },
    { label: '🏮 Gion', address: 'Gion, Kyoto, Japan' },
    { label: '🌙 Yasaka Shrine', address: 'Yasaka Shrine, Kyoto, Japan' },
  ],
  Osaka: [
    { label: '🏨 Hotel em Osaka', address: '' },
    { label: '🌆 Umeda Sky', address: 'Umeda Sky Building, Osaka, Japan' },
    { label: '🏯 Castelo de Osaka', address: 'Osaka Castle, Osaka, Japan' },
    { label: '🎏 Dotonbori', address: 'Dotonbori, Osaka, Japan' },
    { label: '🛕 Shitenno-ji', address: 'Shitenno-ji, Osaka, Japan' },
    { label: '🎡 Shinsekai', address: 'Shinsekai, Osaka, Japan' },
    { label: '⛩️ Namba Yasaka Jinja', address: 'Namba Yasaka Jinja, Osaka, Japan' },
    { label: '✈️ KIX', address: 'Kansai International Airport, Osaka, Japan' },
  ],
  Seul: [
    { label: '🏨 Hotel em Seul', address: '' },
    { label: '🗼 N Seoul Tower', address: 'N Seoul Tower, Seoul, South Korea' },
    { label: '🎶 Hongdae', address: 'Hongdae, Seoul, South Korea' },
    { label: '👘 Loja do Hanbok', address: 'Gyeongbokgung Hanbok Rental, Seoul, South Korea' },
    { label: '🏯 Gyeongbokgung', address: 'Gyeongbokgung Palace, Seoul, South Korea' },
    { label: '🏘️ Bukchon Hanok Village', address: 'Bukchon Hanok Village, Seoul, South Korea' },
    { label: '🛕 Jogyesa', address: 'Jogyesa Temple, Seoul, South Korea' },
    { label: '📚 Starfield Library', address: 'Starfield Library, Seoul, South Korea' },
    { label: '🌃 Dongdaemun DDP', address: 'Dongdaemun Design Plaza, Seoul, South Korea' },
    { label: '🏟️ Jamsil Baseball Stadium', address: 'Jamsil Baseball Stadium, Seoul, South Korea' },
    { label: '🌊 Cheonggyecheon', address: 'Cheonggyecheon, Seoul, South Korea' },
    { label: '✈️ Incheon', address: 'Incheon International Airport, South Korea' },
  ],
  Madri: [
    { label: '🏨 Hotel em Madri', address: '' },
    { label: '🌳 El Retiro', address: 'El Retiro Park, Madrid, Spain' },
    { label: '🏛️ Palacio de Cristal', address: 'Palacio de Cristal, Madrid, Spain' },
    { label: '⚽ Santiago Bernabeu', address: 'Santiago Bernabeu Stadium, Madrid, Spain' },
    { label: '🍽️ Mercado San Miguel', address: 'Mercado de San Miguel, Madrid, Spain' },
    { label: '🍫 San Gines', address: 'Chocolateria San Gines, Madrid, Spain' },
    { label: '👑 Palacio Real', address: 'Royal Palace of Madrid, Spain' },
    { label: '🌇 Templo de Debod', address: 'Temple of Debod, Madrid, Spain' },
    { label: '✈️ Aeroporto de Madri', address: 'Adolfo Suarez Madrid-Barajas Airport, Madrid, Spain' },
  ],
};

export const groupTips = [
  { icon: '🛂', text: 'Confiram passaporte, reservas e regras de imigracao antes de cada trecho internacional.' },
  { icon: '📱', text: 'Vale usar eSIM internacional ou roaming com pacote global, porque a viagem troca de pais varias vezes.' },
  { icon: '🔌', text: 'Levem adaptador universal. Estados Unidos, Japao e Coreia do Sul usam padroes diferentes da Espanha.' },
  { icon: '💳', text: 'Tenham dois meios de pagamento: cartao internacional e um pouco de dinheiro local para emergencias.' },
  { icon: '🚄', text: 'No Japao, deixem margem para deslocamentos longos entre Tokyo, Kyoto e Osaka.' },
  { icon: '🎟️', text: 'Dias de Disney e atracoes concorridas pedem ingresso e janela de chegada definidos antes.' },
  { icon: '🧳', text: 'Como sao muitos voos, mantenham uma mochila com documentos, remedios e troca de roupa sempre acessivel.' },
  { icon: '🗺️', text: 'Tudo o que for alterado no roteiro, checklist e rotas agora pode ficar compartilhado para o grupo todo.' },
];

export const emergencyContacts = [
  { label: 'Emergencia EUA', value: '911', emoji: '🇺🇸' },
  { label: 'Policia Japao', value: '110', emoji: '🇯🇵' },
  { label: 'Ambulancia/Bombeiros Japao', value: '119', emoji: '🆘' },
  { label: 'Emergencia Coreia do Sul', value: '112', emoji: '🇰🇷' },
  { label: 'Emergencia Espanha', value: '112', emoji: '🇪🇸' },
];
