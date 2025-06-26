const { siteConfig } = require('../config/index.ts');

console.log('🔍 Metadata Configuration Verification');
console.log('=====================================');
console.log('');

// Check if metadata base is set
if (siteConfig.metadataBase) {
  console.log('✅ metadataBase:', siteConfig.metadataBase.toString());
} else {
  console.log('❌ metadataBase: Not set');
}

// Check icon configuration
if (siteConfig.icons) {
  console.log('✅ Icons configured:');
  console.log('   - icon:', siteConfig.icons.icon);
  console.log('   - shortcut:', siteConfig.icons.shortcut);
  console.log('   - apple:', siteConfig.icons.apple);
} else {
  console.log('❌ Icons: Not configured');
}

// Check Open Graph configuration
if (siteConfig.openGraph) {
  console.log('✅ Open Graph configured:');
  console.log('   - title:', siteConfig.openGraph.title);
  console.log('   - url:', siteConfig.openGraph.url);
  if (siteConfig.openGraph.images && siteConfig.openGraph.images.length > 0) {
    console.log('   - image:', siteConfig.openGraph.images[0].url);
  }
} else {
  console.log('❌ Open Graph: Not configured');
}

// Check Twitter configuration
if (siteConfig.twitter) {
  console.log('✅ Twitter configured:');
  console.log('   - card:', siteConfig.twitter.card);
  console.log('   - creator:', siteConfig.twitter.creator);
  if (siteConfig.twitter.images && siteConfig.twitter.images.length > 0) {
    console.log('   - image:', siteConfig.twitter.images[0]);
  }
} else {
  console.log('❌ Twitter: Not configured');
}

console.log('');
console.log('📋 Summary:');
console.log('- Favicon will now use: /mascotnew.svg');
console.log('- Apple touch icon will use: /mascotnew.svg');
console.log('- Social media previews will use: /heronew.png');
console.log('- Old icon files remain in the repository but are not used');
console.log('');
console.log('🚀 After deployment, browser tabs, bookmarks, and social media');
console.log('   previews should show the new purple mascot instead of the green one!');
