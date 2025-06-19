<template>
  <aside class="sidebar">
    <nav>
      <ul>
        <li>
          <router-link to="/users" class="nav-btn">
            <span class="icon-entity" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="7" r="4" stroke="#42b883" stroke-width="2" fill="none"/>
                <path d="M3 17c0-2.7614 3.134-5 7-5s7 2.2386 7 5" stroke="#42b883" stroke-width="2" fill="none"/>
              </svg>
            </span>
            <span class="sidebar-link-text">{{ $t('sidebar.users') }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/product-categories" class="nav-btn">
            <span class="icon-entity" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 7l7-4 7 4v6c0 3.3137-2.6863 6-6 6s-6-2.6863-6-6V7z" stroke="#42b883" stroke-width="2" fill="none"/>
                <circle cx="10" cy="11" r="2.5" stroke="#42b883" stroke-width="2" fill="none"/>
              </svg>
            </span>
            <span class="sidebar-link-text">{{ $t('sidebar.productCategories') }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/products" class="nav-btn">
            <span class="icon-entity" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <polygon points="2,7 10,2 18,7 10,12" stroke="#42b883" stroke-width="2" fill="none"/>
                <polyline points="2,7 2,15 10,18 18,15 18,7" stroke="#42b883" stroke-width="2" fill="none"/>
                <line x1="10" y1="12" x2="10" y2="18" stroke="#42b883" stroke-width="2"/>
              </svg>
            </span>
            <span class="sidebar-link-text">{{ $t('sidebar.products') }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script lang="ts">
export default {
  name: 'AppSidebar'
};
</script>