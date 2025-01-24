/* tslint:disable */
/* eslint-disable */
/**
 * Generate a new key pair from the given ethereum private key (32bytes hex string).
 */
export function generate_intmax_account_from_eth_key(eth_private_key: string): Promise<IntmaxAccount>;
/**
 * Function to take a backup before calling the deposit function of the liquidity contract.
 *
 * You can also get the pubkey_salt_hash from the return value.
 */
export function prepare_deposit(config: Config, recipient: string, amount: string, token_type: number, token_address: string, token_id: string): Promise<JsDepositResult>;
/**
 * Function to send a tx request to the block builder. The return value contains information to take a backup.
 */
export function send_tx_request(config: Config, block_builder_url: string, private_key: string, transfers: (JsTransfer)[]): Promise<JsTxRequestMemo>;
/**
 * Function to query the block proposal from the block builder.
 * The return value is the block proposal or null if the proposal is not found.
 * If got an invalid proposal, it will return an error.
 */
export function query_proposal(config: Config, block_builder_url: string, private_key: string, is_registration_block: boolean, tx: JsTx): Promise<JsBlockProposal | undefined>;
/**
 * Send the signed tx tree root to the block builder during taking a backup of the tx.
 *
 * You need to call send_tx_request before calling this function.
 * The return value is the tx result, which contains the tx tree root and transfer data.
 */
export function finalize_tx(config: Config, block_builder_url: string, private_key: string, tx_request_memo: JsTxRequestMemo, proposal: JsBlockProposal): Promise<JsTxResult>;
/**
 * Batch function of query_proposal and finalize_tx.
 */
export function query_and_finalize(config: Config, block_builder_url: string, private_key: string, tx_request_memo: JsTxRequestMemo): Promise<JsTxResult>;
/**
 * Synchronize the user's balance proof. It may take a long time to generate ZKP.
 */
export function sync(config: Config, private_key: string): Promise<void>;
/**
 * Synchronize the user's withdrawal proof, and send request to the withdrawal aggregator.
 * It may take a long time to generate ZKP.
 */
export function sync_withdrawals(config: Config, private_key: string): Promise<void>;
/**
 * Get the user's data. It is recommended to sync before calling this function.
 */
export function get_user_data(config: Config, private_key: string): Promise<JsUserData>;
/**
 * Decrypt the deposit data.
 */
export function decrypt_deposit_data(private_key: string, data: Uint8Array): Promise<JsDepositData>;
/**
 * Decrypt the transfer data. This is also used to decrypt the withdrawal data.
 */
export function decrypt_transfer_data(private_key: string, data: Uint8Array): Promise<JsTransferData>;
/**
 * Decrypt the tx data.
 */
export function decrypt_tx_data(private_key: string, data: Uint8Array): Promise<JsTxData>;
export class Config {
  free(): void;
  constructor(store_vault_server_url: string, balance_prover_url: string, validity_prover_url: string, withdrawal_server_url: string, deposit_timeout: bigint, tx_timeout: bigint, block_builder_request_interval: bigint, block_builder_request_limit: bigint, block_builder_query_wait_time: bigint, block_builder_query_interval: bigint, block_builder_query_limit: bigint, l1_rpc_url: string, l1_chain_id: bigint, liquidity_contract_address: string, l2_rpc_url: string, l2_chain_id: bigint, rollup_contract_address: string, rollup_contract_deployed_block_number: bigint);
  /**
   * URL of the store vault server
   */
  store_vault_server_url: string;
  /**
   * URL of the balance prover
   */
  balance_prover_url: string;
  /**
   * URL of the block validity prover
   */
  validity_prover_url: string;
  /**
   * URL of the withdrawal aggregator
   */
  withdrawal_server_url: string;
  /**
   * Time to reach the rollup contract after taking a backup of the deposit
   * If this time is exceeded, the deposit backup will be ignored
   */
  deposit_timeout: bigint;
  /**
   * Time to reach the rollup contract after sending a tx request
   * If this time is exceeded, the tx request will be ignored
   */
  tx_timeout: bigint;
  /**
   * Interval between retries for tx requests
   */
  block_builder_request_interval: bigint;
  /**
   * Maximum number of retries for tx requests,
   */
  block_builder_request_limit: bigint;
  /**
   * Initial wait time for tx query
   */
  block_builder_query_wait_time: bigint;
  /**
   * Interval between retries for tx queries
   */
  block_builder_query_interval: bigint;
  /**
   * Maximum number of retries for tx queries
   */
  block_builder_query_limit: bigint;
  /**
   * URL of the Ethereum RPC
   */
  l1_rpc_url: string;
  /**
   * Chain ID of the Ethereum network
   */
  l1_chain_id: bigint;
  /**
   * Address of the liquidity contract
   */
  liquidity_contract_address: string;
  /**
   * URL of the Scroll RPC
   */
  l2_rpc_url: string;
  /**
   * Chain ID of the Scroll network
   */
  l2_chain_id: bigint;
  /**
   * Address of the rollup contract
   */
  rollup_contract_address: string;
  /**
   * Scroll block number when the rollup contract was deployed
   */
  rollup_contract_deployed_block_number: bigint;
}
export class IntmaxAccount {
  private constructor();
  free(): void;
  privkey: string;
  pubkey: string;
}
export class JsBlockProposal {
  private constructor();
  free(): void;
  tx_tree_root(): string;
}
export class JsContractWithdrawal {
  free(): void;
  constructor(recipient: string, token_index: number, amount: string, nullifier: string);
  hash(): string;
  recipient: string;
  token_index: number;
  amount: string;
  nullifier: string;
}
export class JsDepositData {
  private constructor();
  free(): void;
  deposit_salt: string;
  pubkey_salt_hash: string;
  amount: string;
  token_type: number;
  token_address: string;
  token_id: string;
}
export class JsDepositResult {
  private constructor();
  free(): void;
  deposit_data: JsDepositData;
  deposit_uuid: string;
}
export class JsGenericAddress {
  free(): void;
  constructor(is_pubkey: boolean, data: string);
  /**
   * true if pubkey, false if ethereum address
   */
  is_pubkey: boolean;
  /**
   * hex string of 32 bytes (pubkey) or 20 bytes (ethereum address)
   */
  data: string;
}
export class JsTransfer {
  free(): void;
  constructor(recipient: JsGenericAddress, token_index: number, amount: string, salt: string);
  to_withdrawal(): JsContractWithdrawal;
  recipient: JsGenericAddress;
  token_index: number;
  amount: string;
  salt: string;
}
export class JsTransferData {
  private constructor();
  free(): void;
  sender: string;
  transfer: JsTransfer;
}
export class JsTx {
  private constructor();
  free(): void;
  transfer_tree_root: string;
  nonce: number;
}
export class JsTxData {
  private constructor();
  free(): void;
  tx: JsTx;
  transfers: (JsTransfer)[];
}
export class JsTxRequestMemo {
  private constructor();
  free(): void;
  tx(): JsTx;
  is_registration_block(): boolean;
}
export class JsTxResult {
  private constructor();
  free(): void;
  tx_tree_root: string;
  transfer_data_vec: (JsTransferData)[];
  withdrawal_data_vec: (JsTransferData)[];
  transfer_uuids: (string)[];
  withdrawal_uuids: (string)[];
}
export class JsUserData {
  private constructor();
  free(): void;
  /**
   * The user public key
   */
  pubkey: string;
  /**
   * The block number of the user data
   */
  block_number: number;
  /**
   * The token balances of the user
   */
  balances: (TokenBalance)[];
  /**
   * The private commitment of the user
   */
  private_commitment: string;
  /**
   * The last unix timestamp of processed deposits
   */
  deposit_lpt: bigint;
  /**
   * The last unix timestamp of processed transfers
   */
  transfer_lpt: bigint;
  /**
   * The last unix timestamp of processed txs
   */
  tx_lpt: bigint;
  /**
   * The last unix timestamp of processed withdrawals
   */
  withdrawal_lpt: bigint;
  /**
   * Uuids of processed deposits
   */
  processed_deposit_uuids: (string)[];
  /**
   * Uuids of processed transfers
   */
  processed_transfer_uuids: (string)[];
  /**
   * Uuids of processed txs
   */
  processed_tx_uuids: (string)[];
  /**
   * Uuids of processed withdrawals
   */
  processed_withdrawal_uuids: (string)[];
}
export class TokenBalance {
  private constructor();
  free(): void;
  /**
   * Token index of the balance
   */
  token_index: number;
  /**
   * The amount of the token. 10 base string
   */
  amount: string;
  /**
   * Flag indicating whether the balance is insufficient for that token index.
   * If true, subsequent transfers or withdrawals for that token index will be impossible.
   */
  is_insufficient: boolean;
}
