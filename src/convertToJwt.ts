import fs from 'fs';
import Jwt from 'jsonwebtoken';

class JwtTools {
  private readonly key;

  constructor(key: string) {
    this.key = key;
  }

  simpleJwt(value: string): string {
    const encode = Jwt.sign(value, this.key);
    return encode;
  }

  encodeImage(filePath: string): string | Buffer {
    const files = fs.readFileSync(filePath);
    // const token = Jwt.sign(files, this.key);
    const opa = files.toString('base64');
    
    return opa;
  }
}

const token = 'dsada';

const call = new JwtTools(token);
// const res = call.simpleJwt('Raphael nascimento neves');
const res = call.encodeImage('./image.png');
console.log(res);