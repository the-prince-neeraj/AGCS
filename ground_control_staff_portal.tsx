import React, { useState, useEffect } from 'react';
import { Clock, CloudRain, Sun, Plus, Edit, CheckCircle, PlaneTakeoff, PlaneLanding, ShieldAlert, Package, ChevronLeft, Save } from 'lucide-react';

// --- INITIAL MOCK DATA ---
const INITIAL_FLIGHTS = [
  { id: '1', flightNumber: 'AI101', airline: 'Air India', aircraftModel: 'Airbus A320', arrivalTime: '14:30', departureTime: '15:30', status: 'On Time', terminal: '', gate: '', approved: false },
  { id: '2', flightNumber: '6E205', airline: 'IndiGo', aircraftModel: 'Airbus A321neo', arrivalTime: '15:10', departureTime: '16:00', status: 'Late', terminal: '', gate: '', approved: false },
  { id: '3', flightNumber: 'SJ731', airline: 'SpiceJet', aircraftModel: 'Boeing 737 Cargo', arrivalTime: '15:45', departureTime: '17:00', status: 'On Time', terminal: '', gate: '', approved: false },
  { id: '4', flightNumber: 'UK827', airline: 'Vistara', aircraftModel: 'Airbus A320neo', arrivalTime: '16:20', departureTime: '17:15', status: 'Emergency', terminal: '', gate: '', approved: false },
  { id: '5', flightNumber: 'SG514', airline: 'SpiceJet', aircraftModel: 'Boeing 737-800', arrivalTime: '12:30', departureTime: '13:15', status: 'Departed', terminal: 'B', gate: '3', approved: true },
  { id: '6', flightNumber: 'AK189', airline: 'AirAsia', aircraftModel: 'Airbus A321neo', arrivalTime: '13:00', departureTime: '13:55', status: 'Departed', terminal: 'A', gate: '2', approved: true }
];

// --- HELPER FUNCTION ---
const formatTime = (date) => date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

// --- EXTRACTED COMPONENTS (Fixes the form reset issue) ---
const TopNav = ({ currentView, setCurrentView, isRaining, setIsRaining, time }) => (
  <div className="bg-slate-900 text-white p-4 shadow-lg flex flex-col md:flex-row justify-between items-center z-10 sticky top-0">
    <div className="flex items-center space-x-3 mb-4 md:mb-0">
      <PlaneTakeoff size={28} className="text-blue-400" />
      <h1 className="text-xl font-bold tracking-wider">GROUND CONTROL AI</h1>
    </div>
    <div className="flex items-center space-x-6">
      <div className="flex space-x-2">
        <button onClick={() => setCurrentView('dashboard')} className={`px-3 py-1.5 rounded transition ${currentView === 'dashboard' ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'}`}>Dashboard</button>
        <button onClick={() => setCurrentView('add')} className={`px-3 py-1.5 rounded transition ${currentView === 'add' ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'}`}>Add Aircraft</button>
        <button onClick={() => setCurrentView('modify')} className={`px-3 py-1.5 rounded transition ${currentView === 'modify' ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'}`}>Modify Schedule</button>
      </div>
      <div className="flex items-center space-x-4 border-l border-slate-700 pl-4">
        <button onClick={() => setIsRaining(!isRaining)} className={`flex items-center space-x-2 px-3 py-1 rounded border ${isRaining ? 'bg-blue-900 border-blue-400 text-blue-200' : 'bg-amber-900 border-amber-400 text-amber-200'} transition-all`} title="Toggle Weather to test AI logic">
          {isRaining ? <CloudRain size={20} /> : <Sun size={20} />}
          <span className="text-sm font-semibold">{isRaining ? "Rain: Delay Active" : "Clear Weather"}</span>
        </button>
        <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
          <Clock size={18} className="text-blue-400" />
          <span className="font-mono text-lg">{formatTime(time)}</span>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = ({ departedFlights, arrivingFlights, unapprovedFlights, predictions, isRaining, handleApprove }) => (
  <div className="p-6 space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Side: Departed */}
      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden flex flex-col h-[400px]">
        <div className="bg-slate-100 p-4 border-b border-slate-200 flex items-center space-x-2">
          <PlaneTakeoff className="text-slate-500" size={20}/>
          <h2 className="text-lg font-bold text-slate-800">Recently Departed (Past Hour)</h2>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          {departedFlights.length === 0 ? <p className="text-slate-400 text-center mt-10">No recent departures.</p> : 
            <div className="space-y-3">
              {departedFlights.map(f => (
                <div key={f.id} className="flex justify-between items-center p-3 rounded-lg border border-slate-100 bg-slate-50">
                  <div>
                    <div className="font-bold text-slate-700">{f.flightNumber} <span className="font-normal text-slate-500 text-sm ml-2">{f.airline}</span></div>
                    <div className="text-sm text-slate-500">Term {f.terminal} • Gate {f.gate}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-semibold text-slate-600">{f.departureTime}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Departed</div>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      </div>

      {/* Right Side: Arriving */}
      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden flex flex-col h-[400px]">
        <div className="bg-blue-50 p-4 border-b border-blue-100 flex items-center space-x-2">
          <PlaneLanding className="text-blue-600" size={20}/>
          <h2 className="text-lg font-bold text-blue-900">Incoming Aircrafts</h2>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          {arrivingFlights.length === 0 ? <p className="text-slate-400 text-center mt-10">No incoming flights.</p> : 
            <div className="space-y-3">
              {arrivingFlights.map(f => (
                <div key={f.id} className="flex justify-between items-center p-3 rounded-lg border border-blue-50 bg-white shadow-sm">
                  <div>
                    <div className="font-bold text-blue-900 flex items-center space-x-2">
                      <span>{f.flightNumber}</span>
                      {f.status.toLowerCase().includes('emergency') && <ShieldAlert size={14} className="text-red-500"/>}
                      {f.aircraftModel.toLowerCase().includes('cargo') && <Package size={14} className="text-amber-600"/>}
                    </div>
                    <div className="text-sm text-slate-500">{f.airline} • {f.aircraftModel}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-blue-600">{f.arrivalTime}</div>
                    <div className={`text-xs font-bold uppercase ${f.status === 'Late' ? 'text-orange-500' : f.status === 'Emergency' ? 'text-red-600' : 'text-emerald-600'}`}>{f.status}</div>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    </div>

    {/* Bottom AI Prediction Section */}
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl shadow-xl overflow-hidden text-white">
      <div className="p-4 border-b border-indigo-800/50 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg"><Clock className="text-indigo-300" size={24}/></div>
          <div>
            <h2 className="text-xl font-bold">AI Terminal & Gate Allocation</h2>
            <p className="text-sm text-indigo-300">Pending predictions requiring staff approval</p>
          </div>
        </div>
        {isRaining && <div className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-200 rounded text-sm flex items-center"><CloudRain size={16} className="mr-2"/> Weather Gaps Applied</div>}
      </div>
      
      <div className="p-4 overflow-x-auto">
        {unapprovedFlights.length === 0 ? <p className="text-indigo-300 text-center py-6">All active flights have been routed and approved.</p> : 
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-indigo-300 text-sm border-b border-indigo-800">
                <th className="pb-3 px-2">Flight</th>
                <th className="pb-3 px-2">Type / Needs</th>
                <th className="pb-3 px-2">Scheduled Arr.</th>
                <th className="pb-3 px-2 text-indigo-100">AI Predicted Arr.</th>
                <th className="pb-3 px-2 text-indigo-100">AI Terminal</th>
                <th className="pb-3 px-2 text-indigo-100">AI Gate</th>
                <th className="pb-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {unapprovedFlights.map(f => {
                const pred = predictions[f.id] || {};
                return (
                  <tr key={f.id} className="border-b border-indigo-800/50 hover:bg-white/5 transition">
                    <td className="py-3 px-2 font-bold">{f.flightNumber}</td>
                    <td className="py-3 px-2 text-sm">
                      {f.status === 'Emergency' ? <span className="text-red-400 font-bold flex items-center"><ShieldAlert size={14} className="mr-1"/> Emergency</span> : 
                       f.aircraftModel.toLowerCase().includes('cargo') ? <span className="text-amber-400 flex items-center"><Package size={14} className="mr-1"/> Cargo</span> : 
                       <span className="text-indigo-200">Passenger</span>}
                    </td>
                    <td className="py-3 px-2 font-mono text-indigo-300">{f.arrivalTime}</td>
                    <td className="py-3 px-2 font-mono font-bold text-amber-300">{pred.predictedArrival || '-'} {pred.isRainDelayed && <span className="text-xs text-blue-300 ml-1">(+15m rain)</span>}</td>
                    <td className="py-3 px-2 font-bold text-xl">{pred.terminal || '-'}</td>
                    <td className="py-3 px-2 font-bold text-xl">{pred.gate || '-'}</td>
                    <td className="py-3 px-2 text-right">
                      <button onClick={() => handleApprove(f.id)} className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-1.5 rounded font-bold shadow transition flex items-center ml-auto">
                        <CheckCircle size={16} className="mr-2"/> Approve
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        }
      </div>
    </div>
  </div>
);

const AddFlight = ({ flights, setFlights, setCurrentView }) => {
  const [form, setForm] = useState({ flightNumber: '', airline: '', aircraftModel: '', arrivalTime: '', departureTime: '', status: 'On Time' });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newFlight = { ...form, id: Date.now().toString(), approved: false, terminal: '', gate: '' };
    setFlights([...flights, newFlight]);
    setCurrentView('dashboard');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button onClick={() => setCurrentView('dashboard')} className="flex items-center text-blue-600 hover:text-blue-800 mb-6 font-semibold"><ChevronLeft size={20}/> Back to Dashboard</button>
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center"><Plus className="mr-2 text-blue-500"/> Add New Aircraft</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div><label className="block text-sm font-semibold text-slate-600 mb-1">Flight Number</label><input required className="w-full p-2.5 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. AI898" value={form.flightNumber} onChange={e => setForm({...form, flightNumber: e.target.value.toUpperCase()})} /></div>
            <div><label className="block text-sm font-semibold text-slate-600 mb-1">Airline</label><input required className="w-full p-2.5 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Air India" value={form.airline} onChange={e => setForm({...form, airline: e.target.value})} /></div>
            <div className="col-span-2"><label className="block text-sm font-semibold text-slate-600 mb-1">Aircraft Model</label><input required className="w-full p-2.5 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Airbus A320neo, Boeing 737 Cargo" value={form.aircraftModel} onChange={e => setForm({...form, aircraftModel: e.target.value})} /></div>
            <div><label className="block text-sm font-semibold text-slate-600 mb-1">Arrival Time (HH:MM)</label><input required type="time" className="w-full p-2.5 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none font-mono" value={form.arrivalTime} onChange={e => setForm({...form, arrivalTime: e.target.value})} /></div>
            <div><label className="block text-sm font-semibold text-slate-600 mb-1">Departure Time (HH:MM)</label><input required type="time" className="w-full p-2.5 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none font-mono" value={form.departureTime} onChange={e => setForm({...form, departureTime: e.target.value})} /></div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-600 mb-1">Initial Status</label>
              <select className="w-full p-2.5 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <option value="On Time">On Time</option>
                <option value="Late">Delayed / Late</option>
                <option value="Emergency">Emergency Landing</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transition mt-6">Add Aircraft to Schedule</button>
        </form>
      </div>
    </div>
  );
};

const ModifyFlight = ({ flights, setFlights, arrivingFlights, setCurrentView }) => {
  const [editList, setEditList] = useState([...arrivingFlights]);

  const handleSave = () => {
    const newFlights = flights.map(f => {
      const updated = editList.find(e => e.id === f.id);
      return updated ? updated : f;
    });
    setFlights(newFlights);
    setCurrentView('dashboard');
  };

  return (
    <div className="p-6">
       <div className="flex justify-between items-center mb-6">
          <button onClick={() => setCurrentView('dashboard')} className="flex items-center text-blue-600 hover:text-blue-800 font-semibold"><ChevronLeft size={20}/> Back to Dashboard</button>
          <button onClick={handleSave} className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-bold shadow transition"><Save size={18} className="mr-2"/> Save Modifications</button>
       </div>
       <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-slate-100 p-5 border-b border-slate-200 flex items-center space-x-3">
            <Edit className="text-slate-600" size={24}/>
            <h2 className="text-2xl font-bold text-slate-800">Modify Arriving Schedule</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold border-b">Flight</th>
                  <th className="p-4 font-semibold border-b">Arrival</th>
                  <th className="p-4 font-semibold border-b">Departure</th>
                  <th className="p-4 font-semibold border-b">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {editList.map(f => (
                  <tr key={f.id} className="hover:bg-slate-50 transition">
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{f.flightNumber}</div>
                      <div className="text-sm text-slate-500">{f.airline}</div>
                    </td>
                    <td className="p-4"><input type="time" className="p-2 border rounded font-mono w-32 outline-none focus:ring-2 focus:ring-blue-400" value={f.arrivalTime} onChange={e => setEditList(editList.map(item => item.id === f.id ? {...item, arrivalTime: e.target.value} : item))} /></td>
                    <td className="p-4"><input type="time" className="p-2 border rounded font-mono w-32 outline-none focus:ring-2 focus:ring-blue-400" value={f.departureTime} onChange={e => setEditList(editList.map(item => item.id === f.id ? {...item, departureTime: e.target.value} : item))} /></td>
                    <td className="p-4">
                      <select className="p-2 border rounded outline-none focus:ring-2 focus:ring-blue-400 w-full" value={f.status} onChange={e => setEditList(editList.map(item => item.id === f.id ? {...item, status: e.target.value} : item))}>
                        <option value="On Time">On Time</option>
                        <option value="Late">Late</option>
                        <option value="Departed">Departed</option>
                        <option value="Emergency">Emergency</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
       </div>
    </div>
  );
};


// --- MAIN APP ---
export default function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'add', 'modify'
  const [flights, setFlights] = useState(() => {
    const saved = localStorage.getItem('airport_flights_db');
    return saved ? JSON.parse(saved) : INITIAL_FLIGHTS;
  });
  const [time, setTime] = useState(new Date());
  const [isRaining, setIsRaining] = useState(false);
  const [predictions, setPredictions] = useState({});

  // Real-time Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync to LocalStorage for User App
  useEffect(() => {
    localStorage.setItem('airport_flights_db', JSON.stringify(flights));
  }, [flights]);

  // Helpers
  const getCurrentMinutes = () => time.getHours() * 60 + time.getMinutes();
  const getMinutesFromString = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  // AI Prediction Logic
  useEffect(() => {
    const newPredictions = {};
    flights.forEach(f => {
      if (!f.approved && !f.terminal) {
        let term, gate;
        const isCargo = f.aircraftModel.toLowerCase().includes('cargo');
        const isEmergency = f.status.toLowerCase().includes('emergency');
        
        if (isCargo) {
          term = 'D';
          gate = Math.random() > 0.5 ? '1' : '2';
        } else if (isEmergency) {
          const terms = ['A', 'B', 'C'];
          term = terms[Math.floor(Math.random() * terms.length)];
          gate = '6'; // Emergency Gate
        } else {
          const terms = ['A', 'B', 'C'];
          const normalGates = ['1', '2', '3', '4', '5'];
          term = terms[Math.floor(Math.random() * terms.length)];
          gate = normalGates[Math.floor(Math.random() * normalGates.length)];
        }

        // Apply Weather Rain Logic (Delay Landing Gap by 15 mins)
        let predArrival = f.arrivalTime;
        if (isRaining && !isEmergency) {
            const mins = getMinutesFromString(f.arrivalTime) + 15;
            const h = Math.floor(mins / 60) % 24;
            const m = mins % 60;
            predArrival = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        }

        newPredictions[f.id] = { terminal: term, gate: gate, predictedArrival: predArrival, isRainDelayed: isRaining && !isEmergency };
      }
    });
    setPredictions(newPredictions);
  }, [flights, isRaining]);

  const handleApprove = (id) => {
    const pred = predictions[id];
    if (pred) {
      setFlights(flights.map(f => f.id === id ? { 
        ...f, 
        terminal: pred.terminal, 
        gate: pred.gate, 
        arrivalTime: pred.predictedArrival,
        approved: true 
      } : f));
    }
  };

  // Derived Data
  const currentMins = getCurrentMinutes();
  const departedFlights = flights.filter(f => {
    const depMins = getMinutesFromString(f.departureTime);
    return f.status === 'Departed' || (depMins < currentMins && currentMins - depMins <= 60);
  }).sort((a, b) => getMinutesFromString(b.departureTime) - getMinutesFromString(a.departureTime));

  const arrivingFlights = flights.filter(f => {
    const depMins = getMinutesFromString(f.departureTime);
    return f.status !== 'Departed' && depMins >= currentMins;
  }).sort((a, b) => getMinutesFromString(a.arrivalTime) - getMinutesFromString(b.arrivalTime));

  const unapprovedFlights = flights.filter(f => !f.approved);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200">
      <TopNav currentView={currentView} setCurrentView={setCurrentView} isRaining={isRaining} setIsRaining={setIsRaining} time={time} />
      
      {currentView === 'dashboard' && (
        <Dashboard 
          departedFlights={departedFlights} 
          arrivingFlights={arrivingFlights} 
          unapprovedFlights={unapprovedFlights} 
          predictions={predictions} 
          isRaining={isRaining} 
          handleApprove={handleApprove} 
        />
      )}
      
      {currentView === 'add' && (
        <AddFlight 
          flights={flights} 
          setFlights={setFlights} 
          setCurrentView={setCurrentView} 
        />
      )}
      
      {currentView === 'modify' && (
        <ModifyFlight 
          flights={flights} 
          setFlights={setFlights} 
          arrivingFlights={arrivingFlights} 
          setCurrentView={setCurrentView} 
        />
      )}
    </div>
  );
}