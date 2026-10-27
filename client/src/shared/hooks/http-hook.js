import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef(new Set());

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);

      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.add(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            responseData.message || "Something went wrong, please try again."
          );
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        // Aborted requests belong to an unmounted component, so stay quiet
        if (err.name !== "AbortError") {
          setError(
            err instanceof TypeError
              ? "Could not reach the server, please check your connection."
              : err.message
          );
          setIsLoading(false);
        }
        throw err;
      } finally {
        activeHttpRequests.current.delete(httpAbortCtrl);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    const requests = activeHttpRequests.current;
    return () => {
      requests.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
