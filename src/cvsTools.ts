import fs from 'fs';
import { createInterface } from 'readline';
import { stdin as input, stdout as output } from 'node:process';
import { format, parseFile } from 'fast-csv';

class CsvTools { 

  readCsv(pathFile: string) {
    
    const getFileData = fs.readFileSync(pathFile, 'utf8');
    const newCsv = fs.writeFileSync('newFile.csv', getFileData);
    console.log(getFileData, 'old');
    console.log(newCsv, 'new'); 
  }

  convertCsvToJson(file: string) {
    // Read file data
    const data = fs.readFileSync(file, 'utf-8');

    // Get data
    let result = [];
    const lines = data.split('\r\n');
    const headers = lines[0].split(','); 
    
    // Get line by line
    for (const line of lines) {
      const splitLine = line.split(',');
      const obj: any = {};
      
      // Join line with object key
      for (let i = 0; i < headers.length; i++) {
        obj[headers[i]] = splitLine[i];
      }
      
      result.push(obj);
    }
    
    // Returns the result
    console.log(result);
    return result;
  }

  async mergeCsvFiles(pathFile: string[], outputFilePath: string) {

    // * Return a number of promises for every files
    const promises = pathFile.map((path) => {
      return new Promise((resolve) => {
        const dataArray: string[] = [];
        return parseFile(path, { headers: true })
          .on('data', (data: any) => {
            dataArray.push(data);
          })
          .on('end', function () {
            resolve(dataArray);
          });
      });
    });
    
    // Revolver every promise and return a result on array. 
    // Promises will contain two array in this case 
    return Promise.all(promises)
      .then((results) => {
    
        const csvStream = format({ headers: true });
        // This line opens the file as a readable stream
        const writableStream = fs.createWriteStream(outputFilePath);
    
        writableStream.on('finish', function () {
          console.log('DONE!');
        });
    
        // Join cvs stream file format with a new createWriteStream file
        csvStream.pipe(writableStream);
        // Create a looping to get the results promise and write on a file
        results.forEach((result: any) => {
          result.forEach((data: any) => {
            console.log(data);
            csvStream.write(data);
          });
        });
        csvStream.end();
    
      });
    
  }


  consolePrograms() {
    const rl = createInterface({ input, output });
    rl.on('line', (res) => {
      console.log(`Received: ${res}`);
    });
  }

  async convertCsvToJsonApi(file: string) {
    // todo: Receber um arquivo csv e ler dados
    const parsePromise = new Promise((resolve) => {
      let dataArray: string[] = [];
      parseFile(file, { headers: true })
        .on('data', (cards: any) => {
          dataArray.push(cards);
        })
        .on('end', () => {
          resolve(dataArray);
        });
    });

    const api = (email: string) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(email);
        }, 3000);
      });
    };

    let data = [];
    const cards: any = await Promise.resolve(parsePromise);
    for (const card of cards) {
      data.push(await api(card.name));
    }

    

    // todo: Pegar esses dados e transformar em um json
    // todo: Pegar o json e para cada item chamar uma promise
    // * Garantir que todo o processo ira aguardr a promise resolver para buscar a pr??xima

  }

}

const result = new CsvTools();
// const files = ['planilha.csv', 'planilha2.csv'];
const file = 'cancelados.csv';
result.convertCsvToJson(file);

// concatCSVAndOutput(['one.csv', 'two.csv'], 'outputfile.csv').then(() => ...doStuff);