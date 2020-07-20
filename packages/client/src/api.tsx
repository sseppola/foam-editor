import * as React from 'react';
import {useProjectConfig} from './project-config';
import {NoteT} from './types';

const BASE_URL = `http://localhost:3300`;
const getUrl = (path: string, project: string) => {
  return BASE_URL + path + `?project=${encodeURIComponent(project)}`;
};

export const useApi = () => {
  const projectConfig = useProjectConfig();

  return React.useMemo(
    () => ({
      getNotes: (): Promise<NoteT[]> => {
        if (!projectConfig.path) {
          return Promise.resolve([]);
        }
        return fetch(getUrl('/notes', projectConfig.path), {
          method: 'GET',
        }).then((res) => {
          if (res.ok) {
            return res.json();
          }

          return res.text().then((text) => Promise.reject(text));
        });
      },
      readNote: (noteId: string): Promise<string> => {
        if (!projectConfig.path) {
          return Promise.reject('Missing project path');
        }
        return fetch(
          getUrl(`/notes/${encodeURIComponent(noteId)}`, projectConfig.path),
          {method: 'GET'},
        ).then((res) => {
          if (res.ok) {
            return res.text();
          }

          return res.text().then((text) => Promise.reject(text));
        });
      },
      saveNote: (noteId: string, content: string): Promise<string> => {
        if (!projectConfig.path) {
          return Promise.reject('Missing project path');
        }

        return fetch(
          getUrl(`/notes/${encodeURIComponent(noteId)}`, projectConfig.path),
          {
            method: 'POST',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({content}),
          },
        ).then((res) => {
          if (res.ok) {
            return res.text();
          }

          return res.text().then((text) => Promise.reject(text));
        });
      },
    }),
    [projectConfig],
  );
};
