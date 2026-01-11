import type { LSystemConfig, Rule } from '../../types/lsystem';

interface ControlPanelProps {
  config: LSystemConfig;
  onChange: (config: LSystemConfig) => void;
}

export function ControlPanel({ config, onChange }: ControlPanelProps) {
  const updateConfig = (updates: Partial<LSystemConfig>) => {
    onChange({ ...config, ...updates });
  };

  const updateRule = (index: number, field: keyof Rule, value: string) => {
    const newRules = [...config.rules];
    newRules[index] = { ...newRules[index], [field]: value };
    updateConfig({ rules: newRules });
  };

  const addRule = () => {
    updateConfig({ rules: [...config.rules, { predecessor: '', successor: '' }] });
  };

  const removeRule = (index: number) => {
    const newRules = config.rules.filter((_, i) => i !== index);
    updateConfig({ rules: newRules });
  };

  return (
    <div className="control-panel">
      <h2 style={{ marginBottom: '1.5rem', color: '#4ade80' }}>L-System Controls</h2>

      <div className="control-section">
        <h3>Axiom</h3>
        <div className="control-row">
          <input
            type="text"
            value={config.axiom}
            onChange={(e) => updateConfig({ axiom: e.target.value })}
            placeholder="Starting string (e.g., F)"
          />
        </div>
      </div>

      <div className="control-section">
        <h3>Production Rules</h3>
        <div className="rules-list">
          {config.rules.map((rule, index) => (
            <div key={index} className="rule-row">
              <input
                type="text"
                className="rule-input"
                value={rule.predecessor}
                onChange={(e) => updateRule(index, 'predecessor', e.target.value)}
                placeholder="F"
                maxLength={1}
              />
              <span className="rule-arrow">→</span>
              <input
                type="text"
                className="rule-successor"
                value={rule.successor}
                onChange={(e) => updateRule(index, 'successor', e.target.value)}
                placeholder="F[+F]F[-F]F"
              />
              {config.rules.length > 1 && (
                <button className="danger" onClick={() => removeRule(index)}>
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button className="secondary add-rule-btn" onClick={addRule}>
          + Add Rule
        </button>
      </div>

      <div className="control-section">
        <h3>Parameters</h3>

        <div className="control-row">
          <span className="control-label">Iterations</span>
          <input
            type="range"
            min="1"
            max="7"
            value={config.iterations}
            onChange={(e) => updateConfig({ iterations: parseInt(e.target.value) })}
          />
          <span className="slider-value">{config.iterations}</span>
        </div>

        <div className="control-row">
          <span className="control-label">Angle</span>
          <input
            type="number"
            value={config.angle}
            onChange={(e) => updateConfig({ angle: parseFloat(e.target.value) || 0 })}
            min="0"
            max="180"
            step="0.5"
          />
          <span style={{ color: '#a0a0a0' }}>°</span>
        </div>

        <div className="control-row">
          <span className="control-label">Step Length</span>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={config.stepLength}
            onChange={(e) => updateConfig({ stepLength: parseFloat(e.target.value) })}
          />
          <span className="slider-value">{config.stepLength.toFixed(1)}</span>
        </div>

        <div className="control-row">
          <span className="control-label">Color</span>
          <input
            type="color"
            value={config.color}
            onChange={(e) => updateConfig({ color: e.target.value })}
          />
        </div>
      </div>

      <div className="control-section">
        <h3>Randomness</h3>

        <div className="control-row">
          <span className="control-label">Length</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={config.lengthRandomness}
            onChange={(e) => updateConfig({ lengthRandomness: parseFloat(e.target.value) })}
          />
          <span className="slider-value">{Math.round(config.lengthRandomness * 100)}%</span>
        </div>

        <div className="control-row">
          <span className="control-label">Angle</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={config.angleRandomness}
            onChange={(e) => updateConfig({ angleRandomness: parseFloat(e.target.value) })}
          />
          <span className="slider-value">{Math.round(config.angleRandomness * 100)}%</span>
        </div>

        <div className="control-row">
          <span className="control-label">Seed</span>
          <input
            type="number"
            value={config.seed}
            onChange={(e) => updateConfig({ seed: parseInt(e.target.value) || 0 })}
            style={{ width: '80px' }}
          />
          <button
            className="secondary"
            onClick={() => updateConfig({ seed: Math.floor(Math.random() * 100000) })}
            style={{ marginLeft: '0.5rem' }}
          >
            Randomize
          </button>
        </div>
      </div>

      <div className="control-section">
        <h3>Commands Reference</h3>
        <div style={{ fontSize: '0.75rem', color: '#a0a0a0', lineHeight: 1.6 }}>
          <div><code>F</code> - Draw forward</div>
          <div><code>f</code> - Move forward (no draw)</div>
          <div><code>+</code> / <code>-</code> - Yaw left/right</div>
          <div><code>^</code> / <code>&amp;</code> - Pitch up/down</div>
          <div><code>\</code> / <code>/</code> - Roll left/right</div>
          <div><code>[</code> / <code>]</code> - Push/pop state</div>
        </div>
      </div>
    </div>
  );
}
