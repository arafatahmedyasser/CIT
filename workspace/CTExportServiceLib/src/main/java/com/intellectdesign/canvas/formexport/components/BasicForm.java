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

import static org.rendersnake.HtmlAttributesFactory.http_equiv;

import java.io.IOException;

import org.rendersnake.HtmlAttributes;
import org.rendersnake.HtmlCanvas;
import org.rendersnake.Renderable;

import com.intellectdesign.canvas.common.UserValue;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ExportConfigurationDescriptor;
import com.intellectdesign.canvas.formexport.framework.FormExportModel;
import com.intellectdesign.canvas.logger.Logger;

/**
 * Basic Form is a form panel which can hold items added on it This Basic Form panel can be attached with any main form
 * as a sub-form
 * 
 * @version 1.0
 */
public class BasicForm implements Renderable
{
	FormExportModel formModel;
	String itemId;

	private BasicForm(){
		
	}
	/**
	 * The Constructor of the class which associates the following params
	 * 
	 * @param formModel
	 * @param itemId
	 */
	public BasicForm(FormExportModel formModel, String itemId)
	{
		this.formModel = formModel;
		this.itemId = itemId;
	}

	/**
	 * This method creates and renders the Basic Form
	 * 
	 * @param html
	 * @throws IOException
	 */
	public void renderOn(HtmlCanvas html) throws IOException
	{
		String layoutSize = "750";
		ConfigurationManager confgr =  ConfigurationManager.getInstance();
		ExportConfigurationDescriptor exportcfg = confgr.getExportDescriptor();

		UserValue uv = this.formModel.getUserInfo();
		String langID = uv.getLangId();
		if(langID == null || langID.isEmpty()){
			langID="en_US";
		}		
		String fontName="Helvetica";
		String themecolor = "#008055";
		try{			
			if(langID.equalsIgnoreCase("ar_SA")) {
				fontName = exportcfg.getRtlfont();
			}else{
				fontName = exportcfg.getLtrfont();
			}
			themecolor = exportcfg.getThemeColor();
		}
		catch(NullPointerException npExcp){
			logger.cterror("CTEXP00197", npExcp.getCause());
		}catch(Exception exp){
			logger.cterror("CTEXP00197", exp.getCause());
		}		
		String exportFormat = this.formModel.getExportFormat();
		
		html
		  .html();
			html.head()
			.meta(http_equiv("Content-Type").content("text/html;charset=utf-8"))
			.title()
			.content(this.formModel.getExportHeader(langID)) 
			.style()
			.write(".widgettable table{width:100%!important; border-spacing:0; border-collapse:collapse;}.widgettable table td,.widgettable table th{border-color:#808080!important;padding-left:7px;}")
			.write(".mainheaderTD_PDF{font-family: "+fontName+";font-size: 10.0pt; font-weight:bold; color:#fff; line-height: 25px;background-color:#fff;padding-left:7px}") 
			.write(".headerTD_PDF{font-family: "+fontName+";font-size: 10.0pt;font-weight:bold;line-height: 25px; color:#000; padding-left:7px;}")
			.write(".NormalTD_PDF{font-family: "+fontName+";font-size: 10.0pt;line-height: 25px; color:#000; padding-left:20px;}")
			.write(".tdheader .mainheaderTD_PDF{color:#fff;background-color:"+themecolor+"; font-weight:bold; padding-left:7px;}") 
			.write(".tdheader{background-color:"+themecolor+"	;}")  //CTCBXQ416F02 themecolor variable
			.write(".widgetHeader_PDF{font-family: "+fontName+";font-size: 10.0pt;font-weight: bold; line-height: 25px;text-align:center;}")
			.write(".widgettable th{background-color:"+themecolor+"; font-weight:bold; border:1px solid #000;}.widgettable table tr th div{color:#fff !important;padding:3px 0px 3px 0px;}")
			._style()  //CTCBXQ416F02 themecolor variable
			._head();			
		// RTL Enablement - Start
			String direction = uv.getDirection();
			if (direction != null && (direction.equalsIgnoreCase("RTL"))){
				html.body(new HtmlAttributes().dir("rtl"))
				.div(new HtmlAttributes().style("width:"+layoutSize+"px !important;"))
				.render(new FormHeader(formModel,itemId))
				.br()
				.form() 
					.render(new TableLayout(formModel,itemId))
				._form()
				._div();
			}else{
				html.body()
				.div(new HtmlAttributes().style("width:"+layoutSize+"px !important;"))
				.render(new FormHeader(formModel,itemId))
				.br()
				.form() 
					.render(new TableLayout(formModel,itemId))
				._form()
				._div();
			}
		// RTL Enablement - End	
		
		if(this.formModel.isAttachScreenPrinting()){
			html.script().write("window.print()")._script();
		}
		
		html._body();	
		html._html();
	}
	private static final Logger logger = Logger.getLogger(BasicForm.class);
}
