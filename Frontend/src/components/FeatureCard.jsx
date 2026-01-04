export default function FeatureCard({ title, desc }) {
  return (
    <div className="p-4 border rounded bg-gray-50">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}
