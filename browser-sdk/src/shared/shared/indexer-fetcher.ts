import { AxiosInstance } from 'axios';

import { DEVNET_ENV, MAINNET_ENV, TESTNET_ENV } from '../constants';
import { BlockBuilderResponse, IntMaxEnvironment } from '../types';
import { axiosClientInit } from '../utils';

export class IndexerFetcher {
  #url: string = '';

  readonly #httpClient: AxiosInstance;

  constructor(environment: IntMaxEnvironment) {
    const urls = environment === 'mainnet' ? MAINNET_ENV : environment === 'testnet' ? TESTNET_ENV : DEVNET_ENV;

    this.#httpClient = axiosClientInit({ baseURL: urls.indexer_url });

    if (urls.block_builder_url) {
      this.#url = urls.block_builder_url;
    }
  }

  async fetchBlockBuilderUrl(): Promise<string> {
    const data = await this.#httpClient.get<BlockBuilderResponse[], BlockBuilderResponse[]>('/builders');
    if (!data) {
      throw new Error('Failed to fetch block builder URL');
    }
    this.#url = data?.[0].url || '';

    return this.#url;
  }

  async getBlockBuilderUrl(): Promise<string> {
    if (this.#url) {
      return this.#url;
    }
    return await this.fetchBlockBuilderUrl();
  }
}
