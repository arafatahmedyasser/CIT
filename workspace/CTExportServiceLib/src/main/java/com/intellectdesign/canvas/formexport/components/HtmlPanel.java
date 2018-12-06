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

import com.intellectdesign.canvas.common.UserValue;
import com.intellectdesign.canvas.formexport.framework.FormExportModel;

/**
 * The class renders the HTML Editor Panel
 * 
 * @version 1.0
 */
public class HtmlPanel implements Renderable
{
	Map item;
	FormExportModel formModel; 
	private HtmlPanel(){
		
	}

	/**
	 * Constructor of the class which is associated with the param
	 * 
	 * @param item
	 */
	public HtmlPanel(FormExportModel formModel,Map item){ 
		
		 this.item = item;
		 this.formModel=formModel; 
			
	}
	
	
	public void renderOn(HtmlCanvas html) throws IOException {
		UserValue userValue = this.formModel.getUserInfo();
		String direction = userValue.getDirection();
		if (direction != null && (direction.equalsIgnoreCase("RTL")) && this.formModel.getExportFormat().equalsIgnoreCase("FORMPDF")){
			renderValue(html);
			renderKey(html);
		}else{
			renderKey(html);
			renderValue(html);			
		}
	}
	private void renderKey(HtmlCanvas html) throws IOException {
		if(!"Y".equals(item.get("HIDE_LABEL")) && !"Y".equals(item.get("CONTAINER_HIDELABEL")))
		{
			html
			.td(new HtmlAttributes().width("20%"))
				.div(new HtmlAttributes().class_("headerTD_PDF REV_UNICODE")).content((String) item.get("FIELD_LABEL"))
			._td();
		}
		
	}
	private void renderValue(HtmlCanvas html) throws IOException {
	    html.td(new HtmlAttributes().width("30%"))
	    	.div(new HtmlAttributes().class_("NormalTD_PDF REV_UNICODE")).content((String) item.get("screenViewData"),false)
	    ._td();
	  
	}

}
