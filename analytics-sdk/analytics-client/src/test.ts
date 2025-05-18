import { SuilensClient } from "./client/SuilensClient";

const client = new SuilensClient();

(async () => {
  await client.init({ dbName: 'nft', tableName: 'createNFT' });
  await client.insert({id: 11, name: 'football_v11', price: 1110});
  await client.insert([{id: 14, name: 'football_v14', price: 1140}, {id: 15, name: 'football_v15', price: 1510}]);
})();
