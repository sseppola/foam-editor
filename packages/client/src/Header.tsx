import React from 'react';
import './App.css';
import {useProjectConfig, useUpdateProjectConfig} from './project-config';

const ProjectSelector = () => {
  const config = useProjectConfig();
  const updateConfig = useUpdateProjectConfig();
  const [projectPath, set_projectPath] = React.useState(config.path);

  const [open, set_open] = React.useState(false);

  return (
    <div
      style={{
        flex: '0 1 auto',
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
      }}>
      {open ? (
        <>
          <input
            value={projectPath}
            onChange={(e) => set_projectPath(e.target.value)}
          />
          <span
            className="cursor-pointer"
            onClick={() => {
              updateConfig({path: projectPath});
              set_open(false);
            }}>
            Save
          </span>
        </>
      ) : (
        <span className="cursor-pointer" onClick={() => set_open(true)}>
          {projectPath || 'Set project'}
        </span>
      )}
    </div>
  );
};

export const Header = () => {
  return (
    <header className="App-header">
      <div className="App-logo">Foam Editor</div>
      <ProjectSelector />
    </header>
  );
};
