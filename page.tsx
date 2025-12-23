import Link from 'next/link';
import { Eye, Mic, Navigation } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center p-6 bg-[url('/assets/grid-pattern.svg')] bg-fixed">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Navigation className="w-16 h-16 text-blue-600 drop-shadow-lg" />
        </div>
        <h1 className="text-5xl font-extrabold mb-2 tracking-tight">CampusNav</h1>
        <p className="text-gray-500 text-lg">Smart Navigation for Everyone</p>
      </div>

      <div className="grid grid-cols-1 gap-6 w-full max-w-md">
        {/* Normal Mode */}
        <Link href="/navigate/normal">
          <div className="bg-blue-600 hover:bg-blue-700 transition-colors p-8 rounded-2xl flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-4">
              <Eye className="w-8 h-8 text-white" />
              <div className="text-left">
                <h2 className="text-2xl font-bold">Start Navigation</h2>
                <p className="text-blue-200">AR & Map View</p>
              </div>
            </div>
            <div className="group-hover:translate-x-2 transition-transform">
              →
            </div>
          </div>
        </Link>




      </div>


    </main>
  );
}
