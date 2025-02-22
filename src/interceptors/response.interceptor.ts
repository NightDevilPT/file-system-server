import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiResponse, MetaData } from 'src/interfaces/response.interface';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();

    return next.handle().pipe(
      map((data: any) => {
        const statusCode = response.statusCode || 200; // Get HTTP status code
        console.log(data, 'Intercepted Response'); // Debugging log

        // Handle different response structures
        let extractedData = data?.data ?? data; // If response has `data`, use it; otherwise, use `data` as it is
        const message = data?.message ?? 'Operation completed successfully';

        // Extract metadata if available (from `meta` or `metadata`)
        const metadata: MetaData | undefined = data?.meta || data?.metadata;

        // Remove metadata from the main data object if it exists inside `data`
        if (data?.metadata) {
          delete extractedData.metadata;
        }

        const formattedResponse: ApiResponse<T> = {
          status: 'success',
          statusCode: statusCode,
          data: extractedData as T, // Extract actual data
          message: message,
        };

        // Include metadata if available
        if (metadata) {
          formattedResponse.meta = {
            totalCount: metadata.totalCount ?? 0,
            totalPages: metadata.totalPages ?? 0,
            nextPage: metadata.nextPage ?? null,
            previousPage: metadata.previousPage ?? null,
            ...metadata, // Include any additional metadata fields
          } as MetaData;
        }

        return formattedResponse;
      }),
    );
  }
}
