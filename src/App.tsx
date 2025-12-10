import React from "react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import imgT2 from "figma:asset/edce7739b3638cb4b2850cfd31ccb8b7d0f7517d.png";
import imgT3 from "figma:asset/b4b3ad5601491d9844b87fb25fbeeafd51e6d696.png";
import imgT4 from "figma:asset/b9e87818d1ddf12cb405d3e54c715601e6931683.png";
import imgT5 from "figma:asset/1a8ad80399b6549cfba16c958beaa5ea548e1a9a.png";
import imgK from "figma:asset/08136ca489a3bad40376f4af4a2d54530754eba6.png";

export default function App() {
  const [modules, setModules] = React.useState([]);
  const [expandedType, setExpandedType] = React.useState("");
  const [hoveredId, setHoveredId] = React.useState(null);
  const [customerName, setCustomerName] = React.useState("");
  const [customerEmail, setCustomerEmail] = React.useState("");
  const [customerMessage, setCustomerMessage] = React.useState("");

  const addModule = (type, length, position) => {
    const newMod = {
      id: Date.now(),
      type: type,
      length: length,
    };
    const arr = [];

    if (position === "left") {
      arr.push(newMod);
      modules.forEach((m) => arr.push(m));
    } else {
      modules.forEach((m) => arr.push(m));
      arr.push(newMod);
    }

    setModules(arr);
    setExpandedType("");
  };

  const removeModule = (id) => {
    const arr = [];
    modules.forEach((m) => {
      if (m.id !== id) arr.push(m);
    });
    setModules(arr);
  };

  const getHeight = (type) => {
    const sc = 0.2133;
    if (type === "T2") return 510 * sc;
    if (type === "T3") return 940 * sc;
    if (type === "T4") return 1370 * sc;
    if (type === "T5") return 1800 * sc;
    if (type === "K") return 1800 * sc;
    return 384;
  };

  const getPositions = (type, h) => {
    const thick = 35 * 0.2133; // 35mm Brettstärke
    const sc = 0.2133;

    if (type === "K") {
      // K: Unterstes Brett 90mm vom Boden, oberstes schließt ab
      const bb = 90 * sc; // 90mm vom Boden
      return [0, h - bb - thick]; // [oberes Brett ganz oben, unteres Brett 90mm vom Boden]
    }

    // T2, T3, T4, T5: Oberstes Brett schließt bündig ab (Position 0)
    // Alle anderen Bretter auf denselben absoluten Höhen vom Boden
    // Brett 1: 45mm vom Boden
    // Brett 2: 475mm vom Boden (bei T2, T3, T4, T5)
    // Brett 3: 905mm vom Boden (bei T3, T4, T5)
    // Brett 4: 1335mm vom Boden (bei T4, T5)

    const num = parseInt(type.substring(1));
    const arr = [];

    // Oberstes Brett schließt immer bündig ab
    arr.push(0);

    // Berechne die unteren Bretter auf festen absoluten Höhen vom Boden
    const bottomGap = 45 * sc; // 45mm vom Boden
    const gap = 395 * sc; // 395mm Abstand zwischen Oberkante und Unterkante

    // Füge die unteren Bretter hinzu (von oben nach unten in der Array-Reihenfolge)
    for (let i = num - 2; i >= 0; i--) {
      const fromBottom = bottomGap + i * (thick + gap);
      const y = h - fromBottom - thick;
      arr.push(y);
    }

    return arr;
  };

  const getModuleImage = (typeId) => {
    if (typeId === "T2") return imgT2;
    if (typeId === "T3") return imgT3;
    if (typeId === "T4") return imgT4;
    if (typeId === "T5") return imgT5;
    if (typeId === "K") return imgK;
    return null;
  };

  const renderModulePreview = (typeId) => {
    // Fallback falls Bilder nicht geladen werden
    return "📦";
  };

  const types = [
    { id: "T2", name: "2 Regalflächen", h: 51 },
    { id: "T3", name: "3 Regalbretter", h: 94 },
    { id: "T4", name: "4 Regalbretter", h: 137 },
    { id: "T5", name: "5 Regalbretter", h: 180 },
    { id: "K", name: "Mit Kleiderstange", h: 180 },
  ];

  let totLen = 0;
  let totW = 0;
  modules.forEach((m) => {
    totLen += m.length === "short" ? 42 : 64.5;
    totW += m.length === "short" ? 96 : 144;
  });

  let maxH = 0;
  let maxT = "";
  modules.forEach((m) => {
    const h = getHeight(m.type);
    const pos = getPositions(m.type, h);
    let top = m.type === "K" ? 0 : pos[0];
    pos.forEach((p) => {
      if (p < top) top = p;
    });
    const bh = h - top;
    if (bh > maxH) {
      maxH = bh;
      maxT = m.type;
    }
  });

  let realH = 0;
  if (maxT === "K") {
    realH = 1800;
  } else if (maxT) {
    const n = parseInt(maxT.substring(1));
    realH = 45 + (n - 1) * 430 + 35;
  }

  let sc = 1;
  if (modules.length > 0) {
    let mh = 0;
    modules.forEach((m) => {
      const h = getHeight(m.type);
      if (h > mh) mh = h;
    });
    const sx = 800 / (totW + 100);
    const sy = 400 / (mh + 150);
    sc = sx < sy ? sx : sy;
    if (sc > 1.5) sc = 1.5;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid #e2e8f0",
          padding: "16px 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#0f172a",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            ⚙
          </div>
          <h1>Regalsystem Konfigurator</h1>
        </div>
      </header>

      <div
        style={{ display: "flex", flex: 1, overflow: "hidden" }}
      >
        <div
          style={{
            flex: 1,
            padding: "24px",
            overflowY: "auto",
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <h2
              style={{ color: "#0f172a", marginBottom: "4px" }}
            >
              Ihre Konfiguration
            </h2>
            <p style={{ color: "#64748b" }}>
              {modules.length === 0
                ? "Wählen Sie Module aus der Bibliothek"
                : `${modules.length} Module`}
            </p>
          </div>

          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "48px",
              minHeight: "500px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {modules.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: "#cbd5e1",
                }}
              >
                <div
                  style={{
                    fontSize: "48px",
                    marginBottom: "16px",
                  }}
                >
                  📦
                </div>
                <p>Keine Module ausgewählt</p>
              </div>
            ) : (
              <div
                style={{
                  transform: `scale(${sc})`,
                  transformOrigin: "center center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 0,
                  }}
                >
                  {modules.map((mod, idx) => {
                    const w = mod.length === "short" ? 96 : 144;
                    const h = getHeight(mod.type);
                    const isLeft = idx === 0;
                    const pos = getPositions(mod.type, h);
                    const thick = 35 * 0.2133; // Brettstärke
                    const railWidth = 35 * 0.2133; // 35mm Leistenbreite

                    // Berechne Höhe für die linke Leiste (nur beim ersten Modul)
                    let leftRailHeight = h;

                    // Berechne Höhe für die rechte Leiste (verbindet aktuelles und nächstes Modul)
                    let rightRailHeight = h;
                    if (idx < modules.length - 1) {
                      const nextH = getHeight(
                        modules[idx + 1].type,
                      );
                      rightRailHeight = Math.max(h, nextH);
                    }

                    return (
                      <div
                        key={mod.id}
                        style={{
                          position: "relative",
                          width: `${w}px`,
                          height: `${h}px`,
                        }}
                        onMouseEnter={() =>
                          setHoveredId(mod.id)
                        }
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        {/* Linke Leiste nur beim ersten Modul */}
                        {isLeft && (
                          <div
                            style={{
                              position: "absolute",
                              left: 0,
                              bottom: 0,
                              height: `${leftRailHeight}px`,
                              width: `${railWidth}px`,
                              backgroundColor: "#0f172a",
                            }}
                          />
                        )}

                        {/* Rechte Leiste bei allen Modulen */}
                        <div
                          style={{
                            position: "absolute",
                            right: 0,
                            bottom: 0,
                            height: `${rightRailHeight}px`,
                            width: `${railWidth}px`,
                            backgroundColor: "#0f172a",
                          }}
                        />

                        {/* Regalbretter */}
                        {pos.map((p, i) => (
                          <div
                            key={i}
                            style={{
                              position: "absolute",
                              left: isLeft
                                ? `${railWidth}px`
                                : "0px",
                              right: `${railWidth}px`,
                              top: `${p}px`,
                              height: `${thick}px`,
                              backgroundColor: "#a0522d",
                              borderTop: "2px solid #8b4513",
                              borderBottom: "2px solid #8b4513",
                            }}
                          />
                        ))}

                        {/* Kleiderstange nur bei Modul K */}
                        {mod.type === "K" && (
                          <div
                            style={{
                              position: "absolute",
                              left: isLeft
                                ? `${railWidth + 4}px`
                                : `${railWidth}px`,
                              right: `${railWidth + 4}px`,
                              top: `${135 * 0.2133}px`,
                              height: "6px",
                              backgroundColor: "#94a3b8",
                              borderRadius: "99px",
                            }}
                          />
                        )}

                        {/* Löschen-Button */}
                        {hoveredId === mod.id && (
                          <button
                            onClick={() => removeModule(mod.id)}
                            style={{
                              position: "absolute",
                              top: "-12px",
                              left: "50%",
                              transform: "translateX(-50%)",
                              width: "28px",
                              height: "28px",
                              backgroundColor: "#ef4444",
                              color: "white",
                              border: "none",
                              borderRadius: "50%",
                              cursor: "pointer",
                              boxShadow:
                                "0 4px 6px rgba(0,0,0,0.1)",
                              zIndex: 20,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div
                  style={{
                    marginTop: "48px",
                    position: "relative",
                    width: `${totW}px`,
                  }}
                >
                  {/* Höhenanzeige - parallel zur linken Leiste, beginnt auf gleicher Höhe wie die Leiste vom Boden */}
                  {maxH > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        left: "-48px",
                        bottom: "48px",
                        height: `${maxH}px`,
                      }}
                    >
                      {/* Vertikale Linie parallel zur Leiste */}
                      <div
                        style={{
                          position: "relative",
                          width: "2px",
                          height: "100%",
                          backgroundColor: "#64748b",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: "-6px",
                            width: "14px",
                            height: "2px",
                            backgroundColor: "#64748b",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: "-6px",
                            width: "14px",
                            height: "2px",
                            backgroundColor: "#64748b",
                          }}
                        />
                      </div>
                      {/* Text um 90 Grad gegen Uhrzeigersinn gedreht, links neben der Linie mit 8px Abstand */}
                      <div
                        style={{
                          color: "#64748b",
                          whiteSpace: "nowrap",
                          transform: "rotate(-90deg)",
                          transformOrigin: "center center",
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                        }}
                      >
                        {(realH / 10).toFixed(1)} cm
                      </div>
                    </div>
                  )}

                  {/* Längenangabe */}
                  <div
                    style={{
                      height: "2px",
                      backgroundColor: "#64748b",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "-6px",
                        width: "2px",
                        height: "14px",
                        backgroundColor: "#64748b",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "-6px",
                        width: "2px",
                        height: "14px",
                        backgroundColor: "#64748b",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "8px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      color: "#64748b",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {totLen} cm
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            width: "384px",
            borderLeft: "1px solid #e2e8f0",
            backgroundColor: "white",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              padding: "24px",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <h2
              style={{ marginBottom: "16px", color: "#0f172a" }}
            >
              Module Bibliothek
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {types.map((t) => {
                const isExp = expandedType === t.id;
                const moduleImg = getModuleImage(t.id);

                return (
                  <div key={t.id}>
                    <div
                      onClick={() =>
                        setExpandedType(isExp ? "" : t.id)
                      }
                      style={{
                        padding: "16px",
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "80px",
                            height: "80px",
                            backgroundColor: "#f1f5f9",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "32px",
                          }}
                        >
                          {moduleImg ? (
                            <ImageWithFallback
                              src={moduleImg}
                              alt={`${t.id} Modul`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                            />
                          ) : (
                            renderModulePreview(t.id)
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3
                            style={{
                              margin: 0,
                              color: "#0f172a",
                            }}
                          >
                            {t.id}
                          </h3>
                          <p
                            style={{
                              color: "#64748b",
                              margin: "4px 0 0",
                            }}
                          >
                            {t.name}
                          </p>
                          <p
                            style={{
                              color: "#94a3b8",
                              margin: "4px 0 0",
                            }}
                          >
                            H: {t.h}cm; T: 40cm
                          </p>
                        </div>
                      </div>
                    </div>

                    {isExp && (
                      <div
                        style={{
                          marginTop: "8px",
                          padding: "16px",
                          backgroundColor: "#f8fafc",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <p
                          style={{
                            color: "#334155",
                            marginBottom: "12px",
                          }}
                        >
                          {modules.length === 0
                            ? "Länge wählen:"
                            : "Länge und Position wählen:"}
                        </p>

                        {modules.length === 0 ? (
                          <div>
                            <button
                              onClick={() =>
                                addModule(
                                  t.id,
                                  "short",
                                  "right",
                                )
                              }
                              style={{
                                width: "100%",
                                padding: "10px 16px",
                                marginBottom: "8px",
                                border: "1px solid #e2e8f0",
                                borderRadius: "6px",
                                backgroundColor: "white",
                                cursor: "pointer",
                              }}
                            >
                              42cm
                            </button>
                            <button
                              onClick={() =>
                                addModule(t.id, "long", "right")
                              }
                              style={{
                                width: "100%",
                                padding: "10px 16px",
                                border: "1px solid #e2e8f0",
                                borderRadius: "6px",
                                backgroundColor: "white",
                                cursor: "pointer",
                              }}
                            >
                              64.5cm
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div
                              style={{ marginBottom: "12px" }}
                            >
                              <p
                                style={{
                                  color: "#64748b",
                                  marginBottom: "8px",
                                }}
                              >
                                42cm
                              </p>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "8px",
                                }}
                              >
                                <button
                                  onClick={() =>
                                    addModule(
                                      t.id,
                                      "short",
                                      "left",
                                    )
                                  }
                                  style={{
                                    flex: 1,
                                    padding: "8px 12px",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "6px",
                                    backgroundColor: "white",
                                    cursor: "pointer",
                                  }}
                                >
                                  ← Links
                                </button>
                                <button
                                  onClick={() =>
                                    addModule(
                                      t.id,
                                      "short",
                                      "right",
                                    )
                                  }
                                  style={{
                                    flex: 1,
                                    padding: "8px 12px",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "6px",
                                    backgroundColor: "white",
                                    cursor: "pointer",
                                  }}
                                >
                                  Rechts →
                                </button>
                              </div>
                            </div>
                            <div>
                              <p
                                style={{
                                  color: "#64748b",
                                  marginBottom: "8px",
                                }}
                              >
                                64.5cm
                              </p>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "8px",
                                }}
                              >
                                <button
                                  onClick={() =>
                                    addModule(
                                      t.id,
                                      "long",
                                      "left",
                                    )
                                  }
                                  style={{
                                    flex: 1,
                                    padding: "8px 12px",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "6px",
                                    backgroundColor: "white",
                                    cursor: "pointer",
                                  }}
                                >
                                  ← Links
                                </button>
                                <button
                                  onClick={() =>
                                    addModule(
                                      t.id,
                                      "long",
                                      "right",
                                    )
                                  }
                                  style={{
                                    flex: 1,
                                    padding: "8px 12px",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "6px",
                                    backgroundColor: "white",
                                    cursor: "pointer",
                                  }}
                                >
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
            <div style={{ padding: "24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <h2 style={{ margin: 0, color: "#0f172a" }}>
                  Übersicht
                </h2>
                <button
                  onClick={() => setModules([])}
                  style={{
                    padding: "4px 12px",
                    color: "#0f172a",
                    border: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
                >
                  Leeren
                </button>
              </div>
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <span style={{ color: "#64748b" }}>
                    Anzahl Module:
                  </span>
                  <span style={{ color: "#0f172a" }}>
                    {modules.length}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ color: "#64748b" }}>
                    Gesamtlänge:
                  </span>
                  <span style={{ color: "#0f172a" }}>
                    {totLen}cm
                  </span>
                </div>
              </div>
            </div>
          )}

          {modules.length > 0 && (
            <div style={{ padding: "24px", borderTop: "1px solid #e2e8f0" }}>
              <h2 style={{ marginBottom: "16px", color: "#0f172a" }}>
                Anfrage senden
              </h2>
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              >
                <p style={{ color: "#64748b", marginBottom: "16px" }}>
                  Schließen Sie Ihre Konfiguration ab und senden Sie uns eine Anfrage.
                </p>
                
                <div style={{ marginBottom: "12px" }}>
                  <label style={{ display: "block", color: "#334155", marginBottom: "4px" }}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ihr Name"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      backgroundColor: "white",
                      color: "#0f172a",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <label style={{ display: "block", color: "#334155", marginBottom: "4px" }}>
                    E-Mail
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="ihre.email@beispiel.de"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      backgroundColor: "white",
                      color: "#0f172a",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", color: "#334155", marginBottom: "4px" }}>
                    Nachricht (optional)
                  </label>
                  <textarea
                    value={customerMessage}
                    onChange={(e) => setCustomerMessage(e.target.value)}
                    placeholder="Ihre Nachricht oder Fragen..."
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      backgroundColor: "white",
                      color: "#0f172a",
                      resize: "vertical",
                    }}
                  />
                </div>

                <button
                  onClick={() => {
                    const moduleList = modules.map((m, idx) => 
                      `${idx + 1}. ${m.type} - ${m.length === 'short' ? '42cm' : '64.5cm'}`
                    ).join('%0D%0A');
                    
                    const emailBody = `Hallo,%0D%0A%0D%0AIch möchte folgende Regalsystem-Konfiguration anfragen:%0D%0A%0D%0A${moduleList}%0D%0A%0D%0AAnzahl Module: ${modules.length}%0D%0AGesamtlänge: ${totLen}cm%0D%0AHöhe: ${(realH / 10).toFixed(1)}cm%0D%0A%0D%0AKontaktdaten:%0D%0AName: ${customerName}%0D%0AE-Mail: ${customerEmail}%0D%0A%0D%0ANachricht:%0D%0A${customerMessage}%0D%0A%0D%0AMit freundlichen Grüßen`;
                    
                    window.location.href = `mailto:sophie@lerchl.one?subject=Regalsystem Anfrage&body=${emailBody}`;
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: "#0f172a",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  📧 Anfrage per E-Mail senden
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}