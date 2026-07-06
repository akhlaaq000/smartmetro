export interface Station {
  id: string;
  name: string;
  kannadaName: string;
  line: 'Purple' | 'Green' | 'Yellow' | 'Intersection';
  x: number;
  y: number;
  index: number;
}

export const purpleStations: Station[] = [
  { id: 'challaghatta', name: 'Challaghatta', kannadaName: 'ಚಲ್ಲಘಟ್ಟ', line: 'Purple', x: 0, y: 0, index: 0 },
  { id: 'kengeri', name: 'Kengeri', kannadaName: 'ಕೆಂಗೇರಿ', line: 'Purple', x: 0, y: 0, index: 1 },
  { id: 'kengeri_bus_terminal', name: 'Kengeri Bus Terminal', kannadaName: 'ಕೆಂಗೇರಿ ಬಸ್ ಟರ್ಮಿನಲ್', line: 'Purple', x: 0, y: 0, index: 2 },
  { id: 'pattanagere', name: 'Pattanagere', kannadaName: 'ಪಟ್ಟಣಗೆರೆ', line: 'Purple', x: 0, y: 0, index: 3 },
  { id: 'jnanabharathi', name: 'Jnanabharathi', kannadaName: 'ಜ್ಞಾನಭಾರತಿ', line: 'Purple', x: 0, y: 0, index: 4 },
  { id: 'rr_nagar', name: 'Rajarajeshwari Nagar', kannadaName: 'ರಾಜರಾಜೇಶ್ವರಿ ನಗರ', line: 'Purple', x: 0, y: 0, index: 5 },
  { id: 'nayandahalli', name: 'Nayandahalli', kannadaName: 'ನಾಯಂಡಹಳ್ಳಿ', line: 'Purple', x: 0, y: 0, index: 6 },
  { id: 'mysuru_road', name: 'Mysuru Road', kannadaName: 'ಮೈಸೂರು ರಸ್ತೆ', line: 'Purple', x: 0, y: 0, index: 7 },
  { id: 'deepanjali_nagar', name: 'Deepanjali Nagar', kannadaName: 'ದೀಪಾಂಜಲಿ ನಗರ', line: 'Purple', x: 0, y: 0, index: 8 },
  { id: 'attiguppe', name: 'Attiguppe', kannadaName: 'ಅತ್ತಿಗುಪ್ಪೆ', line: 'Purple', x: 0, y: 0, index: 9 },
  { id: 'vijayanagar', name: 'Vijayanagar', kannadaName: 'ವಿಜಯನಗರ', line: 'Purple', x: 0, y: 0, index: 10 },
  { id: 'hosahalli', name: 'Hosahalli', kannadaName: 'ಹೊಸಹಳ್ಳಿ', line: 'Purple', x: 0, y: 0, index: 11 },
  { id: 'magadi_road', name: 'Magadi Road', kannadaName: 'ಮಾಗಡಿ ರಸ್ತೆ', line: 'Purple', x: 0, y: 0, index: 12 },
  { id: 'ksr_station', name: 'KSR City Railway Station', kannadaName: 'ಕೆಎಸ್ಆರ್ ಸಿಟಿ ರೈಲ್ವೆ ಸ್ಟೇಷನ್', line: 'Purple', x: 0, y: 0, index: 13 },
  { id: 'majestic', name: 'Nadaprabhu Kempegowda Station (Majestic)', kannadaName: 'ಮೆಜೆಸ್ಟಿಕ್', line: 'Intersection', x: 0, y: 0, index: 14 },
  { id: 'visvesvaraya_station', name: 'Sir M. Visvesvaraya Station', kannadaName: 'ಸರ್ ಎಂ. ವಿಶ್ವೇಶ್ವರಯ್ಯ ಸ್ಟೇಷನ್', line: 'Purple', x: 0, y: 0, index: 15 },
  { id: 'vidhana_soudha', name: 'Vidhana Soudha', kannadaName: 'ವಿಧಾನ ಸೌಧ', line: 'Purple', x: 0, y: 0, index: 16 },
  { id: 'cubbon_park', name: 'Cubbon Park', kannadaName: 'ಕಬ್ಬನ್ ಪಾರ್ಕ್', line: 'Purple', x: 0, y: 0, index: 17 },
  { id: 'mg_road', name: 'M.G. Road', kannadaName: 'ಎಂ.ಜಿ. ರಸ್ತೆ', line: 'Purple', x: 0, y: 0, index: 18 },
  { id: 'trinity', name: 'Trinity', kannadaName: 'ಟ್ರಿನಿಟಿ', line: 'Purple', x: 0, y: 0, index: 19 },
  { id: 'halasuru', name: 'Halasuru', kannadaName: 'ಹಲಸೂರು', line: 'Purple', x: 0, y: 0, index: 20 },
  { id: 'indiranagar', name: 'Indiranagar', kannadaName: 'ಇಂದಿರಾನಗರ', line: 'Purple', x: 0, y: 0, index: 21 },
  { id: 'sv_road', name: 'Swami Vivekananda Road', kannadaName: 'ಸ್ವಾಮಿ ವಿವೇಕಾನಂದ ರಸ್ತೆ', line: 'Purple', x: 0, y: 0, index: 22 },
  { id: 'baiyappanahalli', name: 'Baiyappanahalli', kannadaName: 'ಬೈಯಪ್ಪನಹಳ್ಳಿ', line: 'Purple', x: 0, y: 0, index: 23 },
  { id: 'benniganahalli', name: 'Benniganahalli', kannadaName: 'ಬೆನ್ನಿಗಾನಹಳ್ಳಿ', line: 'Purple', x: 0, y: 0, index: 24 },
  { id: 'kr_puram', name: 'K.R. Puram', kannadaName: 'ಕೆ.ಆರ್. ಪುರಂ', line: 'Purple', x: 0, y: 0, index: 25 },
  { id: 'mahadevapura', name: 'Mahadevapura', kannadaName: 'ಮಹದೇವಪುರ', line: 'Purple', x: 0, y: 0, index: 26 },
  { id: 'garudacharapalya', name: 'Garudacharapalya', kannadaName: 'ಗರುಡಾಚಾರ್ ಪಾಳ್ಯ', line: 'Purple', x: 0, y: 0, index: 27 },
  { id: 'hoodi', name: 'Hoodi', kannadaName: 'ಹೂಡಿ', line: 'Purple', x: 0, y: 0, index: 28 },
  { id: 'seetharamapalya', name: 'Seetharamapalya', kannadaName: 'ಸೀತಾರಾಮಪಾಳ್ಯ', line: 'Purple', x: 0, y: 0, index: 29 },
  { id: 'kundalahalli', name: 'Kundalahalli', kannadaName: 'ಕುಂದಲಹಳ್ಳಿ', line: 'Purple', x: 0, y: 0, index: 30 },
  { id: 'siddapura', name: 'Siddapura', kannadaName: 'ಸಿದ್ದಾಪುರ', line: 'Purple', x: 0, y: 0, index: 31 },
  { id: 'sathya_sai_hospital', name: 'Sri Sathya Sai Hospital', kannadaName: 'ಶ್ರೀ ಸತ್ಯ ಸಾಯಿ ಆಸ್ಪತ್ರೆ', line: 'Purple', x: 0, y: 0, index: 32 },
  { id: 'pattandur_agrahara', name: 'Pattandur Agrahara', kannadaName: 'ಪಟ್ಟಂದೂರು ಅಗ್ರಹಾರ', line: 'Purple', x: 0, y: 0, index: 33 },
  { id: 'kadugodi_tree_park', name: 'Kadugodi Tree Park', kannadaName: 'ಕಾಡುಗೋಡಿ ಟ್ರೀ ಪಾರ್ಕ್', line: 'Purple', x: 0, y: 0, index: 34 },
  { id: 'hopefarm_channasandra', name: 'Hopefarm Channasandra', kannadaName: 'ಹೋಪ್‌ಫಾರ್ಮ್ ಚನ್ನಸಂದ್ರ', line: 'Purple', x: 0, y: 0, index: 35 },
  { id: 'whitefield', name: 'Whitefield (Kadugodi)', kannadaName: 'ವೈಟ್‌ಫೀಲ್ಡ್ (ಕಾಡುಗೋಡಿ)', line: 'Purple', x: 0, y: 0, index: 36 }
];

export const greenStations: Station[] = [
  { id: 'madavara', name: 'Madavara (BIEC)', kannadaName: 'ಮಾದಾವರ (ಬಿಐಇಸಿ)', line: 'Green', x: 0, y: 0, index: 0 },
  { id: 'chikkabidarakallu', name: 'Chikkabidarakallu', kannadaName: 'ಚಿಕ್ಕಬಿದರಕಲ್ಲು', line: 'Green', x: 0, y: 0, index: 1 },
  { id: 'manjunathanagar', name: 'Manjunathanagar', kannadaName: 'ಮಂಜುನಾಥನಗರ', line: 'Green', x: 0, y: 0, index: 2 },
  { id: 'nagasandra', name: 'Nagasandra', kannadaName: 'ನಾಗಸಂದ್ರ', line: 'Green', x: 0, y: 0, index: 3 },
  { id: 'dasarahalli', name: 'Dasarahalli', kannadaName: 'ದಾಸರಹಳ್ಳಿ', line: 'Green', x: 0, y: 0, index: 4 },
  { id: 'jalahalli', name: 'Jalahalli', kannadaName: 'ಜಲಹಳ್ಳಿ', line: 'Green', x: 0, y: 0, index: 5 },
  { id: 'peenya_industry', name: 'Peenya Industry', kannadaName: 'ಪೀಣ್ಯ ಇಂಡಸ್ಟ್ರಿ', line: 'Green', x: 0, y: 0, index: 6 },
  { id: 'peenya', name: 'Peenya', kannadaName: 'ಪೀಣ್ಯ', line: 'Green', x: 0, y: 0, index: 7 },
  { id: 'goraguntepalya', name: 'Goraguntepalya', kannadaName: 'ಗೊರಗುಂಟೆಪಾಳ್ಯ', line: 'Green', x: 0, y: 0, index: 8 },
  { id: 'yeshwanthpur', name: 'Yeshwanthpur', kannadaName: 'ಯಶವಂತಪುರ', line: 'Green', x: 0, y: 0, index: 9 },
  { id: 'sandal_soap_factory', name: 'Sandal Soap Factory', kannadaName: 'ಸ್ಯಾಂಡಲ್ ಸೋಪ್ ಫ್ಯಾಕ್ಟರಿ', line: 'Green', x: 0, y: 0, index: 10 },
  { id: 'mahalakshmi', name: 'Mahalakshmi', kannadaName: 'ಮಹಾಲಕ್ಷ್ಮಿ', line: 'Green', x: 0, y: 0, index: 11 },
  { id: 'rajajinagar', name: 'Rajajinagar', kannadaName: 'ರಾಜಾಜಿನಗರ', line: 'Green', x: 0, y: 0, index: 12 },
  { id: 'kuvempu_road', name: 'Mahakavi Kuvempu Road', kannadaName: 'ಮಹಾಕವಿ ಕುವೆಂಪು ರಸ್ತೆ', line: 'Green', x: 0, y: 0, index: 13 },
  { id: 'srirampura', name: 'Srirampura', kannadaName: 'ಶ್ರೀರಾಮಪುರ', line: 'Green', x: 0, y: 0, index: 14 },
  { id: 'sampige_road', name: 'Mantri Square Sampige Road', kannadaName: 'ಮಂತ್ರಿ ಸ್ಕ್ವೇರ್ ಸಂಪಿಗೆ ರಸ್ತೆ', line: 'Green', x: 0, y: 0, index: 15 },
  { id: 'majestic', name: 'Nadaprabhu Kempegowda Station (Majestic)', kannadaName: 'ಮೆಜೆಸ್ಟಿಕ್', line: 'Intersection', x: 0, y: 0, index: 16 },
  { id: 'chickpet', name: 'Chickpete', kannadaName: 'ಚಿಕ್ಕಪೇಟೆ', line: 'Green', x: 0, y: 0, index: 17 },
  { id: 'kr_market', name: 'KR Market', kannadaName: 'ಕೆ.ಆರ್. ಮಾರುಕಟ್ಟೆ', line: 'Green', x: 0, y: 0, index: 18 },
  { id: 'national_college', name: 'National College', kannadaName: 'ನ್ಯಾಷನಲ್ ಕಾಲೇಜು', line: 'Green', x: 0, y: 0, index: 19 },
  { id: 'lalbagh', name: 'Lalbagh', kannadaName: 'ಲಾಲ್‌ಬಾಗ್', line: 'Green', x: 0, y: 0, index: 20 },
  { id: 'south_end_circle', name: 'South End Circle', kannadaName: 'ಸೌತ್ ಎಂಡ್ ಸರ್ಕಲ್', line: 'Green', x: 0, y: 0, index: 21 },
  { id: 'jayanagar', name: 'Jayanagar', kannadaName: 'ಜಯನಗರ', line: 'Green', x: 0, y: 0, index: 22 },
  { id: 'rv_road', name: 'RV Road', kannadaName: 'ಆರ್.ವಿ. ರಸ್ತೆ', line: 'Intersection', x: 0, y: 0, index: 23 },
  { id: 'banashankari', name: 'Banashankari', kannadaName: 'ಬನಶಂಕರಿ', line: 'Green', x: 0, y: 0, index: 24 },
  { id: 'jp_nagar', name: 'JP Nagar', kannadaName: 'ಜೆ.ಪಿ. ನಗರ', line: 'Green', x: 0, y: 0, index: 25 },
  { id: 'yelachenahalli', name: 'Yelachenahalli', kannadaName: 'ಯಲಚೇನಹಳ್ಳಿ', line: 'Green', x: 0, y: 0, index: 26 },
  { id: 'konanakunte_cross', name: 'Konanakunte Cross', kannadaName: 'ಕೋಣನಕುಂಟೆ ಕ್ರಾಸ್', line: 'Green', x: 0, y: 0, index: 27 },
  { id: 'doddakallasandra', name: 'Doddakallasandra', kannadaName: 'ದೊಡ್ಡಕಲ್ಲಸಂದ್ರ', line: 'Green', x: 0, y: 0, index: 28 },
  { id: 'vajarahalli', name: 'Vajarahalli', kannadaName: 'ವಜರಹಳ್ಳಿ', line: 'Green', x: 0, y: 0, index: 29 },
  { id: 'thalaghattapura', name: 'Thalaghattapura', kannadaName: 'ತಲಘಟ್ಟಪುರ', line: 'Green', x: 0, y: 0, index: 30 },
  { id: 'silk_institute', name: 'Silk Institute', kannadaName: 'ಸಿಲ್ಕ್ ಇನ್ಸ್ಟಿಟ್ಯೂಟ್', line: 'Green', x: 0, y: 0, index: 31 }
];

export const yellowStations: Station[] = [
  { id: 'rv_road', name: 'RV Road', kannadaName: 'ಆರ್.ವಿ. ರಸ್ತೆ', line: 'Intersection', x: 0, y: 0, index: 0 },
  { id: 'ragigudda', name: 'Ragigudda', kannadaName: 'ರಾಗಿಗುಡ್ಡ', line: 'Yellow', x: 0, y: 0, index: 1 },
  { id: 'jayadeva_hospital', name: 'Jayadeva Hospital', kannadaName: 'ಜಯದೇವ ಆಸ್ಪತ್ರೆ', line: 'Yellow', x: 0, y: 0, index: 2 },
  { id: 'btm_layout', name: 'BTM Layout', kannadaName: 'ಬಿ ಟಿ ಎಂ ಲೇಔಟ್', line: 'Yellow', x: 0, y: 0, index: 3 },
  { id: 'silk_board', name: 'Central Silk Board', kannadaName: 'ಸೆಂಟ್ರಲ್ ಸಿಲ್ಕ್ ಬೋರ್ಡ್', line: 'Yellow', x: 0, y: 0, index: 4 },
  { id: 'electronic_city', name: 'Electronic City', kannadaName: 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ', line: 'Yellow', x: 0, y: 0, index: 5 },
  { id: 'bommasandra', name: 'Bommasandra', kannadaName: 'ಬೊಮ್ಮಸಂದ್ರ', line: 'Yellow', x: 0, y: 0, index: 6 }
];

export const allStationsMap = new Map<string, Station>();

purpleStations.forEach(s => {
  allStationsMap.set(s.id, s);
});
greenStations.forEach(s => {
  allStationsMap.set(s.id, s);
});
yellowStations.forEach(s => {
  if (!allStationsMap.has(s.id)) {
    allStationsMap.set(s.id, s);
  }
});

export const allStations = Array.from(allStationsMap.values());

const adj = new Map<string, string[]>();
function addEdge(u: string, v: string) {
  if (!adj.has(u)) adj.set(u, []);
  if (!adj.has(v)) adj.set(v, []);
  if (!adj.get(u)!.includes(v)) adj.get(u)!.push(v);
  if (!adj.get(v)!.includes(u)) adj.get(v)!.push(u);
}

for (let i = 0; i < purpleStations.length - 1; i++) {
  addEdge(purpleStations[i].id, purpleStations[i + 1].id);
}

for (let i = 0; i < greenStations.length - 1; i++) {
  addEdge(greenStations[i].id, greenStations[i + 1].id);
}

for (let i = 0; i < yellowStations.length - 1; i++) {
  addEdge(yellowStations[i].id, yellowStations[i + 1].id);
}

export interface RouterResult {
  path: Station[];
  stopsCount: number;
  interchange: boolean;
  fare: number;
  durationMinutes: number;
}

export function planRoute(sourceId: string, destId: string): RouterResult | null {
  const start = allStationsMap.get(sourceId);
  const end = allStationsMap.get(destId);

  if (!start || !end) return null;
  if (start.id === end.id) {
    return { path: [start], stopsCount: 0, interchange: false, fare: 0, durationMinutes: 0 };
  }

  
  const queue: string[][] = [[start.id]];
  const visited = new Set<string>([start.id]);
  let shortestPathIds: string[] | null = null;

  while (queue.length > 0) {
    const path = queue.shift()!;
    const node = path[path.length - 1];

    if (node === end.id) {
      shortestPathIds = path;
      break;
    }

    const neighbors = adj.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }

  if (!shortestPathIds) return null;

  const pathStations = shortestPathIds.map(id => allStationsMap.get(id)!);
  const stopsCount = pathStations.length - 1;

  
  const linesUsed = new Set(pathStations.map(s => s.line));
  const interchange = linesUsed.size > 1;

  
  const rawFare = Math.min(60, 10 + (stopsCount * 3.5));
  const fare = Math.round(rawFare);
  const durationMinutes = stopsCount * 2.5;

  return {
    path: pathStations,
    stopsCount,
    interchange,
    fare,
    durationMinutes: Math.round(durationMinutes)
  };
}
