import React from 'react';
import './App.css';

import {useApi} from './api';
import {NoteT} from './types';

export const Sidebar = (props: {
  selectedNoteId: string;
  onNoteSelected: (id: string) => void;
}) => {
  const api = useApi();
  const [notes, set_notes] = React.useState<NoteT[]>([]);

  React.useEffect(() => {
    api
      .getNotes()
      .then((_notes) => {
        set_notes(_notes);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [api]);

  console.log('notes', notes);

  return (
    <aside className="notes-sidebar">
      <ul>
        {notes.length === 0 ? <p>No notes</p> : null}
        {notes.map((note) => (
          <li
            key={note.id}
            className="cursor-pointer"
            onClick={() => props.onNoteSelected(note.id)}>
            {note.title}
          </li>
        ))}
      </ul>
    </aside>
  );
};
