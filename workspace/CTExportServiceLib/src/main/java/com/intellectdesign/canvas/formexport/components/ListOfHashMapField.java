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
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.rendersnake.HtmlAttributes;
import org.rendersnake.HtmlCanvas;
import org.rendersnake.Renderable;

import com.intellectdesign.canvas.common.UserValue;
import com.intellectdesign.canvas.formexport.framework.FormExportModel;

/**
 * This class constructs and renders the Combo Box with different items.
 * 
 * @version 1.0
 */
public class ListOfHashMapField implements Renderable
{
	Map item;
	FormExportModel formModel; 

	private ListOfHashMapField(){
		
	}
	/**
	 * Constructor of the class which is associated with the param
	 * 
	 * @param item
	 */
	public ListOfHashMapField(FormExportModel formModel,Map item){ 
		
		 this.item = item;
		 this.formModel=formModel; 
	}

	/**
	 * This method creates and renders a Combo Box and renders as HTML component
	 * 
	 * @param html
	 * @return void
	 * @throws IOException
	 */
	public void renderOn(HtmlCanvas html) throws IOException {
		
		String width = (String) item.get("LAYOUTSIZE");
		
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
			html = html
			.td(new HtmlAttributes().width("20%"))
				.div(new HtmlAttributes().class_("headerTD_PDF REV_UNICODE")).content((String) item.get("FIELD_LABEL"))
			._td();	
		}
	}
		
	private void renderValue(HtmlCanvas html) throws IOException {
	    html.td(new HtmlAttributes().width("30%"));
	    
       	if(item.get("screenViewData") instanceof List){
			List data = (List) item.get("screenViewData");
			if(data.size()>0){
			
			for(int j=0 ;j<data.size();j++){
				
				Map map = (Map) data.get(j);
				String subData ="";
				Iterator entries = map.entrySet().iterator();
				subData= subData.concat(" [ ");
				while (entries.hasNext()) {
				    Map.Entry entry = (Map.Entry) entries.next();
				    subData =subData.concat(" { " +entry.getKey() + " : " + entry.getValue()+" } ");
				}
				subData= subData.concat(" ] ");
				
				html =html
					.div(new HtmlAttributes().class_("NormalTD_PDF REV_UNICODE")).content(subData);
        	 }
			
			}else{
				
				html =html
				.div(new HtmlAttributes().class_("NormalTD_PDF REV_UNICODE")).content("--");
			}
    	}else{
    		html =html
    		.div(new HtmlAttributes().class_("NormalTD_PDF REV_UNICODE")).content("--");
    	}
       	
       	html._td();
      		
	}

}
