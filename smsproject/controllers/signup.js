module.exports = function (req, res) {
  var sTopHtml = sTopHtmlRam.replace('{{title}}', 'Signup to : : SMS').replace('{{jt-styles}}', '<link rel="stylesheet" href="/css/styles.css">')
  // var sMainHtml = sMainHtmlRam
  var sSignUpBodyHtml = sSignUpBodyHtmlRam
  var sBottomHtml = sBottomHtmlRam.replace('{{js-script}}', '<script src="/js/signup-scripts.js"></script>')
  return res.send(sTopHtml + sSignUpBodyHtml + sBottomHtml);
}