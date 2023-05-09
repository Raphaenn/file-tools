import cp from 'child_process';

class ItConnections {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor, @typescript-eslint/no-empty-function
  constructor() {}

  async PingCurl(): Promise<void> {
    cp.exec('ping -c 3 globo.com', function (err, stdout) {
      console.log(stdout);
    });
  }
}

const response = new ItConnections();
response.PingCurl();
