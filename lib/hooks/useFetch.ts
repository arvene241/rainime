'use client'

import { useEffect, useState } from "react";

interface ApiResponse<T> {
  data: T;
}

export const useFetch = <ApiResponse>({ url, param }: {url: string, param?: string}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiResponse>();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await fetch(url);
        const data = await res.json();
        setData(data);
        setLoading(false);
      } catch (error) {
        setError('Something went wront while fetching the data. Go to console to see the message');
        console.log(error);
      }
    }

    fetchData();
  }, [url, param]);


  return { loading, error, data };
}
