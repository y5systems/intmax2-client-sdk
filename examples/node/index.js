const { IntMaxNodeClient, TokenType } = require('intmax2-client-sdk');
const dotenv = require('dotenv');
dotenv.config();


const main = async () => {
  try {
    // Initialize client
    console.log('Initializing client...');
    const client = new IntMaxNodeClient({
      environment: 'devnet',
      eth_private_key: process.env.ETH_PRIVATE_KEY,
    });

    // Login
    console.log('Logging in...');
    await client.login();
    console.log('Logged in successfully');
    console.log('Address:', client.address);

    // Fetch and display balances
    console.log('\nFetching balances...');
    const { balances } = await client.fetchTokenBalances();
    console.log('Balances:');
    balances.forEach((balance) => {
      console.log(JSON.stringify(balance, (_, v) => (typeof v === 'bigint' ? v.toString() : v), 2));
    });

    // Example deposit
    console.log('\nPreparing deposit...');
    const tokens = await client.getTokensList();
    const nativeToken = tokens.find(
      (t) => t.contractAddress.toLowerCase() === '0x0000000000000000000000000000000000000000',
    );

    if (nativeToken) {
      const token = {
        ...nativeToken,
        tokenType: TokenType.NATIVE,
      };

      // Estimate deposit gas
      const gas = await client.estimateDepositGas({
        amount: 0.001,
        token,
        address: client.address,
        isGasEstimation: true,
      });
      console.log('Estimated gas for deposit:', gas);

      // Perform deposit
      console.log('Performing deposit...');
      const deposit = await client.deposit({
        amount: 0.001,
        token,
        address: client.address,
      });
      console.log('Deposit result:', JSON.stringify(deposit, null, 2));
    }

    // // Example withdrawal
    // console.log('\nPreparing withdrawal...');
    // const { balances: updatedBalances } = await client.fetchTokenBalances();
    // const availableTokens = updatedBalances.filter((b) => b.amount > 0);
    //
    // if (availableTokens.length > 0) {
    //   const withdrawToken = availableTokens[0];
    //   console.log('Performing withdrawal...');
    //   const withdraw = await client.withdraw({
    //     amount: 0.0005,
    //     token: withdrawToken.token,
    //     address: client.address,
    //   });
    //   console.log('Withdrawal result:', JSON.stringify(withdraw, null, 2));
    // } else {
    //   console.log('No tokens available for withdrawal');
    // }

    // Fetch transaction history
    console.log('\nFetching transaction history...');
    const [deposits, receiveTxs, sendTxs] = await Promise.all([
      client.fetchDeposits({}),
      client.fetchTransfers({}),
      client.fetchTransactions({}),
    ]);

    console.log('\nTransaction History:');
    console.log('Deposits:', JSON.stringify(deposits, null, 2));
    console.log('Received Transfers:', JSON.stringify(receiveTxs, null, 2));
    console.log('Sent Transfers:', JSON.stringify(sendTxs, null, 2));

    // Logout
    console.log('\nLogging out...');
    await client.logout();
    console.log('Logged out successfully');
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

main();
