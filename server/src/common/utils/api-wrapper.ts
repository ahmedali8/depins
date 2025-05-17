import axios from 'axios';
import { Logger } from '@nestjs/common';
import { AppException } from '../exceptions/app-exception';

const logger = new Logger('ApiWrapper');

export async function safeApiCall<T>(
  request: () => Promise<T>,
  errorMessage = 'Third-party API failed',
  key?: string,
): Promise<T> {
  try {
    const timeLogId = Math.floor(Math.random() * 1000000);
    const timeLog = `⏳ ${timeLogId} ${key ? `(${key})` : ''}`;

    key && console.time(timeLog);
    const res = await request();
    key && console.timeEnd(timeLog);

    return res;
  } catch (error) {
    console.log('🚀 ~ error:', error.response?.data);
    logger.error(`❌ API Error: ${error.message}`, error.stack);

    if (axios.isAxiosError(error)) {
      throw new AppException(
        errorMessage,
        'EXTERNAL_API_ERROR',
        error.response?.status || 500,
      );
    }

    throw new AppException('Internal Server Error', 'INTERNAL_ERROR', 500);
  }
}
