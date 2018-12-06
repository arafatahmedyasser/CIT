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

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.rendersnake.HtmlAttributes;
import org.rendersnake.HtmlCanvas;
import org.rendersnake.Renderable;
import org.w3c.dom.NodeList;
import org.w3c.tidy.Tidy;

import com.intellectdesign.canvas.common.UserValue;
import com.intellectdesign.canvas.formexport.framework.FormExportModel;

/**
 * The class renders the Widget Panel control
 * 
 * @version 1.0
 */
public class WidgetPanel implements Renderable
{
	Map item;
	FormExportModel formModel; 

	private WidgetPanel(){
		
	}
	/**
	 * The constructor of the class which associates the following param
	 * 
	 * @param item
	 */
	public WidgetPanel(FormExportModel formModel,Map item){ 
		
		 this.item = item;
		 this.formModel=formModel; 
	}
	
	public void renderOn(HtmlCanvas html) throws IOException {
		
		String url = (String)((Map)(item.get("WIDGET_DATA"))).get("exportFileName");

		if(url==null){
			return;
		}
		File widgetFile = new File(url);
		NodeList nl = null;
		
		// Create instance
		Tidy tidy = new Tidy();
		tidy.setInputEncoding("raw");
		tidy.setOutputEncoding("raw");
		
		// Use XHTML output
		tidy.setXHTML( true );

		
		// Make document readable by indenting the elements
		tidy.setSmartIndent( true );

		tidy.setNumEntities(true);
		ByteArrayOutputStream byteAryOutputStream=new ByteArrayOutputStream();
		tidy.parse(new ByteArrayInputStream( FileUtils.readFileToByteArray(widgetFile)), byteAryOutputStream);
		String widgetsFileInfo = byteAryOutputStream.toString();
		
		UserValue usrValue = this.formModel.getUserInfo();
		
		 UserValue userValue = this.formModel.getUserInfo();
			String direction = userValue.getDirection();
			String align="left";
			if (direction != null && (direction.equalsIgnoreCase("RTL"))){
				 align="right";
			}
	
	 html
	
		.tr() 
		 .td(new HtmlAttributes().width("100%").align(align).colspan("4"))
	    	.div(new HtmlAttributes().class_("headerTD_PDF REV_UNICODE").style("display:inline-block;")).content("")
	    ._td()
		._tr() 
		.tr()
			.td(new HtmlAttributes().width("100%").colspan("4").dir("ltr"))
	    	.div(new HtmlAttributes().class_("widgettable"))
	    	.content(widgetsFileInfo,false)	    	
	._td()	
	 ._tr(); 
		
		widgetFile.delete();

	}

}
