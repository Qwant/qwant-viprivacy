// TODO: remove this
/* eslint-disable */

/**
 * This file is part of Adguard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * Adguard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Adguard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adguard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */

/* global contentPage */

/**
 * Script used to subscribe to filters clicking to links with specified format
 */
// (function () {
//     /*
//
//      Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
//      This code may only be used under the BSD style license found at
//      http://polymer.github.io/LICENSE.txt The complete set of authors may be found
//      at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
//      be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
//      Google as part of the polymer project is also subject to an additional IP
//      rights grant found at http://polymer.github.io/PATENTS.txt
//     */
//
//     'use strict';
//
//     const n = window.Document.prototype.createElement; const p = window.Document.prototype.createElementNS; const aa = window.Document.prototype.importNode; const ba = window.Document.prototype.prepend; const ca = window.Document.prototype.append; const da = window.DocumentFragment.prototype.prepend; const ea = window.DocumentFragment.prototype.append; const q = window.Node.prototype.cloneNode; const r = window.Node.prototype.appendChild; const t = window.Node.prototype.insertBefore; const u = window.Node.prototype.removeChild; const v = window.Node.prototype.replaceChild; const w = Object.getOwnPropertyDescriptor(window.Node.prototype,
//         'textContent'); const y = window.Element.prototype.attachShadow; const z = Object.getOwnPropertyDescriptor(window.Element.prototype, 'innerHTML'); const A = window.Element.prototype.getAttribute; const B = window.Element.prototype.setAttribute; const C = window.Element.prototype.removeAttribute; const D = window.Element.prototype.getAttributeNS; const E = window.Element.prototype.setAttributeNS; const F = window.Element.prototype.removeAttributeNS; const G = window.Element.prototype.insertAdjacentElement; const H = window.Element.prototype.insertAdjacentHTML; const fa = window.Element.prototype.prepend;
//     const ha = window.Element.prototype.append; const ia = window.Element.prototype.before; const ja = window.Element.prototype.after; const ka = window.Element.prototype.replaceWith; const la = window.Element.prototype.remove; const ma = window.HTMLElement; const I = Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, 'innerHTML'); const na = window.HTMLElement.prototype.insertAdjacentElement; const oa = window.HTMLElement.prototype.insertAdjacentHTML; const pa = new Set(); 'annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph'.split(' ').forEach((a) => { return pa.add(a); }); function qa(a) { const b = pa.has(a); a = /^[a-z][.0-9_a-z]*-[-.0-9_a-z]*$/.test(a); return !b && a; } const ra = document.contains ? document.contains.bind(document) : document.documentElement.contains.bind(document.documentElement);
//     function J(a) { const b = a.isConnected; if (void 0 !== b) return b; if (ra(a)) return !0; for (;a && !(a.__CE_isImportDocument || a instanceof Document);)a = a.parentNode || (window.ShadowRoot && a instanceof ShadowRoot ? a.host : void 0); return !(!a || !(a.__CE_isImportDocument || a instanceof Document)); } function K(a) { let b = a.children; if (b) return Array.prototype.slice.call(b); b = []; for (a = a.firstChild; a; a = a.nextSibling)a.nodeType === Node.ELEMENT_NODE && b.push(a); return b; }
//     function L(a, b) { for (;b && b !== a && !b.nextSibling;)b = b.parentNode; return b && b !== a ? b.nextSibling : null; }
//     function M(a, b, c) { for (let f = a; f;) { if (f.nodeType === Node.ELEMENT_NODE) { let d = f; b(d); const e = d.localName; if (e === 'link' && d.getAttribute('rel') === 'import') { f = d.import; void 0 === c && (c = new Set()); if (f instanceof Node && !c.has(f)) for (c.add(f), f = f.firstChild; f; f = f.nextSibling)M(f, b, c); f = L(a, d); continue; } else if (e === 'template') { f = L(a, d); continue; } if (d = d.__CE_shadowRoot) for (d = d.firstChild; d; d = d.nextSibling)M(d, b, c); }f = f.firstChild ? f.firstChild : L(a, f); } } function N() { const a = !(O === null || void 0 === O || !O.noDocumentConstructionObserver); const b = !(O === null || void 0 === O || !O.shadyDomFastWalk); this.m = []; this.g = []; this.j = !1; this.shadyDomFastWalk = b; this.I = !a; } function P(a, b, c, f) { const d = window.ShadyDOM; if (a.shadyDomFastWalk && d && d.inUse) { if (b.nodeType === Node.ELEMENT_NODE && c(b), b.querySelectorAll) for (a = d.nativeMethods.querySelectorAll.call(b, '*'), b = 0; b < a.length; b++)c(a[b]); } else M(b, c, f); } function sa(a, b) { a.j = !0; a.m.push(b); } function ta(a, b) { a.j = !0; a.g.push(b); }
//     function Q(a, b) { a.j && P(a, b, (c) => { return R(a, c); }); } function R(a, b) { if (a.j && !b.__CE_patched) { b.__CE_patched = !0; for (var c = 0; c < a.m.length; c++)a.m[c](b); for (c = 0; c < a.g.length; c++)a.g[c](b); } } function S(a, b) { const c = []; P(a, b, (d) => { return c.push(d); }); for (b = 0; b < c.length; b++) { const f = c[b]; f.__CE_state === 1 ? a.connectedCallback(f) : T(a, f); } } function U(a, b) { const c = []; P(a, b, (d) => { return c.push(d); }); for (b = 0; b < c.length; b++) { const f = c[b]; f.__CE_state === 1 && a.disconnectedCallback(f); } }
//     function V(a, b, c) {
//         c = void 0 === c ? {} : c; const f = c.J; const d = c.upgrade || function (g) { return T(a, g); }; const e = []; P(a, b, (g) => {
//             a.j && R(a, g); if (g.localName === 'link' && g.getAttribute('rel') === 'import') {
//                 const h = g.import; h instanceof Node && (h.__CE_isImportDocument = !0, h.__CE_registry = document.__CE_registry); h && h.readyState === 'complete' ? h.__CE_documentLoadHandled = !0 : g.addEventListener('load', () => {
//                     const k = g.import; if (!k.__CE_documentLoadHandled) {
//                         k.__CE_documentLoadHandled = !0; const l = new Set(); f && (f.forEach((m) => { return l.add(m); }),
//                         l.delete(k)); V(a, k, { J: l, upgrade: d });
//                     }
//                 });
//             } else e.push(g);
//         }, f); for (b = 0; b < e.length; b++)d(e[b]);
//     }
//     function T(a, b) {
//         try {
//             const c = b.ownerDocument; const f = c.__CE_registry; let d = f && (c.defaultView || c.__CE_isImportDocument) ? W(f, b.localName) : void 0; if (d && void 0 === b.__CE_state) {
//                 d.constructionStack.push(b); try { try { if (new d.constructorFunction() !== b) throw Error('The custom element constructor did not produce the element being upgraded.'); } finally { d.constructionStack.pop(); } } catch (k) { throw b.__CE_state = 2, k; }b.__CE_state = 1; b.__CE_definition = d; if (d.attributeChangedCallback && b.hasAttributes()) {
//                     const e = d.observedAttributes;
//                     for (d = 0; d < e.length; d++) { const g = e[d]; const h = b.getAttribute(g); h !== null && a.attributeChangedCallback(b, g, null, h, null); }
//                 }J(b) && a.connectedCallback(b);
//             }
//         } catch (k) { X(k); }
//     }N.prototype.connectedCallback = function (a) { const b = a.__CE_definition; if (b.connectedCallback) try { b.connectedCallback.call(a); } catch (c) { X(c); } }; N.prototype.disconnectedCallback = function (a) { const b = a.__CE_definition; if (b.disconnectedCallback) try { b.disconnectedCallback.call(a); } catch (c) { X(c); } };
//     N.prototype.attributeChangedCallback = function (a, b, c, f, d) { const e = a.__CE_definition; if (e.attributeChangedCallback && e.observedAttributes.indexOf(b) > -1) try { e.attributeChangedCallback.call(a, b, c, f, d); } catch (g) { X(g); } };
//     function ua(a, b, c, f) {
//         let d = b.__CE_registry; if (d && (f === null || f === 'http://www.w3.org/1999/xhtml') && (d = W(d, c))) {
//             try {
//                 const e = new d.constructorFunction(); if (void 0 === e.__CE_state || void 0 === e.__CE_definition) throw Error(`Failed to construct '${c}': The returned value was not constructed with the HTMLElement constructor.`); if (e.namespaceURI !== 'http://www.w3.org/1999/xhtml') throw Error(`Failed to construct '${c}': The constructed element's namespace must be the HTML namespace.`); if (e.hasAttributes()) {
//                     throw Error(`Failed to construct '${
//                         c}': The constructed element must not have any attributes.`);
//                 } if (e.firstChild !== null) throw Error(`Failed to construct '${c}': The constructed element must not have any children.`); if (e.parentNode !== null) throw Error(`Failed to construct '${c}': The constructed element must not have a parent node.`); if (e.ownerDocument !== b) throw Error(`Failed to construct '${c}': The constructed element's owner document is incorrect.`); if (e.localName !== c) throw Error(`Failed to construct '${c}': The constructed element's local name is incorrect.`);
//                 return e;
//             } catch (g) { return X(g), b = f === null ? n.call(b, c) : p.call(b, f, c), Object.setPrototypeOf(b, HTMLUnknownElement.prototype), b.__CE_state = 2, b.__CE_definition = void 0, R(a, b), b; }
//         }b = f === null ? n.call(b, c) : p.call(b, f, c); R(a, b); return b;
//     }
//     function X(a) {
//         const b = a.message; const c = a.sourceURL || a.fileName || ''; const f = a.line || a.lineNumber || 0; const d = a.column || a.columnNumber || 0; let e = void 0; void 0 === ErrorEvent.prototype.initErrorEvent ? e = new ErrorEvent('error', {
//             cancelable: !0, message: b, filename: c, lineno: f, colno: d, error: a,
//         }) : (e = document.createEvent('ErrorEvent'), e.initErrorEvent('error', !1, !0, b, c, f), e.preventDefault = function () { Object.defineProperty(this, 'defaultPrevented', { configurable: !0, get() { return !0; } }); }); void 0 === e.error && Object.defineProperty(e, 'error',
//             { configurable: !0, enumerable: !0, get() { return a; } }); window.dispatchEvent(e); e.defaultPrevented || console.error(a);
//     } function va() { const a = this; this.g = void 0; this.F = new Promise((b) => { a.l = b; }); }va.prototype.resolve = function (a) { if (this.g) throw Error('Already resolved.'); this.g = a; this.l(a); }; function wa(a) { const b = document; this.l = void 0; this.h = a; this.g = b; V(this.h, this.g); this.g.readyState === 'loading' && (this.l = new MutationObserver(this.G.bind(this)), this.l.observe(this.g, { childList: !0, subtree: !0 })); } function xa(a) { a.l && a.l.disconnect(); }wa.prototype.G = function (a) { let b = this.g.readyState; b !== 'interactive' && b !== 'complete' || xa(this); for (b = 0; b < a.length; b++) for (let c = a[b].addedNodes, f = 0; f < c.length; f++)V(this.h, c[f]); }; function Y(a) { this.s = new Map(); this.u = new Map(); this.C = new Map(); this.A = !1; this.B = new Map(); this.o = function (b) { return b(); }; this.i = !1; this.v = []; this.h = a; this.D = a.I ? new wa(a) : void 0; }Y.prototype.H = function (a, b) { const c = this; if (!(b instanceof Function)) throw new TypeError('Custom element constructor getters must be functions.'); ya(this, a); this.s.set(a, b); this.v.push(a); this.i || (this.i = !0, this.o(() => { return za(c); })); };
//     Y.prototype.define = function (a, b) { const c = this; if (!(b instanceof Function)) throw new TypeError('Custom element constructors must be functions.'); ya(this, a); Aa(this, a, b); this.v.push(a); this.i || (this.i = !0, this.o(() => { return za(c); })); }; function ya(a, b) { if (!qa(b)) throw new SyntaxError(`The element name '${b}' is not valid.`); if (W(a, b)) throw Error(`A custom element with name '${b}' has already been defined.`); if (a.A) throw Error('A custom element is already being defined.'); }
//     function Aa(a, b, c) {
//         a.A = !0; let f; try { const d = c.prototype; if (!(d instanceof Object)) throw new TypeError("The custom element constructor's prototype is not an object."); const e = function (m) { const x = d[m]; if (void 0 !== x && !(x instanceof Function)) throw Error(`The '${m}' callback must be a function.`); return x; }; var g = e('connectedCallback'); var h = e('disconnectedCallback'); var k = e('adoptedCallback'); var l = (f = e('attributeChangedCallback')) && c.observedAttributes || []; } catch (m) { throw m; } finally { a.A = !1; }c = {
//             localName: b,
//             constructorFunction: c,
//             connectedCallback: g,
//             disconnectedCallback: h,
//             adoptedCallback: k,
//             attributeChangedCallback: f,
//             observedAttributes: l,
//             constructionStack: [],
//         }; a.u.set(b, c); a.C.set(c.constructorFunction, c); return c;
//     }Y.prototype.upgrade = function (a) { V(this.h, a); };
//     function za(a) { if (!1 !== a.i) { a.i = !1; for (var b = [], c = a.v, f = new Map(), d = 0; d < c.length; d++)f.set(c[d], []); V(a.h, document, { upgrade(k) { if (void 0 === k.__CE_state) { const l = k.localName; const m = f.get(l); m ? m.push(k) : a.u.has(l) && b.push(k); } } }); for (d = 0; d < b.length; d++)T(a.h, b[d]); for (d = 0; d < c.length; d++) { for (var e = c[d], g = f.get(e), h = 0; h < g.length; h++)T(a.h, g[h]); (e = a.B.get(e)) && e.resolve(void 0); }c.length = 0; } }Y.prototype.get = function (a) { if (a = W(this, a)) return a.constructorFunction; };
//     Y.prototype.whenDefined = function (a) { if (!qa(a)) return Promise.reject(new SyntaxError(`'${a}' is not a valid custom element name.`)); let b = this.B.get(a); if (b) return b.F; b = new va(); this.B.set(a, b); const c = this.u.has(a) || this.s.has(a); a = this.v.indexOf(a) === -1; c && a && b.resolve(void 0); return b.F; }; Y.prototype.polyfillWrapFlushCallback = function (a) { this.D && xa(this.D); const b = this.o; this.o = function (c) { return a(() => { return b(c); }); }; };
//     function W(a, b) { let c = a.u.get(b); if (c) return c; if (c = a.s.get(b)) { a.s.delete(b); try { return Aa(a, b, c()); } catch (f) { X(f); } } }window.CustomElementRegistry = Y; Y.prototype.define = Y.prototype.define; Y.prototype.upgrade = Y.prototype.upgrade; Y.prototype.get = Y.prototype.get; Y.prototype.whenDefined = Y.prototype.whenDefined; Y.prototype.polyfillDefineLazy = Y.prototype.H; Y.prototype.polyfillWrapFlushCallback = Y.prototype.polyfillWrapFlushCallback; function Z(a, b, c) { function f(d) { return function (e) { for (var g = [], h = 0; h < arguments.length; ++h)g[h] = arguments[h]; h = []; for (var k = [], l = 0; l < g.length; l++) { let m = g[l]; m instanceof Element && J(m) && k.push(m); if (m instanceof DocumentFragment) for (m = m.firstChild; m; m = m.nextSibling)h.push(m); else h.push(m); }d.apply(this, g); for (g = 0; g < k.length; g++)U(a, k[g]); if (J(this)) for (g = 0; g < h.length; g++)k = h[g], k instanceof Element && S(a, k); }; } void 0 !== c.prepend && (b.prepend = f(c.prepend)); void 0 !== c.append && (b.append = f(c.append)); } function Ba(a) { Document.prototype.createElement = function (b) { return ua(a, this, b, null); }; Document.prototype.importNode = function (b, c) { b = aa.call(this, b, !!c); this.__CE_registry ? V(a, b) : Q(a, b); return b; }; Document.prototype.createElementNS = function (b, c) { return ua(a, this, c, b); }; Z(a, Document.prototype, { prepend: ba, append: ca }); } function Ca(a) {
//         function b(f) { return function (d) { for (var e = [], g = 0; g < arguments.length; ++g)e[g] = arguments[g]; g = []; for (var h = [], k = 0; k < e.length; k++) { let l = e[k]; l instanceof Element && J(l) && h.push(l); if (l instanceof DocumentFragment) for (l = l.firstChild; l; l = l.nextSibling)g.push(l); else g.push(l); }f.apply(this, e); for (e = 0; e < h.length; e++)U(a, h[e]); if (J(this)) for (e = 0; e < g.length; e++)h = g[e], h instanceof Element && S(a, h); }; } const c = Element.prototype; void 0 !== ia && (c.before = b(ia)); void 0 !== ja && (c.after = b(ja)); void 0 !== ka
//     && (c.replaceWith = function (f) { for (var d = [], e = 0; e < arguments.length; ++e)d[e] = arguments[e]; e = []; for (var g = [], h = 0; h < d.length; h++) { let k = d[h]; k instanceof Element && J(k) && g.push(k); if (k instanceof DocumentFragment) for (k = k.firstChild; k; k = k.nextSibling)e.push(k); else e.push(k); }h = J(this); ka.apply(this, d); for (d = 0; d < g.length; d++)U(a, g[d]); if (h) for (U(a, this), d = 0; d < e.length; d++)g = e[d], g instanceof Element && S(a, g); }); void 0 !== la && (c.remove = function () { const f = J(this); la.call(this); f && U(a, this); });
//     } function Da(a) {
//         function b(d, e) {
//             Object.defineProperty(d, 'innerHTML', {
//                 enumerable: e.enumerable, configurable: !0, get: e.get, set(g) { const h = this; let k = void 0; J(this) && (k = [], P(a, this, (x) => { x !== h && k.push(x); })); e.set.call(this, g); if (k) for (let l = 0; l < k.length; l++) { const m = k[l]; m.__CE_state === 1 && a.disconnectedCallback(m); } this.ownerDocument.__CE_registry ? V(a, this) : Q(a, this); return g; },
//             });
//         } function c(d, e) { d.insertAdjacentElement = function (g, h) { const k = J(h); g = e.call(this, g, h); k && U(a, h); J(g) && S(a, h); return g; }; } function f(d,
//             e) {
//             function g(h, k) { for (var l = []; h !== k; h = h.nextSibling)l.push(h); for (k = 0; k < l.length; k++)V(a, l[k]); }d.insertAdjacentHTML = function (h, k) {
//                 h = h.toLowerCase(); if (h === 'beforebegin') { var l = this.previousSibling; e.call(this, h, k); g(l || this.parentNode.firstChild, this); } else if (h === 'afterbegin')l = this.firstChild, e.call(this, h, k), g(this.firstChild, l); else if (h === 'beforeend')l = this.lastChild, e.call(this, h, k), g(l || this.firstChild, null); else if (h === 'afterend')l = this.nextSibling, e.call(this, h, k), g(this.nextSibling, l);
//                 else throw new SyntaxError(`The value provided (${String(h)}) is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'.`);
//             };
//         }y && (Element.prototype.attachShadow = function (d) { d = y.call(this, d); if (a.j && !d.__CE_patched) { d.__CE_patched = !0; for (let e = 0; e < a.m.length; e++)a.m[e](d); } return this.__CE_shadowRoot = d; }); z && z.get ? b(Element.prototype, z) : I && I.get ? b(HTMLElement.prototype, I) : ta(a, (d) => {
//             b(d, {
//                 enumerable: !0,
//                 configurable: !0,
//                 get() { return q.call(this, !0).innerHTML; },
//                 set(e) {
//                     const g = this.localName === 'template'; const h = g ? this.content : this; const k = p.call(document, this.namespaceURI, this.localName); for (k.innerHTML = e; h.childNodes.length > 0;)u.call(h, h.childNodes[0]); for (e = g ? k.content : k; e.childNodes.length > 0;)r.call(h, e.childNodes[0]);
//                 },
//             });
//         }); Element.prototype.setAttribute = function (d, e) { if (this.__CE_state !== 1) return B.call(this, d, e); const g = A.call(this, d); B.call(this, d, e); e = A.call(this, d); a.attributeChangedCallback(this, d, g, e, null); }; Element.prototype.setAttributeNS = function (d, e, g) {
//             if (this.__CE_state !== 1) {
//                 return E.call(this,
//                     d, e, g);
//             } const h = D.call(this, d, e); E.call(this, d, e, g); g = D.call(this, d, e); a.attributeChangedCallback(this, e, h, g, d);
//         }; Element.prototype.removeAttribute = function (d) { if (this.__CE_state !== 1) return C.call(this, d); const e = A.call(this, d); C.call(this, d); e !== null && a.attributeChangedCallback(this, d, e, null, null); }; Element.prototype.removeAttributeNS = function (d, e) { if (this.__CE_state !== 1) return F.call(this, d, e); const g = D.call(this, d, e); F.call(this, d, e); const h = D.call(this, d, e); g !== h && a.attributeChangedCallback(this, e, g, h, d); };
//         na ? c(HTMLElement.prototype, na) : G && c(Element.prototype, G); oa ? f(HTMLElement.prototype, oa) : H && f(Element.prototype, H); Z(a, Element.prototype, { prepend: fa, append: ha }); Ca(a);
//     } const Ea = {}; function Fa(a) {
//         function b() {
//             const c = this.constructor; const f = document.__CE_registry.C.get(c); if (!f) throw Error('Failed to construct a custom element: The constructor was not registered with `customElements`.'); let d = f.constructionStack; if (d.length === 0) return d = n.call(document, f.localName), Object.setPrototypeOf(d, c.prototype), d.__CE_state = 1, d.__CE_definition = f, R(a, d), d; const e = d.length - 1; const g = d[e]; if (g === Ea) throw Error(`Failed to construct '${f.localName}': This element was already constructed.`); d[e] = Ea;
//             Object.setPrototypeOf(g, c.prototype); R(a, g); return g;
//         }b.prototype = ma.prototype; Object.defineProperty(HTMLElement.prototype, 'constructor', {
//             writable: !0, configurable: !0, enumerable: !1, value: b,
//         }); window.HTMLElement = b;
//     } function Ga(a) {
//         function b(c, f) {
//             Object.defineProperty(c, 'textContent', {
//                 enumerable: f.enumerable, configurable: !0, get: f.get, set(d) { if (this.nodeType === Node.TEXT_NODE)f.set.call(this, d); else { let e = void 0; if (this.firstChild) { const g = this.childNodes; const h = g.length; if (h > 0 && J(this)) { e = Array(h); for (let k = 0; k < h; k++)e[k] = g[k]; } }f.set.call(this, d); if (e) for (d = 0; d < e.length; d++)U(a, e[d]); } },
//             });
//         }Node.prototype.insertBefore = function (c, f) {
//             if (c instanceof DocumentFragment) {
//                 var d = K(c); c = t.call(this, c, f); if (J(this)) { for (f = 0; f < d.length; f++)S(a, d[f]); } return c;
//             }d = c instanceof Element && J(c); f = t.call(this, c, f); d && U(a, c); J(this) && S(a, c); return f;
//         }; Node.prototype.appendChild = function (c) { if (c instanceof DocumentFragment) { var f = K(c); c = r.call(this, c); if (J(this)) for (var d = 0; d < f.length; d++)S(a, f[d]); return c; }f = c instanceof Element && J(c); d = r.call(this, c); f && U(a, c); J(this) && S(a, c); return d; }; Node.prototype.cloneNode = function (c) { c = q.call(this, !!c); this.ownerDocument.__CE_registry ? V(a, c) : Q(a, c); return c; }; Node.prototype.removeChild = function (c) {
//             const f = c instanceof Element && J(c); const d = u.call(this, c); f && U(a, c); return d;
//         }; Node.prototype.replaceChild = function (c, f) { if (c instanceof DocumentFragment) { var d = K(c); c = v.call(this, c, f); if (J(this)) for (U(a, f), f = 0; f < d.length; f++)S(a, d[f]); return c; }d = c instanceof Element && J(c); const e = v.call(this, c, f); const g = J(this); g && U(a, f); d && U(a, c); g && S(a, c); return e; }; w && w.get ? b(Node.prototype, w) : sa(a, (c) => {
//             b(c, {
//                 enumerable: !0,
//                 configurable: !0,
//                 get() {
//                     for (var f = [], d = this.firstChild; d; d = d.nextSibling) {
//                         d.nodeType !== Node.COMMENT_NODE
//         && f.push(d.textContent);
//                     } return f.join('');
//                 },
//                 set(f) { for (;this.firstChild;)u.call(this, this.firstChild); f != null && f !== '' && r.call(this, document.createTextNode(f)); },
//             });
//         });
//     } var O = window.customElements; function Ha() { let a = new N(); Fa(a); Ba(a); Z(a, DocumentFragment.prototype, { prepend: da, append: ea }); Ga(a); Da(a); a = new Y(a); document.__CE_registry = a; Object.defineProperty(window, 'customElements', { configurable: !0, enumerable: !0, value: a }); }O && !O.forcePolyfill && typeof O.define === 'function' && typeof O.get === 'function' || Ha(); window.__CE_installPolyfill = Ha;
// // eslint-disable-next-line no-restricted-globals
// }).call(self);

(function () {
    if (!(document instanceof HTMLDocument)) {
        return;
    }

    const getSubscriptionParams = (urlParams) => {
        let title = null;
        let url = null;

        for (let i = 0; i < urlParams.length; i += 1) {
            const parts = urlParams[i].split('=', 2);
            if (parts.length !== 2) {
                continue;
            }
            switch (parts[0]) {
                case 'title':
                    title = decodeURIComponent(parts[1]);
                    break;
                case 'location':
                    url = decodeURIComponent(parts[1]);
                    break;
                default:
                    break;
            }
        }

        return {
            title,
            url,
        };
    };

    const onLinkClicked = function (e) {
        if (e.button === 2) {
            // ignore right-click
            return;
        }

        let { target } = e;
        while (target) {
            if (target instanceof HTMLAnchorElement) {
                break;
            }
            target = target.parentNode;
        }

        if (!target) {
            return;
        }

        if (target.protocol === 'http:' || target.protocol === 'https:') {
            if (target.host !== 'subscribe.adblockplus.org' || target.pathname !== '/') {
                return;
            }
        } else if (!(/^abp:\/*subscribe\/*\?/i.test(target.href)
            || /^adguard:\/*subscribe\/*\?/i.test(target.href))) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        let urlParams;
        if (target.search) {
            urlParams = target.search.substring(1).replace(/&amp;/g, '&').split('&');
        } else {
            const { href } = target;
            const index = href.indexOf('?');
            urlParams = href.substring(index + 1).replace(/&amp;/g, '&').split('&');
        }

        const subParams = getSubscriptionParams(urlParams);
        const url = subParams.url.trim();
        const title = (subParams.title || url).trim();

        if (!url) {
            return;
        }

        contentPage.sendMessage({
            type: 'addFilterSubscription',
            url,
            title,
        });
    };

    document.addEventListener('click', onLinkClicked);

    window.setTimeout(() => {
        console.log('loaded ::re🟥');
        addHighlightFeature();
    }, 1000);
})();

function addHighlightFeature() {
    const highlightColor = 'rgb(213, 234, 255)';

    //     const template = `
    //   <template id="highlightTemplate">
    //     <span class="highlight" style="background-color: ${highlightColor}; display: inline"></span>
    //   </template>
    //   <button id="mediumHighlighter">
    //     <span>Search on <b>Qwant </b></span>
    //   </button>
    // `;

    const styled = ({ display = 'none', left = 0, top = 0 }) => `
  #mediumHighlighter {
    align-items: center;
    background-color: #5c97ff;
    border-radius: 5px;
    cursor: pointer;
    display: ${display};
    justify-content: center;
    left: ${left}px;
    padding: 5px 10px;
    position: fixed;
    top: ${top}px;
    z-index: 9999;
  }
  .text-marker {
    fill: white;
  }
  .text-marker:hover {
    fill: ${highlightColor};
  }
`;

    // class MediumHighlighter extends HTMLElement {
    //     constructor() {
    //         super();
    //         this.render();
    //     }
    //
    //     get markerPosition() {
    //         return JSON.parse(this.getAttribute('markerPosition') || '{}');
    //     }
    //
    //     get styleElement() {
    //         return this.shadowRoot.querySelector('style');
    //     }
    //
    //     get highlightTemplate() {
    //         return this.shadowRoot.getElementById('highlightTemplate');
    //     }
    //
    //     static get observedAttributes() {
    //         return ['markerPosition'];
    //     }
    //
    //     render() {
    //         this.attachShadow({ mode: 'open' });
    //         const style = document.createElement('style');
    //         style.textContent = styled({});
    //         this.shadowRoot.appendChild(style);
    //         this.shadowRoot.innerHTML += template;
    //         this.shadowRoot
    //             .getElementById('mediumHighlighter')
    //             .addEventListener('click', () => this.highlightSelection());
    //     }
    //
    //     attributeChangedCallback(name, oldValue, newValue) {
    //         if (name === 'markerPosition') {
    //             this.styleElement.textContent = styled(this.markerPosition);
    //         }
    //     }
    //
    //     highlightSelection() {
    //         const userSelection = window.getSelection();
    //         const selectedText = userSelection.toString();
    //         const url = new URL('https://qwant.com');
    //         url.searchParams.set('q', selectedText);
    //         window.open(url, '_blank');
    //
    //         // for (let i = 0; i < userSelection.rangeCount; i++) {
    //         //   this.highlightRange(userSelection.getRangeAt(i));
    //         // }
    //         window.getSelection().empty();
    //     }
    //
    //     highlightRange(range) {
    //         const clone = this.highlightTemplate.cloneNode(true).content.firstElementChild;
    //         clone.appendChild(range.extractContents());
    //         range.insertNode(clone);
    //     }
    // }

    // Refactor old way
    const HighLightElement = document.createElement('div');
    HighLightElement.setAttribute('id', 'mediumHighlighter');
    HighLightElement.textContent = 'Search on Qwant';

    const style = document.createElement('style');
    style.innerHTML = styled({});

    const ref = document.querySelector('head');
    const styleRef = ref.appendChild(style);

    console.log(styleRef);

    document.body.appendChild(HighLightElement);

    // window.customElements.define('medium-highlighter', MediumHighlighter);

    // const mediumHighlighter = document.createElement('medium-highlighter');

    // document.body.appendChild(mediumHighlighter);

    // const setMarkerPosition = (markerPosition) => mediumHighlighter.setAttribute(
    //     'markerPosition',
    //     JSON.stringify(markerPosition),
    // );

    const getSelectedText = () => window.getSelection().toString();

    document.addEventListener('click', () => {
        if (getSelectedText().length > 0) {
            // setMarkerPosition(getMarkerPosition());
            styleRef.innerHTML = styled(getMarkerPosition());
        }
    });

    document.addEventListener('selectionchange', () => {
        if (getSelectedText().length === 0) {
            // setMarkerPosition({ display: 'none' });
            styleRef.innerHTML = styled({ display: 'none' });
        }
    });

    function getMarkerPosition() {
        const rangeBounds = window
            .getSelection()
            .getRangeAt(0)
            .getBoundingClientRect();
        return {
            // Substract width of marker button -> 40px / 2 = 20
            left: rangeBounds.left + rangeBounds.width / 2 - 20,
            top: rangeBounds.top - 40,
            display: 'flex',
        };
    }
}
