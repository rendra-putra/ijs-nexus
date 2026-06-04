import JusticeDashboard from "../components/dashboard/JusticeDashboard";

export default function HomePage() {
  return (
    <div style={{ minHeight: 'calc(100vh - 64px)' }}>
      <JusticeDashboard />
    </div>
  );
}