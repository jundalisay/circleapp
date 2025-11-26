<script lang="ts">
  import { goto } from '$app/navigation';
  
  let name = $state('');
  let measure = $state('');
  let points = $state(0);
  let category = $state(1);
  let photo1 = $state('');
  let description = $state('');
  let headline = $state('');
  
  async function createProduct() {
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, measure, points, category, photo1, description, headline })
    });
    
    goto('/products');
  }
</script>

<div class="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
  <h2 class="text-2xl font-bold mb-6">Create Product</h2>
  
  <form onsubmit={(e) => { e.preventDefault(); createProduct(); }}>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Name *</label>
        <input id="name" bind:value={name} required class="w-full border rounded px-3 py-2" />
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Measure *</label>
          <input id="measure" bind:value={measure} required class="w-full border rounded px-3 py-2" placeholder="pcs, kg, etc" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Points *</label>
          <input id="points" bind:value={points} type="number" step="0.01" required class="w-full border rounded px-3 py-2" />
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-1">Category *</label>
        <select bind:value={category} class="w-full border rounded px-3 py-2">
          <option value={1}>Category 1</option>
          <option value={2}>Category 2</option>
          <option value={3}>Category 3</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-1">Photo URL</label>
        <input id="photo" bind:value={photo1} type="url" class="w-full border rounded px-3 py-2" />
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-1">Headline</label>
        <input id="headline" bind:value={headline} class="w-full border rounded px-3 py-2" />
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-1">Description</label>
        <textarea id="description" bind:value={description} class="w-full border rounded px-3 py-2" rows="4"></textarea>
      </div>
      
      <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700">
        Create Product
      </button>
    </div>
  </form>
</div>
