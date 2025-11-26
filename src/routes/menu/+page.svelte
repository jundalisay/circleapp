<script lang="ts">
  import { goto } from '$app/navigation';
  
  import { setLocale } from '$lib/paraglide/runtime';
  import { page } from '$app/state';
  import { m } from '$lib/paraglide/messages.js';

  import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';

  const menuItems = [
    { name: 'Posts', route: '/posts', icon: '📝' },
    // { name: m.products, route: '/products', icon: '📦' },
    // { name: m.services, route: '/services', icon: '🛠️' },
    { name: 'Products', route: '/products', icon: '📦' },
    { name: 'Services', route: '/services', icon: '🛠️' },    
    { name: 'Points', route: '/points', icon: '💰' },
    { name: 'Shops', route: '/shops', icon: '🏪' },
    { name: 'Profile', route: '/profile', icon: '👤' }
  ];
</script>

<div class="max-w-2xl mx-auto px-4 py-8">
  <h2 class="text-3xl font-extrabold mb-8 text-center text-gray-900 tracking-tight">
    {m.menu()}
  </h2>
  <h3 class="text-center">{m.hello_world({ name: 'SvelteKit User' })}</h3>
</div>

<div>
  <div class="mb-10 flex justify-center">
    <div class="bg-white p-1 rounded-full shadow-sm border border-gray-100">
      <LanguageSwitcher />
    </div>
  </div>
  
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
    {#each menuItems as item}
      <button
        onclick={() => goto(item.route)}
        class="group relative bg-white flex flex-col items-center justify-center p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-orange-100/50 hover:-translate-y-1 transition-all duration-300 ease-out active:scale-95 aspect-square"
      >
        <div class="w-14 h-14 mb-3 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-orange-50 group-hover:rotate-3 transition-all duration-300">
          {item.icon}
        </div>
        
        <div class="font-bold text-gray-700 group-hover:text-orange-600 transition-colors">
          {item.name}
        </div>
      </button>
    {/each}
  </div>
  
  <button
    onclick={() => goto('/posts')}
    class="mt-10 w-full py-4 rounded-2xl font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 group"
  >
    <span class="group-hover:-translate-x-1 transition-transform">←</span> Back to Home
  </button>
</div>