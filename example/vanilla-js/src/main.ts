import './style.css';
import { IntMaxClient } from 'intmax2-client-sdk';

const client = await IntMaxClient.init({ environment: 'testnet' });

async function ff() {
  console.log('client', client);
  const login = await client.login();
  console.log(login);
  // const pk = await client.getPrivateKey();
  // console.log(pk);

  const { balances } = await client.fetchTokenBalances();
  console.log('balances', balances);

  const gas = await client.estimateDepositGas({
    amount: 1001,
    token: balances[1].token,
    address: client.address,
    isGasEstimation: true,
  });
  console.log(gas);

  // const deposit = await client.deposit({
  //   amount: 100,
  //   token: balances[1].token,
  //   address: client.address,
  // });
  // console.log(deposit);

  const deposits = await client.fetchDeposits({});
  console.log('deposits', deposits);

  const receiveTxs = await client.fetchTransfers({});
  console.log('receiveTxs', receiveTxs);

  const send = await client.fetchTransactions({});
  console.log('send', send);

  // const resp = await client.broadcastTransaction([
  //   {
  //     amount: 10,
  //     address: '0x25eef1e63358732a96a0b66b26fbf7ec80c8d72cace88f364ccf1960dd70dd61',
  //     token: balances[3].token,
  //   },
  // ]);
  // console.log('broadcastTransaction', resp);
}

ff();
