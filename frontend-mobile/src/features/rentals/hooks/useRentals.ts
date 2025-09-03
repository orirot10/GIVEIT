import { useEffect, useState } from 'react';
import { fetchRentals } from '../api';
import { Rental } from '../../../types';

export default function useRentals() {
  const [data, setData] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const rentals = await fetchRentals();
        setData(rentals);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { data, loading, error };
}
