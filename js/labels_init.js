function setLabels(s) {

  // Get the activity/organization
  var selection = $('#selectGroup' + s)
    .children('option:selected')
    .attr('class');

  // Grab the appropriate labels
  if (selection == 'acts'){
    var columns = activity_labels;
  } else {
    var columns = organization_labels;
  }

  // Remove the current options
  $('#selectType' + s).find('option').remove().end()

  // Add the options
  $.each(columns, function(key, val){
    $('#selectType' + s).append('<option class=' + key + '>' + val + '</option>');
  });

}

setLabels('UV')
$('#selectGroupUV').change(function(){
  setLabels('UV');
});


setLabels('BV');
$('#selectGroupBV').change(function(){
  setLabels('BV');
});

setLabels('SP');
$('#selectGroupSP').change(function(){
  setLabels('SP');
});

function setStateRC(stateNames) {
  var s = $('#selectStateRC');
  for (var state of stateNames){
    s.append('<option class=' + state.replace(/\s+/g, '') + '>' + state + '</option>');
  }
}

function setDemographics(s) {
  $.each(demographic_labels, function(key, val){
    $('#selectDemographic' + s).append('<option class=' + key + '>' + val + '</option>');
  });
}

setDemographics('BV');
setDemographics('SP');

function setScheme(s) {
  for (c of schemes) {
    $('#selectScheme' + s).append(`<option class=${c.name}>${c.name}</option>`);
  }
}

setScheme('BV');
setScheme('SP');
