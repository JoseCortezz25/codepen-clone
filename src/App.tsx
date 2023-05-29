import { useEffect, useState } from 'react'
import Split from 'react-split-grid'
import { encode, decode } from 'js-base64'
import htmlIcon from './assets/html-logo.png'
import cssIcon from './assets/css-logo.png'
import javascriptIcon from './assets/javascript-logo.png'
import githubIcon from './assets/github.svg'
import fileIcon from './assets/file-zip.svg'
import { Editor } from '@monaco-editor/react';
import { OnChange } from '@monaco-editor/react'
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import './App.css'

type TemplateProps = {
  cssValue: string | undefined,
  htmlValue: string | undefined,
  jsValue: string | undefined
}

function App() {
  const [html, setHtml] = useState<string>('')
  const [css, setCss] = useState<string>('')
  const [js, setJs] = useState<string>('')
  const [template, setTemplate] = useState('')

  const COMMON_EDITOR_OPTIONS = {
    automaticLayout: true,
    fontSize: 18,
  }

  useEffect(() => {
    const { pathname } = window.location;

    const [rawHtml, rawCss, rawJs] = pathname.slice(1).split('%7C')

    const pureHtml = rawHtml !== undefined ? decode(rawHtml) : ''
    const pureCss = rawCss !== undefined ? decode(rawCss) : ''
    const pureJs = rawJs !== undefined ? decode(rawJs) : ''

    if (html !== null && css !== null && js !== null) {
      setHtml(pureHtml)
      setCss(pureCss)
      setJs(pureJs)
    }

    const htmlForPreview = createHtml({ htmlValue: pureHtml, cssValue: pureCss, jsValue: pureJs })
    setTemplate(htmlForPreview)
  }, [])

  const downloadCode = () => {
    const zip = new JSZip();
    zip.file('index.html', html);
    zip.file('script.js', js);
    zip.file('style.css', css);

    zip.generateAsync({ type: 'blob' })
      .then((content: Blob) => {
        saveAs(content, 'codeo.zip');
      });
  }

  const handleEditorHtml: OnChange = (value) => {
    if (typeof value === 'string') {
      setHtml(value)
      update()
    }
  }

  const handleEditorCss: OnChange = (value) => {
    if (typeof value === 'string') {
      setCss(value)
      update()
    }
  }

  const handleEditorJs: OnChange = (value) => {
    if (typeof value === 'string') {
      setJs(value)
      update()
    }
  }

  const update = () => {
    if (typeof html !== 'undefined' && typeof css !== 'undefined' && typeof js !== 'undefined') {
      const hashedCode = `${encode(html)}|${encode(css)}|${encode(js)}`
      window.history.replaceState(null, '', `/${hashedCode}`)
    }

    const htmlForPreview = createHtml({ htmlValue: html, cssValue: css, jsValue: js })
    setTemplate(htmlForPreview)
  }

  const createHtml = ({ cssValue, htmlValue, jsValue }: TemplateProps) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            ${cssValue}
          </style>
        </head>
        <body>
        ${htmlValue}
          <script>
            ${jsValue}
          </script>
        </body>
      </html>
    `
  }

  return (
    <main className='Main'>
      <section>
        <Split
          columnCursor="col-resize"
          rowCursor="row-resize"
          render={({
            getGridProps,
            getGutterProps,
          }) => (
            <div className={"grid-container"} {...getGridProps()}>
              <div className={"item grid-item item-block1"}>
                <Editor
                  defaultValue={html}
                  defaultLanguage="html"
                  onChange={(handleEditorHtml)}
                  theme='vs-dark'
                  options={{
                    ...COMMON_EDITOR_OPTIONS
                  }}
                />
                <img alt="Icono de HTML" src={htmlIcon} />
              </div>
              <div className={"item grid-item item-block2"}>
                <Editor
                  defaultValue={css}
                  defaultLanguage="css"
                  onChange={handleEditorCss}
                  theme='vs-dark'
                  options={{
                    ...COMMON_EDITOR_OPTIONS
                  }}
                />
                <img alt="Icono de CSS" src={cssIcon} />
              </div>
              <div className={"item grid-item item-block3"}>
                <Editor
                  defaultValue={js}
                  defaultLanguage="javascript"
                  onChange={handleEditorJs}
                  theme='vs-dark'
                  options={{
                    ...COMMON_EDITOR_OPTIONS
                  }}
                />
                <img alt="Icono de JS" src={javascriptIcon} />
              </div>
              <div className={"grid-item item-block4"}>
                <iframe srcDoc={template}></iframe>
              </div>

              <div
                className={"grid-gutter item-horizontal gutter-horizontal"}
                {...getGutterProps("column", 1)} />

              <div
                className={"grid-gutter item-vertical gutter-vertical"}
                {...getGutterProps("row", 1)}
              />
            </div>
          )}
        />
      </section>
      <aside className='menu'>
        <button onClick={downloadCode}>
          <img src={githubIcon} alt="Icono de boton github" />
        </button>

        <a href="https://github.com/JoseCortezz25/codepen-clone">
          <button onClick={downloadCode}>
            <img src={fileIcon} alt="Icono de boton zip" />
          </button>
        </a>

      </aside>
    </main>
  )
}

export default App
