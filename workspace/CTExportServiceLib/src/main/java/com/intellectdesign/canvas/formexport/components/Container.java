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
 * The Container class renders the container panel that produce HTML pages by writing HTML component classes
 * 
 * @version 1.0
 */
public class Container implements Renderable
{
	FormExportModel formModel;
	String itemId;
	Map item;

	private Container() {

	}
	/**
	 * Constructor of the class which is associated with the params
	 * 
	 * @param formModel
	 * @param itemId
	 * @param item
	 */
	public Container(FormExportModel formModel, String itemId, Map item)
	{

		this.formModel = formModel;
		this.itemId = itemId;
		this.item = item;
	}

	/**
	 * This method creates the container panel and renders as html component
	 * 
	 * @param html
	 * @return void
	 * @throws IOException
	 */
	public void renderOn(HtmlCanvas html) throws IOException
	{

		FormExportItemCreator itemCreator = new FormExportItemCreator(formModel, itemId);

		List itemArray = itemCreator.getChildItems();

		if(itemArray == null){
			return ;
		}
		
		if(!"N".equals(item.get("VISIBLE_IND"))){
			renderKey(html);
			renderValue(html);
	}
 }
	private void renderKey(HtmlCanvas html) throws IOException {
		if("".equals((String) item.get("FIELD_LABEL"))){
			html = html._tr();
			return;
		}
		
		 UserValue userValue = this.formModel.getUserInfo();
			String direction = userValue.getDirection();
			String align="left";
			if (direction != null && (direction.equalsIgnoreCase("RTL"))){
				 align="right";
			}
		html
		._tr()
		.tr()
		.td(new HtmlAttributes().width("100%").height(0).colspan("4"))
		._td()
		._tr()
		.tr()
	    .td(new HtmlAttributes().width("100%").align(align).colspan("4").class_("tdheader"))
	    	.div(new HtmlAttributes().class_("mainheaderTD_PDF REV_UNICODE").style("display:inline-block;")).content((String) item.get("FIELD_LABEL")) 
	    ._td()
	    ._tr();
	}
	private void renderValue(HtmlCanvas html) throws IOException {
		FormExportItemCreator itemCreator = new FormExportItemCreator(formModel,itemId);
		List itemArray = itemCreator.getChildItems();
		String hideLabel=(String)item.get("HIDE_LABEL");
		UserValue userValue = this.formModel.getUserInfo();
		String direction = userValue.getDirection();
		if (direction != null && (direction.equalsIgnoreCase("RTL")) && this.formModel.getExportFormat().equalsIgnoreCase("FORMPDF")){ 
			 for(int itemIndex=0 ;itemIndex<itemArray.size();){
					html = 	html.tr();
						  if(itemArray.size() ==1){
							  html = html.render(itemCreator.getItemRender((String) itemArray.get(itemIndex)+"@@@"+hideLabel));
							  itemIndex++;
						  }else{
						  itemIndex++;
						  if(itemIndex<itemArray.size()){
							  html = html.render(itemCreator.getItemRender((String) itemArray.get(itemIndex)+"@@@"+hideLabel));
							  itemIndex--;
						  }else if(itemIndex == itemArray.size()) {
							  html = html.render(new EmptyField(null));
						  }
						  if(itemIndex<itemArray.size()){
							  html = html.render(itemCreator.getItemRender((String) itemArray.get(itemIndex)+"@@@"+hideLabel));
							  itemIndex+=2;
							  }
						  }
					html = html._tr();
				}
		}else{
	    for(int itemIndex=0 ;itemIndex<itemArray.size();){
			html = 	html.tr();
			  for(int tempColCount =0 ;tempColCount<2;tempColCount++)
			  {		
				  if(itemIndex<itemArray.size()){
					  html = html.render(itemCreator.getItemRender((String) itemArray.get(itemIndex)+"@@@"+hideLabel));
					  itemIndex++;
				  }
			  }
			
			html = html._tr();
				}
		}
		html = html.tr();

	}

}
