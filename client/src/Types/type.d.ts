type TSortOrder = "asc" | "desc";
type TSort = "createdAt" | "answers";
type TFilter = "all" | "blocked" | "active";
type Ttransaction = "all" | "deposit" | "withdrawal" | "earning";
 type Tuser = "mentor" | "mentee"|'admin';
export const enum SlotStatus {
  "RESCHEDULED",
  "CANCELLED",
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "RECLAIM_REQUESTED",
}
