import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { listPayments, payPayment } from '../api/payment';
import type { Payment, FeeType } from '../types/payment';

export const usePaymentStore = defineStore('payment', () => {
  const payments = ref<Payment[]>([]);
  const loading = ref(false);
  const activeFeeType = ref<FeeType | 'all'>('all');

  const filteredPayments = computed(() => {
    if (activeFeeType.value === 'all') return payments.value;
    return payments.value.filter((item) => item.feeType === activeFeeType.value);
  });

  const unpaidAmount = computed(() =>
    payments.value.filter((item) => item.status !== 'paid').reduce((sum, item) => sum + Number(item.amount), 0),
  );

  const feeTypeSummary = computed(() => {
    const summary: Record<string, { total: number; unpaid: number }> = {};
    for (const item of payments.value) {
      if (!summary[item.feeType]) {
        summary[item.feeType] = { total: 0, unpaid: 0 };
      }
      summary[item.feeType].total += Number(item.amount);
      if (item.status !== 'paid') {
        summary[item.feeType].unpaid += Number(item.amount);
      }
    }
    return summary;
  });

  function setFeeTypeFilter(type: FeeType | 'all') {
    activeFeeType.value = type;
  }

  async function fetchPayments() {
    loading.value = true;
    try {
      payments.value = await listPayments();
    } finally {
      loading.value = false;
    }
  }

  async function pay(id: number) {
    const updated = await payPayment(id);
    payments.value = payments.value.map((item) => (item.id === id ? updated : item));
  }

  return { payments, loading, unpaidAmount, activeFeeType, filteredPayments, feeTypeSummary, setFeeTypeFilter, fetchPayments, pay };
});
