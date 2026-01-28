export enum AppState {
  INTRO = 'INTRO',
  IDLE = 'IDLE',
  COUNTDOWN = 'COUNTDOWN',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export interface ProcessingResult {
  imageUrl: string;
}
