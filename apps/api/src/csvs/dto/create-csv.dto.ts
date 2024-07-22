export class CreateCsvDto {
  // id: number;
  uniqueFilename: string;
  originalFilename: string;
  fileSize: number;
  // createdAt: Date;
  // updatedAt: Date;
  userEmail: string;
}
export interface Influencer {
  id: number;
  Influencer: string;
  Username: string;
  Cidade: string;
  Investimento: string;
  Posts: string;
  Stories: string;
  Feed: string;
  Tiktok: string;
  Impressoes: string;
  Interacoes: string;
  Cliques: string;
  'Video Views': string;
  Engajamento: string;
  'Engajamento Tiktok': string;
  'Cliques Tiktok': string;
  'Impressoes Tiktok': string;
  'Url Foto Perfil': string;
  CPE: string;
  CTR: string;
  CPC: string;
  CPV: string;
  createdAt?: string;
  updatedAt?: string;
}
