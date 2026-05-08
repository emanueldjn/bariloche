import { ChecklistCategory } from './types';

export const checklist: ChecklistCategory[] = [
  {
    id: 'documentos',
    label: 'Documentos',
    emoji: '📄',
    items: [
      { id: 'doc-1', label: 'Passaporte valido', important: true },
      { id: 'doc-2', label: 'Passagens e reservas no celular', important: true },
      { id: 'doc-3', label: 'Seguro viagem', important: true },
      { id: 'doc-4', label: 'Cartao de credito internacional', important: true },
      { id: 'doc-5', label: 'Comprovantes de hospedagem', important: true },
      { id: 'doc-6', label: 'Carteira com RG/CNH como apoio', important: false },
    ],
  },
  {
    id: 'roupas',
    label: 'Roupas',
    emoji: '👕',
    items: [
      { id: 'roup-1', label: 'Roupas leves para dias amenos', important: true },
      { id: 'roup-2', label: 'Casaco ou jaqueta para noites frias', important: true },
      { id: 'roup-3', label: 'Calcados confortaveis para muita caminhada', important: true },
      { id: 'roup-4', label: 'Roupa extra para parques e dias longos', important: false },
      { id: 'roup-5', label: 'Pijama e roupa intima para toda a viagem', important: false },
      { id: 'roup-6', label: 'Oculos de sol e bone', important: false },
    ],
  },
  {
    id: 'eletronicos',
    label: 'Eletronicos',
    emoji: '📱',
    items: [
      { id: 'elet-1', label: 'Celular e carregador', important: true },
      { id: 'elet-2', label: 'Power bank', important: true },
      { id: 'elet-3', label: 'Adaptador universal de tomada', important: true },
      { id: 'elet-4', label: 'Fones de ouvido', important: false },
      { id: 'elet-5', label: 'Chip internacional / eSIM configurado', important: true },
      { id: 'elet-6', label: 'Cabos extras', important: false },
    ],
  },
  {
    id: 'saude',
    label: 'Saude e higiene',
    emoji: '🧴',
    items: [
      { id: 'hig-1', label: 'Remedios pessoais', important: true },
      { id: 'hig-2', label: 'Analgésico / antitermico', important: true },
      { id: 'hig-3', label: 'Kit de higiene', important: true },
      { id: 'hig-4', label: 'Protetor solar', important: true },
      { id: 'hig-5', label: 'Curativos basicos', important: false },
      { id: 'hig-6', label: 'Mascara de dormir e hidratante labial', important: false },
    ],
  },
  {
    id: 'voos',
    label: 'Voos e deslocamentos',
    emoji: '✈️',
    items: [
      { id: 'desl-1', label: 'Travesseiro de pescoco', important: false },
      { id: 'desl-2', label: 'Mochila para itens essenciais', important: true },
      { id: 'desl-3', label: 'Snacks para conexoes e voos longos', important: false },
      { id: 'desl-4', label: 'Garrafinha de agua', important: false },
      { id: 'desl-5', label: 'Etiquetas e cadeado na mala', important: false },
    ],
  },
];
