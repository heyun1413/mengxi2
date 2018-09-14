define(function(require) {
  var formname               = require('text!templates/snippet/formname.html')
  , textinput                = require('text!templates/snippet/textinput.html')
  , filebutton               = require('text!templates/snippet/filebutton.html')
  , imagebutton              = require('text!templates/snippet/imagebutton.html')
  , multiplecheckboxes       = require('text!templates/snippet/multiplecheckboxes.html')
  , multiplecheckboxesinline = require('text!templates/snippet/multiplecheckboxesinline.html')
  , tablelist                = require('text!templates/snippet/tablelist.html')
  , flowtablelist            = require('text!templates/snippet/tablelist.html')
  , multipleradios           = require('text!templates/snippet/multipleradios.html')
  , multipleradiosinline     = require('text!templates/snippet/multipleradiosinline.html')
  , passwordinput            = require('text!templates/snippet/passwordinput.html')
  , selectbasic              = require('text!templates/snippet/selectbasic.html')
  , selectmultiple           = require('text!templates/snippet/selectmultiple.html')
  , textarea                 = require('text!templates/snippet/textarea.html')
  , textinput                = require('text!templates/snippet/textinput.html')
  , searchinput              = require('text!templates/snippet/searchinput.html')
  , inputhidden              = require('text!templates/snippet/inputhidden.html')
  , dateinput                = require('text!templates/snippet/dateinput.html')
  , datetimeinput            = require('text!templates/snippet/datetimeinput.html')
  , sectiontitle             = require('text!templates/snippet/sectiontitle.html')
  , printbutton              = require('text!templates/snippet/printbutton.html');

  return {
    formname                   : formname
    , textinput                : textinput
    , filebutton               : filebutton
    , imagebutton              : imagebutton
    , multiplecheckboxes       : multiplecheckboxes
    , multiplecheckboxesinline : multiplecheckboxesinline
    , tablelist                : tablelist
    , flowtablelist            : flowtablelist
    , multipleradios           : multipleradios
    , multipleradiosinline     : multipleradiosinline
    , passwordinput            : passwordinput
    , selectbasic              : selectbasic
    , selectmultiple           : selectmultiple
    , textarea                 : textarea
    , textinput                : textinput
    , searchinput              : searchinput
    , inputhidden              : inputhidden
    , dateinput                : dateinput
    , datetimeinput            : datetimeinput
    , sectiontitle             : sectiontitle
    , printbutton              : printbutton
  }
});
