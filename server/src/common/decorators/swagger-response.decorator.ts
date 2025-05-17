import { applyDecorators, RequestMethod } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponseNoStatusOptions,
  ApiCreatedResponse,
} from '@nestjs/swagger';

export function SwaggerApiResponse(
  requestMethod: RequestMethod,
  description: string,
  responseType: any,
  isAuthenticated = false,
  successParams?: ApiResponseNoStatusOptions,
  failParams?: ApiResponseNoStatusOptions,
) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const swaggerDecorators = [
      ApiInternalServerErrorResponse({
        description: 'An error occurred while processing the request',
        ...(failParams || {}),
      }),
      ApiOperation({
        summary: `- ${description}`, // Dynamic summary
      }),
    ];

    if (
      requestMethod === RequestMethod.POST ||
      requestMethod === RequestMethod.PATCH
    ) {
      swaggerDecorators.unshift(
        ApiCreatedResponse({
          description: `: ${description}`, // Add method dynamically
          type: responseType,
          ...(successParams || {}),
        }),
      );
    } else {
      swaggerDecorators.unshift(
        ApiOkResponse({
          description: `: ${description}`, // Add method dynamically
          type: responseType,
          ...(successParams || {}),
        }),
      );
    }

    if (isAuthenticated) {
      swaggerDecorators.unshift(ApiBearerAuth('access-token'));
      swaggerDecorators.push(
        ApiUnauthorizedResponse({
          description: 'Unauthorized - Invalid or missing JWT',
        }),
      );
    }

    // Apply common Swagger decorators
    applyDecorators(...swaggerDecorators)(target, propertyKey, descriptor);
  };
}
