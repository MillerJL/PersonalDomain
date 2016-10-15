import Koa from 'koa'
import serve from 'koa-static'
import path from 'path'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import routes from './modules/routes'

const app = new Koa()

// define the folder that will be used for static assets
app.use(serve(path.join(__dirname, 'public'), { index: false }))

app.use(async (ctx, next) => {
  await match({ routes, location: ctx.url }, (err, redirect, props) => {
    if (err) {
      ctx.status = 500
      ctx.body = err.message
    } else if (redirect) {
      ctx.redirect(redirect.pathname + redirect.search)
    } else if (props) {
      const appHtml = renderToString(<RouterContext {...props}/>)
      ctx.body = renderPage(appHtml)
    } else {
      ctx.status = 404
      ctx.body = 'Not Found'
    }
  })
})

function renderPage(appHtml) {
  return `
    <!doctype html public="storage">
    <html>
    <meta charset=utf-8/>
    <title>My First React Router App</title>
    <link rel=stylesheet href=/index.css>
    <div id=app>${appHtml}</div>
    <script src="/bundle.js"></script>
   `
}

const PORT = 8080
app.listen(PORT, ::console.log('Server Listending on port ' + PORT))
