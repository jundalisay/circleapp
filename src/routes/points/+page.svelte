<script lang="ts">
	import { onMount } from 'svelte';
	
	// --- Types ---
	type TransactionType = 'DEBT' | 'CREDIT' | 'CLEAR';

	interface Transaction {
		id: string;
		date: Date;
		type: TransactionType;
		counterparty: string;
		item: string;
		amount: number;
	}

	// --- 1. Mock Data Generation (Simulating your DB) ---
	const generateData = (): Transaction[] => {
		const users = ['Bakery Bob', 'Mechanic Mike', 'Farmer Fran', 'Tailor Tom'];
		const items = ['Bread', 'Tire Fix', 'Eggs', 'Hemming Pants', 'Rice', 'Oil Change'];
		const data: Transaction[] = [];

		// Generate 50 random transactions
		for (let i = 0; i < 50; i++) {
			const type = Math.random() > 0.7 ? 'CLEAR' : (Math.random() > 0.5 ? 'DEBT' : 'CREDIT');
			const date = new Date();
			date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Past 30 days

			data.push({
				id: crypto.randomUUID(),
				date: date,
				type: type as TransactionType,
				counterparty: users[Math.floor(Math.random() * users.length)],
				item: type === 'CLEAR' ? 'Settlement' : items[Math.floor(Math.random() * items.length)],
				amount: Math.floor(Math.random() * 500) + 50
			});
		}
		return data.sort((a, b) => b.date.getTime() - a.date.getTime());
	};

	// --- 2. Svelte 5 State (Runes) ---
	let transactions = $state<Transaction[]>(generateData());
	let activeTab = $state(1);
	
	// Filters
	let minAmount = $state(0);
	let filterDate = $state('');

	// --- 3. Derived Computations (Runes) ---
	
	// Base Filter Logic
	let filteredTransactions = $derived(
		transactions.filter(t => {
			const dateMatch = filterDate ? t.date.toISOString().split('T')[0] === filterDate : true;
			const amountMatch = t.amount >= minAmount;
			return dateMatch && amountMatch;
		})
	);

	// Tab 1: Balance Logic
	let balances = $derived.by(() => {
		const acc: Record<string, { debt: number, credit: number, net: number }> = {};
		filteredTransactions.forEach(t => {
			if (!acc[t.counterparty]) acc[t.counterparty] = { debt: 0, credit: 0, net: 0 };
			
			if (t.type === 'DEBT') acc[t.counterparty].debt += t.amount;
			if (t.type === 'CREDIT') acc[t.counterparty].credit += t.amount;
			// CLEAR implies logic depending on who initiated, assuming generic settlement here reducing net
		});

		// Calculate Net
		return Object.entries(acc).map(([name, val]) => ({
			name,
			...val,
			net: val.credit - val.debt
		}));
	});

	// Tab Specific Filters
	let debtList = $derived(filteredTransactions.filter(t => t.type === 'DEBT'));
	let creditList = $derived(filteredTransactions.filter(t => t.type === 'CREDIT'));
	
	// Tab 5 & 6 Aggregates
	let aggDebt = $derived(balances.filter(b => b.debt > 0));
	let aggCredit = $derived(balances.filter(b => b.credit > 0));

	// Tab 7 Stats
	let stats = $derived.by(() => {
		const totalDebt = transactions.filter(t => t.type === 'DEBT').reduce((a, b) => a + b.amount, 0);
		const totalCredit = transactions.filter(t => t.type === 'CREDIT').reduce((a, b) => a + b.amount, 0);
		const uniqueUsers = new Set(transactions.map(t => t.counterparty)).size;
		
		// Mock calculation for avg resolution (in a real app, you'd link Debt ID to Clear ID)
		const avgResolutionDays = 4.2; 

		return { totalDebt, totalCredit, uniqueUsers, avgResolutionDays };
	});

	// Helper to format currency/points
	const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2 });
</script>

<div class="min-h-screen bg-slate-50 text-slate-800 p-4 pb-20 font-sans">
	
	<header class="mb-6">
		<h1 class="text-2xl font-bold text-teal-800">Points & Barter</h1>
		<p class="text-sm text-slate-500">Manage your debt and credits circle.</p>
	</header>


<div class="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm pb-2 border-b border-slate-200">
		<div class="flex flex-wrap gap-2 px-1 py-2">
			{#each [
				{ id: 1, label: 'Balances' },
				{ id: 2, label: 'Transactions' },
				{ id: 3, label: 'My Debts' },
				{ id: 4, label: 'My Sales' },
				{ id: 5, label: 'Agg. Debt' },
				{ id: 6, label: 'Agg. Credit' },
				{ id: 7, label: 'Stats' }
			] as tab}
				<button 
					onclick={() => activeTab = tab.id}
					class="
						flex-1 
						min-w-[100px] 
						px-3 py-2 
						rounded-lg 
						text-xs font-bold uppercase tracking-wide
						transition-all duration-200 
						text-center
						{activeTab === tab.id 
							? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 transform scale-[1.02]' 
							: 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'}
					"
				>
					{tab.label}
				</button>
			{/each}
		</div>
	</div>

	{#if [2, 3, 4, 5].includes(activeTab)}
		<div class="my-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center">
			<label class="flex flex-col gap-1 text-xs font-semibold text-slate-500">
				Min Amount
				<input type="number" bind:value={minAmount} class="border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-teal-500 outline-none w-32 text-slate-800" placeholder="0" />
			</label>
			<label class="flex flex-col gap-1 text-xs font-semibold text-slate-500">
				Date
				<input type="date" bind:value={filterDate} class="border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-teal-500 outline-none text-slate-800" />
			</label>
			<button onclick={() => { minAmount = 0; filterDate = ''; }} class="mt-auto px-3 py-1.5 text-xs text-teal-600 font-medium hover:underline">Clear Filters</button>
		</div>
	{/if}

	<div class="mt-4 space-y-4">

		{#if activeTab === 1}
			<div class="grid gap-3">
				{#each balances as user}
					<div class="bg-white p-4 rounded-xl shadow-sm border-l-4 {user.net >= 0 ? 'border-teal-500' : 'border-rose-500'}">
						<div class="flex justify-between items-start mb-2">
							<h3 class="font-bold text-lg">{user.name}</h3>
							<span class="text-xs font-mono px-2 py-1 bg-slate-100 rounded">
								Net: <span class={user.net >= 0 ? 'text-teal-600' : 'text-rose-600'}>{fmt(user.net)}</span>
							</span>
						</div>
						<div class="grid grid-cols-2 gap-4 text-sm">
							<div class="text-rose-600">
								<span class="block text-xs text-slate-400 uppercase">You Owe</span>
								{fmt(user.debt)}
							</div>
							<div class="text-teal-600 text-right">
								<span class="block text-xs text-slate-400 uppercase">They Owe</span>
								{fmt(user.credit)}
							</div>
						</div>
					</div>
				{/each}
			</div>

		{:else if activeTab === 2}
			<div class="space-y-3">
				{#each filteredTransactions as tx}
					<TransactionCard {tx} />
				{/each}
			</div>

		{:else if activeTab === 3}
			<div class="space-y-3">
				{#each debtList as tx}
					<TransactionCard {tx} highlight="DEBT" />
				{/each}
				{#if debtList.length === 0} <p class="text-center text-slate-400 py-10">No debts found.</p> {/if}
			</div>

		{:else if activeTab === 4}
			<div class="space-y-3">
				{#each creditList as tx}
					<TransactionCard {tx} highlight="CREDIT" />
				{/each}
				{#if creditList.length === 0} <p class="text-center text-slate-400 py-10">No sales found.</p> {/if}
			</div>

		{:else if activeTab === 5}
			<div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
				<table class="w-full text-left text-sm">
					<thead class="bg-slate-50 border-b border-slate-200">
						<tr>
							<th class="p-4 font-semibold text-slate-600">User</th>
							<th class="p-4 font-semibold text-right text-rose-600">Total Owed</th>
						</tr>
					</thead>
					<tbody>
						{#each aggDebt as item}
							<tr class="border-b border-slate-100 last:border-0">
								<td class="p-4">{item.name}</td>
								<td class="p-4 text-right font-mono font-medium">{fmt(item.debt)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

		{:else if activeTab === 6}
			<div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
				<table class="w-full text-left text-sm">
					<thead class="bg-slate-50 border-b border-slate-200">
						<tr>
							<th class="p-4 font-semibold text-slate-600">User</th>
							<th class="p-4 font-semibold text-right text-teal-600">Total Credit</th>
						</tr>
					</thead>
					<tbody>
						{#each aggCredit as item}
							<tr class="border-b border-slate-100 last:border-0">
								<td class="p-4">{item.name}</td>
								<td class="p-4 text-right font-mono font-medium">{fmt(item.credit)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

		{:else if activeTab === 7}
			<div class="grid gap-4">
				<div class="grid grid-cols-2 gap-4">
					<div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
						<div class="text-xs text-slate-400 uppercase font-bold">Avg. Resolution</div>
						<div class="text-2xl font-bold text-teal-600">{stats.avgResolutionDays} <span class="text-sm text-slate-400 font-normal">days</span></div>
					</div>
					<div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
						<div class="text-xs text-slate-400 uppercase font-bold">Unique Traders</div>
						<div class="text-2xl font-bold text-teal-600">{stats.uniqueUsers}</div>
					</div>
				</div>

				<div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
					<h3 class="text-sm font-bold text-slate-700 mb-4 w-full text-left">Debt vs Credit Ratio</h3>
					

[Image of Donut Chart Visualization]

					<div class="relative w-48 h-48">
						<svg viewBox="0 0 36 36" class="w-full h-full rotate-[-90deg]">
							<path class="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3.8" />
							<path class="text-rose-500" 
								stroke-dasharray="{ (stats.totalDebt / (stats.totalDebt + stats.totalCredit)) * 100 }, 100" 
								d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
								fill="none" stroke="currentColor" stroke-width="3.8" />
							<path class="text-teal-500" 
								stroke-dasharray="{ (stats.totalCredit / (stats.totalDebt + stats.totalCredit)) * 100 }, 100" 
								stroke-dashoffset="{ -((stats.totalDebt / (stats.totalDebt + stats.totalCredit)) * 100) }"
								d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
								fill="none" stroke="currentColor" stroke-width="3.8" />
						</svg>
						<div class="absolute inset-0 flex items-center justify-center flex-col">
							<span class="text-xs text-slate-400">Total Vol</span>
							<span class="font-bold text-slate-700">{fmt(stats.totalDebt + stats.totalCredit)}</span>
						</div>
					</div>
					<div class="flex gap-4 mt-4 text-xs font-semibold">
						<div class="flex items-center gap-1"><div class="w-3 h-3 rounded-full bg-rose-500"></div> Debt ({Math.round((stats.totalDebt / (stats.totalDebt + stats.totalCredit)) * 100)}%)</div>
						<div class="flex items-center gap-1"><div class="w-3 h-3 rounded-full bg-teal-500"></div> Credit ({Math.round((stats.totalCredit / (stats.totalDebt + stats.totalCredit)) * 100)}%)</div>
					</div>
				</div>

				<div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
					<h3 class="text-sm font-bold text-slate-700 mb-4">Recent Transaction Volume</h3>
					<div class="flex items-end justify-between h-32 gap-1">
						{#each transactions.slice(0, 10).reverse() as tx}
							<div class="w-full bg-teal-100 rounded-t-sm relative group" style="height: {Math.min((tx.amount / 500) * 100, 100)}%">
								<div class="absolute bottom-0 w-full bg-teal-500 rounded-t-sm transition-all duration-500" style="height: 100%"></div>
								<div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
									{fmt(tx.amount)}
								</div>
							</div>
						{/each}
					</div>
					<div class="text-center text-xs text-slate-400 mt-2">Last 10 Transactions</div>
				</div>

			</div>
		{/if}
	</div>
</div>

{#snippet TransactionCard({ tx, highlight }: { tx: Transaction, highlight?: string })}
	<div class="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
		<div class="flex items-center gap-3">
			<div class="w-10 h-10 rounded-full flex items-center justify-center 
				{tx.type === 'DEBT' ? 'bg-rose-100 text-rose-600' : 
				 tx.type === 'CREDIT' ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-500'}">
				{#if tx.type === 'DEBT'}
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
				{:else if tx.type === 'CREDIT'}
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
				{/if}
			</div>
			<div>
				<div class="font-bold text-slate-800 text-sm">{tx.counterparty}</div>
				<div class="text-xs text-slate-500">{tx.item} • {tx.date.toLocaleDateString()}</div>
			</div>
		</div>
		<div class="text-right">
			<div class="font-mono font-bold 
				{tx.type === 'DEBT' ? 'text-rose-600' : 
				 tx.type === 'CREDIT' ? 'text-teal-600' : 'text-slate-600'}">
				{tx.type === 'DEBT' ? '-' : '+'}{fmt(tx.amount)}
			</div>
			<div class="text-[10px] uppercase font-bold text-slate-400 tracking-wide">{tx.type}</div>
		</div>
	</div>
{/snippet}

<style>
	/* Utility to hide scrollbar for the tabs but keep functionality */
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>

