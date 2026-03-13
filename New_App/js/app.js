/**
 * app.js – Swinton Go! Insurance Motor Quote Demo
 * Manages per-page form data using sessionStorage, vehicle lookup,
 * and quote price calculation.
 */

// ── Storage helpers ───────────────────────────────────────
const Store = (() => {
    const PREFIX = 'sgq_';
    return {
        get(key)      { try { return JSON.parse(sessionStorage.getItem(PREFIX + key)); } catch { return null; } },
        set(key, val) { try { sessionStorage.setItem(PREFIX + key, JSON.stringify(val)); } catch {} },
        clear()       {
            const keys = Object.keys(sessionStorage).filter(k => k.startsWith(PREFIX));
            keys.forEach(k => sessionStorage.removeItem(k));
        }
    };
})();

// ── Vehicle database (demo stub) ──────────────────────────
const VEHICLES = {
    'D500NLE': {
        make:         'Volkswagen',
        model:        'Golf',
        variant:      '1.5 TSI SE 5dr',
        year:         2019,
        cc:           1498,
        fuelType:     'Petrol',
        transmission: 'Manual',
        doors:        5,
        bodyType:     'Hatchback',
        colour:       'Metallic Silver',
        value:        14250
    }
};

function lookupVehicle(rawReg) {
    const reg = rawReg.replace(/\s+/g, '').toUpperCase();
    return VEHICLES[reg] || null;
}

// ── Quote price calculation ───────────────────────────────
function calculateQuote(data) {
    let base = 580;

    // Age factor
    if (data.dob) {
        const dob = new Date(data.dob);
        const age = Math.floor((Date.now() - dob) / (365.25 * 24 * 3600 * 1000));
        if      (age < 22) base += 600;
        else if (age < 25) base += 350;
        else if (age < 30) base += 100;
        else if (age > 70) base += 120;
    }

    // Cover type
    const cover = data.coverType || 'comprehensive';
    if      (cover === 'tpft') base -= 40;
    else if (cover === 'tpo')  base -= 130;

    // NCB discount
    const ncb     = parseInt(data.ncbYears || 0, 10);
    const ncbDisc = Math.min(ncb * 0.07, 0.65);
    base = base * (1 - ncbDisc);

    // Claims
    base += (parseInt(data.claimsCount || 0, 10)) * 220;

    // Convictions
    base += (parseInt(data.convictionsCount || 0, 10)) * 175;

    // Voluntary excess credit
    const volExcess = parseInt(data.voluntaryExcess || 0, 10);
    if (volExcess >= 500) base -= 40;
    else if (volExcess >= 250) base -= 20;

    const annual  = Math.max(Math.round(base), 200);
    const monthly = Math.round((annual * 1.13) / 12 * 100) / 100;

    return { annual, monthly };
}

// ── Form helpers ──────────────────────────────────────────
function setError(input, msg) {
    input.classList.add('form-control--error');
    const v = input.closest('.form-row')?.querySelector('.form-row__validation-text');
    if (v) { v.textContent = msg; v.classList.add('visible'); }
}

function clearError(input) {
    input.classList.remove('form-control--error');
    const v = input.closest('.form-row')?.querySelector('.form-row__validation-text');
    if (v) v.classList.remove('visible');
}

function validateRequired(input, label) {
    if (!input.value.trim()) {
        setError(input, `${label || 'This field'} is required`);
        return false;
    }
    clearError(input);
    return true;
}

// ── DOM helpers ───────────────────────────────────────────
function $(sel, ctx) { return (ctx || document).querySelector(sel); }
function $$(sel, ctx){ return [...(ctx || document).querySelectorAll(sel)]; }

function autoUppercase(input) {
    input.addEventListener('input', () => { input.value = input.value.toUpperCase(); });
}

// ── Shared init ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Footer year
    const fy = document.getElementById('footer-year');
    if (fy) fy.textContent = new Date().getFullYear();

    // Mark step as done/active in progress bar from data-step on body
    const active = parseInt(document.body.dataset.step, 10);
    const steps = $$('.step');
    steps.forEach(s => {
        const n = parseInt(s.dataset.step, 10);
        if (n < active)  s.classList.add('step--done');
        if (n === active) s.classList.add('step--active');
    });
});
