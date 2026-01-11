import { useState, useMemo } from 'react';
import './App.css';
import { Canvas3D } from './components/Canvas3D';
import { ControlPanel } from './components/ControlPanel/ControlPanel';
import { type LSystemConfig, DEFAULT_CONFIG } from './types/lsystem';
import { expandLSystem } from './lsystem/expander';
import { interpretLSystem } from './lsystem/turtle3d';

function App() {
  const [config, setConfig] = useState<LSystemConfig>(DEFAULT_CONFIG);

  const segments = useMemo(() => {
    if (!config.axiom || config.rules.length === 0) {
      return [];
    }

    const validRules = config.rules.filter(
      (r) => r.predecessor && r.successor
    );

    if (validRules.length === 0) {
      return [];
    }

    const expanded = expandLSystem(config.axiom, validRules, config.iterations);
    return interpretLSystem(expanded, config.angle, config.stepLength);
  }, [config]);

  return (
    <div className="app-container">
      <div className="canvas-pane">
        <Canvas3D segments={segments} color={config.color} />
      </div>
      <div className="control-pane">
        <ControlPanel config={config} onChange={setConfig} />
      </div>
    </div>
  );
}

export default App;
