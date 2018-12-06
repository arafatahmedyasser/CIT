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
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ExportConfigurationDescriptor;
import com.intellectdesign.canvas.formexport.framework.FormExportModel;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This class constructs and renders the Combo Box
 * 
 * @version 1.0
 */
public class ListField implements Renderable
{
	Map item;
	FormExportModel formModel; 

	private ListField(){
		
	}
	/**
	 * Constructor of the class which is associated with the param
	 * 
	 * @param item
	 */
	public ListField(FormExportModel formModel,Map item){	 
		
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

		UserValue uv = this.formModel.getUserInfo();
		String direction = uv.getDirection();
		if (direction != null && (direction.equalsIgnoreCase("RTL"))&& this.formModel.getExportFormat().equalsIgnoreCase("FORMPDF")){
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
		ConfigurationManager confgr =  ConfigurationManager.getInstance();
		ExportConfigurationDescriptor exportcfg = confgr.getExportDescriptor();
		UserValue uv = this.formModel.getUserInfo();
		String langID = uv.getLangId();
		if(langID == null || langID.isEmpty()){
			langID="en_US";
		}		
		String fontName="Helvetica";
		try{			
			if(langID.equalsIgnoreCase("ar_SA")) {
				fontName = exportcfg.getRtlfont();
			}else{
				fontName = exportcfg.getLtrfont();
			}			
		}
		catch(NullPointerException npExcp){
			logger.cterror("CTEXP00197", npExcp.getCause());
		}catch(Exception exp){
			logger.cterror("CTEXP00197", exp.getCause());
		}
	    html.td(new HtmlAttributes().width("30%"));
	    
		if(item.get("screenViewData") instanceof List){
			List data = (List) item.get("screenViewData");
			if(data.size()>0){
				
			for(int j=0 ;j<data.size();j++){
				html =html
				.div(new HtmlAttributes().class_("NormalTD_PDF REV_UNICODE")).content((String) data.get(j));
        	 }

			
			}else{
				
				html =html
				.div(new HtmlAttributes().style("font-family: "+fontName+"; font-size: 10.0pt;")).content("--");
			}
    	}else{
    		html =html
    			.div(new HtmlAttributes().style("font-family: "+fontName+"; font-size: 10.0pt;")).content("--");
    	}
	     
		html._td();
		

	}
	
	private static final Logger logger = Logger.getLogger(ListField.class);
}
