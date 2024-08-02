import React, { useCallback, useEffect, useState } from 'react'
import Quill from 'quill';
import "../../../client/node_modules/quill/dist/quill.snow.css";
import { io } from "../../../client/node_modules/socket.io-client";
import { useParams } from 'react-router-dom';

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
  ]

  const SAVE_INTERVAL_MS = 2000

function TextEditor() {
  const {id: documentId} = useParams()
  const [socket, setSocket] = useState()
  const [quill, setQuill] = useState()

  useEffect(()=>{
    const s  = io('http://localhost:5000')
    setSocket(s)

    return () => {
      s.disconnect()
    }
  },[])

  useEffect(()=>{
    if (socket == null || quill == null) return 

    socket.once('load-document', (document) => {
      if (document){
        quill.setContents(document)
        console.log(document)
        quill.enable()
      }else {
        console.error("Document not found")
      }
    })

    socket.emit('get-document', documentId)
  },[socket, quill, documentId])

  useEffect(()=>{
    if (socket == null || quill == null) return

    const interval = setInterval(()=>{
      socket.emit('save-document', quill.getContents())
    }, SAVE_INTERVAL_MS)

    return ()=>{
      clearInterval(interval)
    }
  },[socket, quill])

  useEffect(()=>{
    if (socket == null || quill == null) return 

    const handler = (delta, oldDelta, source)=>{
      if (source !== 'user') return
      socket.emit('send-changes', delta)
    }
    quill.on('text-change', handler)

    return () => {
      quill.off('text-change', handler)
    }
  },[quill, socket])

  useEffect(()=>{
    if (socket == null || quill == null) return 

    const handler = (delta)=>{
      quill.updateContents(delta)
    }
    socket.on('receive-changes', handler)

    return () => {
      socket.off('receive-changes', handler)
    }
  },[quill, socket])

    const wrapperRef = useCallback(wrapper => {
        if (wrapper == null) return

        wrapper.innerHTML = ''

        const editor = document.createElement('div')
        wrapper.append(editor)
        const q = new Quill(editor, {
          theme: 'snow', 
          modules: {toolbar: TOOLBAR_OPTIONS}}
        )
        q.disable()
        q.setText('Loading......')
        setQuill(q)
    }, [])

  return (
    <div className='container' ref={wrapperRef}></div>
  )
}

export default TextEditor