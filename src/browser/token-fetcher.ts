import { IntMaxEnvironment, PaginatedResponse, Token, TokenType } from '../types';
import { axiosClientInit } from '../utils';
import { liquidityAbiNft, TESTNET_ENV } from '../constants';
import { AxiosInstance } from 'axios';
import { Abi, createPublicClient, http, PublicClient } from 'viem';
import { mainnet, sepolia } from 'viem/chains';

export class TokenFetcher {
  tokens: Token[] = [];

  #intervalId: number | null | NodeJS.Timeout = null;
  readonly #httpClient: AxiosInstance;
  readonly #liquidityContractAddress: string;
  readonly #publicClient: PublicClient;

  constructor(environment: IntMaxEnvironment) {
    this.#liquidityContractAddress =
      environment === 'mainnet' ? TESTNET_ENV.liquidity_contract : TESTNET_ENV.liquidity_contract;

    this.#httpClient = axiosClientInit({
      baseURL: environment === 'mainnet' ? TESTNET_ENV.tokens_url : TESTNET_ENV.tokens_url,
    });

    this.#publicClient = createPublicClient({
      chain: environment === 'mainnet' ? mainnet : sepolia,
      transport: http(),
    });

    this.fetchTokens();

    this.#startPeriodicUpdate(60000);
  }

  async fetchTokens() {
    let cursor: string | null = null;
    let fetchAgain = true;
    this.tokens = [];

    while (fetchAgain) {
      const data = await this.#fetchTokens(cursor);
      this.tokens = [...this.tokens, ...data.items];
      cursor = data.nextCursor;
      if (!cursor) {
        fetchAgain = false;
      }
    }

    return this.tokens;
  }

  async getTokensById(tokenIds: number[]): Promise<
    (
      | {
          error?: undefined;
          result: {
            tokenType: TokenType;
            tokenAddress: string;
            tokenId: number;
          };
          status: 'success';
        }
      | { error: Error; result?: undefined; status: 'failure' }
    )[]
  > {
    const contracts = tokenIds.map((id) => ({
      abi: liquidityAbiNft as Abi,
      address: this.#liquidityContractAddress as `0x${string}`,
      functionName: 'getTokenInfo',
      args: [id],
    }));

    const multicallResults = await this.#publicClient.multicall({
      contracts,
    });

    return multicallResults as (
      | {
          error?: undefined;
          result: {
            tokenType: TokenType;
            tokenAddress: string;
            tokenId: number;
          };
          status: 'success';
        }
      | { error: Error; result?: undefined; status: 'failure' }
    )[];
  }

  // PRIVATE METHODS

  #startPeriodicUpdate(interval: number) {
    if (this.#intervalId) {
      clearInterval(this.#intervalId);
    }
    this.#intervalId = setInterval(async () => {
      await this.fetchTokens();
      console.info('Tokens updated');
    }, interval);
  }

  async #fetchTokens(cursor: string | null): Promise<PaginatedResponse<Token>> {
    return this.#httpClient.get<PaginatedResponse<Token>, PaginatedResponse<Token>>('/token-mappings/list', {
      params: {
        perPage: 100,
        cursor,
      },
    });
  }
}
