<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  let { data } = $props();
  let mode = $state('login');
  let loading = $state(false);
  let formData = $state({
    name: '',
    codename: '',
    pin: '',
    pinConfirm: '',
    password: '',
    passwordConfirm: '',
    avatar_url: '',
    gender: '',
    date_of_birth: '',
    email: '',
    phone: '',
    location: ''
  });
  
  let errors = $state({});
  
  // Redirect if already logged in
  onMount(() => {
    if (data.user) {
      goto('/posts');
    }
  });
  
  function validateForm() {
    errors = {};
    
    if (mode === 'register') {
      if (!formData.name) errors.name = 'Name is required';
      if (!formData.codename) errors.codename = 'Codename is required';
      if (!formData.pin) errors.pin = 'PIN is required';
      if (formData.pin.length < 4) errors.pin = 'PIN must be at least 4 digits';
      if (formData.pin !== formData.pinConfirm) errors.pinConfirm = 'PINs do not match';
      if (!formData.password) errors.password = 'Password is required';
      if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.passwordConfirm) errors.passwordConfirm = 'Passwords do not match';
    } else {
      if (!formData.codename) errors.codename = 'Codename is required';
      if (!formData.password) errors.password = 'Password is required';
    }
    
    return Object.keys(errors).length === 0;
  }
  
  async function handleSubmit() {
    if (!validateForm()) return;
    
    loading = true;
    errors = {};
    
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        goto('/posts');
      } else {
        errors.general = result.message || 'An error occurred';
      }
    } catch (error) {
      console.error('Submit error:', error);
      errors.general = 'Network error. Please try again.';
    } finally {
      loading = false;
    }
  }
  
  function switchMode(newMode) {
    mode = newMode;
    errors = {};
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 px-4">
  <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
    <img src="/pp.png">
<!--     <h1 class="text-3xl font-bold text-center mb-2 text-gray-800">Circle Barter</h1>
    <p class="text-center text-gray-600 mb-6">Community Exchange Platform</p> -->
    
    <div class="flex gap-2 mb-6">
      <button
        onclick={() => switchMode('login')}
        class={`flex-1 py-2 rounded-lg font-semibold transition ${
          mode === 'login' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Login
      </button>
      <button
        onclick={() => switchMode('register')}
        class={`flex-1 py-2 rounded-lg font-semibold transition ${
          mode === 'register' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Register
      </button>
    </div>
    
    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
      {#if mode === 'register'}
        <div>
          <input 
            type="text" 
            bind:value={formData.name} 
            placeholder="Name *" 
            required 
            class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {#if errors.name}<span class="text-red-500 text-sm">{errors.name}</span>{/if}
        </div>
      {/if}
      
      <div>
        <input 
          type="text" 
          bind:value={formData.codename} 
          placeholder="Codename *" 
          required 
          class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {#if errors.codename}<span class="text-red-500 text-sm">{errors.codename}</span>{/if}
      </div>
      
      {#if mode === 'register'}
        <div>
          <input 
            type="password" 
            bind:value={formData.pin} 
            placeholder="PIN (4+ digits) *" 
            required 
            pattern="[0-9]*"
            inputmode="numeric"
            class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {#if errors.pin}<span class="text-red-500 text-sm">{errors.pin}</span>{/if}
        </div>
        
        <div>
          <input 
            type="password" 
            bind:value={formData.pinConfirm} 
            placeholder="Confirm PIN *" 
            required 
            pattern="[0-9]*"
            inputmode="numeric"
            class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {#if errors.pinConfirm}<span class="text-red-500 text-sm">{errors.pinConfirm}</span>{/if}
        </div>
      {/if}
      
      <div>
        <input 
          type="password" 
          bind:value={formData.password} 
          placeholder="Password *" 
          required 
          class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {#if errors.password}<span class="text-red-500 text-sm">{errors.password}</span>{/if}
      </div>
      
      {#if mode === 'register'}
        <div>
          <input 
            type="password" 
            bind:value={formData.passwordConfirm} 
            placeholder="Confirm Password *" 
            required 
            class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {#if errors.passwordConfirm}<span class="text-red-500 text-sm">{errors.passwordConfirm}</span>{/if}
        </div>
        
        <details class="border rounded-lg p-4">
          <summary class="cursor-pointer font-semibold text-gray-700">Optional Information</summary>
          <div class="mt-4 space-y-3">
            <input 
              type="url" 
              bind:value={formData.avatar_url} 
              placeholder="Avatar URL" 
              class="w-full px-4 py-2 border rounded-lg"
            />
            
            <select 
              bind:value={formData.gender}
              class="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Gender (optional)</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            
            <input 
              type="date" 
              bind:value={formData.date_of_birth} 
              placeholder="Date of Birth" 
              class="w-full px-4 py-2 border rounded-lg"
            />
            <input 
              type="email" 
              bind:value={formData.email} 
              placeholder="Email" 
              class="w-full px-4 py-2 border rounded-lg"
            />
            <input 
              type="tel" 
              bind:value={formData.phone} 
              placeholder="Phone" 
              class="w-full px-4 py-2 border rounded-lg"
            />
            <input 
              type="text" 
              bind:value={formData.location} 
              placeholder="Location" 
              class="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </details>
      {/if}
      
      {#if errors.general}
        <div class="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
          {errors.general}
        </div>
      {/if}
      
      <button 
        type="submit" 
        disabled={loading}
        class="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
      </button>
    </form>
  </div>
</div>