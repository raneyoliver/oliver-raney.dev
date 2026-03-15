"use client";

interface InfoPanelProps {
  visible: boolean;
  instructions: string | null;
  controls?: { button: string; action: string }[];
  widgetHtml: string | null;
}

export default function InfoPanel({ visible, instructions, controls, widgetHtml }: InfoPanelProps) {
  if (!visible) return null;

  return (
    <div className="info-panel-overlay">
      <div className="info-panel-content">
        <h2 className="info-panel-title">CREATION INTEL</h2>
        
        <div className="info-panel-grid">
          <div className="info-panel-section">
            <h3 className="info-panel-subtitle">CONTROLS</h3>
            <ul className="info-panel-controls">
              <li><span className="key">W</span><span className="key">A</span><span className="key">S</span><span className="key">D</span> Move</li>
              <li><span className="key">MOUSE</span> Rotate</li>
              <li><span className="key">L-CLICK</span> / <span className="key">R-CLICK</span> Action</li>
              <li><span className="key">TAB</span> Info Panel</li>
              <li><span className="key">ESC</span> Pause</li>
              {controls && controls.length > 0 && (
                <>
                  <li style={{ marginTop: "1rem", color: "#FF00FF", fontSize: "12px" }}>--- CUSTOM MECHANICS ---</li>
                  {controls.map((c, i) => (
                    <li key={`ctrl-${i}`}>
                      <span className="key" style={{ borderColor: "#FF00FF", color: "#FF00FF", boxShadow: "0 0 5px #FF00FF33" }}>
                        {c.button.toUpperCase()}
                      </span>
                      {c.action}
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>
          
          <div className="info-panel-section">
            <h3 className="info-panel-subtitle">INSTRUCTIONS</h3>
            <p className="info-panel-text">
              {instructions || "No custom instructions available for this creation."}
            </p>
          </div>
        </div>

        <div className="info-panel-preview">
          <h3 className="info-panel-subtitle center">SCHEMATICS</h3>
          <div className="info-panel-preview-box">
             {widgetHtml ? (
               <div dangerouslySetInnerHTML={{ __html: widgetHtml }} />
             ) : (
               <div className="info-panel-empty">AWAITING DESIGN...</div>
             )}
          </div>
        </div>
        
        <div className="info-panel-footer">
          PRESS TAB TO CLOSE
        </div>
      </div>
    </div>
  );
}
