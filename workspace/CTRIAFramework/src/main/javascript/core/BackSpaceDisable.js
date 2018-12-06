////CT_BSD-Start - To disabling the Backspace through out the application except input fields focus

// The function getInternetExplorerVersion() provides version number, it will provide -1 in case Browser not IE. 
function getInternetExplorerVersion() {
	var rv = -1; // Return value assumes failure. 
	if (navigator.appName == 'Microsoft Internet Explorer') { 
		var ua = navigator.userAgent; 
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})"); 
		if (re.exec(ua) != null)     
			rv = parseFloat(RegExp.$1);   
	}  
	return rv;
}

/* The function validateBrowserShortcut returns boolean value to document.onkeydown. 
 * getting the keycode of the keydown.
 * if the pressed on FormFieldFocus means will return true (then backspace will work as usual).
 * if control not in FormFieldFocus will return false for the backspace key (keycode = 8). it will allow normal backspace behaviour.
 */
function validateBrowserShortcut(e) {
    if (Ext.FormFieldFocused) 
    {
    	return true;
    }

	var KeyID;
	if(getInternetExplorerVersion() != -1)
	{
	    KeyID = (window.event) ? event.keyCode : e.keyCode || e.charCode;
	}
	else
	{
		KeyID = e.keyCode;
	}
    if(KeyID==8) 
    {
        return false;
    }
	else
	{
		return true;
	}
} 
/* 
* For disabling backspace if the focus is moved to the other fields, except input field
*/
window.onmousedown = function(event){
if(event.target.tagName != "INPUT"){
Ext.FormFieldFocused = false;
}
} 	 
document.onkeydown = validateBrowserShortcut;
window.ondragstart = function (){return false;} 
//CT_BSD End - To disabling the Backspace through out the application except input fields focus
