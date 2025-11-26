<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  
  const type = $page.url.searchParams.get('type');
  const itemId = $page.url.searchParams.get('id');
  const sellerId = $page.url.searchParams.get('sellerId');
  
  let buyerCodename = $state('');
  let buyerPin = $state('');
  let amount = $state(1);
  let error = $state('');
  
  async function createTransaction() {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        itemId,
        sellerId,
        buyerCodename,
        buyerPin,
        amount
      })
    });
    
    if (response.ok) {
      goto('/points');
    } else {
      const data = await response.json();
      error = data.message || 'Transaction failed';
    }
  }
</script>

<div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
  <h2 class="text-2xl font-bold mb-6">Complete Purchase</h2>
  
  {#if error}
    <div class="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
  {/if}
  
  <form onsubmit={(e) => { e.preventDefault(); createTransaction(); }}>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Your Codename</label>
        <input id="codename" bind:value={buyerCodename} required class="w-full border rounded px-3 py-2" />
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-1">Your PIN</label>
        <input id="pin" bind:value={buyerPin} type="password" required class="w-full border rounded px-3 py-2" />
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-1">Amount</label>
        <input id="amount" bind:value={amount} type="number" step="0.01" min="0.01" required class="w-full border rounded px-3 py-2" />
      </div>
      
      <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700">
        Confirm Purchase
      </button>
    </div>
  </form>
</div>
