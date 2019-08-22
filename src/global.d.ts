declare module '*.scss';

declare interface String {
  insertAt(pos: number, str: string): string;
  deleteAt(pos: number): string;
}