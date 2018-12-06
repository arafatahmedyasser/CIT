cbx.ns("ct.impl");

ct.impl.tmplLayer = Class(ct.lib.tmplLayer, {
	constructor: function(input, tmplParams) {
			ct.impl.tmplLayer.$super.call(this, input, tmplParams);
	},
	getBasePath : function(){
		return ""; 
	}
});