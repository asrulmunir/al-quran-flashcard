#!/bin/bash

# Cache-busting script for Al-Quran Flashcard
# Updates version numbers in HTML to force fresh downloads

TIMESTAMP=$(date +%Y%m%d%H%M%S)
echo "🔄 Updating cache-busting version to: $TIMESTAMP"

# Update CSS version
sed -i.bak "s/styles\.css?v=[0-9]*/styles.css?v=$TIMESTAMP/g" index.html

# Update JS version  
sed -i.bak "s/script\.js?v=[0-9]*/script.js?v=$TIMESTAMP/g" index.html

# Remove backup file
rm -f index.html.bak

echo "✅ Cache-busting version updated in index.html"
echo "📁 Files will be served fresh on next deployment"
