import { SuilensClient } from "./client/SuilensClient";

const client = new SuilensClient();

(async () => {
  await client.init({ dbName: 'nft', tableName: 'createNFT' });
  await client.insert({id: 11, name: 'football_v11', price: 1110});
  await client.insert([{id: 14, name: 'football_v14', price: 1140}, {id: 15, name: 'football_v15', price: 1510}]);
  await client.update({ match: { id: 11 }, update: { name: 'football_v11_updated', price: 1200 } }); // Updating one record by id
  await client.update({ match: { price: 1140 }, update: { price: 1150 } }); // Updating multiple records using price
  await client.delete({ id: 15 }); // Deleting one record by id
  await client.delete({ price: 1150 }); // Deleting all records with price 1150  
  await client.delete(); // Deleting entire table
})();
