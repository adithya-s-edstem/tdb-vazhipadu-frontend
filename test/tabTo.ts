import type { UserEvent } from "@testing-library/user-event";

const MAX_TAB_PRESSES = 100;

export async function tabTo(user: UserEvent, target: HTMLElement): Promise<void> {
  for (let presses = 0; presses < MAX_TAB_PRESSES; presses += 1) {
    if (document.activeElement === target) {
      return;
    }
    await user.tab();
  }
  throw new Error(`Tab never reached ${target.outerHTML}`);
}
