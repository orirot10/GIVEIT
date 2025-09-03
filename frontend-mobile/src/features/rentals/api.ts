import { Rental } from '../../types';

export async function fetchRentals(): Promise<Rental[]> {
  await new Promise(r => setTimeout(r, 500));
  return [
    { id: '1', title: 'Camera', image: 'https://via.placeholder.com/150', price: 25, description: 'A nice camera' },
    { id: '2', title: 'Bike', image: 'https://via.placeholder.com/150', price: 15, description: 'Mountain bike' },
  ];
}
