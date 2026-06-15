<script setup lang="ts">
import { onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import PaymentItem from '../components/common/PaymentItem.vue';
import EmptyState from '../components/common/EmptyState.vue';
import StatCard from '../components/common/StatCard.vue';
import { usePaymentStore } from '../stores/paymentStore';
import { calculatePropertyFee } from '../utils/feeCalculator';
import type { FeeType } from '../types/payment';

const paymentStore = usePaymentStore();

const feeTypeOptions: { label: string; value: FeeType | 'all' }[] = [
  { label: '全部', value: 'all' },
  { label: '物业费', value: 'property' },
  { label: '停车费', value: 'parking' },
  { label: '水电费', value: 'utilities' },
  { label: '装修保证金', value: 'renovation_deposit' },
  { label: '垃圾清运费', value: 'garbage_fee' },
];

async function pay(id: number) {
  await paymentStore.pay(id);
  ElMessage.success('支付宝沙箱支付成功');
}

onMounted(paymentStore.fetchPayments);
</script>

<template>
  <section>
    <div class="stats-row">
      <StatCard label="本月待缴" :value="`¥${paymentStore.unpaidAmount.toFixed(2)}`" hint="含全部费用类型" tone="amber" />
      <StatCard label="装修保证金" :value="`¥${calculatePropertyFee(1, 'renovation_deposit')}`" hint="一次性缴纳" tone="red" />
      <StatCard label="垃圾清运费" :value="`¥${calculatePropertyFee(1, 'garbage_fee')}`" hint="按次收取" tone="blue" />
      <StatCard label="账单数量" :value="paymentStore.payments.length" hint="历史账单" />
    </div>
    <section class="section-panel">
      <div class="section-title">
        <h2>账单列表</h2>
        <div class="fee-filter">
          <el-radio-group v-model="paymentStore.activeFeeType" size="small" @change="paymentStore.setFeeTypeFilter">
            <el-radio-button v-for="opt in feeTypeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div v-if="paymentStore.filteredPayments.length" class="list-stack">
        <PaymentItem v-for="payment in paymentStore.filteredPayments" :key="payment.id" :payment="payment" @pay="pay" />
      </div>
      <EmptyState v-else title="暂无账单" description="物业生成账单后将在这里显示" />
    </section>
  </section>
</template>

<style scoped>
.fee-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>
