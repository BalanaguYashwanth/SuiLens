exports.checkAndCreateTable = (db, tableName) => {
    return new Promise((resolve, reject) => {
      const checkTableQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`;
  
      db.get(checkTableQuery, (err, row) => {
        if (err) return reject(err);
  
        if (row) {
          resolve();
        } else {
          const createTableQuery = `
            CREATE TABLE ${tableName} (
              id TEXT PRIMARY KEY,
              fee INTEGER,
              description TEXT
            )
          `;
          db.run(createTableQuery, (err) => {
            if (err) return reject(err);
            resolve();
          });
        }
      });
    });
  };
  