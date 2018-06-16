document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.fixed-action-btn');
  var instances = M.FloatingActionButton.init(elems, {
    direction: 'left',
    hoverEnabled: false
  });

  var tooltipElement = document.querySelectorAll('.tooltipped');
  var toolTipInstace = M.Tooltip.init(tooltipElement, {
    position: 'top'
  });

});