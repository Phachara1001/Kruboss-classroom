import { ref } from 'vue'

export const celebration = ref(null)

const TIERS = ['special', 'secret', 'legendary', 'epic']

/** เรียกหลังซื้อสำเร็จ: celebrate(item.rarity, item.name, item.image) */
export function celebrate(rarity, itemName = '', itemImage = null) {
  const key = String(rarity || '').toLowerCase()
  const tier = TIERS.find((t) => key.includes(t)) || 'common'
  celebration.value = { id: Date.now(), tier, itemName, itemImage }
}
