import { SDKUrls } from '../types';

export * from './abis';

export const networkMessage = (address: string) =>
  `\nThis signature on this message will be used to access the INTMAX network. \nYour address: ${address}\nCaution: Do not sign if requested on any domain other than intmax.io`;

export const spendFundsMessage = (amount: string, address: string) =>
  `\nThis signature on this message will be used to send ETH to your mining address via INTMAX network.\n Amount: ${amount} ETH\nYour mining address: ${address}\nCaution: Do not sign if requested on any domain other than intmax.io`;

export const MAINNET_ENV: SDKUrls = {
  balance_prover_url: 'https://dev.private.zkp.intmax.xyz',
  indexer_url: 'https://dev.indexer.intmax.xyz/v1/indexer',
  validity_prover_url: 'https://dev.node.api.intmax.xyz/validity-prover',
  store_vault_server_url: 'https://dev.node.api.intmax.xyz/store-vault-server',
  withdrawal_aggregator_url: 'https://dev.node.api.intmax.xyz/withdrawal-server',
  predicate_url: 'https://dev.predicate.intmax.xyz/v1/predicate',
  chain_id_l1: 11155111,
  chain_id_l2: 534351,
  //
  liquidity_contract: '0x9e60b235CF6d6cb63670b3fFC4f98fB56ba91409',
  rollup_contract: '0xD315383e78E8dDee60e3BdaD8b278e5f10386557',
  withdrawal_contract_address: '0xC2AD2B9720330D005B137f3A841F343C60A7a2F6',
  predicate_contract_address: '0x4D9B3CF9Cb04B27C5D221c82B428D9dE990D3e3a',
  //
  rollup_contract_deployed_block_number: 8803282,
  rpc_url_l1: 'https://sepolia.gateway.tenderly.co',
  rpc_url_l2: 'https://sepolia-rpc.scroll.io',
  key_vault_url: 'https://oimhddprvflxjsumnmmg.supabase.co/functions/v1/keyvault/external',
  tokens_url: 'https://dev.token.intmax.xyz/v1',
};

export const TESTNET_ENV: SDKUrls = {
  store_vault_server_url: 'https://poc-intmax.y5.systems/store-vault-server',
  balance_prover_url: 'https://poc-intmax.y5.systems/balance-prover',
  block_builder_url: 'https://poc-intmax.y5.systems/block-builder',
  validity_prover_url: 'https://poc-intmax.y5.systems/validity-prover',
  withdrawal_aggregator_url: 'https://poc-intmax.y5.systems/withdrawal-server',
  tokens_url: 'https://poc-intmax.y5.systems/token/v1',

  liquidity_contract: '0xe80B1caECce7682Cf92d4559169F6f5FAa7b79C8',
  rollup_contract: '0xA8188e9F61803a354eed0F184ECD7b49D705C63E',
  withdrawal_contract_address: '0x3d80C1666979EcD0B9AFF4cD8aa6e2dAe1DF02DF',

  rollup_contract_deployed_block_number: 10239197,
  chain_id_l1: 84532,
  chain_id_l2: 534351,

  rpc_url_l1: '',
  rpc_url_l2: '',

  indexer_url: 'https://stage.api.indexer.intmax.io/v1/indexer',

  predicate_url: 'https://stage.api.predicate.intmax.io/v1/predicate',
  predicate_contract_address: '0x4D9B3CF9Cb04B27C5D221c82B428D9dE990D3e3a',
  key_vault_url: 'https://slxcnfhgxpfokwtathje.supabase.co/functions/v1/keyvault/external',
};

export const DEVNET_ENV: SDKUrls = {
  balance_prover_url: 'https://dev.api.private.zkp.intmax.xyz',
  indexer_url: 'https://dev.api.indexer.intmax.xyz/v1/indexer',
  validity_prover_url: 'https://dev.api.node.intmax.xyz/validity-prover',
  store_vault_server_url: 'https://dev.api.node.intmax.xyz/store-vault-server',
  withdrawal_aggregator_url: 'https://dev.api.node.intmax.xyz/withdrawal-server',
  predicate_url: 'https://dev.api.predicate.intmax.xyz/v1/predicate',
  chain_id_l1: 11155111,
  chain_id_l2: 534351,
  //
  liquidity_contract: '0xd018F2F944dFa7f8b14E6889a33AfA56B61E4A83',
  rollup_contract: '0xa91c5e8E63bc88a3f4ED9a125F3a8308C0c1aF6C',
  withdrawal_contract_address: '0x1cc9381E21BBef00dd2b2242Df5031cEd67Dd66A',
  predicate_contract_address: '0x4D9B3CF9Cb04B27C5D221c82B428D9dE990D3e3a',
  //
  rollup_contract_deployed_block_number: 9007032,
  rpc_url_l1: 'https://sepolia.gateway.tenderly.co',
  rpc_url_l2: 'https://sepolia-rpc.scroll.io',
  key_vault_url: 'https://oimhddprvflxjsumnmmg.supabase.co/functions/v1/keyvault',
  tokens_url: 'https://dev.api.token.intmax.xyz/v1',
};
