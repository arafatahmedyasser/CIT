/*************************************************************************
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 **************************************************************************/

package com.intellectdesign.canvas.fdf;

import java.io.File;
import java.io.OutputStream;
import java.io.PrintStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import oracle.net.aso.e;

import org.allcolor.yahp.converter.CYaHPConverter;
import org.allcolor.yahp.converter.IHtmlToPdfTransformer;
import org.allcolor.yahp.converter.IHtmlToPdfTransformer.PageSize;

import com.intellectdesign.canvas.action.PortletAction;
import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ExportConfigurationDescriptor;
import com.intellectdesign.canvas.constants.export.ExportFwsConstants;
import com.intellectdesign.canvas.datahandler.RequestParamsHandler;
import com.intellectdesign.canvas.exceptions.action.OrbiActionException;
import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.exportdata.IExportDataProvider;
import com.intellectdesign.canvas.exportdata.IExportDataValueObject;
import com.intellectdesign.canvas.exportdata.SimpleExportDataValueObject;
import com.intellectdesign.canvas.formdefinition.FormDefinitionConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.login.sessions.SessionManager;
import com.intellectdesign.canvas.vdf.ViewDefinitionAction;
import com.intellectdesign.canvas.web.config.ActionMap;
import com.intellectdesign.canvas.web.config.ActionMapRegistry;

/**
 * This class is incharge of form related export
 * 
 * @version 1.0
 */
public class FormViewAction extends PortletAction implements IExportDataProvider
{

	private static final Logger logger = Logger.getLogger(FormViewAction.class);
	private static final String FORM_PDF_FILE_PATH = "FORM_PDF_FILE_PATH";
	private static final String FORM_HTML_FILE_PATH = "FORM_HTML_FILE_PATH";
	private static final String ATTACHSCRIPTPRINTING = "ATTACHSCRIPTPRINTING";

	/**
	 * To get the export data
	 * 
	 * @param request
	 * @param actionMap
	 * @return IExportDataValueObject
	 * @exception e
	 */

	public IExportDataValueObject getExportData(HttpServletRequest request, ActionMap actionMap)
	{

		SimpleExportDataValueObject simpleExportData = new SimpleExportDataValueObject();

		SessionManager lSessionManager = SessionManager.getInstance();
		SessionInfo sessionInfo = lSessionManager.getUserSessionInfo(request);
		Map requestParams = new RequestParamsHandler().getParameterSet(request);

		String sExportFormat = (String) requestParams.get("EXPORT_FORMAT");

		String fileName = "FORMView_" + sessionInfo.userNo + new Date().getTime();

		ExtReplyObject reply = null;
		OutputStream outpdf = null;
		PrintStream psout = null;
		String filePath = null;
		String newFilePath = null;
		String attachScriptPrinting = null; 

		String fullPath = null;
		String newFullPath = null;
		HashMap exportDataMap = new HashMap();
		HashMap map = null;
		String exportHtml = null;

		try
		{

			if (ExportFwsConstants.FORMPDF.equals(sExportFormat))
			{

				requestParams.put(FormDefinitionConstants.INPUT_ACTION,
						FormDefinitionConstants.ACTION_GET_FORM_EXPORT_HTML);

				requestParams.put("FORM_WIDGET_PATH", sessionInfo.formWidgetPathIdMap);
				requestParams.put("LANG_DIRECTION", sessionInfo.direction);
				reply = (ExtReplyObject) executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams,
						request);

				map = reply.headerMap;

				if((String) map.get("FORM_HEADER_TITLE") != null){
					fileName = (String) map.get("FORM_HEADER_TITLE");
				}

				/*exportHtml = URLEncoder.encode((String) map.get("FORM_HTML"),"UTF-8") for RTL support but currently not working*/				
				exportHtml = (String) map.get("FORM_HTML");

				List exportUniqueIdList = (List) map.get("FORM_WIDGET_CLEANUP");

				if (exportUniqueIdList != null)
				{
					for (int i = 0; i < exportUniqueIdList.size(); i++)
					{

						sessionInfo.formWidgetPathIdMap.remove(exportUniqueIdList.get(i));
					}
				}

				ConfigurationManager configMgr = ConfigurationManager.getInstance();
				ExportConfigurationDescriptor exportDescriptor = configMgr.getExportDescriptor();
				String fontsPath = null;
				try
				{
					fontsPath = exportDescriptor.getFontPath();
				} catch (Exception e)
				{

					fontsPath = exportDescriptor.getXmlFolderPath();
					fontsPath = fontsPath + File.separator + "fonts";
				}
				CYaHPConverter converter = new CYaHPConverter();
				Map properties = new HashMap();
				properties.put(IHtmlToPdfTransformer.PDF_RENDERER_CLASS,
						IHtmlToPdfTransformer.FLYINGSAUCER_PDF_RENDERER);
				properties.put(IHtmlToPdfTransformer.FOP_TTF_FONT_PATH, fontsPath);
				properties.put("DIRECTION", sessionInfo.direction);
				List headerFooterList = new ArrayList();

				filePath = exportDescriptor.getFormPDFFilePath();
				fullPath = filePath + "/" + fileName + ".pdf";

				outpdf = new java.io.FileOutputStream(new File(fullPath));

				String footerText = "";

				try
				{
					footerText = exportDescriptor.getExportFooterText();
				} catch (Exception e)
				{

					footerText = "?" + footerText + "?";
				}

				headerFooterList.add(new IHtmlToPdfTransformer.CHeaderFooter(
						"<table width=\"100%\"><tbody><tr><td align=\"left\">" + footerText
								+ "</td><td align=\"right\">Page <pagenumber>/<"
								+ "pagecount></td></tr></tbody></table>", IHtmlToPdfTransformer.CHeaderFooter.FOOTER));

				converter.convertToPdf(exportHtml, new PageSize(23d, 20.8d, 1d), headerFooterList, "file:///temp/",
						outpdf, properties);

				exportDataMap.put("FORMEXPORT_FILE_NAME", fileName);
				exportDataMap.put("FORMEXPORT_FILE_PATH", fullPath);

			} else if (ExportFwsConstants.FORMHTML.equals(sExportFormat))
			{

				requestParams.put(FormDefinitionConstants.INPUT_ACTION,
						FormDefinitionConstants.ACTION_GET_FORM_EXPORT_HTML);
				requestParams.put("LANG_DIRECTION", sessionInfo.direction);

				// attachScriptPrinting = CTProperties.getProperty(ATTACHSCRIPTPRINTING);

				if (attachScriptPrinting == "")
				{
					requestParams.put("ATTACHSCRIPTPRINTING", "N");
				} else
				{
					requestParams.put("ATTACHSCRIPTPRINTING", attachScriptPrinting);
				}

				requestParams.put("FORM_WIDGET_PATH", sessionInfo.formWidgetPathIdMap);

				reply = (ExtReplyObject) executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams,
						request);

				map = reply.headerMap;

				exportHtml = (String) map.get("FORM_HTML");

				exportDataMap.put("FORMEXPORT_CONTENT", exportHtml);

			} else if (ExportFwsConstants.FORMXLS.equals(sExportFormat))
			{

				requestParams.put(FormDefinitionConstants.INPUT_ACTION, FormDefinitionConstants.ACTION_GET_FORM_EXPORT);
				requestParams.put("LANG_DIRECTION", sessionInfo.direction);

				reply = (ExtReplyObject) executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams,
						request);

				map = reply.headerMap;

				// Step 1: put the whole data as Form metadata.
				Map formMetaData = (Map) map.get("FORM_METADATA");
				exportDataMap.put("FORM_METADATA", formMetaData); // First item - HashMap

				//
				/**
				 * Step 1: Needs to form the ActionMap for the Widget. Step 2 :Needs to call
				 * ViewDefinitionAction.getExportData() method to get the Widget details as SimpleExportDataValueObject
				 * class object (simpleExportData). Step 3: Get the simpleExportData.getExportAdditionalData() and store
				 * TEMP HASHMAP (which have the widget additional data (ie) currency, last updated date and time Step 4:
				 * put the list of TEMP_HASHMAP(widgets) in the exportDataMap as WIDGET_METADATA as key.
				 * //exportDataMap.put("WIDGET_METADATA", List of Widget's TEMP_HASHMAP); // Second item - HashMap
				 */
				//

				// Step 2: Handling the widgets details.
				List widgetsList = (List) formMetaData.get("WIDGETIDS");

				List dataAvailableWidgetsList = new ArrayList();

				for (int i = 0; i < widgetsList.size(); i++)
				{
					Map wigetMap = (Map) widgetsList.get(i);
					boolean isExportParamsAvailable = wigetMap.containsKey("exportParams");

					if (isExportParamsAvailable)
					{
						Map widgetExtraParamMap = new HashMap();
						String widgetId = (String) wigetMap.get("widgetID");
						widgetExtraParamMap.put(widgetId, ((List) wigetMap.get("exportParams")).get(0));
						dataAvailableWidgetsList.add(widgetExtraParamMap);
					} else
					{
						widgetsList.remove(i);
						i--;
					}
				}
				Map widgetsExportDataMap = new HashMap();
				// ActionMap creation for each configured widget in the form.
				for (int i = 0; i < dataAvailableWidgetsList.size(); i++)
				{
					Map wigetParamMap = (Map) dataAvailableWidgetsList.get(i);
					ActionMap widgetActionMap = constructActionMap(wigetParamMap);
					constrctReqObjToWidgetExport(request, sExportFormat);
					Map requestParamsMap = constructRequestParamMap(request, sExportFormat, wigetParamMap);

					SessionInfo sessionInfo1 = lSessionManager.getUserSessionInfo(request);
					ViewDefinitionAction viewDefAction = new ViewDefinitionAction();
					IExportDataValueObject exportDataValueObject = viewDefAction.getExportData(widgetActionMap,
							sessionInfo1, requestParamsMap, request);
					widgetsExportDataMap.put(requestParamsMap.get("WIDGET_ID"), exportDataValueObject);

				}
				exportDataMap.put("WIDGET_METADATA", widgetsExportDataMap); // Second item - List of widgets_HasMap

				// Step 6: Add the form id as the reportId.
				Map formScreenData = (Map) formMetaData.get("FORMSCREENVIEW");
				String reportId = (String) formScreenData.get("parentFormId");
				simpleExportData.setReportId(reportId);

				if (dataAvailableWidgetsList.size() > 0)
				{
					exportDataMap.put("IS_WIDGET_AVAILABLE", new Boolean(true)); // Third item - Stirng, boolean
				} else
				{
					exportDataMap.put("IS_WIDGET_AVAILABLE", new Boolean(false)); // Third item - Stirng, boolean
				}
			}

		} catch (ProcessingErrorException e1)
		{
			logger.cterror("CTRND00293", e1);
			return simpleExportData;
		} catch (Exception e)
		{
			logger.cterror("CTRND00293 ", e);
			return simpleExportData;
		} finally
		{
			try
			{
				if (outpdf != null)
					outpdf.close();
				if (psout != null)
					psout.close();

			} catch (Exception exObj)
			{
				logger.cterror("CTRND00043", exObj);
			}
		}
		simpleExportData.addExportAdditionalData(exportDataMap);

		return simpleExportData;

	}

	/**
	 * To construct the Action Map
	 * 
	 * @param widgetExtraParamMap
	 * @return ActionMap
	 * @throws BaseException
	 */

	private ActionMap constructActionMap(Map widgetExtraParamMap) throws BaseException
	{

		ActionMap locatedMap = null;
		// First try to locate the Action Map from the default registry. Else look into custom registry.
		Map widgetParamMap = new HashMap();
		Iterator widgetIterator = widgetExtraParamMap.entrySet().iterator();
		if (widgetIterator.hasNext())
		{
			Map.Entry entry = (Map.Entry) widgetIterator.next();
			String key = (String) entry.getKey();
			widgetParamMap = (Map) entry.getValue();
		}

		ActionMapRegistry registry = ActionMapRegistry.getDefaultInstance();
		String screenCode = "VIEWDEFN";
		String productCode = ((String) widgetParamMap.get("INPUT_PRODUCT") != null ? (String) widgetParamMap
				.get("INPUT_PRODUCT") : (String) widgetExtraParamMap.get("PRODUCT_NAME"));
		String subProductCode = (String) widgetParamMap.get("INPUT_SUB_PRODUCT");
		String functionCode = (String) widgetParamMap.get("INPUT_FUNCTION_CODE");

		if (locatedMap == null)
		{
			// Now look into the custom registry (if one is present)
			registry = ActionMapRegistry.getCustomInstance();
			locatedMap = (ActionMap) registry.lookup(screenCode, productCode, subProductCode, functionCode);
		}
		if (locatedMap == null)
			logger.cterror("CTRND00044", screenCode, productCode, subProductCode, functionCode);
		return locatedMap;

	}

	/**
	 * To construct the RequestParamMap
	 * 
	 * @param HttpServletRequest
	 * @param exportFormat
	 * @param widgetExtraParamMap
	 * 
	 * @return Map
	 */

	private Map constructRequestParamMap(HttpServletRequest request, String exportFormat, Map widgetExtraParamMap)
	{

		Map requestParams = new RequestParamsHandler().getParameterSet(request);

		updateParams(request, requestParams);

		if (requestParams == null)
		{
			requestParams = new HashMap();
		}
		widgetExtraParamMap.remove("IS_STREAM_ENABLED");
		widgetExtraParamMap.remove("ONLY_CONTENT");

		Map widgetParamMap = new HashMap();
		Iterator widgetIterator = widgetExtraParamMap.entrySet().iterator();
		if (widgetIterator.hasNext())
		{
			Map.Entry entry = (Map.Entry) widgetIterator.next();
			String key = (String) entry.getKey();
			widgetParamMap = (Map) entry.getValue();
		}
		widgetParamMap.put("EXPORT_FORMAT", exportFormat);
		widgetParamMap.put("host", "VIEWDEFN");

		Iterator entries = widgetParamMap.entrySet().iterator();
		while (entries.hasNext())
		{
			Map.Entry entry = (Map.Entry) entries.next();
			String key = (String) entry.getKey();
			if (requestParams.containsKey(key))
			{
				requestParams.put(key, entry.getValue());
			} else
			{
				requestParams.put(key, entry.getValue());
			}
		}

		return requestParams;
	}

	/**
	 * To construct the ReqObjToWidgetExport
	 * 
	 * @param HttpServletRequest
	 * @param exportFormat
	 * @return HttpServletRequest
	 */
	private HttpServletRequest constrctReqObjToWidgetExport(HttpServletRequest request, String exportFormat)
	{
		try
		{
			request.removeAttribute("IS_STREAM_ENABLED");
			request.removeAttribute("ONLY_CONTENT");
			request.setAttribute("EXPORT_FORMAT", exportFormat);

		} catch (Exception exp)
		{
			logger.cterror("CTRND00045", exp);
		}
		return request;
	}

	/**
	 * To construct the ReqObjToWidgetExport
	 * 
	 * @param sessionInfo
	 * @param action
	 * @param actionMap
	 * @param requestParams
	 * @return ReplyObject
	 * @throws OrbiActionException
	 */
	@Override
	public ReplyObject executePortletActionUsing(String action, SessionInfo sessionInfo, ActionMap actionMap,
			Map requestParams, HttpServletRequest request) throws OrbiActionException
	{

		return null;
	}

}
