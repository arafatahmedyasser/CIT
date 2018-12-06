/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 * 
 */

package com.intellectdesign.canvas.formexport.components;

import java.io.IOException;
import java.util.Map;

import org.rendersnake.HtmlAttributes;
import org.rendersnake.HtmlCanvas;
import org.rendersnake.Renderable;

import com.intellectdesign.canvas.formexport.framework.FormExportModel;

/**
 * This class constructs and renders the Label
 * 
 * @version 1.0
 */
public class LabelField implements Renderable
{
	Map item;
	FormExportModel formModel; 

	private LabelField(){
		
	}
	/**
	 * Constructor of the class which is associated with the params
	 * 
	 * @param item
	 */
	public LabelField(FormExportModel formModel,Map item){ 
		
		 this.item = item;
		 this.formModel=formModel; 
			
	}

	/**
	 * This method creates and renders a Label and renders as HTML component
	 * 
	 * @param html
	 * @return void
	 * @throws IOException
	 */
	public void renderOn(HtmlCanvas html) throws IOException {

		html
		._tr()
		.tr()
	    .td(new HtmlAttributes().width("100%").bgcolor("F1F1F1").colspan("4"))
	    	.div(new HtmlAttributes().class_("headerTD_PDF REV_UNICODE")).content((String) item.get("screenViewData"))
	    ._td()
		._tr()
		.tr();


	}

}
