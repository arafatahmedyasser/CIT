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

package com.intellectdesign.canvas.formexport.framework;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.rendersnake.HtmlCanvas;
import org.rendersnake.error.RenderException;
import org.rendersnake.tools.PrettyWriter;

import com.intellectdesign.canvas.common.UserValue;
import com.intellectdesign.canvas.formexport.components.BasicForm;
import com.intellectdesign.canvas.formexport.htmlrenderer.StringEscapeUtilsCustom;
import com.intellectdesign.canvas.logger.Logger;

/**
 * The Manager class incharge of exporting form content
 * 
 * 
 * @version 1.0
 */
public class FormExportManager
{

	/** The Class which sets the custom commons lang class for renderSnake **/
	static
	{
		StringEscapeUtilsCustom.init();
	}

	/** The FormExport Model is initialized **/
	FormExportModel formModel = new FormExportModel();

	/** The HTMLCanvas of renderSnake is initialized which is incharge of generating the HTML **/
	HtmlCanvas htmlCanvas = new HtmlCanvas(new PrettyWriter());

	/**
	 * This method incharge of intializing all the information required for drawing the html for the form
	 * printing/exporting.
	 * 
	 * @param config
	 * @exception RenderException
	 * @exception IOException
	 */
	public void initialize(Map config)
	{

		Map formData = (Map) config.get("FORMSCREENVIEW");
		Map formDefn = (Map) config.get("FORMDBVIEW");
		List widgets = (List) config.get("WIDGETIDS");
		Map widgetMapUrl = (Map) config.get("FORM_WIDGET_PATH");
		String attachScriptPrinting=(String) config.get("ATTACHSCRIPTPRINTING");
		String  exportFormat = (String) config.get("EXPORT_FORMAT"); 
		
		
		UserValue userValue = (UserValue) config.get("USERVALUE");

		/**
		 * Step 1 : Set the form screen data in the model
		 */

		this.formModel.setScreenFormData(formData);
		
		this.formModel.setExportFormat(exportFormat); 
 		
		this.formModel.setWidgetList(widgets);
		if (widgetMapUrl != null)
		{
			this.formModel.setWidgetMapUrl(widgetMapUrl);
		}
		
		if("Y".equals(attachScriptPrinting)){		
			this.formModel.setAttachScreenPrinting(true);
		}
		else{
			this.formModel.setAttachScreenPrinting(false);
		}
		
		
		String formId = (String) formData.get("parentFormId");

		/**
		 * Step 2 : Get and Set the form definition in the model
		 */

		try
		{

			this.formModel.setFormMetaData(formDefn);

			this.formModel.setUserInfo(userValue);

			/**
			 * Step 3 : Call the HtmlCanvas render method with the basic form
			 */
			htmlCanvas.render(new BasicForm(this.formModel, formId));

		} catch (RenderException fde)
		{
			LOGGER.cterror("CTEXP00032", fde, formId);
		} catch (IOException ioe)
		{
			LOGGER.cterror("CTEXP00032", ioe, formId);
		}
	}

	/**
	 * The Method used to get the generated html for the corresponding form export.
	 * 
	 * @return String html
	 */
	public String getHtmlForTheForm()
	{
		return htmlCanvas.toHtml();
	}

	/**
	 * The Method used to get the ExportUniqueIdList.
	 * 
	 * @return the exportUniqueIdList
	 */
	public List getExportUniqueIdList()
	{
		return this.formModel.getExportUniqueIdList();
	}

	/**
	 * The Method is used to get the form header.
	 * 
	 * @return String
	 */
	public String getFormHeader()
	{
		UserValue uv = this.formModel.getUserInfo();
		String langID = uv.getLangId();
		if (langID == null || langID.isEmpty())
		{
			langID = "en_US";
		}
		return this.formModel.getExportHeader(langID);
	}

	/**
	 * An instance of Logger
	 */
	private static final Logger LOGGER = Logger.getLogger(FormExportManager.class);
}
