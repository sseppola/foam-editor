import './App.css';

import React from 'react';

import {Header} from './Header';
import {ProjectConfigProvider} from './project-config';
import {Sidebar} from './Sidebar';
import {useApi} from './api';

import {UnControlled as CodeMirror} from 'react-codemirror2/.ts';
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
        console.log('noteContent', noteContent);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [api, selectedNoteId]);

  return (
    <CodeMirror
      value={noteContent}
      options={{
        mode: 'gfm',
        theme: 'elegant',
        lineNumbers: false,
        lineWrapping: true,
      }}
      onChange={(editor, data, value) => {}}
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
