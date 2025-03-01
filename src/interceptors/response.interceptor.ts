import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    const response: Response = httpContext.getResponse();

    return next.handle().pipe(
      map((data: any) => {
        // ✅ Get dynamic status code (default to 200)
        const statusCode = data?.statusCode || response.statusCode || 200;

        console.log(data, 'Intercepted Response'); // Debugging log

        // ✅ Extract tokens if present
        const accessToken = data?.data?.accessToken;
        const refreshToken = data?.data?.refreshToken;

        // ✅ Set tokens in HTTP-only cookies (Secure)
        if (accessToken) {
          response.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 10 * 60 * 1000, // 10 minutes
          });
        }

        if (refreshToken) {
          response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 minutes
          });
        }

        // ✅ Remove tokens from the response body
        if (data?.data) {
          delete data.data.accessToken;
          delete data.data.refreshToken;
        }

        // ✅ Extract actual data and message
        const extractedData = data?.data ?? data;
        const message = data?.message ?? 'Operation completed successfully';

        // ✅ Extract metadata if available
        const metadata: MetaData | undefined = data?.meta || data?.metadata;
        if (data?.metadata) {
          delete extractedData.metadata;
        }

        // ✅ Construct the final response
        const formattedResponse: ApiResponse<T> = {
          status: 'success',
          statusCode: statusCode,
          data: extractedData as T,
          message: message,
        };

        // ✅ Include metadata if available
        if (metadata) {
          formattedResponse.meta = {
            totalCount: metadata.totalCount ?? 0,
            totalPages: metadata.totalPages ?? 0,
            nextPage: metadata.nextPage ?? null,
            previousPage: metadata.previousPage ?? null,
            ...metadata,
          } as MetaData;
        }

        console.log(formattedResponse, 'Formatted Response'); // Debugging log

        // ✅ Use `res.json()` to send the response dynamically
        response.status(statusCode).json(formattedResponse);

        // ✅ Return an empty observable because `res.json()` already sends the response
        return null as unknown as ApiResponse<T>;
      }),
    );
  }
}
