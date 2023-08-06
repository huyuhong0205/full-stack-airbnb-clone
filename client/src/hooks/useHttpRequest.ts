/* React */
import { useCallback, useEffect, useRef, useState } from 'react';

/* Types */
import type { THttpError } from '../types/type-http-res-body';

/* //////////////////////////////////////////////////////////////// */
export default function useHttpRequest() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [httpError, setHttpError] = useState<THttpError | null>(null);

  // Record all unsolved request
  const activeHttpRequests = useRef<AbortController[]>([]);

  // Cancel all unsolved request, when the component that use this hook unmount
  useEffect(() => {
    // Run before next useEffect execute or component that use this hook unmount
    return () => {
      activeHttpRequests.current.forEach((AbortControl) =>
        AbortControl.abort()
      );
    };
  }, []);

  // Use build-in fetch send request, if no error return body, if has error setError and throw
  const sendHttpRequest = useCallback(
    async (
      url: string,
      options?: {
        method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
        headers?: HeadersInit;
        body?: BodyInit;
      }
    ) => {
      // add current request to activeHttpRequests
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      // Create a promise that resolves with a timeout error after the specified duration
      const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('Request timeout'));
        }, Number(import.meta.env.VITE_HTTP_TIMEOUT));
      });

      // (1) fetch data and parse response body
      const fetchPromise = fetch(`${import.meta.env.VITE_SERVER_API}${url}`, {
        // mode: 'cors',
        method: options?.method || 'GET',
        headers: options?.headers || {},
        body: options?.body || null,
        credentials: 'include', // Important for including cookies
      });

      setIsLoading(true);

      try {
        const res = (await Promise.race([
          fetchPromise,
          timeoutPromise,
        ])) as Response;
        const body = await res.json();

        // (2) if has error throw error
        if (!res.ok) {
          setHttpError(body as THttpError);
          throw body;
        }

        // (3) if no error return response body
        setIsLoading(false);
        return body;

        //
      } catch (error) {
        if ((error as Error)?.message === 'Request timeout')
          setHttpError({
            status: 'fail',
            statusCode: 408,
            message:
              'The request is taking too long. Please try again later. If the error persists, please contact me.',
          });

        if ((error as Error)?.message === 'Failed to fetch')
          setHttpError({
            status: 'error',
            statusCode: 500,
            message:
              'Failed to fetch. Please try again later. If the error persists, please contact me.',
          });
      }

      setIsLoading(false);

      // When request solved filter out solved request
      activeHttpRequests.current = activeHttpRequests.current.filter(
        (reqCtrl) => reqCtrl !== httpAbortCtrl
      );

      throw new Error();
    },
    []
  );

  return { isLoading, httpError, sendHttpRequest };
}
