<template>
  <div class="main-layout">
    <header class="header" style="display: flex; align-items: center; justify-content: space-between;">
      <div class="header-left" style="display: flex; align-items: center;">
        <img src="@/assets/logo.png" alt="Logo" style="height:52px; margin-right:12px; padding-top:14px;" />
        <h1 style="margin: 0;">Portfolio-Vue</h1>
      </div>
      <div class="header-actions" style="display: flex; align-items: center; gap: 16px;">
        <LanguageSelector />
        <div class="header-user-menu" ref="menuRef" @click="toggleMenu" tabindex="0">
          <svg class="header-user-icon" width="36" height="36" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="7" r="4" stroke="#fff" stroke-width="2" fill="none" />
            <path d="M3 17c0-2.7614 3.134-5 7-5s7 2.2386 7 5" stroke="#fff" stroke-width="2" fill="none" />
          </svg>
          <div v-if="showMenu" class="user-dropdown" @click.stop>
            <button class="dropdown-item" @click="logout">{{ $t('common.logout') }}</button>
          </div>
        </div>
      </div>
    </header>
    <div class="layout-body">
      <AppSidebar />
      <section class="page-content">
        <router-view />
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { removeToken } from '../services/tokenService';
import AppSidebar from './Sidebar.vue';
import LanguageSelector from './LanguageSelector.vue';

export default defineComponent({
  name: 'MainLayout',
  components: { AppSidebar, LanguageSelector },
  setup() {
    const showMenu = ref(false);
    const router = useRouter();
    const menuRef = ref<HTMLElement | null>(null);

    function toggleMenu(event: MouseEvent) {
      event.stopPropagation();
      showMenu.value = !showMenu.value;
    }

    function logout() {
      removeToken();
      router.push('/login');
      showMenu.value = false;
    }

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
        showMenu.value = false;
      }
    }

    onMounted(() => {
      window.addEventListener('click', handleClickOutside);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('click', handleClickOutside);
    });

    return { showMenu, toggleMenu, logout, menuRef };
  }
});
</script>

<style scoped>
.header-left {
  display: flex;
  align-items: center;
}
.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 40px;
}

.header-actions .language-selector {
  margin-bottom: 0;
  height: 40px;
  display: flex;
  align-items: center;
}

.header {
  height: 80px;
  background: #42b883;
  border-bottom: 1px solid #36976b;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  z-index: 2;
}

.header-user-menu {
  position: relative;
  margin-left: auto;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  height: 40px;
  width: 40px;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.15s;
}

.header-user-menu:focus,
.header-user-menu:hover {
  background: rgba(255, 255, 255, 0.12);
}

.header-user-icon {
  display: block;
}

.user-dropdown {
  position: absolute;
  top: 48px;
  right: 0;
  background: #fff;
  color: #222e3c;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  min-width: 120px;
  z-index: 100;
  padding: 8px 0;
}

.dropdown-item {
  width: 100%;
  background: none;
  border: none;
  color: #222e3c;
  padding: 10px 18px;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s;
}

.dropdown-item:hover {
  background: #e6f7f1;
  color: #42b883;
}

.layout-body {
  display: flex;
  flex: 1;
  min-height: 0;
}

.sidebar {
  width: 220px;
  background: #fff;
  color: #222e3c;
  padding: 0;
  display: flex;
  flex-direction: column;
  min-width: 180px;
  z-index: 1;
}

.sidebar nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar nav ul li:first-child {
  margin-top: 0;
}

.sidebar nav ul li {
  margin: 16px 0;
}

.sidebar nav ul li a {
  color: #222e3c;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border-radius: 8px;
  transition: background 0.15s, color 0.15s;
}

.page-content {
  flex: 1;
  padding: 24px;
  background: #f7f8fa;
  overflow-y: auto;
}
</style>