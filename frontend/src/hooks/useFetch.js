import { useState, useEffect, useCallback } from 'react';

const useFetch = (fetchFunction, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const responseData = await fetchFunction(...args);
      setData(responseData);
      return responseData;
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Something went wrong';
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return { data, loading, error, execute, setData };
};

export default useFetch;
