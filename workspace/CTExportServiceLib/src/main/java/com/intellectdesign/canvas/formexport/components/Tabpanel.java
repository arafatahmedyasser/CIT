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
import java.util.List;
import java.util.Map;

import org.rendersnake.HtmlAttributes;
import org.rendersnake.HtmlCanvas;
import org.rendersnake.Renderable;

import com.intellectdesign.canvas.common.UserValue;
import com.intellectdesign.canvas.formexport.framework.FormExportItemCreator;
import com.intellectdesign.canvas.formexport.framework.FormExportModel;

/**
 * The TabPanel class renders the Tabbed control
 * 
 * @version 1.0
 * 
 */
public class Tabpanel implements Renderable
{
	FormExportModel formModel;
	String itemId;
	Map item;

	private Tabpanel(){
		
	}
	/**
	 * Constructor of the class which is associated with the params
	 * 
	 * @param formModel
	 * @param itemId
	 * @param item
	 */
	public Tabpanel(FormExportModel formModel, String itemId, Map item)
	{

		this.formModel = formModel;
		this.itemId = itemId;
		this.item = item;

	}

	/**
	 * This method creates and renders a Tabbed Panel and renders as HTML component
	 * 
	 * @param html
	 * @return void
	 * @throws IOException
	 */
	public void renderOn(HtmlCanvas html) throws IOException
	{

		FormExportItemCreator itemCreator = new FormExportItemCreator(formModel, itemId);

		List itemArray = itemCreator.getChildItems();

		if (itemArray == null)
		{
			return;
		}

		html
		._tr();
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
		html
		.tr()
		.td(new HtmlAttributes().width("100%").height(2).colspan("4"))
		._td()
		._tr()
		.tr()
	    .td(new HtmlAttributes().width("100%").bgcolor("F1F1F1").colspan("4"))
	    	.div(new HtmlAttributes().class_("headerTD_PDF REV_UNICODE")).content((String) item.get("FIELD_LABEL"))
	    ._td()
	    ._tr();
		
	}
	private void renderValue(HtmlCanvas html) throws IOException {
		FormExportItemCreator itemCreator = new FormExportItemCreator(formModel,itemId);
		List itemArray = itemCreator.getChildItems();
	    for(int itemIndex=0 ;itemIndex<itemArray.size();){
			html = 	html.tr();
			  for(int tempColCount =0 ;tempColCount<2;tempColCount++)
			  {		
				  if(itemIndex<itemArray.size()){
					  html = html.render(itemCreator.getItemRender((String) itemArray.get(itemIndex)));
					  itemIndex++;
				  }
			  }
			
			html = html._tr();
		}
	    //html = 	html.tr();			
	}

}
