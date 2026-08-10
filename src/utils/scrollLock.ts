import { getLenis } from "./smoothScroll";

/**
 * Reference-counted scroll lock. Both the mobile menu and the command
 * palette can lock scrolling independently; the page only actually
 * becomes scrollable again once *every* consumer has released its
 * lock — otherwise, if one closes while the other is still open, it
 * would prematurely re-enable scrolling underneath the one still
 * showing.
 */
let lockCount = 0;

export function acquireScrollLock() {
  lockCount += 1;
  if (lockCount === 1) {
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
  }
}

export function releaseScrollLock() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = "";
    getLenis()?.start();
  }
}
