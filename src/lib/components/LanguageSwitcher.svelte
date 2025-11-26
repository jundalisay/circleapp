<script lang="ts">
  import { setLocale } from '$lib/paraglide/runtime';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { m } from '$lib/paraglide/messages.js';


  let currentLang = $state('en');
  
  function switchLanguage(lang: string) {
    currentLang = lang;
    setLocale(lang);
    localStorage.setItem('language', lang);
  }
</script>

<div class="flex gap-2">
<!--   <button
    onclick={() => switchLanguage('en')}
    class={`px-4 py-2 rounded ${currentLang === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
  >
    English
  </button>
  <button
    onclick={() => switchLanguage('tl')}
    class={`px-4 py-2 rounded ${currentLang === 'tl' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
  >
    Tagalog
  </button> -->

  <button onclick={() => switchLanguage('en')} class={`px-4 py-2 rounded ${currentLang === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
    English
  </button>
  <button onclick={() => switchLanguage('tl')} class={`px-4 py-2 rounded ${currentLang === 'tl' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
  >
    Tagalog
  </button>


<!--   <button onclick={() => }>en</button>
  <button onclick={() => setLocale('es')}>es</button>
  <button onclick={() => setLocale('fr')}>fr</button>
  <button onclick={() => setLocale('zh')}>zh</button>
  <button onclick={() => }>tl</button>
  <button onclick={() => setLocale('cb')}>cb</button>
  <button onclick={() => setLocale('ps')}>ps</button>
  <button onclick={() => setLocale('vi')}>vi</button> -->
</div>



