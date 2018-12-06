/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
canvas.lib.metadataProgress = Class(cbx.core.Component, {
	
	initialize : function ()
	{
		var rb=CRB.getFWBundle();
		var dialogPanel = '<div class="popup-container">';
		var loadingText=rb&& rb.LOADING_METADATA?rb.LOADING_METADATA:"Updating App Definitions... Please Wait..";
		dialogPanel += '<div class="loading-text">'+loadingText+'</div>';
		dialogPanel += '<div class="progress-container">';
		dialogPanel += '<div class="progress-bar" ></div>';
		dialogPanel += '</div>';

		dialogPanel += '<div class="overlay"></div>';
		dialogPanel += '</div>';
		this.panel=dialogPanel;
	},
	showProgressAnimation:function ()
	{
		$('body').append(this.panel);
		$(".popup-container").css('display', 'block');
		var width = 0;
		setInterval(function ()
		{
			width = width >= 100 ? 0 : width + 5;
			$('.progress-bar').css('width', width + '%')
		}, 200);
		$(".popup-container").show();
		$(".overlay").css("display", "block");

	},
	showProgressBar : function ()
	{
		

		this.showProgressAnimation();
		
	},
	hideProgressBar : function ()
	{
		$(".popup-container").css('display', 'none');
		$(".popup-container").hide();
		$(".overlay").css("display", "none");
	}
});

CLCR.registerCmp({
	"COMP_TYPE" : "METADATA_DIALOG"
}, canvas.lib.metadataProgress);
