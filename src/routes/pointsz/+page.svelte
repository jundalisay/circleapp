<script lang="ts">
  let { data } = $props();
  let activeTab = $state('overview');
</script>

<div class="max-w-6xl mx-auto">
  <h2 class="text-2xl font-bold mb-6">Points & Transactions</h2>
  
  <div class="bg-white rounded-lg shadow p-6 mb-6">
    <h3 class="text-lg font-semibold mb-2">Total Balance</h3>
    <p class="text-3xl font-bold" class:text-red-600={data.balance < 0} class:text-green-600={data.balance >= 0}>
      {data.balance.toFixed(2)} pts
    </p>
  </div>
  
  <div class="flex gap-2 mb-6 overflow-x-auto">
    <button
      onclick={() => activeTab = 'overview'}
      class={`px-4 py-2 rounded whitespace-nowrap ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
    >
      Overview
    </button>
    <button
      onclick={() => activeTab = 'transactions'}
      class={`px-4 py-2 rounded whitespace-nowrap ${activeTab === 'transactions' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
    >
      All Transactions
    </button>
    <button
      onclick={() => activeTab = 'debts'}
      class={`px-4 py-2 rounded whitespace-nowrap ${activeTab === 'debts' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
    >
      Purchases (Debts)
    </button>
    <button
      onclick={() => activeTab = 'credits'}
      class={`px-4 py-2 rounded whitespace-nowrap ${activeTab === 'credits' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
    >
      Sales (Credits)
    </button>
    <button
      onclick={() => activeTab = 'stats'}
      class={`px-4 py-2 rounded whitespace-nowrap ${activeTab === 'stats' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
    >
      Statistics
    </button>
  </div>
  
  {#if activeTab === 'overview'}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each data.userBalances as balance}
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex justify-between items-center">
            <div>
              <p class="font-semibold">{balance.name}</p>
              <p class="text-sm text-gray-500">{balance.location || 'No location'}</p>
            </div>
            <p class="text-xl font-bold" class:text-red-600={balance.balance < 0} class:text-green-600={balance.balance >= 0}>
              {balance.balance.toFixed(2)}
            </p>
          </div>
        </div>
      {/each}
    </div>
  {/if}
  
  {#if activeTab === 'transactions'}
    <div class="bg-white rounded-lg shadow">
      {#each data.transactions as tx}
        <div class="p-4 border-b last:border-b-0">
          <div class="flex justify-between items-start">
            <div>
              <p class="font-semibold">{tx.name}</p>
              <p class="text-sm text-gray-500">{new Date(tx.dateCreated).toLocaleDateString()}</p>
              <p class="text-xs text-gray-400">{tx.kind === 'debt' ? 'Purchase from' : 'Sale to'} {tx.otherParty}</p>
            </div>
            <p class="text-lg font-bold" class:text-red-600={tx.kind === 'debt'} class:text-green-600={tx.kind === 'credit'}>
              {tx.kind === 'debt' ? '-' : '+'}{tx.points.toFixed(2)}
            </p>
          </div>
        </div>
      {/each}
    </div>
  {/if}
  
  {#if activeTab === 'debts'}
    <div class="bg-white rounded-lg shadow">
      {#each data.transactions.filter(t => t.kind === 'debt') as tx}
        <div class="p-4 border-b last:border-b-0">
          <div class="flex justify-between items-start">
            <div>
              <p class="font-semibold">{tx.name}</p>
              <p class="text-sm text-gray-500">{new Date(tx.dateCreated).toLocaleDateString()}</p>
              <p class="text-xs text-gray-400">From {tx.otherParty}</p>
            </div>
            <p class="text-lg font-bold text-red-600">
              -{tx.points.toFixed(2)}
            </p>
          </div>
        </div>
      {/each}
    </div>
  {/if}
  
  {#if activeTab === 'credits'}
    <div class="bg-white rounded-lg shadow">
      {#each data.transactions.filter(t => t.kind === 'credit') as tx}
        <div class="p-4 border-b last:border-b-0">
          <div class="flex justify-between items-start">
            <div>
              <p class="font-semibold">{tx.name}</p>
              <p class="text-sm text-gray-500">{new Date(tx.dateCreated).toLocaleDateString()}</p>
              <p class="text-xs text-gray-400">To {tx.otherParty}</p>
            </div>
            <p class="text-lg font-bold text-green-600">
              +{tx.points.toFixed(2)}
            </p>
          </div>
        </div>
      {/each}
    </div>
  {/if}
  
  {#if activeTab === 'stats'}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white p-6 rounded-lg shadow text-center">
        <p class="text-sm text-gray-500 mb-2">Total Transactions</p>
        <p class="text-3xl font-bold">{data.stats.totalTransactions}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow text-center">
        <p class="text-sm text-gray-500 mb-2">Unique Partners</p>
        <p class="text-3xl font-bold">{data.stats.uniquePartners}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow text-center">
        <p class="text-sm text-gray-500 mb-2">Avg Transaction</p>
        <p class="text-3xl font-bold">{data.stats.avgTransaction.toFixed(2)}</p>
      </div>
    </div>
  {/if}
</div>

