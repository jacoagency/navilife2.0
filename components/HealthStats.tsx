import { Activity, Heart } from 'lucide-react';

export default function HealthStats() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Health Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <Activity className="text-primary mr-2" size={24} />
          <div>
            <h3 className="text-lg font-semibold">Steps</h3>
            <p className="text-3xl font-bold">8,234</p>
          </div>
        </div>
        <div className="flex items-center">
          <Heart className="text-secondary mr-2" size={24} />
          <div>
            <h3 className="text-lg font-semibold">Heart Rate</h3>
            <p className="text-3xl font-bold">72 bpm</p>
          </div>
        </div>
      </div>
    </div>
  );
}