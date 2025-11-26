<script lang="ts">
  import { goto } from '$app/navigation';
  
  let codename = $state('');
  let password = $state('');
  let error = $state('');
  
  async function handleLogin() {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codename, password })
    });
    
    if (response.ok) {
      goto('/posts');
    } else {
      error = 'Invalid credentials';
    }
  }
</script>

<div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
  <h2 class="text-2xl font-bold mb-6">Login</h2>
  
  {#if error}
    <div class="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
  {/if}
  
  <form onsubmit={(e) => { e.preventDefault(); handleLogin(); }}>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Codename</label>
        <input id="codename-input" bind:value={codename} required class="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Password</label>
        <input id="password" bind:value={password} type="password" required class="w-full border rounded px-3 py-2" />
      </div>
      
      <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700">
        Login
      </button>
    </div>
  </form>
  
  <p class="mt-4 text-center text-sm">
    Don't have an account? <a href="/register" class="text-blue-600 hover:underline">Register</a>
  </p>
</div>