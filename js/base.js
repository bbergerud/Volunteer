const w = $('.container').width();
const h = parseInt(w * 0.75);
const sWidth  = w;
const sHeight = 0.7 * h;
const margin = {'top': 60, 'bottom': 60, 'left': 60, 'right': 60};
const n = 3;
const k = 24;




function getScheme(s) {
  var color = $('#selectScheme' + s).children('option:selected').attr('class');
  for (c of schemes) {
    if (c.name == color) {
      return c.colors;
    }
  }
}

function getScale(s) {
  return $('#selectScale' + s).children('option:selected').attr('class');
}

function getDemo(s) {
  return $('#selectDemographic' + s).children('option:selected').attr('class');
}

function getGroup(s) {
  return $('#selectGroup' + s).children('option:selected').attr('class');
}

function getType(s) {
  return $('#selectType' + s).children('option:selected').attr('class');
}
