import './App.css';

import React from 'react';
import debounce from 'lodash/debounce';

import {Header} from './Header';
import {ProjectConfigProvider} from './project-config';
import {Sidebar} from './Sidebar';
import {useApi} from './api';

import {Controlled as CodeMirror} from 'react-codemirror2/.ts';
require('codemirror/mode/gfm/gfm');

function App() {
  const [selectedNoteId, set_selectedNoteId] = React.useState('');

  return (
    <div className="App">
      <Header />

      <div className="App-body">
        <Sidebar
          selectedNoteId={selectedNoteId}
          onNoteSelected={set_selectedNoteId}
        />
        <Editor selectedNoteId={selectedNoteId} />
      </div>
    </div>
  );
}

const Editor = (props: {selectedNoteId: string}) => {
  const {selectedNoteId} = props;
  const api = useApi();

  const [noteContent, set_noteContent] = React.useState('');

  React.useEffect(() => {
    if (!selectedNoteId) {
      return;
    }
    api
      .readNote(selectedNoteId)
      .then((noteContent) => {
        set_noteContent(noteContent);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [api, selectedNoteId]);

  const saveChanges = React.useCallback(
    debounce(
      (updatedContent: string) => {
        api.saveNote(selectedNoteId, updatedContent);
      },
      500,
      {leading: false, trailing: true},
    ),
    [api, selectedNoteId],
  );

  return (
    <CodeMirror
      value={noteContent}
      options={{
        mode: 'gfm',
        theme: 'elegant',
        lineNumbers: false,
        lineWrapping: true,
      }}
      onBeforeChange={(editor, data, value) => {
        set_noteContent(value);
        saveChanges(value);
      }}
    />
  );
};

export default function () {
  return (
    <ProjectConfigProvider>
      <App />
    </ProjectConfigProvider>
  );
}
