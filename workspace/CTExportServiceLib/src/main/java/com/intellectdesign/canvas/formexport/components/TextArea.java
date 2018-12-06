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
 * The TextArea class renders the Text Area that produce HTML pages
 * 
 * @version 1.0
 * 
 */
public class TextArea implements Renderable
{
	FormExportModel formModel; 
	Map item;

	private TextArea(){
		
	}
	/**
	 * Constructor of the class which is associated with the params
	 * 
	 * @param item
	 */
	public TextArea(Map item)
	{
		this.item = item;
	}

	public TextArea(FormExportModel formModel,Map itemMetadata){ 		
		 this.item = itemMetadata;
		 this.formModel=formModel;
	}
	
	public void renderOn(HtmlCanvas html) throws IOException {
		
		
		UserValue userValue = this.formModel.getUserInfo();
		String direction = userValue.getDirection();
		
		if (direction != null && (direction.equalsIgnoreCase("RTL")) && this.formModel.getExportFormat().equalsIgnoreCase("FORMPDF")) {			
			renderValue(html);
			renderKey(html);			
		} else {
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
		
		String contentText = (String) item.get("screenViewData");
		contentText = contentText.replaceAll("\\r\\n", "<br/>");
		contentText = contentText.replaceAll("\\\\n", "<br/>");
		html
		.td(new HtmlAttributes().width("30%"))
	    	.div(new HtmlAttributes().class_("NormalTD_PDF REV_UNICODE")).content(contentText,false)
	    ._td();

	}
}
