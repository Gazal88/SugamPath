// A minimal in-memory store standing in for the real backend feed until Role 2 ships
// the reports API in week 5-6. Deliberately tiny — no redux/zustand needed for one array.
// Swap addReport/subscribe for a real API call + polling/websocket later; screens that
// consume this (HomeScreen) shouldn't need to change their own logic, just the source.

export type LiveReport = {
  id: string;
  title: string;
  meta: string;
  kind: 'warning' | 'resolved';
};

let reports: LiveReport[] = [
  { id: 'r1', title: 'Ramp blocked — Sector 12 Market', meta: 'Reported 20 min ago · 4 upvotes', kind: 'warning' },
  { id: 'r2', title: 'Lift restored — District Court', meta: 'Verified 1 hr ago by NGO Sahayak', kind: 'resolved' },
];

type Listener = () => void;
const listeners = new Set<Listener>();

export function getReports(): LiveReport[] {
  return reports;
}

export function addReport(report: Omit<LiveReport, 'id' | 'meta'>) {
  reports = [
    { ...report, id: `r${Date.now()}`, meta: 'Reported just now · 0 upvotes' },
    ...reports,
  ];
  listeners.forEach((l) => l());
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
