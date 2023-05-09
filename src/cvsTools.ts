import fs, { WriteStream } from 'fs';
import path from 'path';
// import { createInterface } from 'readline';
// import { stdin as input, stdout as output } from 'node:process';
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

  convertJsonToCsv(file: string) {
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
    
    // // Returns the result
    // console.log(result);

    // // choose another string to temporally replace commas if necessary
    // let stringToReplaceComas = '!!!!';

    // myObj.rows.map((singleRow) => {
    //   singleRow.map((value, index) => {
    //     singleRow[index] = value.replace(/,/g, stringToReplaceComas);
    //   });
    // });

    // let csv = `"${myObj.rows.join('"\n"').replace(/,/g, '","')}"`;
    // // // or like this
    // // let csv = `"${myObj.rows.join('"\n"').split(',').join('","')}"`;

    // csv = csv.replace(new RegExp(`${stringToReplaceComas}`, 'g'), ',');

    // // // 2. Another way - if you don't need the double quotes in the generated csv and you don't have comas in rows' values
    // // let csv = myObj.rows.join('\n')

    // fs.writeFile('name.csv', csv, 'utf8', function (err) {
    //   if (err) {
    //     console.log('Some error occured - file either not saved or corrupted file saved.');
    //   } else {
    //     console.log('It\'s saved!');
    //   }
    // });

    return result;
  }

  async mergeCsvFiles(pathFile: string[], outputFilePath: string) {

    // * Return a number of promises for every files
    const promises = pathFile.map((paths) => {
      return new Promise((resolve) => {
        const dataArray: string[] = [];
        return parseFile(paths, { headers: true })
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

  async convertCsvToJsonApi(file: string, fileName: string) {
    const parsePromise: Promise<string[]> = new Promise((resolve) => {
      let dataArray: string[] = [];
      parseFile(file, { headers: true })
        .on('data', (purchase: any) => {
          dataArray.push(purchase);
        })
        .on('end', () => {
          resolve(dataArray);
        });
    });
    const allItens: string[] = await parsePromise;

    const jsonFile = fs.writeFileSync(`${fileName}.json`, JSON.stringify(allItens));
    return jsonFile;
  }

  async mergeFilesFromPath(folder: string, destine: string) {
    const files = fs.readdirSync(folder);
    const validFiles = files.filter((i) => i.includes('.csv'));
    const promise = validFiles.map((file) => {
      return new Promise((resolve) => {
        const dataArray: string[] = [];
        const filePath = path.join(folder);
        return parseFile(`${filePath}/${file}`, { headers: true })
          .on('data', (data: any) => {
            dataArray.push(data);
          })
          .on('end', () => {
            resolve(dataArray);
          });
      });
    });
    const results = await Promise.all(promise);
    
    const csvStream = format({ headers: true });
    // create csv file with defined name
    const writebleStream = fs.createWriteStream(destine);
    csvStream.pipe(writebleStream);

    // loopinng to write result promise inside a csv file
    results.forEach((element: any) => {
      element.forEach((data: any) => {
        csvStream.write(data);
      });
    });
    csvStream.end();
    
  }

  async saveStringIntoTextFile(fileName: string, text: string): Promise<boolean> {
    // todo - create the file
    
    //todo - write the text inside the file
    const writeData = fs.createWriteStream(fileName).write(text);

    return writeData.valueOf();
  }

}

const result = new CsvTools();
result.convertCsvToJsonApi('pix.csv', 'pix');
// result.mergeFilesFromPath('/Users/raphaelneves/Desktop/pix', 'pix.csv');
// result.saveStringIntoTextFile('dock.txt', 'Csv from dock that contain the callback of function.');
// const files = '/Users/raphaelneves/Desktop/purchases';

// concatCSVAndOutput(['one.csv', 'two.csv'], 'outputfile.csv').then(() => ...doStuff);