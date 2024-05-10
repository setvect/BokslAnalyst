import PouchdbExample from '../main/service/PouchdbExample';

async function main() {
  console.log('Hello, world!');
  PouchdbExample.example();
}

main()
  .then(() => console.log('Done'))
  .catch((err) => console.error(err));
