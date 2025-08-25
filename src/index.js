// Cloudflare Worker for Al-Quran Flashcard App
import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

// Import static files
import indexHtml from '../index.html'
import stylesCss from '../styles.css'
import scriptJs from '../script.js'
import apiSpecYaml from '../api-spec.yaml'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const pathname = url.pathname

  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    // Route static files
    let response
    let contentType = 'text/html'

    switch (pathname) {
      case '/':
      case '/index.html':
        response = new Response(indexHtml, {
          headers: { 
            'Content-Type': 'text/html; charset=utf-8',
            ...corsHeaders 
          }
        })
        break

      case '/styles.css':
        response = new Response(stylesCss, {
          headers: { 
            'Content-Type': 'text/css; charset=utf-8',
            ...corsHeaders 
          }
        })
        break

      case '/script.js':
        response = new Response(scriptJs, {
          headers: { 
            'Content-Type': 'application/javascript; charset=utf-8',
            ...corsHeaders 
          }
        })
        break

      case '/api-spec.yaml':
        response = new Response(apiSpecYaml, {
          headers: { 
            'Content-Type': 'text/yaml; charset=utf-8',
            ...corsHeaders 
          }
        })
        break

      default:
        // Try to get asset from KV storage
        try {
          response = await getAssetFromKV(event, {
            mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req),
          })
          
          // Add CORS headers to KV response
          response = new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: {
              ...response.headers,
              ...corsHeaders,
            },
          })
        } catch (e) {
          // If asset not found, serve index.html for SPA routing
          response = new Response(indexHtml, {
            headers: { 
              'Content-Type': 'text/html; charset=utf-8',
              ...corsHeaders 
            }
          })
        }
    }

    return response

  } catch (e) {
    return new Response('Internal Server Error', { 
      status: 500,
      headers: corsHeaders 
    })
  }
}
