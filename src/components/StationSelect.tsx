import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Station, purpleStations, greenStations } from '../data/stations';

interface StationSelectProps {
  label: string;
  selectedStationId: string;
  onSelectStation: (stationId: string) => void;
  excludeStationId?: string;
  id?: string;
}

export default function StationSelect({
  label,
  selectedStationId,
  onSelectStation,
  excludeStationId,
  id
}: StationSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedStation = [...purpleStations, ...greenStations].find(s => s.id === selectedStationId);

  
  const filterStations = (stations: Station[]) => {
    return stations.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.kannadaName.includes(searchQuery);
      const isNotExcluded = s.id !== excludeStationId;
      return matchesSearch && isNotExcluded;
    });
  };

  const filteredPurple = filterStations(purpleStations);
  const filteredGreen = filterStations(greenStations).filter(s => s.id !== 'majestic'); 

  const totalFiltered = filteredPurple.length + filteredGreen.length;

  const handleSelect = (stationId: string) => {
    onSelectStation(stationId);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative w-full text-left" ref={dropdownRef} id={id}>
      <label className="block text-sm font-medium text-slate-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>

      {/* Dropdown Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 active:bg-slate-850 rounded-xl p-3.5 px-4 text-base font-medium text-slate-300 flex justify-between items-center transition cursor-pointer"
      >
        <span className="truncate">
          {selectedStation ? (
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                selectedStation.line === 'Purple' ? 'bg-purple-600' :
                selectedStation.line === 'Green' ? 'bg-emerald-500' : 'bg-slate-450'
              }`} />
              <strong>{selectedStation.name}</strong>
              <span className="text-slate-600 text-sm">({selectedStation.kannadaName})</span>
            </span>
          ) : (
            <span className="text-slate-600">Select Station</span>
          )}
        </span>
        <ChevronDown size={18} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-100">
          
          {/* Search Header */}
          <div className="p-3 border-b border-slate-800 bg-slate-950 flex items-center gap-2">
            <Search size={16} className="text-slate-600 shrink-0" />
            <input
              type="text"
              placeholder="Search station name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-0 p-1 text-sm text-slate-300 placeholder-slate-600 focus:ring-0 focus:outline-hidden font-medium"
              autoFocus
            />
          </div>

          {/* List Options */}
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-3">
            {totalFiltered === 0 ? (
              <div className="p-4 text-center text-sm text-slate-600 italic">
                No stations match your search.
              </div>
            ) : (
              <>
                {}
                {filteredPurple.length > 0 && (
                  <div>
                    <div className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-600 font-mono">
                      Purple Line
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {filteredPurple.map(s => (
                        <button
                          key={`sel-${s.id}`}
                          type="button"
                          onClick={() => handleSelect(s.id)}
                          className="w-full text-left p-2.5 px-3 rounded-lg text-sm font-medium hover:bg-slate-850 flex items-center justify-between text-slate-350 hover:text-slate-200 transition cursor-pointer"
                        >
                          <span>{s.name}</span>
                          <span className="text-xs text-slate-600">{s.kannadaName}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {}
                {filteredGreen.length > 0 && (
                  <div>
                    <div className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-500 font-mono">
                      Green Line
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {filteredGreen.map(s => (
                        <button
                          key={`sel-${s.id}`}
                          type="button"
                          onClick={() => handleSelect(s.id)}
                          className="w-full text-left p-2.5 px-3 rounded-lg text-sm font-medium hover:bg-slate-850 flex items-center justify-between text-slate-350 hover:text-slate-200 transition cursor-pointer"
                        >
                          <span>{s.name}</span>
                          <span className="text-xs text-slate-600">{s.kannadaName}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
