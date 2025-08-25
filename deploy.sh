#!/bin/bash

# Al-Quran Flashcard Deployment Script for Cloudflare Workers

echo "🚀 Deploying Al-Quran Flashcard to Cloudflare Workers..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Login to Cloudflare (if not already logged in)
echo "🔐 Checking Cloudflare authentication..."
wrangler whoami || wrangler login

# Create dist directory
echo "📁 Creating build directory..."
mkdir -p dist

# Copy static files to dist
echo "📋 Copying static files..."
cp index.html dist/
cp styles.css dist/
cp script.js dist/
cp api-spec.yaml dist/

# Create a simple worker script that serves static files
echo "⚙️ Creating worker script..."
cat > dist/index.js << 'EOF'
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const pathname = url.pathname

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'public, max-age=3600',
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  // Serve files based on pathname
  let content, contentType
  
  try {
    switch (pathname) {
      case '/':
      case '/index.html':
        content = await fetch(new URL('./index.html', import.meta.url)).then(r => r.text())
        contentType = 'text/html; charset=utf-8'
        break
      case '/styles.css':
        content = await fetch(new URL('./styles.css', import.meta.url)).then(r => r.text())
        contentType = 'text/css; charset=utf-8'
        break
      case '/script.js':
        content = await fetch(new URL('./script.js', import.meta.url)).then(r => r.text())
        contentType = 'application/javascript; charset=utf-8'
        break
      case '/api-spec.yaml':
        content = await fetch(new URL('./api-spec.yaml', import.meta.url)).then(r => r.text())
        contentType = 'text/yaml; charset=utf-8'
        break
      default:
        // Default to index.html for SPA routing
        content = await fetch(new URL('./index.html', import.meta.url)).then(r => r.text())
        contentType = 'text/html; charset=utf-8'
    }

    return new Response(content, {
      headers: {
        'Content-Type': contentType,
        ...corsHeaders,
      },
    })
  } catch (error) {
    return new Response('File not found', { 
      status: 404, 
      headers: corsHeaders 
    })
  }
}
EOF

# Create wrangler.toml in dist
echo "📝 Creating wrangler configuration..."
cat > dist/wrangler.toml << EOF
name = "al-quran-flashcard"
main = "index.js"
compatibility_date = "2024-08-25"

[site]
bucket = "."
EOF

# Deploy to Cloudflare Workers
echo "🌐 Deploying to Cloudflare Workers..."
cd dist && wrangler deploy

echo "✅ Deployment complete!"
echo "🔗 Your app should be available at: https://al-quran-flashcard.your-subdomain.workers.dev"
echo ""
echo "📋 Next steps:"
echo "1. Check your Cloudflare Workers dashboard"
echo "2. Configure custom domain if needed"
echo "3. Test the application"
