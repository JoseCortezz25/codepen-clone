import { useRef, useState } from 'react'
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
      <section>

        <div>
          <label htmlFor=""></label>
          <textarea name="" id="" ref={html} onInput={update}></textarea>
        </div>

        <div>
          <label htmlFor=""></label>
          <textarea name="" id="" ref={css} onInput={update}></textarea>
        </div>

        <div>
          <label htmlFor=""></label>
          <textarea name="" id="" ref={js} onInput={update}></textarea>
        </div>

        <iframe srcDoc={template}></iframe>

      </section>
    </main>
  )
}

export default App
