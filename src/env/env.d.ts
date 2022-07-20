import { selfENV } from "./interface.t"
declare global {
  namespace NodeJS {
    interface ProcessEnv extends selfENV {
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      PWD: string;
    }  
  }
}

export { }