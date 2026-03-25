<template>
  <section class="screen s-paywall">
    <div class="page-tag">{{ t('paywall.pageTag') }}</div>
    <h2 class="page-title">{{ t('paywall.title1') }}<br>{{ t('paywall.title2') }}</h2>
    <p class="paywall-sub">
      {{ t('paywall.sub') }}<br>
      {{ t('paywall.unlockAnother') }}
    </p>

    <div class="paywall-card">
      <div class="paywall-card-label">{{ t('paywall.whatYouGet') }}</div>
      <div class="paywall-card-items">
        <div class="paywall-item">{{ t('paywall.item1') }}</div>
        <div class="paywall-item">{{ t('paywall.item2') }}</div>
        <div class="paywall-item">{{ t('paywall.item3') }}</div>
      </div>
    </div>

    <button class="btn-primary" @click="unlock" style="margin-bottom:14px;">
      {{ t('paywall.unlockBtn') }}
    </button>
    <button class="paywall-skip" @click="store.go('s-landing')">{{ t('paywall.maybeLater') }}</button>
  </section>
</template>

<script setup>
import { useAppStore, apiCall } from '@/stores/useAppStore'
import { useVK } from '@/composables/useVK'
import { useI18n } from '@/composables/useI18n'

const store = useAppStore()
const { showOrderBox } = useVK()
const { t } = useI18n()

async function unlock() {
  try {
    // Step 1: Get item info from backend
    const invoiceData = await store.retestInvoice()

    // Step 2: VK Order Box (Голоса) payment
    const result = await showOrderBox(invoiceData.item_name || 'blink_retest')

    if (result && result.status) {
      // Payment successful — confirm with backend via apiCall (includes auth header)
      try {
        const confirmRes = await apiCall('POST', '/api/user/confirm-vk-payment', {
          order_id: result.order_id,
          type: 'retest',
        })
        if (confirmRes.ok) {
          await store.resumePaidRetest()
        } else {
          alert(t('common.paymentFailed'))
        }
      } catch {
        // Even if confirm fails, try resuming — the VK callback will confirm server-side
        try { await store.resumePaidRetest() }
        catch { alert(t('common.paymentFailed')) }
      }
    }
    // If status is false/undefined, user cancelled — do nothing
  } catch (e) {
    console.error('[Blink VK] Payment error:', e)
    alert(t('compat.invoiceError'))
  }
}
</script>

<style scoped>
.s-paywall {
  display: flex; flex-direction: column;
  min-height: var(--vk-viewport-height, 100vh);
  padding: 40px 24px;
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
  animation: screenIn .3s cubic-bezier(.16,1,.3,1);
}
.paywall-sub {
  font-size: 15px; color: rgba(255,255,255,0.55); font-family: var(--f-sans);
  line-height: 1.7; margin: 0 0 32px;
}
.paywall-card {
  background: rgba(120,80,220,0.08); border: 1px solid rgba(120,80,220,0.2);
  border-radius: 18px; padding: 20px 22px; margin: 0 0 28px;
}
.paywall-card-label {
  font-size: 13px; color: rgba(255,255,255,0.4); font-family: var(--f-mono);
  letter-spacing: .06em; margin-bottom: 8px;
}
.paywall-card-items { display: flex; flex-direction: column; gap: 6px; }
.paywall-item { font-size: 14px; color: rgba(255,255,255,0.75); font-family: var(--f-sans); line-height: 1.8; }
.paywall-skip {
  width: 100%; padding: 12px; background: none; border: none;
  color: rgba(255,255,255,0.3); font-size: 13px; font-family: var(--f-sans); cursor: pointer;
}
</style>
