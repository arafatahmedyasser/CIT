/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns('canvas.applnlayout.app');
/**
 * @namespace "canvas.applnlayout.app"
 * @description This component is currently responsible Jquery Framework to rendered app layout in RTL.
 */
canvas.applnlayout.app.rtl = Class({
	/**
	 * @class "canvas.applnlayout.app.rtl"
	 * @description Renders app in RTL
	 */
	constructor : function () {
		if(!($('.ct-al-app__hscroll').hasClass("mCS_no_scrollbar")))
			$('.ct-al-app__hscroll').mCustomScrollbar('scrollTo',['right']);
	}
	
});