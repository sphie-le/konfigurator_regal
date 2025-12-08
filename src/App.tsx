import React from 'react';

export default function App() {
  const [modules, setModules] = React.useState([]);
  const [expandedType, setExpandedType] = React.useState('');
  const [hoveredId, setHoveredId] = React.useState(null);

  const addModule = (type, length, position) => {
    const newMod = { id: Date.now(), type: type, length: length };
    const arr = [];
    
    if (position === 'left') {
      arr.push(newMod);
      modules.forEach(m => arr.push(m));
    } else {
      modules.forEach(m => arr.push(m));
      arr.push(newMod);
    }
    
    setModules(arr);
    setExpandedType('');
  };

  const removeModule = (id) => {
    const arr = [];
    modules.forEach(m => {
      if (m.id !== id) arr.push(m);
    });
    setModules(arr);
  };

  const getHeight = (type) => {
    if (type === 'T2') return 109;
    if (type === 'T3') return 197;
    if (type === 'T4') return 292;
    if (type === 'T5') return 384;
    return 384;
  };

  const getPositions = (type, h) => {
    const thick = 10;
    const sc = 0.2133;
    
    if (type === 'K') {
      const bb = 90 * sc;
      return [0, h - bb - thick];
    }
    
    const fb = 45 * sc;
    const gap = 395 * sc;
    const arr = [];
    const num = parseInt(type.substring(1));
    
    for (let i = 0; i < num; i++) {
      if (i === 0) {
        arr.push(h - fb - thick);
      } else {
        arr.push(arr[i - 1] - gap - thick);
      }
    }
    
    return arr;
  };

  const types = [
    { id: 'T2', name: '2 Regalflächen', h: 510 },
    { id: 'T3', name: '3 Regalbretter', h: 925 },
    { id: 'T4', name: '4 Regalbretter', h: 1370 },
    { id: 'T5', name: '5 Regalbretter', h: 1800 },
    { id: 'K', name: 'Mit Kleiderstange', h: 1800 },
  ];

  let totLen = 0;
  let totW = 0;
  modules.forEach(m => {
    totLen += m.length === 'short' ? 35 : 57.5;
    totW += m.length === 'short' ? 80 : 128;
  });

  let maxH = 0;
  let maxT = '';
  modules.forEach(m => {
    const h = getHeight(m.type);
    const pos = getPositions(m.type, h);
    let top = m.type === 'K' ? 0 : pos[0];
    pos.forEach(p => { if (p < top) top = p; });
    const bh = h - top;
    if (bh > maxH) {
      maxH = bh;
      maxT = m.type;
    }
  });

  let realH = 0;
  if (maxT === 'K') {
    realH = 1800;
  } else if (maxT) {
    const n = parseInt(maxT.substring(1));
    realH = 45 + (n - 1) * 430 + 35;
  }

  let sc = 1;
  if (modules.length > 0) {
    let mh = 0;
    modules.forEach(m => {
      const h = getHeight(m.type);
      if (h > mh) mh = h;
    });
    const sx = 800 / (totW + 100);
    const sy = 400 / (mh + 150);
    sc = sx < sy ? sx : sy;
    if (sc > 1.5) sc = 1.5;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#0f172a', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>⚙</div>
          <h1>Regalsystem Konfigurator</h1>
        </div>
      </header>
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#0f172a', marginBottom: '4px' }}>Ihre Konfiguration</h2>
            <p style={{ color: '#64748b' }}>
              {modules.length === 0 ? 'Wählen Sie Module aus der Bibliothek' : `${modules.length} Module`}
            </p>
          </div>
          
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '48px', minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {modules.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#cbd5e1' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                <p>Keine Module ausgewählt</p>
              </div>
            ) : (
              <div style={{ transform: `scale(${sc})`, transformOrigin: 'center center' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0 }}>
                  {modules.map((mod, idx) => {
                    const w = mod.length === 'short' ? 80 : 128;
                    const h = getHeight(mod.type);
                    const isLeft = idx === 0;
                    const pos = getPositions(mod.type, h);
                    
                    let lTop = mod.type === 'K' ? 0 : pos[0];
                    pos.forEach(p => { if (p < lTop) lTop = p; });
                    const lH = h - lTop;
                    
                    let rTop = lTop;
                    let rH = lH;
                    
                    if (idx < modules.length - 1) {
                      const nMod = modules[idx + 1];
                      const nH = getHeight(nMod.type);
                      const nPos = getPositions(nMod.type, nH);
                      let nTop = nMod.type === 'K' ? 0 : nPos[0];
                      nPos.forEach(p => { if (p < nTop) nTop = p; });
                      const diff = h - nH;
                      rTop = lTop < nTop + diff ? lTop : nTop + diff;
                      rH = h - rTop;
                    }
                    
                    return (
                      <div 
                        key={mod.id}
                        style={{ position: 'relative', width: `${w}px` }}
                        onMouseEnter={() => setHoveredId(mod.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        <div style={{ position: 'relative', height: `${h}px` }}>
                          {isLeft && <div style={{ position: 'absolute', left: 0, top: `${lTop}px`, height: `${lH}px`, width: '4px', backgroundColor: '#0f172a' }} />}
                          <div style={{ position: 'absolute', right: 0, top: `${rTop}px`, height: `${rH}px`, width: '4px', backgroundColor: '#0f172a' }} />
                          
                          {pos.map((p, i) => (
                            <div 
                              key={i}
                              style={{
                                position: 'absolute',
                                left: isLeft ? '4px' : '0px',
                                right: '4px',
                                top: `${p}px`,
                                height: '10px',
                                backgroundColor: '#a0522d',
                                borderTop: '2px solid #8b4513',
                                borderBottom: '2px solid #8b4513',
                              }}
                            />
                          ))}
                          
                          {mod.type === 'K' && (
                            <div style={{
                              position: 'absolute',
                              left: isLeft ? '8px' : '4px',
                              right: '8px',
                              top: '28.8px',
                              height: '6px',
                              backgroundColor: '#94a3b8',
                              borderRadius: '99px',
                            }} />
                          )}
                        </div>
                        
                        {hoveredId === mod.id && (
                          <button
                            onClick={() => removeModule(mod.id)}
                            style={{
                              position: 'absolute',
                              top: '-12px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: '28px',
                              height: '28px',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              cursor: 'pointer',
                              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                              zIndex: 20,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <div style={{ marginTop: '48px', position: 'relative', width: `${totW}px` }}>
                  <div style={{ height: '2px', backgroundColor: '#64748b', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 0, top: '-6px', width: '2px', height: '14px', backgroundColor: '#64748b' }} />
                    <div style={{ position: 'absolute', right: 0, top: '-6px', width: '2px', height: '14px', backgroundColor: '#64748b' }} />
                  </div>
                  <div style={{ position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)', color: '#64748b', whiteSpace: 'nowrap' }}>
                    {totLen} cm
                  </div>
                </div>
                
                {maxH > 0 && (
                  <div style={{ position: 'absolute', left: '-40px', bottom: 0, width: '2px', height: `${maxH}px`, backgroundColor: '#64748b' }}>
                    <div style={{ position: 'absolute', top: 0, left: '-6px', width: '14px', height: '2px', backgroundColor: '#64748b' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: '-6px', width: '14px', height: '2px', backgroundColor: '#64748b' }} />
                    <div style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {(realH / 10).toFixed(1)} cm
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div style={{ width: '384px', borderLeft: '1px solid #e2e8f0', backgroundColor: 'white', overflowY: 'auto' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
            <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>Module Bibliothek</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {types.map((t) => {
                const isExp = expandedType === t.id;
                
                return (
                  <div key={t.id}>
                    <div
                      onClick={() => setExpandedType(isExp ? '' : t.id)}
                      style={{ padding: '16px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '80px', height: '80px', backgroundColor: '#f1f5f9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
                          📦
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ margin: 0, color: '#0f172a' }}>{t.id}</h3>
                          <p style={{ color: '#64748b', margin: '4px 0 0' }}>{t.name}</p>
                          <p style={{ color: '#94a3b8', margin: '4px 0 0' }}>Höhe: {t.h}mm</p>
                        </div>
                        <div style={{ color: '#cbd5e1' }}>{isExp ? '▲' : '▼'}</div>
                      </div>
                    </div>
                    
                    {isExp && (
                      <div style={{ marginTop: '8px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <p style={{ color: '#334155', marginBottom: '12px' }}>
                          {modules.length === 0 ? 'Tiefe wählen:' : 'Tiefe und Position wählen:'}
                        </p>
                        
                        {modules.length === 0 ? (
                          <div>
                            <button onClick={() => addModule(t.id, 'short', 'right')} style={{ width: '100%', padding: '10px 16px', marginBottom: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer' }}>
                              35cm (Standard)
                            </button>
                            <button onClick={() => addModule(t.id, 'long', 'right')} style={{ width: '100%', padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer' }}>
                              57.5cm (Tief)
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div style={{ marginBottom: '12px' }}>
                              <p style={{ color: '#64748b', marginBottom: '8px' }}>35cm (Standard)</p>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => addModule(t.id, 'short', 'left')} style={{ flex: 1, padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer' }}>
                                  ← Links
                                </button>
                                <button onClick={() => addModule(t.id, 'short', 'right')} style={{ flex: 1, padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer' }}>
                                  Rechts →
                                </button>
                              </div>
                            </div>
                            <div>
                              <p style={{ color: '#64748b', marginBottom: '8px' }}>57.5cm (Tief)</p>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => addModule(t.id, 'long', 'left')} style={{ flex: 1, padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer' }}>
                                  ← Links
                                </button>
                                <button onClick={() => addModule(t.id, 'long', 'right')} style={{ flex: 1, padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer' }}>
                                  Rechts →
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {modules.length > 0 && (
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 style={{ margin: 0, color: '#0f172a' }}>Übersicht</h2>
                <button onClick={() => setModules([])} style={{ padding: '4px 12px', color: '#0f172a', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '4px' }}>
                  Leeren
                </button>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#64748b' }}>Anzahl Module:</span>
                  <span style={{ color: '#0f172a' }}>{modules.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Gesamtlänge:</span>
                  <span style={{ color: '#0f172a' }}>{totLen}cm</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
