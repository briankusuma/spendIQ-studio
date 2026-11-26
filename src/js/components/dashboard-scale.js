const DESIGN_WIDTH = 1152; // lebar dashboard di Figma
const MIN_SCALE = 0.48;    // di bawah ini dashboard dipotong kiri-kanan, bukan dikecilkan lagi
const SIDE_SPACE = 32;     // ruang minimal kiri-kanan di layar sempit

/** Skalakan mockup dashboard agar muat di lebar layar (set --dash-scale di .hero). */
export function initDashboardScale() {
  const hero = document.querySelector('[data-hero]');
  const stage = hero?.querySelector('[data-dash-stage]');
  if (!stage) return;

  const apply = () => {
    const available = stage.clientWidth - SIDE_SPACE;
    const scale = Math.max(MIN_SCALE, Math.min(1, available / DESIGN_WIDTH));
    hero.style.setProperty('--dash-scale', scale.toFixed(4));
  };

  new ResizeObserver(apply).observe(stage);
  apply();
}
