import React, { useEffect, useMemo, useState, useRef } from "react";
import PropTypes from 'prop-types';
import 'draft-js/dist/Draft.css';
import Editor from 'draft-js-plugins-editor';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import createToolbarPlugin from 'draft-js-static-toolbar-plugin';
import buttonStyles from '../buttonStyles.css';
import toolbarStyles from '../toolbarStyles.css';
<link rel="stylesheet" href="./style.css"></link>
import css from './style.css';


const toolbarPlugin = createToolbarPlugin({
  theme: { buttonStyles, toolbarStyles }
});

function PlaintextEditor({ file, write }) {

  const initialState = EditorState.createEmpty()
  const [editorState, setEditorState] = useState(initialState);
  const { Toolbar } = toolbarPlugin;

  useEffect(() => {
    getSavedEditorData();
  }, [file]);

  useEffect(() => {
    saveEditorContent();
  }, [editorState]);

  const getSavedEditorData = () => {
    const savedData = localStorage.getItem(file.name);
    if (savedData) {
      const rawEditorData = JSON.parse(savedData)
      const contentState = convertFromRaw(rawEditorData);
      setEditorState(EditorState.createWithContent(contentState))
    }
    else { return null }
  }


  const saveEditorContent = async () => {
    const raw = convertToRaw(editorState.getCurrentContent());
    localStorage.setItem(file.name, JSON.stringify(raw));
    return;
  }


  const handleSave = async () => {
    const result = await saveEditorContent()
    write(file);
  }

  const [fileName, setfileName] = useState('new file')


  const handleSubmit = (e) => {
    e.preventDefault();
    const newDate = new Date();
    const newfile = new File(
      ["you're doing great"], fileName, { type: 'text/plain', lastModified: newDate });
    write(newfile);
    setEditorState(initialState);
  }

  const handleOnChange = e => {
    setfileName(e.target.value)
  }

  return (
    <div>
      <form class={css.forminline} onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter new file name" onChange={handleOnChange} />
        <button type="submit">New File</button>
        <button Click={() => handleSave()}> Save Changes </button>
      </form>
      <Toolbar />
      <div className={css.editor}>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          placeholder='start typing'
          plugins={[toolbarPlugin]} />
      </div>
    </div>
  )
}

PlaintextEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func,
};

export default PlaintextEditor;
