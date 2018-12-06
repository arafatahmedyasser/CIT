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

import org.rendersnake.HtmlAttributes;
import org.rendersnake.HtmlCanvas;
import org.rendersnake.Renderable;

import com.intellectdesign.canvas.common.UserValue;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ExportConfigurationDescriptor;
import com.intellectdesign.canvas.constants.reports.ReportingConstants;
import com.intellectdesign.canvas.formexport.framework.FormExportModel;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.message.ReportsMessageManager;

/**
 * This class creates and renders the form LOGO on Forms Header section
 * 
 * @version 1.0
 */
public class FormHeader implements Renderable
{
	FormExportModel formModel;
	String itemId;

	private FormHeader(){
		
	}
	/**
	 * Constructor of the class which is associated with the params
	 * 
	 * @param formModel
	 * @param itemId
	 */
	public FormHeader(FormExportModel formModel, String itemId)
	{
		this.formModel = formModel;
		this.itemId = itemId;
	}
	
	public void renderOn(HtmlCanvas html) throws IOException {
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
		String imgURL="";
		try{
			imgURL = exportcfg.getIntellectLogo();
		}
		catch(NullPointerException npExcp){
			logger.cterror("CTEXP00198", npExcp.getCause());
		}catch(Exception exp){
			logger.cterror("CTEXP00198", exp.getCause());
		}
		
		// CHG001_61609 Starts
		String imgURLPrint="";
		
		if("FORMHTML".equals(this.formModel.getExportFormat())){
			
			if(imgURL!=null && !imgURL.equals(""))
			{
				int pos=imgURL.lastIndexOf("/");
				String fileName=imgURL.substring(pos+1,imgURL.length());
				//imgURLPrint = "iportal/images/"+fileName;
				imgURLPrint = imgURL;
			}
			
		}else{
			if(imgURL==null || imgURL.isEmpty()){
				imgURLPrint="";
			}else{				
				imgURLPrint ="file:///"+imgURL;
			}
		}
		
		String direction = uv.getDirection();
		String align="left";
		if (direction != null && (direction.equalsIgnoreCase("RTL"))){
			 align="right";
		}
		
		 	
		html
		.table(new HtmlAttributes().width("100%").cellspacing("0").cellpadding("0"))
	  	.tr()
	  		.td(new HtmlAttributes().width("100%").align("center"))
	  			.img(new HtmlAttributes().src(imgURLPrint)) 
	  		._td()
	  	._tr()
	  	.tr()
	  		.td(new HtmlAttributes().width("100%").align("center"))
	  				.div(new HtmlAttributes().style("font-family: "+fontName+"; font-size: 14.0pt; font-weight: bold;display:inline-block;")).content(this.formModel.getExportHeader(uv.getLangId())) 
	  		._td()
	  	._tr()
	  		.tr();
		if("FORMHTML".equals(this.formModel.getExportFormat())){	
	  		
			html.td(new HtmlAttributes().width("100%").align("center"))
	  			.span(new HtmlAttributes().style("font-family: "+fontName+"; font-size: 8.0pt;")).content(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,ReportingConstants.GEN_ON,uv.getLangId()))
	  			.span(new HtmlAttributes().style("font-family: "+fontName+"; font-size: 8.0pt;")).content(" ")
	  			.span(new HtmlAttributes().style("font-family: "+fontName+"; font-size: 8.0pt;")).content(ReportsMessageManager.getDate(uv.getLangId()).toUpperCase())
	  			.span(new HtmlAttributes().style("font-family: "+fontName+"; font-size: 8.0pt;")).content(" ")
	  			.span(new HtmlAttributes().style("font-family: "+fontName+"; font-size: 8.0pt;")).content(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,ReportingConstants.EZ_REP_BY,uv.getLangId()))
	  			.span(new HtmlAttributes().style("font-family: "+fontName+"; font-size: 8.0pt;")).content(" ")
	  			.span(new HtmlAttributes().style("font-family: "+fontName+"; font-size: 8.0pt;")).content((String)uv.getFIRST_NAME())
	  		._td();
	  		
		}else{
			if(langID.equalsIgnoreCase("ar_SA")) {
			html.td(new HtmlAttributes().width("100%").align("center"))
			.div(new HtmlAttributes().style("font-family: "+fontName+"; font-size: 8.0pt;display:inline-block;")).content((String)uv.getFIRST_NAME())
  			.div(new HtmlAttributes().style("font-family: "+fontName+"; font-size: 8.0pt;display:inline-block;")).content(" ")
  			.div(new HtmlAttributes().style("font-family: "+fontName+"; font-size: 8.0pt;display:inline-block;")).content(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,ReportingConstants.EZ_REP_BY,uv.getLangId()))
  			.div(new HtmlAttributes().style("font-family: "+fontName+"; font-size: 8.0pt;display:inline-block;")).content(" ")
  			.div(new HtmlAttributes().style("font-family: "+fontName+"; font-size: 8.0pt;display:inline-block;")).content(ReportsMessageManager.getDate(uv.getLangId()).toUpperCase())
  			.div(new HtmlAttributes().style("font-family: "+fontName+"; font-size: 8.0pt;display:inline-block;")).content(" ")
  			.div(new HtmlAttributes().style("font-family: "+fontName+"; font-size: 8.0pt;display:inline-block;")).content(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,ReportingConstants.GEN_ON,uv.getLangId()))
  		._td();
			}else{
				html.td(new HtmlAttributes().width("100%").align("center"))
				.div(new HtmlAttributes().style("font-family: "+fontName+"; font-size: 8.0pt;display:inline-block;")).content(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,ReportingConstants.GEN_ON,uv.getLangId()))
	  			.div(new HtmlAttributes().style("font-family: "+fontName+"; font-size: 8.0pt;display:inline-block;")).content(" ")
	  			.div(new HtmlAttributes().style("font-family: "+fontName+"; font-size: 8.0pt;display:inline-block;")).content(ReportsMessageManager.getDate(uv.getLangId()).toUpperCase())
	  			.div(new HtmlAttributes().style("font-family: "+fontName+"; font-size: 8.0pt;display:inline-block;")).content(" ")
	  			.div(new HtmlAttributes().style("font-family: "+fontName+"; font-size: 8.0pt;display:inline-block;")).content(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,ReportingConstants.EZ_REP_BY,uv.getLangId()))
	  			.div(new HtmlAttributes().style("font-family: "+fontName+"; font-size: 8.0pt;display:inline-block;")).content(" ")
	  			.div(new HtmlAttributes().style("font-family: "+fontName+"; font-size: 8.0pt;display:inline-block;")).content((String)uv.getFIRST_NAME())
	  		._td();
			}
		}
	  		
	  	html._tr()
	  	._table();
		
	}

	private static final Logger logger = Logger.getLogger(FormHeader.class);
}
