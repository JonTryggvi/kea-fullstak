module.exports = function (req, res) {
  var sTopHtml = sTopHtmlRam.replace('{{title}}', 'SignedIn to : : SMS').replace('{{jt-styles}}', '<link rel="stylesheet" href="/css/styles.css">')
  // var sMainHtml = sMainHtmlRam
  var sValidatedBodyHtml = sValidatedBodyHtmlRam
  var sBottomHtml = sBottomHtmlRam.replace('{{js-script}}', '<script src="/js/valid-scripts.js"></script>')
  return res.send(sTopHtml + sValidatedBodyHtml + sBottomHtml); 

}