export const APPLICATION_STATUSES = [
  "applied",
  "screening",
  "interview",
  "technical",
  "offer",
  "rejected",
  "no_response",
] as const;

export const APPLICATION_SOURCES = ["linkedin", "site", "referral", "other"] as const;

export const WORK_TYPES = ["remote", "hybrid", "onsite"] as const;

export const ACTIVE_STATUSES = ["applied", "screening", "interview", "technical"] as const;
