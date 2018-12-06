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
 
 *************************************************************************/

package com.intellectdesign.canvas.servlets;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.UUID;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.intellectdesign.canvas.common.UserValue;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ExportConfigurationDescriptor;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.constants.common.JSPIOConstants;
import com.intellectdesign.canvas.constants.export.ExportFwsConstants;
import com.intellectdesign.canvas.exportdata.ExportDataException;
import com.intellectdesign.canvas.exportdata.ExportFormatFactory;
import com.intellectdesign.canvas.exportdata.IExportDataProvider;
import com.intellectdesign.canvas.exportdata.IExportDataValueObject;
import com.intellectdesign.canvas.exportdata.IExportFormatProvider;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.initalizer.Log4jMDCInitializer;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.login.sessions.SessionManager;
import com.intellectdesign.canvas.properties.MessageManager;
import com.intellectdesign.canvas.reports.generator.PDFFormGenerator;
import com.intellectdesign.canvas.utility.CTUtility;
import com.intellectdesign.canvas.web.config.ActionMap;
import com.intellectdesign.canvas.web.config.ActionMapRegistry;

/**
 * This Servlet is responsible for getting the data to be exported and streaming the file to the output.
 */
public class ExportServiceServlet extends HttpServlet
{

	/**
	 * override the init method of servlet config
	 * 
	 * @param pConfig
	 * @throws ServletException
	 */
	public void init(ServletConfig pConfig) throws ServletException
	{
		super.init(pConfig);
	}

	/**
	 * handles incoming HTTP POST requests
	 * 
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		LOGGER.ctinfo("CTRND00288");
		SessionInfo sessionInfo = null;
		String method = "ExportServiceServlet.doPost";
		String sExportFormat = request.getParameter("EXPORT_FORMAT");
		LOGGER.ctdebug("CTRND00112", sExportFormat);
		String sUsername = null;
		String sCorporateName = null;
		String sLanguageId = null;
		String sUserNo = null;
		String referenceId = null;
		String errorCode = null;
		String sFirstname = "";
		String sMiddlename = "";
		String sLastname = "";
		String aMtFormat = "";
		String dateFormat = "";
		String timeFormat = "";
		String timeZoneId = "";

		String bundleKey = ExportFwsConstants.EZ_LABELS;
		if (request.getParameter(ExportFwsConstants.WID_BUNDLE_KEY) != null)
		{
			bundleKey = request.getParameter(ExportFwsConstants.WID_BUNDLE_KEY);
		}

		LOGGER.ctdebug("CTRND00113", bundleKey);

		try
		{
			sessionInfo = validateSession(request, response);
			if (sessionInfo != null)
			{
				// Get the user name, corporate name, language id and user no from the session info
				if (sessionInfo.firstName != null && !"null".equalsIgnoreCase(sessionInfo.firstName))
					sFirstname = sessionInfo.firstName;
				if (sessionInfo.middleName != null && !"null".equalsIgnoreCase(sessionInfo.middleName))
					sMiddlename = sessionInfo.middleName;
				if (sessionInfo.lastName != null && !"null".equalsIgnoreCase(sessionInfo.lastName))
					sLastname = sessionInfo.lastName;
				sUsername = sFirstname + " " + sMiddlename + " " + sLastname;
				sCorporateName = sessionInfo.primaryCorporate;
				sLanguageId = sessionInfo.mLanguage;
				sUserNo = sessionInfo.userNo;
				aMtFormat = sessionInfo.mAmtFormat;
				dateFormat = sessionInfo.mDateFormat;
				timeFormat = sessionInfo.timeFormat;
				timeZoneId = sessionInfo.mTimeZoneId;
				LOGGER.ctdebug("CTRND00307", sUsername, sCorporateName, sLanguageId, sUserNo);

				// Form User Value object
				UserValue userValue = new UserValue();
				userValue.setFIRST_NAME(sUsername);
				userValue.setUserNo(sUserNo);
				userValue.setPrimaryCorporate(sCorporateName);
				userValue.setLangId(sLanguageId);
				userValue.setmAmtFormat(aMtFormat);
				userValue.setDirection(sessionInfo.direction); // For RTL

				userValue.setExportReportFormat(sExportFormat);

				userValue.setDateId(dateFormat);
				userValue.setTimeFormat(timeFormat);
				userValue.setTimeZoneId(timeZoneId);
				request.setAttribute("MODE", sExportFormat);

				// set the uservalue for requestId - to create png image temp file with this id.
				String reqId = new Log4jMDCInitializer().getCurrentRequestId();
				userValue.setRequestID(reqId);

				LOGGER.ctdebug("CTRND00114", userValue);

				// Get the action class from the action map
				ActionMapRegistry actionMapRegistry = ActionMapRegistry.getDefaultInstance();
				ActionMapRegistry actionMapRegistrycus = ActionMapRegistry.getCustomInstance();

				ActionMap actionMap = null;
				String product = null;
				String subproduct = null;
				String functionCode = null;
				String screenCode = null;
				product = request.getParameter(FrameworkConstants.PRODUCT_NAME);
				if (product == null)
					LOGGER.ctdebug("CTRND00115", FrameworkConstants.PRODUCT_NAME);

				subproduct = request.getParameter(FrameworkConstants.SUB_PRODUCT_NAME);
				if (subproduct == null)
					LOGGER.ctdebug("CTRND00116", FrameworkConstants.SUB_PRODUCT_NAME);

				functionCode = request.getParameter(JSPIOConstants.INPUT_FUNCTION_CODE);
				if (functionCode == null)
					LOGGER.ctdebug("CTRND00117", JSPIOConstants.INPUT_FUNCTION_CODE);

				screenCode = request.getParameter(FrameworkConstants.PAGE_CODE_TYPE);
				if (screenCode == null)
					LOGGER.ctdebug("CTRND00118", FrameworkConstants.PAGE_CODE_TYPE);

				actionMap = (ActionMap) actionMapRegistry.lookup(screenCode, product, subproduct, functionCode);
				if (actionMap == null || actionMap.getActionClass() == null)
				{
					actionMap = (ActionMap) actionMapRegistrycus.lookup(screenCode, product, subproduct, functionCode);
				}
				IExportDataProvider ExportDataProvider = null;
				String dataProviderClass = null;
				if (actionMap != null)
				{
					dataProviderClass = (actionMap.getActionClass() == null) ? "com.intellectdesign.canvas.action.PortletAction"
							: actionMap.getActionClass();
				}
				LOGGER.ctdebug("CTRND00119", dataProviderClass);
				ExportDataProvider = (IExportDataProvider) Class.forName(dataProviderClass).newInstance();

				// Get the data to be exported
				IExportDataValueObject exportDataValueObject = ExportDataProvider.getExportData(request, actionMap);
				LOGGER.ctdebug("CTRND00120", exportDataValueObject);
				if (exportDataValueObject == null)
				{
					LOGGER.cterror("CTRND00121");
					request.setAttribute("ERROR_KEY", "DATA_NULL");
					SessionManager lSessionManager = SessionManager.getInstance();
					lSessionManager.routeToErrorPage(request, response);
					return;
				}
				exportDataValueObject.setBundleKey(bundleKey);

				String onlyContent = request.getParameter("ONLY_CONTENT");
				if ("Y".equalsIgnoreCase(onlyContent))
				{
					exportDataValueObject.setOnlyContent(true);
				}

				// Check for the format and get the corresponding format provider instance using export format factory
				if (ExportFwsConstants.XLS.equals(sExportFormat))
				{
					handleExportToXLS(exportDataValueObject, userValue, request, response);
				}

				/**
				 * Checks for exporting both data and graph in excel.
				 */
				else if (ExportFwsConstants.VECTORXLS.equals(sExportFormat))
				{
					handleExportToXLSForChart(exportDataValueObject, userValue, request, response);
				}

				else if (ExportFwsConstants.VECTORRTF.equals(sExportFormat))
				{
					handleExportToRTFForCharts(exportDataValueObject, userValue, request, response);
				}

				/**
				 * Checks for exporting both data and graph in pdf.
				 */
				else if (ExportFwsConstants.VECTORPDF.equals(sExportFormat))
				{
					handleExportToPDFForCharts(exportDataValueObject, userValue, request, response);
				}

				else if (ExportFwsConstants.PDF.equals(sExportFormat))
				{
					handleExportToPDF(exportDataValueObject, userValue, request, response);
				}

				// If export format is CONFIRMPDF, this code will call
				// generatePDFDocument method of PDFFormGenerator class to
				// generate confirmation pdf .
				// And futher streams out this file .
				else if (ExportFwsConstants.CONFIRMPDF.equals(sExportFormat))
				{
					handleExportToPDFForConfirmForm(exportDataValueObject, userValue, request, response, actionMap);
				}

				else if (ExportFwsConstants.CSV.equals(sExportFormat))
				{
					handleExportToCSV(exportDataValueObject, userValue, request, response);
				}

				else if ("FORMXLS".equals(sExportFormat))
				{
					handleExportToXLSForForm(exportDataValueObject, userValue, request, response);
				}

				else if (ExportFwsConstants.RTF.equals(sExportFormat))
				{
					handleExportToRTF(exportDataValueObject, userValue, request, response);
				}

				else if (ExportFwsConstants.IMAGE.equals(sExportFormat))
				{
					handleExportToImage(exportDataValueObject, userValue, request, response);
				} else if (ExportFwsConstants.CHARTPDF.equals(sExportFormat))
				{
					handleExportToPDFForOrgChart(exportDataValueObject, userValue, request, response);
				} else if (ExportFwsConstants.TRANSPDF.equals(sExportFormat))
				{
					handleExportToPDFSwiftDownload(exportDataValueObject, userValue, request, response);
				} else if (ExportFwsConstants.DOWNPDF.equals(sExportFormat))
				{
					handlePDFDownload(exportDataValueObject, userValue, request, response);
				} else if (ExportFwsConstants.VECTORPDF.equals(sExportFormat))
				{
					handleExportToPDFForVector(exportDataValueObject, userValue, request, response);
				} else if (ExportFwsConstants.STATIC_TEMPLATE_PDF.equals(sExportFormat))
				{
					handleExportToPDFForStaticTemplate(exportDataValueObject, userValue, request, response);
				} else if (ExportFwsConstants.FORMHTML.equals(sExportFormat))
				{
					handleExportToHTMLForForm(exportDataValueObject, userValue, request, response);
				} else if (ExportFwsConstants.FORMPDF.equals(sExportFormat))
				{
					handleExportToPDFForForm(exportDataValueObject, userValue, request, response);
				} else if (ExportFwsConstants.HTML.equals(sExportFormat))
				{
					handleExportToHTML(exportDataValueObject, userValue, request, response, sessionInfo);
				}

				// Few more formats go here
				// If the given format is not supported then show a message that the format is not supported
				else
				{
					LOGGER.cterror("CTRND00152");
					request.setAttribute("ERROR_KEY", "FORMAT_NOT_SUPPORTED");
					SessionManager.getInstance().routeToErrorPage(request, response);
				}

			} else
			{
				LOGGER.cterror("CTRND00153");
				request.setAttribute("ERROR_KEY", "SESSION_EXPIRED");
				SessionManager.getInstance().routeToErrorPage(request, response);
			}
		} catch (Exception exception)
		{
			LOGGER.cterror("CTRND00154", exception);
			request.setAttribute("ERROR_KEY", "EXCEPTION");
			SessionManager.getInstance().routeToErrorPage(request, response);
			Log4jMDCInitializer initializer = new Log4jMDCInitializer();
			referenceId = initializer.getCurrentRequestId();
			LOGGER.ctdebug("CTRND00155", method, referenceId);
			errorCode = SYSERROR;
			dispayErrorMsg(errorCode, response, sessionInfo, referenceId);
		}
		LOGGER.ctinfo("CTRND00289");
	}

	/**
	 * handles incoming HTTP GET requests
	 * 
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		doPost(request, response);
	}

	/**
	 * Handles the Export to XLS request
	 * 
	 * @param exportDataValueObject
	 * @param userValue
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ExportDataException
	 */
	private void handleExportToXLS(IExportDataValueObject exportDataValueObject, UserValue userValue,
			HttpServletRequest request, HttpServletResponse response) throws IOException, ExportDataException
	{
		String fileName = null;
		IExportFormatProvider exportFormatProvider = ExportFormatFactory.getFormatProvider(ExportFwsConstants.XLS);

		// Get the path of the generated file
		String sFilePath = exportFormatProvider.getExportFormat(exportDataValueObject, userValue);
		LOGGER.ctdebug("CTRND00122", sFilePath);

		fileName = getExportedFileName(exportDataValueObject, userValue, true, null);

		// Stream the file
		streamTheFile(sFilePath, fileName, request, response);
	}

	/**
	 * Handles the Export to XLS for Chart. Does the data and image export
	 * 
	 * @param exportDataValueObject
	 * @param userValue
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ExportDataException
	 */
	private void handleExportToXLSForChart(IExportDataValueObject exportDataValueObject, UserValue userValue,
			HttpServletRequest request, HttpServletResponse response) throws IOException, ExportDataException
	{
		String fileName = "";
		HashMap exportDataMap = exportDataValueObject.getExportAdditionalData();
		LOGGER.ctdebug("CTRND00124", exportDataMap);

		IExportFormatProvider exportFormatProvider = ExportFormatFactory.getFormatProvider(ExportFwsConstants.XLS);

		// Get the path of the generated file
		String sFilePath = exportFormatProvider.getExportFormat(exportDataValueObject, userValue);
		LOGGER.ctdebug("CTRND00125", sFilePath);

		fileName = getExportedFileName(exportDataValueObject, userValue, true, null);
		// Stream the file
		streamTheFile(sFilePath, fileName, request, response);
		removeImageFile(request);
	}

	/**
	 * Handle Export to RTF
	 * 
	 * @param exportDataValueObject
	 * @param userValue
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ExportDataException
	 */
	private void handleExportToRTF(IExportDataValueObject exportDataValueObject, UserValue userValue,
			HttpServletRequest request, HttpServletResponse response) throws IOException, ExportDataException
	{
		String fileName = "";
		IExportFormatProvider exportFormatProvider = ExportFormatFactory.getFormatProvider(ExportFwsConstants.RTF);

		// Get the path of the generated file
		String sFilePath = exportFormatProvider.getExportFormat(exportDataValueObject, userValue);
		LOGGER.ctdebug("CTRND00140", sFilePath);
		fileName = getExportedFileName(exportDataValueObject, userValue, true, null);
		// Stream the file
		streamTheFile(sFilePath, fileName, request, response);
	}

	/**
	 * Handles the Export to RTF for charts.
	 * 
	 * @param exportDataValueObject
	 * @param userValue
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ExportDataException
	 */
	private void handleExportToRTFForCharts(IExportDataValueObject exportDataValueObject, UserValue userValue,
			HttpServletRequest request, HttpServletResponse response) throws IOException, ExportDataException
	{
		String fileName = "";
		HashMap exportDataMap = exportDataValueObject.getExportAdditionalData();
		LOGGER.ctdebug("CTRND00127", exportDataMap);

		IExportFormatProvider exportFormatProvider = ExportFormatFactory.getFormatProvider(ExportFwsConstants.RTF);

		// Get the path of the generated file
		String sFilePath = exportFormatProvider.getExportFormat(exportDataValueObject, userValue);
		LOGGER.ctdebug("CTRND00128", sFilePath);

		fileName = getExportedFileName(exportDataValueObject, userValue, true, null);
		// Stream the file
		streamTheFile(sFilePath, fileName, request, response);
	}

	/**
	 * Handles the Export to PDF
	 * 
	 * @param exportDataValueObject
	 * @param userValue
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ExportDataException
	 */
	private void handleExportToPDF(IExportDataValueObject exportDataValueObject, UserValue userValue,
			HttpServletRequest request, HttpServletResponse response) throws IOException, ExportDataException
	{
		String fileName = "";
		IExportFormatProvider exportFormatProvider = ExportFormatFactory.getFormatProvider(ExportFwsConstants.PDF);

		// Get the path of the generated file
		String sFilePath = exportFormatProvider.getExportFormat(exportDataValueObject, userValue);
		LOGGER.ctdebug("CTRND00133", sFilePath);
		fileName = getExportedFileName(exportDataValueObject, userValue, true, null);
		// Stream the file
		streamTheFile(sFilePath, fileName, request, response);
	}

	/**
	 * Handles the Export to PDF for charts with data and image
	 * 
	 * @param exportDataValueObject
	 * @param userValue
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ExportDataException
	 */
	private void handleExportToPDFForCharts(IExportDataValueObject exportDataValueObject, UserValue userValue,
			HttpServletRequest request, HttpServletResponse response) throws IOException, ExportDataException
	{
		String fileName = "";
		HashMap exportDataMap = exportDataValueObject.getExportAdditionalData();
		LOGGER.ctdebug("CTRND00130", exportDataMap);

		IExportFormatProvider exportFormatProvider = ExportFormatFactory.getFormatProvider(ExportFwsConstants.PDF);

		// Get the path of the generated file
		String sFilePath = exportFormatProvider.getExportFormat(exportDataValueObject, userValue);
		LOGGER.ctdebug("CTRND00131", sFilePath);

		fileName = getExportedFileName(exportDataValueObject, userValue, true, null);
		// Stream the file
		streamTheFile(sFilePath, fileName, request, response);
		removeImageFile(request);
	}

	/**
	 * Handle Export to PDF for Org Chart
	 * 
	 * @param exportDataValueObject
	 * @param userValue
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ExportDataException
	 */
	private void handleExportToPDFForOrgChart(IExportDataValueObject exportDataValueObject, UserValue userValue,
			HttpServletRequest request, HttpServletResponse response) throws IOException, ExportDataException
	{
		String fileName = "";
		HashMap exportDataMap = exportDataValueObject.getExportAdditionalData();
		LOGGER.ctdebug("CTRND00143", exportDataMap);

		fileName = "Sweep_Structure_Pictorial_Representation";

		fileName = appendCurrentTimeStampToFileName(fileName);
		streamTheFile((String) exportDataMap.get("ORG_FILE_PATH"), fileName, request, response);
		removeImageFile(request);
	}

	/**
	 * Handle Export to PDF for Confirmation Form
	 * 
	 * @param exportDataValueObject
	 * @param userValue
	 * @param request
	 * @param response
	 * @param actionMap
	 * @throws IOException
	 */
	private void handleExportToPDFForConfirmForm(IExportDataValueObject exportDataValueObject, UserValue userValue,
			HttpServletRequest request, HttpServletResponse response, ActionMap actionMap) throws IOException
	{
		String fileName = "";
		String userId = userValue.getUserNo();
		String reportID = exportDataValueObject.getReportId();
		// The file name with which pdf should be generated
		String FilePath = reportID + userId + "_" + CTUtility.getDateTime() + ".pdf";
		PDFFormGenerator pdfGenerator = new PDFFormGenerator();
		// calls generatePDFDocument method of PDFFormGenerator
		// to generate pdf file .
		pdfGenerator.generatePDFDocument(exportDataValueObject, FilePath, userValue, actionMap.getProductCode(),
				actionMap.getSubProductCode(), actionMap.getFunctionCode());
		// Completepath of pdf file generated
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		ExportConfigurationDescriptor exportDescriptor = configMgr.getExportDescriptor();
		String sFilePath = exportDescriptor.getPdfFolderPath() + File.separator + FilePath;
		String fileNamePrefix = exportDataValueObject.getFileNamePrefix();
		fileName = appendCurrentTimeStampToFileName(fileNamePrefix);
		// Stream the file
		streamTheFile(sFilePath, fileName, request, response);
	}

	/**
	 * This is to be remmoved. This is not part of the Framework functionality
	 * 
	 * @param exportDataValueObject
	 * @param userValue
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	private void handleExportToPDFSwiftDownload(IExportDataValueObject exportDataValueObject, UserValue userValue,
			HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		String fileName = "";
		LOGGER.ctdebug("CTRND00144");

		HashMap exportDataMap = exportDataValueObject.getExportAdditionalData();
		LOGGER.ctdebug("CTRND00145", exportDataMap);

		fileName = "transcation_swift_dload";

		fileName = appendCurrentTimeStampToFileName(fileName);
		streamTheFile((String) exportDataMap.get("ORG_PDF_FILE_PATH"), fileName, request, response);
		removeImageFile(request);
	}

	/**
	 * Handle Export to PDF of Vector data
	 * 
	 * @param exportDataValueObject
	 * @param userValue
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	private void handleExportToPDFForVector(IExportDataValueObject exportDataValueObject, UserValue userValue,
			HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		HashMap exportDataMap = exportDataValueObject.getExportAdditionalData();
		LOGGER.ctdebug("CTRND00146", exportDataMap);
		streamTheFile((String) exportDataMap.get("GRAPH_FILE_PATH"), (String) exportDataMap.get("GRAPH_FILE_NAME"),
				request, response);
	}

	/**
	 * Handle the Export to PDF for Static template
	 * 
	 * @param exportDataValueObject
	 * @param userValue
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	private void handleExportToPDFForStaticTemplate(IExportDataValueObject exportDataValueObject, UserValue userValue,
			HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		String fileName = "";
		HashMap exportDataMap = exportDataValueObject.getExportAdditionalData();
		fileName = exportDataMap.get("ORG_FILE_NAME").toString();
		streamThetemplatepdfFile((String) exportDataMap.get("ORG_FILE_NAME"), fileName, request, response);
	}

	/**
	 * Handles Export to PDF for Forms
	 * 
	 * @param exportDataValueObject
	 * @param userValue
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	private void handleExportToPDFForForm(IExportDataValueObject exportDataValueObject, UserValue userValue,
			HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		String fileName = "";
		HashMap exportDataMap = exportDataValueObject.getExportAdditionalData();
		LOGGER.ctdebug("CTRND00148", exportDataMap);

		fileName = exportDataMap.get("FORMEXPORT_FILE_NAME").toString();

		fileName = appendCurrentTimeStampToFileName(fileName);
		streamTheFile((String) exportDataMap.get("FORMEXPORT_FILE_PATH"), fileName, request, response);
	}

	/**
	 * Handles Export to CSV
	 * 
	 * @param exportDataValueObject
	 * @param userValue
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ExportDataException
	 */
	private void handleExportToCSV(IExportDataValueObject exportDataValueObject, UserValue userValue,
			HttpServletRequest request, HttpServletResponse response) throws IOException, ExportDataException
	{
		String fileName = "";
		IExportFormatProvider exportFormatProvider = ExportFormatFactory.getFormatProvider(ExportFwsConstants.CSV);

		// Get the path of the generated file
		String sFilePath = exportFormatProvider.getExportFormat(exportDataValueObject, userValue);
		LOGGER.ctdebug("CTRND00135", sFilePath);
		fileName = getExportedFileName(exportDataValueObject, userValue, true, null);
		// Stream the file
		streamTheFile(sFilePath, fileName, request, response);
	}

	/**
	 * Handle export to XLS for Form
	 * 
	 * @param exportDataValueObject
	 * @param userValue
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ExportDataException
	 */
	private void handleExportToXLSForForm(IExportDataValueObject exportDataValueObject, UserValue userValue,
			HttpServletRequest request, HttpServletResponse response) throws IOException, ExportDataException
	{
		String fileName = "";
		HashMap exportDataMap = exportDataValueObject.getExportAdditionalData();
		LOGGER.ctdebug("CTRND00137", exportDataMap);

		IExportFormatProvider exportFormatProvider = ExportFormatFactory.getFormatProvider("FORMXLS");

		// Get the path of the generated file
		String sFilePath = exportFormatProvider.getExportFormat(exportDataValueObject, userValue);
		LOGGER.ctdebug("CTRND00138", sFilePath);

		fileName = getExportedFileName(exportDataValueObject, userValue, true, null);
		// Stream the file
		streamTheFile(sFilePath, fileName, request, response);
	}

	/**
	 * Handle the Export to HTML
	 * 
	 * @param exportDataValueObject
	 * @param userValue
	 * @param request
	 * @param response
	 * @param sessionInfo
	 * @throws IOException
	 * @throws ExportDataException
	 */
	private void handleExportToHTML(IExportDataValueObject exportDataValueObject, UserValue userValue,
			HttpServletRequest request, HttpServletResponse response, SessionInfo sessionInfo) throws IOException,
			ExportDataException
	{
		String fileName = "";
		IExportFormatProvider exportFormatProvider = ExportFormatFactory.getFormatProvider(ExportFwsConstants.HTML);

		String isStreamEnabled = request.getParameter("IS_STREAM_ENABLED");

		// Get the path of the generated file
		String sFilePath = exportFormatProvider.getExportFormat(exportDataValueObject, userValue);
		LOGGER.ctdebug("CTRND00149", sFilePath);

		fileName = getExportedFileName(exportDataValueObject, userValue, true, null);

		LOGGER.ctdebug("CTRND00151", request);
		// Stream the file
		if ("Y".equals(isStreamEnabled))
		{
			streamTheFile(sFilePath, fileName, request, response);
		} else
		{
			sFilePath = sFilePath.replace("\\", "/");

			String uniqueId = UUID.randomUUID().toString().concat(String.valueOf(new Date().getTime()));

			sessionInfo.formWidgetPathIdMap.put(uniqueId, sFilePath);

			response.getWriter().write("{FilePath : '" + uniqueId + "'}");
		}
	}

	/**
	 * Handle the export to HTML for Form
	 * 
	 * @param exportDataValueObject
	 * @param userValue
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ExportDataException
	 */
	private void handleExportToHTMLForForm(IExportDataValueObject exportDataValueObject, UserValue userValue,
			HttpServletRequest request, HttpServletResponse response) throws IOException, ExportDataException
	{
		HashMap exportDataMap = exportDataValueObject.getExportAdditionalData();
		LOGGER.ctdebug("CTRND00147", exportDataMap);

		String fileContent = (String) exportDataMap.get("FORMEXPORT_CONTENT");

		response.getWriter().write(fileContent);
	}

	/**
	 * Handles Export to Image
	 * 
	 * @param exportDataValueObject
	 * @param userValue
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ExportDataException
	 */
	private void handleExportToImage(IExportDataValueObject exportDataValueObject, UserValue userValue,
			HttpServletRequest request, HttpServletResponse response) throws IOException, ExportDataException
	{
		HashMap exportDataMap = exportDataValueObject.getExportAdditionalData();
		LOGGER.ctdebug("CTRND00142", exportDataMap);
		streamTheImage((String) exportDataMap.get("VIEW_NAME"), (String) exportDataMap.get("IMAGE_FILE_NAME"), request,
				response);
	}

	/**
	 * Triggers a download of the PDF
	 * 
	 * @param exportDataValueObject
	 * @param userValue
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ExportDataException
	 */
	private void handlePDFDownload(IExportDataValueObject exportDataValueObject, UserValue userValue,
			HttpServletRequest request, HttpServletResponse response) throws IOException, ExportDataException
	{
		String fileName = "";
		HashMap exportDataMap = exportDataValueObject.getExportAdditionalData();
		fileName = (String) exportDataMap.get("ORG_FILE_NAME");
		streamTheFile((String) exportDataMap.get("ORG_FILE_NAME"), fileName, request, response);
	}

	/**
	 * Gets the exported file name and randomizes it with current time stamp if requested for
	 * 
	 * @param exportDataValueObject
	 * @param userValue
	 * @param appendTimeStamp
	 * @param bundleKey
	 * @return
	 */
	private String getExportedFileName(IExportDataValueObject exportDataValueObject, UserValue userValue,
			boolean appendTimeStamp, String bundleKey)
	{
		String fileName = "";
		String sLanguageId = userValue.getLangId();
		String fileNamePrefix = exportDataValueObject.getFileNamePrefix();
		LOGGER.ctdebug("CTRND00150", fileNamePrefix);
		String finalBundleKey = (bundleKey == null || "".equals(bundleKey)) ? exportDataValueObject.getBundleKey()
				: bundleKey;

		if (exportDataValueObject.isLocalizationRequiredForFileName())
		{
			fileName = MessageManager.getMessage(finalBundleKey, fileNamePrefix, sLanguageId);
		} else
		{
			fileName = fileNamePrefix;
		}
		if (appendTimeStamp)
			fileName = appendCurrentTimeStampToFileName(fileName);

		return fileName;
	}

	/**
	 * Append the current date time stamp to the file name
	 * 
	 * @param fileName
	 * @return
	 */
	private String appendCurrentTimeStampToFileName(String fileName)
	{
		StringBuilder returnValue = new StringBuilder();
		returnValue.append(fileName != null ? fileName : "");
		returnValue.append("_");
		SimpleDateFormat simpleFormat = new SimpleDateFormat("ddMMMyyyy_HHmmss");
		returnValue.append(simpleFormat.format(new Date()));

		return returnValue.toString();
	}

	/**
	 * This method Streams the file and show it in the browser
	 * 
	 * @param sFilePath
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	private void streamTheFile(String sFilePath, String filename, HttpServletRequest request,
			HttpServletResponse response) throws IOException
	{
		LOGGER.ctinfo("CTRND00292");
		LOGGER.ctdebug("CTRND00157", sFilePath);

		LOGGER.ctdebug("CTRND00158", filename);
		// Get the file input stream
		FileInputStream fileInputStream = null;
		try
		{
			fileInputStream = new FileInputStream(sFilePath);
			byte[] workSheet = new byte[fileInputStream.available()];
			if (fileInputStream.available() > 0)
				fileInputStream.read(workSheet);
			String extension = "";
			if (sFilePath.indexOf("pdf") > 0)
			{
				response.setContentType("application/pdf");
				extension = "pdf";
			} else if (sFilePath.indexOf("xls") > 0)
			{
				response.setContentType("application/vnd.ms-excel");

				extension = "xls";
			} else if (sFilePath.indexOf("rtf") > 0)
			{
				response.setContentType("application/msword");

				extension = "rtf";

			} else if (sFilePath.indexOf("csv") > 0)
			{
				response.setContentType("text/csv");
				extension = "csv";
			}

			else if (sFilePath.indexOf("html") > 0)
			{
				response.setContentType("application/html");
				extension = "html";
			}

			else
			{
				response.setContentType("application/unknown");
			}
			/** To make this response not saved in Temp folder */
			response.setHeader("Expires", "0");
			response.setHeader("Cache-Control", "private, must-revalidate");
			response.setHeader("Pragma", "private");

			filename = filename.replaceAll(" ", "_");

			response.setHeader("Content-Disposition", "attachment; filename=" + (filename + "." + extension));

			response.getOutputStream().write(workSheet);
			LOGGER.ctdebug("CTRND00159");
			response.getOutputStream().flush();

			// Close the file input stream.
			fileInputStream.close();
			response.getOutputStream().close();

			// Delete the file after streaming
			File file = new File(sFilePath);
			boolean bresult = file.delete();
			LOGGER.ctdebug("CTRND00160", bresult);

			LOGGER.ctinfo("CTRND00291");
		} catch (FileNotFoundException fnfe)
		{
			LOGGER.cterror("CTRND00161", fnfe);
			LOGGER.cterror("CTRND00162");
		} catch (IOException ioEx)
		{
			LOGGER.cterror("CTRND00163", ioEx);
			throw ioEx;
		} finally
		{
			try
			{
				if (fileInputStream != null)
					fileInputStream.close();

			} catch (IOException ee)
			{
				LOGGER.cterror("CTRND00164", ee);
			}
		}

		return;
	}

	/**
	 * This method used to remove the file
	 * 
	 * @param HttpServletRequest
	 * @return boolean true if file is removed
	 */
	private boolean removeImageFile(HttpServletRequest request)
	{
		/**
		 * Get the path of the image from property file
		 */
		boolean bimgresult = false;
		try
		{
			String reqId = new Log4jMDCInitializer().getCurrentRequestId();
			ConfigurationManager configMgr = ConfigurationManager.getInstance();
			ExportConfigurationDescriptor exportDescriptor = configMgr.getExportDescriptor();
			String imgFilePath = exportDescriptor.getOrgPDFPath() + File.separator + reqId + ".png";

			// Delete the image file after streaming
			File imgFile = new File(imgFilePath);
			bimgresult = imgFile.delete();
		} catch (NullPointerException nullPointerExcep)
		{
			LOGGER.cterror("CTRND00165", nullPointerExcep);
		} catch (Exception excep)
		{
			LOGGER.cterror("CTRND00166", excep);
		}
		LOGGER.ctdebug("CTRND00167", bimgresult);
		return bimgresult;
	}

	/**
	 * handle the method to stream templated file
	 * 
	 * @param sFilePath
	 * @param filename
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	private void streamThetemplatepdfFile(String sFilePath, String filename, HttpServletRequest request,
			HttpServletResponse response) throws IOException
	{
		LOGGER.ctinfo("CTRND00292");
		LOGGER.ctdebug("CTRND00168", sFilePath);
		LOGGER.ctdebug("CTRND00169", filename);

		// Get the file input stream
		FileInputStream fileInputStream = null;

		try
		{
			fileInputStream = new FileInputStream(sFilePath);
			byte[] workSheet = new byte[fileInputStream.available()];
			if (fileInputStream.available() > 0)
				fileInputStream.read(workSheet);

			String extension = "";

			response.setContentType("application/pdf");
			extension = "pdf";

			/** To make this response not saved in Temp folder */
			response.setHeader("Expires", "0");
			response.setHeader("Cache-Control", "private, must-revalidate");
			response.setHeader("Pragma", "private");
			filename = filename.replaceAll(" ", "_");
			response.setHeader("Content-Disposition", "attachment; filename=" + (filename + "." + extension));
			response.getOutputStream().write(workSheet);

			LOGGER.ctdebug("CTRND00170");

			response.getOutputStream().flush();

			// Close the file input stream.
			fileInputStream.close();
			response.getOutputStream().close();
		} catch (FileNotFoundException fnfe)
		{
			LOGGER.cterror("CTRND00171", fnfe);
			LOGGER.cterror("CTRND00162");
		} catch (IOException ioEx)
		{
			LOGGER.cterror("CTRND00163");
			throw ioEx;
		} finally
		{
			try
			{
				if (fileInputStream != null)
					fileInputStream.close();

			} catch (Exception ee)
			{
				LOGGER.cterror("CTRND00172", ee);
			}
		}
	}

	/**
	 * Helper method to stream the image to the browser.
	 * 
	 * @param viewName The view name of the plotted chart
	 * @param filename The image file name
	 * @param request HttpServletRequest
	 * @param response HttpServletResponse
	 */
	private void streamTheImage(String viewName, String filename, HttpServletRequest request,
			HttpServletResponse response) throws IOException
	{
		String type = "";

		if (request.getParameter("TYPE") != null)
		{
			type = request.getParameter("TYPE");
		}

		response.setContentType("image/jpeg");
		/** To make this response not saved in Temp folder */
		response.setHeader("Expires", "0");
		response.setHeader("Cache-Control", "private, must-revalidate");
		response.setHeader("Pragma", "private");
		if ("PRINT".equals(type))
		{
			response.setHeader("Content-Disposition", "inline; filename=" + (viewName + ".jpg"));
		} else
		{
			response.setHeader("Content-Disposition", "attachment; filename=" + (viewName + ".jpg"));
		}
		LOGGER.ctdebug("CTRND00173", filename);
		File imgFile = null;
		BufferedInputStream in = null;
		BufferedOutputStream out = null;
		String imageFilePath = null;
		try
		{
			ConfigurationManager configMgr = ConfigurationManager.getInstance();
			ExportConfigurationDescriptor exportDescriptor = configMgr.getExportDescriptor();
			imageFilePath = exportDescriptor.getChartGeneratedImgPath();

			if (imageFilePath == null || "".equals(imageFilePath))
			{
				LOGGER.cterror("CTRND00174");
			}

			imgFile = new File(imageFilePath + "/" + filename);
			in = new BufferedInputStream(new FileInputStream(imgFile));
			out = new BufferedOutputStream(response.getOutputStream());

			byte b[] = new byte[8];
			int count;
			while ((count = in.read(b)) != -1)
			{
				out.write(b, 0, count);
			}

			out.flush();

			// Delete the generated image file once the image is streamed to browser.
			boolean bresult = imgFile.delete();
			LOGGER.ctdebug("CTRND00175", bresult);
		} catch (FileNotFoundException fnfe)
		{
			LOGGER.cterror("CTRND00176", imageFilePath);
			LOGGER.cterror("CTRND00162");
		} catch (IOException ioEx)
		{
			LOGGER.cterror("CTRND00163");
			throw ioEx;
		} finally
		{
			try
			{
				if (out != null)
					out.close();
				if (in != null)
					in.close();

			} catch (Exception ee)
			{
				LOGGER.cterror("CTRND00177", ee);
			}
		}
	}

	/**
	 * This method gets the session from the request
	 * 
	 * @param request
	 * @return SessionInfo
	 * @throws IOException
	 * @throws ServletException
	 */
	private SessionInfo validateSession(HttpServletRequest request, HttpServletResponse response) throws IOException,
			ServletException
	{
		LOGGER.ctinfo("CTRND00288");
		SessionManager lSessionManager = SessionManager.getInstance();
		if (!"success".equals(lSessionManager.validateSession(request)))
		{
			lSessionManager.routeToExpiryPage(request, response);
		}
		SessionInfo sessionInfo = lSessionManager.getUserSessionInfo(request);
		LOGGER.ctdebug("CTRND00178", sessionInfo);
		LOGGER.ctinfo("CTRND00291");
		return sessionInfo;
	}

	/**
	 * This method displays the error message
	 * 
	 * @param errorcode
	 * @param response
	 * @param sessionInfo
	 * @param referenceId
	 * @return String
	 * @throws IOException
	 */

	private String dispayErrorMsg(String errorCode, HttpServletResponse response, SessionInfo sessionInfo,
			String referenceId) throws IOException
	{
		String errorMsg = null;
		String errorTitle = null;
		String errorLblBtn = null;
		String referenceLbl = null;
		try
		{
			String languageCode = sessionInfo.mLanguage;
			LOGGER.ctdebug("CTRND00179", languageCode);
			ConfigurationManager configMgr = ConfigurationManager.getInstance();
			ExportConfigurationDescriptor exportDescriptor = configMgr.getExportDescriptor();

			String contextPath = exportDescriptor.getContextPath();
			if (errorCode != null && !"".equals(errorCode))
			{
				errorMsg = exportDescriptor.getSysError();
				errorTitle = exportDescriptor.getErrorTitle();
				errorLblBtn = exportDescriptor.getOkButtonLabel();
				referenceLbl = exportDescriptor.getReference();
				StringBuffer strMessageBuffer = new StringBuffer();
				strMessageBuffer.append("<script language='javascript' src='" + contextPath
						+ "/iportal/ext/adapter/ext/ext-base.js'></script>");
				strMessageBuffer.append("<script language='javascript' src='" + contextPath
						+ "/iportal/ext/ext-all.js'></script>");
				strMessageBuffer.append("<link rel='stylesheet' type='text/css' href='" + contextPath
						+ "/iportal/css/ext-all.css' />");
				strMessageBuffer.append("<link rel='stylesheet' type='text/css' href='" + contextPath
						+ "/iportal/css/custom.css' />");
				strMessageBuffer.append("<script>");
				strMessageBuffer.append("Ext.onReady(function(){");
				strMessageBuffer.append("var errorMsgWindow = new Ext.Window({");
				strMessageBuffer.append("width:360,");
				strMessageBuffer.append("height:200,");
				strMessageBuffer.append("modal:true,");
				strMessageBuffer.append("closable:false,");
				strMessageBuffer
						.append("tools:[{id:'iportalClose',handler:function(){errorMsgWindow.close();window.close();}}],");
				strMessageBuffer.append("bbar:[{xtype:'tbbutton',minWidth :40,text:'" + errorLblBtn
						+ "',handler:function(){errorMsgWindow.close();window.close();}}],");
				strMessageBuffer.append("autoScroll:true,");
				strMessageBuffer.append("cls:'formBg',");
				strMessageBuffer.append("id:'REPERR_DIALOG',");
				strMessageBuffer.append("title:'" + errorTitle + "',");
				strMessageBuffer.append("items:[{");
				strMessageBuffer.append("xtype: 'box',");
				if (referenceId != null && !"".equals(referenceId))
				{
					strMessageBuffer.append("autoEl: {cn:'<div class=\"message-window\">" + errorMsg + "<br>"
							+ referenceLbl + " : " + referenceId + "</div>'}");
				} else
				{
					strMessageBuffer.append("autoEl: {cn:'<div class=\"message-window\">" + errorMsg + "</div>'}");
				}
				strMessageBuffer.append("}");
				strMessageBuffer.append("]");
				strMessageBuffer.append("});");
				strMessageBuffer.append("errorMsgWindow.show();");
				strMessageBuffer.append("});");
				strMessageBuffer.append("</script>");
				LOGGER.ctdebug("CTRND00180", errorMsg);
				response.setContentType(FrameworkConstants.CONTENT_TYPE_HTML);
				response.setCharacterEncoding(FrameworkConstants.UTF);
				response.getOutputStream().print(strMessageBuffer.toString());
			}
		} catch (IOException ioe)
		{
			throw ioe;
		}
		return errorMsg;
	}

	private static Logger LOGGER = Logger.getLogger(ExportServiceServlet.class);
	private static final long serialVersionUID = 1L;
	public static final String SYSERROR = "SYSERROR";
}
