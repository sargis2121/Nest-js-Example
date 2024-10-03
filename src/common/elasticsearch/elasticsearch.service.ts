import { Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ElasticsearchService {
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
    });
  }

  async search(index: string, query: any) {
    return await this.client.search({
      index,
      body: query,
    });
  }

  async indexDocument(index: string, id: string, document: any) {
    return await this.client.index({
      index,
      id,
      body: document,
    });
  }

  async deleteDocument(index: string, id: string) {
    return await this.client.delete({
      index,
      id,
    });
  }
}
