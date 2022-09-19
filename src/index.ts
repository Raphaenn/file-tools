import { ConnectSentry } from './sentry';

class ExecuteQuery {

  async getSpdReport() {
    const connect = new ConnectSentry();
    try {
      const result = await connect.get(process.argv[2]); 
      console.log(result);
      return result;
    } catch (error: any) {
      console.error(error);
    }
  }
}

const exec = new ExecuteQuery();
exec.getSpdReport();