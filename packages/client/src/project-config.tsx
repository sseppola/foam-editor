import React, {useContext} from 'react';
import {ProjectConfigT} from './types';

const PROJECT_CONFIG_KEY = 'foam-config';

const FoamProjectContext = React.createContext<ProjectConfigT>({
  path: '',
});

type UpdateConfigT = (conf: Partial<ProjectConfigT>) => void;
const UpdateFoamProjectContext = React.createContext<UpdateConfigT>(() => {});

export const ProjectConfigProvider = (props: {children: React.ReactNode}) => {
  const [projectConfig, set_projectConfig] = React.useState<ProjectConfigT>(
    () => {
      const configString = localStorage.getItem(PROJECT_CONFIG_KEY);

      if (configString) {
        return JSON.parse(configString);
      }
      return {path: ''};
    },
  );

  React.useEffect(() => {
    localStorage.setItem(PROJECT_CONFIG_KEY, JSON.stringify(projectConfig));
  }, [projectConfig]);

  const updateConfig = React.useCallback((config: Partial<ProjectConfigT>) => {
    set_projectConfig((_prevConf) => ({..._prevConf, ...config}));
  }, []);

  return (
    <FoamProjectContext.Provider value={projectConfig}>
      <UpdateFoamProjectContext.Provider value={updateConfig}>
        {props.children}
      </UpdateFoamProjectContext.Provider>
    </FoamProjectContext.Provider>
  );
};

export const useUpdateProjectConfig = () => {
  return useContext(UpdateFoamProjectContext);
};

export const useProjectConfig = () => {
  return useContext(FoamProjectContext);
};
