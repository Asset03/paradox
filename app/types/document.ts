export interface Document {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface DocumentTableItem extends Document {
  version: string;
  size: string;
  uploadDate: string;
}