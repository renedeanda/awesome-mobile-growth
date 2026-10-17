// Sets <html data-platform="apple | android | other"> before first paint so navigation chrome can
// match the visitor's device. The site is a static export, so this can only happen in the browser.
// iPadOS reports a Mac user agent; both are Apple, so no touch check is needed.
export const PLATFORM_SCRIPT = `(function(){var p="other";try{var n=navigator,s=(n.userAgentData&&n.userAgentData.platform)||"",u=n.userAgent||"";if(/android/i.test(s+" "+u))p="android";else if(/^(macos|ios)$/i.test(s)||/iPhone|iPad|iPod|Macintosh/.test(u))p="apple"}catch(e){}document.documentElement.setAttribute("data-platform",p)})();`;
