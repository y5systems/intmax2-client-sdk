import { AxiosInstance } from 'axios';
import { axiosClientInit, getWithdrawHash } from '../utils';
import { LiquidityAbi, TESTNET_ENV } from '../constants';
import {
  ContractWithdrawal,
  EncryptedDataItem,
  IntMaxEnvironment,
  WithdrawalsInfoResponse,
  WithdrawalsStatus,
} from '../types';
import { Abi, createPublicClient, hexToBigInt, http, PublicClient } from 'viem';
import { mainnet, sepolia } from 'viem/chains';

interface GetTxParams {
  address: string;
  timestamp?: number;
}

export class TransactionFetcher {
  readonly #storeVaultHttpClient: AxiosInstance;
  readonly #withdrawalHttpClient: AxiosInstance;
  readonly #publicClient: PublicClient;
  readonly #liquidityContractAddress: string;

  constructor(environment: IntMaxEnvironment) {
    this.#liquidityContractAddress =
      environment === 'mainnet' ? TESTNET_ENV.liquidity_contract : TESTNET_ENV.liquidity_contract;

    this.#storeVaultHttpClient = axiosClientInit({
      baseURL: environment === 'mainnet' ? TESTNET_ENV.store_vault_server_url : TESTNET_ENV.store_vault_server_url,
    });

    this.#withdrawalHttpClient = axiosClientInit({
      baseURL: `${environment === 'mainnet' ? TESTNET_ENV.withdrawal_aggregator_url : TESTNET_ENV.withdrawal_aggregator_url}/withdrawal-server`,
    });

    this.#publicClient = createPublicClient({
      chain: environment === 'mainnet' ? mainnet : sepolia,
      transport: http(),
    });
  }

  async fetchTx({ address, timestamp = 0 }: GetTxParams): Promise<EncryptedDataItem[]> {
    return this.#storeVaultHttpClient.get<EncryptedDataItem[], EncryptedDataItem[]>(
      '/store-vault-server/tx/get-all-after',
      {
        params: {
          timestamp,
          pubkey: hexToBigInt(address as `0x${string}`),
        },
      },
    );
  }

  async fetchTransfers({ address, timestamp = 0 }: GetTxParams): Promise<EncryptedDataItem[]> {
    return await this.#storeVaultHttpClient.get<EncryptedDataItem[], EncryptedDataItem[]>(
      '/store-vault-server/transfer/get-all-after',
      {
        params: {
          timestamp,
          pubkey: hexToBigInt(address as `0x${string}`),
        },
      },
    );
  }

  async fetchDeposits({ address, timestamp = 0 }: GetTxParams): Promise<EncryptedDataItem[]> {
    return await this.#storeVaultHttpClient.get<EncryptedDataItem[], EncryptedDataItem[]>(
      '/store-vault-server/deposit/get-all-after',
      {
        params: {
          timestamp,
          pubkey: hexToBigInt(address as `0x${string}`),
        },
      },
    );
  }

  async fetchPendingWithdrawals(address: string): Promise<Record<WithdrawalsStatus, ContractWithdrawal[]>> {
    const pendingWithdrawals = {
      [WithdrawalsStatus.Failed]: [] as ContractWithdrawal[],
      [WithdrawalsStatus.NeedClaim]: [] as ContractWithdrawal[],
      [WithdrawalsStatus.Relayed]: [] as ContractWithdrawal[],
      [WithdrawalsStatus.Requested]: [] as ContractWithdrawal[],
      [WithdrawalsStatus.Success]: [] as ContractWithdrawal[],
    };

    const rawWithdrawals = await this.#withdrawalHttpClient.get<WithdrawalsInfoResponse, WithdrawalsInfoResponse>(
      '/get-withdrawal-info',
      {
        params: {
          pubkey: hexToBigInt(address as `0x${string}`),
          signature: [
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          ],
        },
      },
    );

    rawWithdrawals.withdrawalInfo.forEach((withdrawal) => {
      pendingWithdrawals[withdrawal.status as WithdrawalsStatus].push(withdrawal.contractWithdrawal);
    });

    pendingWithdrawals[WithdrawalsStatus.NeedClaim] = Array.from(
      new Map(pendingWithdrawals[WithdrawalsStatus.NeedClaim].map((w) => [w.nullifier, w])).values(),
    );

    if (pendingWithdrawals[WithdrawalsStatus.NeedClaim].length > 0) {
      const withdrawalHashes = new Set(pendingWithdrawals[WithdrawalsStatus.NeedClaim].map(getWithdrawHash));
      const results = await this.#publicClient.multicall({
        contracts: [...withdrawalHashes].map((hash) => ({
          abi: LiquidityAbi as Abi,
          address: this.#liquidityContractAddress as `0x${string}`,
          functionName: 'claimableWithdrawals',
          args: [hash],
        })),
      });
      const updatedWithdrawalsToClaim: ContractWithdrawal[] = [];
      results.forEach((result: any, i: number) => {
        if (result.status === 'success' && result.result) {
          updatedWithdrawalsToClaim.push({
            ...pendingWithdrawals[WithdrawalsStatus.NeedClaim][i],
          });
        }
      });
      pendingWithdrawals[WithdrawalsStatus.NeedClaim] = updatedWithdrawalsToClaim;
    }

    return pendingWithdrawals;
  }
}
