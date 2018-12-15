'use strict';

import * as moment from 'moment';

export interface IFixerRates {
  readonly [currency: string]: number;
}

export interface IFixerResponse {
  readonly base: string;
  readonly date: string;
  readonly rates: IFixerRates;
  readonly error?: {
    type: string,
    info: string
  };
}

export interface IRequestOptions {
  base?: string;
  symbols?: string[];
  access_key: string;
}

export interface IBasicOptions {
  baseUrl: string;
  accessKey?: string;
}

export abstract class Fixer {
  protected basicOptions: IBasicOptions;

  constructor(opts: Partial<IBasicOptions> = {}) {
    this.basicOptions = {
      baseUrl: opts.baseUrl || 'http://data.fixer.io/api',
      accessKey: opts.accessKey
    };
  }

  set({ baseUrl, accessKey }: Partial<IBasicOptions> = {}): Fixer {
    this.basicOptions.baseUrl = baseUrl || this.basicOptions.baseUrl;
    this.basicOptions.accessKey = accessKey || this.basicOptions.accessKey;
    return this;
  }

  async forDate(date: Date | string, opts?: Partial<IRequestOptions>): Promise<IFixerResponse> {
    let formattedDate;

    const RE_DATE = /^\d{4}-\d{2}-\d{2}$/;
    if (typeof date === 'string' && RE_DATE.test(date)) {
      formattedDate = date;
    } else if (date instanceof Date) {
      formattedDate = moment(date).format('YYYY-MM-DD');
    } else {
      throw new Error('Invalid date argument');
    }

    return this.request(`/${formattedDate}`, this.filterOptions(opts));
  }

  async latest(opts?: Partial<IRequestOptions>): Promise<IFixerResponse> {
    return this.request('/latest', this.filterOptions(opts));
  }

  private filterOptions(
    { base, symbols, access_key: accessKey }: Partial<IRequestOptions> = {}
  ): IRequestOptions {
    const maybeAccessKey = accessKey || this.basicOptions.accessKey;

    if (!maybeAccessKey) {
      throw new Error('access_key is required to use fixer');
    }

    return {
      ...(base ? { base } : {}),
      ...(symbols ? { symbols } : {}),
      access_key: maybeAccessKey
    };
  }

  protected abstract request(url: string, opts: any): Promise<IFixerResponse>;
}
