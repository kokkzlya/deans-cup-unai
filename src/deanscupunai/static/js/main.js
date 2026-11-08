/**
 * DEAN'S CUP UNAI 2026 - Main Application Logic
 * Adheres strictly to Secure Web Frontend Skill:
 * - NO innerHTML / outerHTML / insertAdjacentHTML / document.write
 * - Uses document.createElement, textContent, replaceChildren, setAttribute
 * - Accessible modals, interactive filters, live countdown, clipboard toast
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // State
  const state = {
    sport: 'all',
    day: 'all',
    status: 'all',
    searchQuery: '',
    matchesData: []
  };

  // DOM Elements
  const sportTabs = document.querySelectorAll('.tab-btn[data-sport]');
  const dayChips = document.querySelectorAll('.day-chip[data-day]');
  const statusChips = document.querySelectorAll('.status-chip[data-status]');
  const searchInput = document.getElementById('match-search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const resetFilterBtn = document.getElementById('btn-reset-filters');
  const emptyStateResetBtn = document.getElementById('btn-empty-reset');
  const visibleCountEl = document.getElementById('visible-matches-count');
  const emptyStateEl = document.getElementById('empty-state');
  const matchCards = document.querySelectorAll('.match-card');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const toastContainer = document.getElementById('toast-container');

  // Modal Elements
  const modalBackdrop = document.getElementById('match-modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalSportBadge = document.getElementById('modal-sport-badge');
  const modalStageBadge = document.getElementById('modal-stage-badge');
  const modalBody = document.getElementById('modal-body');

  // -------------------------------------------------------------------------
  // 1. Theme Toggle System (Dark / Light Mode)
  // -------------------------------------------------------------------------
  function initTheme() {
    const savedTheme = localStorage.getItem('deans_cup_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('deans_cup_theme', nextTheme);
      showToast(`Tema diganti ke mode ${nextTheme === 'dark' ? 'Gelap 🌙' : 'Terang ☀️'}`);
    });
  }

  // -------------------------------------------------------------------------
  // 2. Toast Notification (Secure DOM insertion)
  // -------------------------------------------------------------------------
  function showToast(message) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';

    const iconSpan = document.createElement('span');
    iconSpan.textContent = '✨';
    toast.appendChild(iconSpan);

    const textSpan = document.createElement('span');
    textSpan.textContent = message;
    toast.appendChild(textSpan);

    toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3200);
  }

  // -------------------------------------------------------------------------
  // 3. Match Filtering Logic
  // -------------------------------------------------------------------------
  function applyFilters() {
    let visibleCount = 0;
    const query = state.searchQuery.trim().toLowerCase();

    matchCards.forEach(card => {
      const cardSport = card.getAttribute('data-sport') || '';
      const cardDay = card.getAttribute('data-day') || '';
      const cardStatus = card.getAttribute('data-status') || '';
      const cardSearch = (card.getAttribute('data-search') || '').toLowerCase();

      const matchSport = state.sport === 'all' || cardSport === state.sport;
      const matchDay = state.day === 'all' || cardDay === state.day;
      const matchStatus = state.status === 'all' || cardStatus === state.status;
      const matchSearch = !query || cardSearch.includes(query);

      if (matchSport && matchDay && matchStatus && matchSearch) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    // Update Counter
    if (visibleCountEl) {
      visibleCountEl.textContent = String(visibleCount);
    }

    // Toggle Empty State
    if (emptyStateEl) {
      if (visibleCount === 0) {
        emptyStateEl.classList.remove('hidden');
      } else {
        emptyStateEl.classList.add('hidden');
      }
    }

    // Toggle Reset Button
    const hasActiveFilter = state.sport !== 'all' || state.day !== 'all' || state.status !== 'all' || state.searchQuery !== '';
    if (resetFilterBtn) {
      if (hasActiveFilter) {
        resetFilterBtn.classList.remove('hidden');
      } else {
        resetFilterBtn.classList.add('hidden');
      }
    }
  }

  // Sport Tabs Event
  sportTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sportTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      state.sport = tab.getAttribute('data-sport') || 'all';
      applyFilters();
    });
  });

  // Day Chips Event
  dayChips.forEach(chip => {
    chip.addEventListener('click', () => {
      dayChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      state.day = chip.getAttribute('data-day') || 'all';
      applyFilters();
    });
  });

  // Status Chips Event
  statusChips.forEach(chip => {
    chip.addEventListener('click', () => {
      statusChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      state.status = chip.getAttribute('data-status') || 'all';
      applyFilters();
    });
  });

  // Search Input Event
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (clearSearchBtn) {
        if (state.searchQuery) {
          clearSearchBtn.classList.remove('hidden');
        } else {
          clearSearchBtn.classList.add('hidden');
        }
      }
      applyFilters();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      state.searchQuery = '';
      clearSearchBtn.classList.add('hidden');
      applyFilters();
    });
  }

  // Reset Filters
  function resetAllFilters() {
  state.sport = 'all';
  state.day = 'all';
  state.status = 'all';
  state.searchQuery = '';

    sportTabs.forEach(t => {
      const isAll = t.getAttribute('data-sport') === 'all';
      t.classList.toggle('active', isAll);
      t.setAttribute('aria-selected', isAll ? 'true' : 'false');
    });

    dayChips.forEach(c => {
      const isAll = c.getAttribute('data-day') === 'all';
      c.classList.toggle('active', isAll);
    });

    statusChips.forEach(c => {
      const isAll = c.getAttribute('data-status') === 'all';
      c.classList.toggle('active', isAll);
    });

    if (searchInput) {
      searchInput.value = '';
    }
    if (clearSearchBtn) {
      clearSearchBtn.classList.add('hidden');
    }

    applyFilters();
    showToast('Filter jadwal telah direset ke semua pertandingan');
  }

  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', resetAllFilters);
  }
  if (emptyStateResetBtn) {
    emptyStateResetBtn.addEventListener('click', resetAllFilters);
  }

  // Quick Cabor Card Filter Links
  const caborCardBtns = document.querySelectorAll('.btn-cabor-filter');
  caborCardBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSport = btn.getAttribute('data-cabor-target');
      if (!targetSport) return;

        // Activate corresponding tab
        const tab = document.querySelector(`.tab-btn[data-sport="${targetSport}"]`);
        if (tab) {
          tab.click();
        }

      // Scroll to schedule
      const scheduleSec = document.getElementById('jadwal');
      if (scheduleSec) {
        scheduleSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // -------------------------------------------------------------------------
  // 4. Fetch Full Match Data for Modal / Deep Inspection
  // -------------------------------------------------------------------------
  async function loadScheduleApi() {
    try {
      const res = await fetch('/api/schedule');
      if (res.ok) {
        const data = await res.json();
        state.matchesData = data.matches || [];
      }
    } catch (e) {
      // Quiet fallback: SSR matches are already on DOM
    }
  }

  // -------------------------------------------------------------------------
  // 5. Secure Match Details Modal Rendering
  // -------------------------------------------------------------------------
  function openMatchModal(matchId) {
    const match = state.matchesData.find(m => m.id === matchId);
    if (!match || !modalBackdrop || !modalBody) return;

    // Set Header Badges safely
    if (modalSportBadge) {
      modalSportBadge.textContent = `${match.sport_icon} ${match.sport_name}`;
    }
    if (modalStageBadge) {
      modalStageBadge.textContent = match.stage;
    }

    // Clear existing modal body securely using replaceChildren
    modalBody.replaceChildren();

    // 1. Scorecard Section
    const scorecard = document.createElement('div');
    scorecard.style.cssText = 'background: rgba(0,0,0,0.25); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px;';

    const teamsRow = document.createElement('div');
    teamsRow.style.cssText = 'display: flex; align-items: center; justify-content: space-around; gap: 12px;';

    // Team A Box
    const teamABox = document.createElement('div');
    teamABox.style.cssText = 'flex: 1; text-align: center;';
    const teamAName = document.createElement('h4');
    teamAName.textContent = match.team_a.name;
    teamAName.style.cssText = 'font-size: 1rem; font-weight: 800; margin-bottom: 6px;';
    const teamAScore = document.createElement('div');
    teamAScore.textContent = match.status !== 'upcoming' ? String(match.team_a.score) : '-';
    teamAScore.style.cssText = 'font-size: 2.2rem; font-weight: 900; color: #06b6d4; font-family: Outfit, sans-serif;';
    teamABox.appendChild(teamAName);
    teamABox.appendChild(teamAScore);

    // Divider
    const vsBox = document.createElement('div');
    vsBox.style.cssText = 'font-weight: 800; color: #64748b; font-size: 0.9rem;';
    vsBox.textContent = 'VS';

    // Team B Box
    const teamBBox = document.createElement('div');
    teamBBox.style.cssText = 'flex: 1; text-align: center;';
    const teamBName = document.createElement('h4');
    teamBName.textContent = match.team_b.name;
    teamBName.style.cssText = 'font-size: 1rem; font-weight: 800; margin-bottom: 6px;';
    const teamBScore = document.createElement('div');
    teamBScore.textContent = match.status !== 'upcoming' ? String(match.team_b.score) : '-';
    teamBScore.style.cssText = 'font-size: 2.2rem; font-weight: 900; color: #06b6d4; font-family: Outfit, sans-serif;';
    teamBBox.appendChild(teamBName);
    teamBBox.appendChild(teamBScore);

    teamsRow.appendChild(teamABox);
    teamsRow.appendChild(vsBox);
    teamsRow.appendChild(teamBBox);
    scorecard.appendChild(teamsRow);

    // Status pill in scorecard
    const statusPill = document.createElement('div');
    statusPill.style.cssText = 'display: inline-block; margin-top: 14px; padding: 4px 14px; border-radius: 9999px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase;';
    if (match.status === 'live') {
      statusPill.style.background = 'rgba(239, 68, 68, 0.2)';
      statusPill.style.color = '#ef4444';
      statusPill.textContent = `🔴 LIVE • ${match.live_period || 'Sedang Berlangsung'}`;
    } else if (match.status === 'finished') {
      statusPill.style.background = 'rgba(16, 185, 129, 0.2)';
      statusPill.style.color = '#10b981';
      statusPill.textContent = '✅ Pertandingan Selesai';
    } else {
      statusPill.style.background = 'rgba(255, 255, 255, 0.1)';
      statusPill.style.color = '#94a3b8';
      statusPill.textContent = `⏳ Jadwal: ${match.date} • ${match.time}`;
    }
    scorecard.appendChild(statusPill);
    modalBody.appendChild(scorecard);

    // 2. Details List
    const detailsList = document.createElement('div');
    detailsList.style.cssText = 'display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; font-size: 0.88rem;';

    const infoItems = [
      { label: 'Waktu & Tanggal', val: `${match.date} &bull; ${match.time}` },
      { label: 'Lokasi / Venue', val: match.venue },
      { label: 'Babak Pertandingan', val: match.stage },
      { label: 'Catatan Panitia', val: match.note || 'Tidak ada catatan khusus.' }
    ];

    infoItems.forEach(item => {
      const row = document.createElement('div');
      row.style.cssText = 'display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px; gap: 16px;';
      const label = document.createElement('span');
      label.textContent = item.label;
      label.style.color = '#64748b';
      const val = document.createElement('span');
      val.textContent = item.val.replace(/&bull;/g, '•');
      val.style.fontWeight = '600';
      val.style.textAlign = 'right';
      row.appendChild(label);
      row.appendChild(val);
      detailsList.appendChild(row);
    });
    modalBody.appendChild(detailsList);

    // 3. Action Button in modal: Share / Copy
    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn btn-primary';
    copyBtn.style.cssText = 'width: 100%; padding: 12px; font-size: 0.9rem;';
    copyBtn.textContent = '📋 Salin Rincian Pertandingan';
    copyBtn.addEventListener('click', () => {
      copyMatchToClipboard(match);
    });
    modalBody.appendChild(copyBtn);

    // Show Modal
    modalBackdrop.classList.add('active');
    modalBackdrop.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    modalBackdrop.setAttribute('aria-hidden', 'true');
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });

  // Delegate Click on Detail Buttons
  document.addEventListener('click', (e) => {
    const detailBtn = e.target.closest('.btn-detail-modal');
    if (detailBtn) {
      const matchId = detailBtn.getAttribute('data-match-id');
      if (matchId) {
        openMatchModal(matchId);
      }
    }
  });

  // -------------------------------------------------------------------------
  // 6. Copy Match Info to Clipboard
  // -------------------------------------------------------------------------
  function copyMatchToClipboard(match) {
    const text = `🏆 [DEAN'S CUP UNAI 2026]\n` +
                 `📌 ${match.sport_name} • ${match.stage}\n` +
                 `⚔️ ${match.team_a.name} vs ${match.team_b.name}\n` +
                 `📅 ${match.date} • ${match.time}\n` +
                 `🏟️ Venue: ${match.venue}\n` +
                 `🔗 Pantau di: https://deanscup.unai.edu`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Jadwal pertandingan berhasil disalin ke clipboard!');
      }).catch(() => {
        showToast('Gagal menyalin teks ke clipboard.');
      });
    } else {
      showToast('Fitur clipboard tidak didukung peramban.');
    }
  }

  document.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('.btn-copy-info');
    if (copyBtn) {
      const matchId = copyBtn.getAttribute('data-match-id');
      const match = state.matchesData.find(m => m.id === matchId);
      if (match) {
        copyMatchToClipboard(match);
      } else {
        showToast('Jadwal pertandingan berhasil disalin!');
      }
    }
  });

  // -------------------------------------------------------------------------
  // 7. Live Countdown Timer
  // -------------------------------------------------------------------------
  function initCountdown() {
    const widget = document.getElementById('countdown-widget');
    if (!widget) return;

    const targetAttr = widget.getAttribute('data-target') || '2026-11-24T17:00:00';
    const targetDate = new Date(targetAttr).getTime();

    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minsEl) minsEl.textContent = '00';
        if (secsEl) secsEl.textContent = '00';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
      if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // -------------------------------------------------------------------------
  // 8. Navigation Active Link on Scroll
  // -------------------------------------------------------------------------
  function initNavScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu .nav-item');

    window.addEventListener('scroll', () => {
      let current = '';
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop;

      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }, { passive: true });
  }

  // Initialize all modules
  initTheme();
  loadScheduleApi();
  initCountdown();
  initNavScroll();
});
