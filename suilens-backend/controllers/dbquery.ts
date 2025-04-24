import fs from 'fs';
import Database from 'better-sqlite3';

type DB_QUERY = {
    module: string
    query: string
}



export const dbquery = ({module, query}: DB_QUERY) => {
    const dbPath = `./db/${module}.sqlite`;

    if (!fs.existsSync(dbPath)) {
        throw new Error('DB file does not exist');
    }
    const db = new Database(dbPath);
    
    const row = db.prepare(query).all();
    return row
}

const classfieragent = (data: any) => {
    //decide text or query, if it query return it 
    // if text process to query and return it
}

export const getdata = () => {
    
    //TODOs
    //multiple agents

    // trigger first classifier to decide text or query 
    // once data you got then decide which chart it should display

    const query = classfieragent(data)
    //trigger the data dbquery


}