export interface IRow {
  name: string;
  author: string;
  release_date: string;
  price: number;
  views: number;
  status: boolean;
  actions:string;
}

export interface Dialogue{
    name:string
    text:string
}

export interface Game {
  id:number
  name:string
  author:number
  release_date:Date
  price:number
  status:boolean
  views:number
  data:string
}

export interface SaveData {
  id?:number
  userId: number
  gameId: number
  scene: number
  dialogue: number
  savedAt: Date
}