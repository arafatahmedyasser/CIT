/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns('canvas.applnlayout.excard');
/**
 * @namespace "canvas.applnlayout.excard"
 * @description This component is currently responsible Jquery Framework to rendered excard layout in RTL.
 */
canvas.applnlayout.excard.rtl = Class({
	/**
	 * @class "canvas.applnlayout.excard.rtl"
	 * @description Renders excard in RTL
	 */
	constructor : function () {
		$('.ct-al-excard__hscroll').mCustomScrollbar('scrollTo',['right']);
	}
	
});