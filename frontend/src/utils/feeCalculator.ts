export type FeeCalcType = 'property' | 'parking' | 'utilities' | 'renovation_deposit' | 'garbage_fee';

export function calculatePropertyFee(area: number, type: FeeCalcType) {
  const rateMap = {
    property: 3.2,
    parking: 280,
    utilities: 1.15,
    renovation_deposit: 2000,
    garbage_fee: 300,
  };
  if (type === 'parking' || type === 'renovation_deposit' || type === 'garbage_fee') {
    return rateMap[type];
  }
  return Number((area * rateMap[type]).toFixed(2));
}
