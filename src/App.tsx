import { useRef, useState } from 'react'
import Split from 'react-split-grid'
import './App.css'

function App() {
  const html = useRef<HTMLTextAreaElement>(null)
  const css = useRef<HTMLTextAreaElement>(null)
  const js = useRef<HTMLTextAreaElement>(null)
  const [template, setTemplate] = useState('')

  const update = () => {
    const htmlTemplate = createHtml()
    setTemplate(htmlTemplate)
  }

  const createHtml = () => {
    const htmlValue = html.current?.value;
    const cssValue = css.current?.value;
    const jsValue = js.current?.value;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            ${cssValue}
          </style>
        </head>
        <body>
          <script>
            ${jsValue}
          </script>
          ${htmlValue}
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
            <div className={"grid-item item-block1"}>
              <label htmlFor=""></label>
              <textarea name="" id="" ref={html} onInput={update}></textarea>
            </div>
            <div className={"grid-item item-block2"}>
              <label htmlFor=""></label>
              <textarea name="" id="" ref={css} onInput={update}></textarea>
            </div>
            <div className={"grid-item item-block3"}>
              <label htmlFor=""></label>
              <textarea name="" id="" ref={js} onInput={update}></textarea>
            </div>
            <div className={"grid-item item-block4"}>
              <iframe srcDoc={template}></iframe>
            </div>

            <div
              className={"grid-gutter item-horizontal gutter-horizontal"}
              {...getGutterProps("column", 1)}
            />

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
