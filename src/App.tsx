import { useEffect, useRef, useState } from 'react'
import Split from 'react-split-grid'
import { encode, decode } from 'js-base64'
import htmlIcon from './assets/html-logo.png'
import cssIcon from './assets/css-logo.png'
import javascriptIcon from './assets/javascript-logo.png'
import './App.css'

type TemplateProps = {
  cssValue: string | undefined,
  htmlValue: string | undefined,
  jsValue: string | undefined
}

function App() {
  const html = useRef<HTMLTextAreaElement>(null)
  const css = useRef<HTMLTextAreaElement>(null)
  const js = useRef<HTMLTextAreaElement>(null)
  const [template, setTemplate] = useState('')

  useEffect(() => {
    const { pathname } = window.location;
    const [rawHtml, rawCss, rawJs] = pathname.slice(1).split('%7C')

    const pureHtml = rawHtml === undefined ? decode(rawHtml) : ''
    const pureCss = rawHtml === undefined ? decode(rawCss) : ''
    const pureJs = rawHtml === undefined ? decode(rawJs) : ''

    if (html.current !== null && css.current !== null && js.current !== null) {
      html.current.value = pureHtml
      css.current.value = pureCss
      js.current.value = pureJs
    }

    const htmlForPreview = createHtml({ htmlValue: html.current?.value, cssValue: css.current?.value, jsValue: js.current?.value })
    setTemplate(htmlForPreview)
  }, [])

  const update = () => {
    const htmlValue = html.current?.value;
    const cssValue = css.current?.value;
    const jsValue = js.current?.value;

    if (typeof htmlValue !== 'undefined' && typeof cssValue !== 'undefined' && typeof jsValue !== 'undefined') {
      const hashedCode = `${encode(htmlValue)}|${encode(cssValue)}|${encode(jsValue)}`
      window.history.replaceState(null, '', `/${hashedCode}`)
    }

    const htmlForPreview = createHtml({ htmlValue, cssValue, jsValue })
    setTemplate(htmlForPreview)
  }

  const createHtml = ({ cssValue, htmlValue, jsValue }: TemplateProps) => {
    console.log('de una');

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
      <Split
        columnCursor="col-resize"
        rowCursor="row-resize"
        render={({
          getGridProps,
          getGutterProps,
        }) => (
          <div className={"grid-container"} {...getGridProps()}>
            <div className={"item grid-item item-block1"}>
              <textarea name="" id="" ref={html} onInput={update}></textarea>
              <img alt="Icono de" src={htmlIcon} />
            </div>
            <div className={"item grid-item item-block2"}>
              <textarea name="" id="" ref={css} onInput={update}></textarea>
              <img alt="Icono de" src={cssIcon} />
            </div>
            <div className={"item grid-item item-block3"}>
              <textarea name="" id="" ref={js} onInput={update}></textarea>
              <img alt="Icono de" src={javascriptIcon} />
            </div>
            <div className={"grid-item item-block4"}>
              <iframe srcDoc={template}></iframe>
            </div>

            <div
              className={"grid-gutter item-horizontal gutter-horizontal"}
              {...getGutterProps("column", 1)}
            />

            {/* <div
              className={"grid-gutter item-horizontal2 gutter-horizontal"}
              {...getGutterProps("column", 3)}
            /> */}

            <div
              className={"grid-gutter item-vertical gutter-vertical"}
              {...getGutterProps("row", 1)}
            />

          </div>
        )}
      />
    </main >
  )
}

export default App
