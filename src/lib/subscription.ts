export function isSubscribed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (localStorage.getItem("umunsi_subscribed") !== "active") return false;
    const until = localStorage.getItem("umunsi_subscribed_until");
    if (!until) return true; // lifetime or legacy flag
    if (new Date(until).getTime() > Date.now()) return true;
    localStorage.removeItem("umunsi_subscribed");
    localStorage.removeItem("umunsi_subscribed_until");
    localStorage.removeItem("umunsi_subscription_ref");
    localStorage.removeItem("umunsi_subscription_plan");
    return false;
  } catch {
    return false;
  }
}
