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
 * */

package com.intellectdesign.canvas.viewdefinition.export;

import java.awt.print.PageFormat;
import java.awt.print.Paper;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.intellectdesign.canvas.Image.SVGConverter;
import com.intellectdesign.canvas.action.PortletAction;
import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ExportConfigurationDescriptor;
import com.intellectdesign.canvas.constants.export.ExportFwsConstants;
import com.intellectdesign.canvas.constants.listviews.ListViewConstants;
import com.intellectdesign.canvas.datahandler.RequestParamsHandler;
import com.intellectdesign.canvas.exceptions.action.OrbiActionException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.exportdata.IExportDataProvider;
import com.intellectdesign.canvas.exportdata.IExportDataValueObject;
import com.intellectdesign.canvas.exportdata.SimpleExportDataColumnHeaderValueObject;
import com.intellectdesign.canvas.exportdata.SimpleExportDataValueObject;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.initalizer.Log4jMDCInitializer;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.login.sessions.SessionManager;
import com.intellectdesign.canvas.pref.date.DateFormatterManager;
import com.intellectdesign.canvas.preference.GlobalPreferencesUtil;
import com.intellectdesign.canvas.properties.MessageManager;
import com.intellectdesign.canvas.viewdefinition.ColumnDefinition;
import com.intellectdesign.canvas.viewdefinition.ViewDefinition;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionConstants;
import com.intellectdesign.canvas.viewdefinition.util.ListViewUtil;
import com.intellectdesign.canvas.web.config.ActionMap;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfTemplate;
import com.lowagie.text.pdf.PdfWriter;

/**
 * class for Vector View Action which extends Portlet Action and implements IExportDataProvider
 * 
 * @version 1.0
 * 
 */
public class VectorViewAction extends PortletAction implements IExportDataProvider
{

	private static final Logger logger = Logger.getLogger(VectorViewAction.class);
	private static final String ORG_PDF_FILE_PATH = "ORG_PDF_FILE_PATH";
	private static final String IPORTAL_REFERENCE = "IPORTAL_REFERENCE";

	/**
	 * to get the export data
	 * 
	 * @param request
	 * @param actionMap
	 * @return IExportDataValueObject
	 * @exception exception
	 * @see com.intellectdesign.canvas.exportdata.IExportDataProvider#getExportData(javax.servlet.http.HttpServletRequest,
	 *      com.intellectdesign.canvas.web.config.ActionMap)
	 */
	public IExportDataValueObject getExportData(HttpServletRequest request, ActionMap actionMap)
	{

		SessionManager lSessionManager = SessionManager.getInstance();
		SessionInfo sessionInfo = null;

		if (!"success".equals(lSessionManager.validateSession(request)))
		{
			logger.cterror("CTRND00351");
			return null;

		}

		sessionInfo = lSessionManager.getUserSessionInfo(request);

		if (sessionInfo == null)
		{
			logger.cterror("CTRND00351");
			return null;
		}
		SimpleExportDataValueObject simpleExportData = new SimpleExportDataValueObject();

		Map inputParams = new RequestParamsHandler().getParameterSet(request);

		String sFileNamePrefix = (String) inputParams.get("VIEW_ID") + "_";

		// String pdfFileName = "Vector_" + sessionInfo.userNo + new Date().getTime();
		String pdfFileName = sFileNamePrefix + sessionInfo.userNo + new Date().getTime();

		logger.ctdebug("CTRND00352", pdfFileName);

		ConfigurationManager confMgr = ConfigurationManager.getInstance();
		ExportConfigurationDescriptor exportDescriptor = confMgr.getExportDescriptor();
		String pdfFilePath = exportDescriptor.getOrgPDFPath();

		logger.ctdebug("CTRND00353", pdfFilePath);

		String iportalPath = exportDescriptor.getContextPath();

		// Get the path from the property file to write image.
		String pdfImagePath = exportDescriptor.getOrgPDFPath();

		// Get the Grid value for exporting from metadata and set the grid value in VO object.
		try
		{
			ExtReplyObject reply = executeHostRequest(sessionInfo, actionMap.getHostCode(),
					inputParams, request);
			List<HashMap<String, Object>> listViewData = (List) reply.headerMap
					.get(ViewDefinitionConstants.HEADER_KEY_VIEW_DATA);
			ViewDefinition viewDef = (ViewDefinition) reply.headerMap
					.get(ViewDefinitionConstants.HEADER_KEY_VIEW_METADATA);

			logger.ctdebug("CTRND00354", listViewData);
			logger.ctdebug("CTRND00355", inputParams);
			ListViewUtil lUtil = new ListViewUtil();
			String dateStrVal = null;
			String dateStrFormattedVal = null;
			Date dateFormat = null;
			ArrayList<ColumnDefinition> arrColumnsList = viewDef.getListColumns();
			ArrayList<String> arrDisplayColumnsList = new ArrayList<String>();
			SimpleExportDataColumnHeaderValueObject simpleExportDataColumnHeader = null;
			simpleExportData = new SimpleExportDataValueObject();
			simpleExportData.setexportMode((String) request.getAttribute("MODE"));

			String bundleKey = ExportFwsConstants.CUSER;
			if (request.getParameter(ExportFwsConstants.WID_BUNDLE_KEY) != null)
			{
				bundleKey = request.getParameter(ExportFwsConstants.WID_BUNDLE_KEY);
			}

			logger.ctdebug("CTRND00356", bundleKey);

			/**
			 * Set the view name into VO, so that it can be accessed at servlet and assign the filename prefix
			 */
			logger.ctdebug("CTRND00357", viewDef.getViewName());
			logger.ctdebug("CTRND00358", viewDef.getGCIF(), viewDef.getUserNumber());
			simpleExportData.setFileNamePrefix(viewDef.getViewName());

			simpleExportData.setLocalizationRequiredForFileName(viewDef.isPreDefinedView());

			// Get the current date and convert it into the user preferred time
			// zone.
			String userTimezoneCode = (String) inputParams.get(ListViewConstants.USER_PREFEERENCE_TIMEZONE_FORMAT);
			Date currDate = new Date();
			/**
			 * GlobalPreferencesUtil gpUtil = new GlobalPreferencesUtil(); String lastUpdatedDate =
			 * gpUtil.userPrefFormatDateAndTime( sessionInfo.mDateFormat + " HH:mm:ss", sessionInfo.mTimeZoneId,
			 * currDate);
			 */
			String jDateFormat = DateFormatterManager.getJavaDateFormat(sessionInfo.mDateFormat);
			GlobalPreferencesUtil globalPreferencesUtil = new GlobalPreferencesUtil();
			String lastUpdatedDate = globalPreferencesUtil.userPrefFormatDateAndTime(jDateFormat
					+ " "+sessionInfo.timeFormat, sessionInfo.mTimeZoneId, currDate); // Split env changes

			logger.ctdebug("CTRND00359", userTimezoneCode, lastUpdatedDate);
			// String offSet = gpUtil.getTimeZoneOffset(timeZonePreference,
			// currDate);
			// logger.debug("offset value-->" + offSet);
			// Respect the user preference for the date.

			/**
			 * LOGGER.debug("calendar value-->" + calendar.toString()); SimpleDateFormat formatter = new
			 * SimpleDateFormat("dd/MM/yyyy HH:mm:ss");//formatter should change acccording to userprefrence setup, get
			 * the date format from userprefrence setup LOGGER.debug("  It is now : " +
			 * formatter.format(calendar.getTime()));
			 */
			HashMap additionalData = (HashMap) reply.headerMap.get(ViewDefinitionConstants.HEADER_KEY_ADDITIONAL_DATA);
			String langCode = sessionInfo.mLanguage;
			logger.ctdebug("CTRND00360", jDateFormat, lastUpdatedDate, sessionInfo.mTimeZoneId);
			String lastUpdateMsg = MessageManager.getMessage("cuser", "LBL_LAST_UPDATED_AS_OF", langCode);
			additionalData.put(ViewDefinitionConstants.HEADER_KEY_LAST_UPDATED_DATE_MSG, lastUpdateMsg);
			additionalData.put(ViewDefinitionConstants.HEADER_KEY_LAST_UPDATED_DATE_TIME, lastUpdatedDate);
			additionalData.put(ListViewConstants.FLD_CURRENCY_CD,
					request.getParameter(ListViewConstants.FLD_CURRENCY_CD));
			logger.ctdebug("CTRND00361", additionalData);
			simpleExportData.addExportAdditionalData(additionalData);

			Iterator<ColumnDefinition> columnIterator = arrColumnsList.iterator();
			String strHidden = null;
			String strColHeaderType = null;
			String formatedDate = "";
			// Include grouped by columns as separate columns in the exported
			ArrayList<ColumnDefinition> arrGroupsList = viewDef.getOrderedGroupColumns();
			for (ColumnDefinition columnDef : arrGroupsList)
			{
				strColHeaderType = headerTypeMap.get(columnDef.getDataType());
				simpleExportDataColumnHeader = new SimpleExportDataColumnHeaderValueObject(columnDef.getColumnId(),
						columnDef.getColumnDisplayNameKey(), strColHeaderType);
				simpleExportData.addColumnHeader(simpleExportDataColumnHeader);
				arrDisplayColumnsList.add(columnDef.getColumnId());
			}
			columnIterator = arrColumnsList.iterator();
			// Include grouped by columns as separate columns in the exported
			while (columnIterator.hasNext())
			{
				ColumnDefinition colDef = columnIterator.next();
				strHidden = colDef.getStrHidden();
				strColHeaderType = headerTypeMap.get(colDef.getDataType());
				logger.ctdebug("CTRND00362", colDef.getDataType(), strColHeaderType);
				if (!colDef.isVisible() || ViewDefinitionConstants.VAL_BOOL_YES.equals(strHidden)
						|| colDef.getColumnId().equals(ListViewConstants.CONTEXT))
					continue;
				simpleExportDataColumnHeader = new SimpleExportDataColumnHeaderValueObject(colDef.getColumnId(),
						colDef.getColumnDisplayNameKey(), strColHeaderType);
				simpleExportData.addColumnHeader(simpleExportDataColumnHeader);
				arrDisplayColumnsList.add(colDef.getColumnId());
			}
			logger.ctdebug("CTRND00363", arrDisplayColumnsList);
			Iterator rowsIterator = listViewData.iterator();
			SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
			while (rowsIterator.hasNext())
			{
				HashMap<String, Object> hmDataMap = (HashMap<String, Object>) rowsIterator.next();
				logger.ctdebug("CTRND00364", hmDataMap);
				HashMap<String, Object> hmDisplayDataMap = new HashMap<String, Object>();
				Iterator<String> displayColumnsIterator = arrDisplayColumnsList.iterator();
				while (displayColumnsIterator.hasNext())
				{
					String colId = displayColumnsIterator.next();
					logger.ctdebug("CTRND00365", colId, hmDataMap.get(colId));
					if (lUtil.isDateField(viewDef.getViewId(), colId))
					{

						Object dateTemp = hmDataMap.get(colId);
						Class dateClass = Date.class;
						if (dateTemp != null && dateClass.isInstance(dateTemp))
						{
							dateFormat = (Date) dateTemp;
							formatedDate = globalPreferencesUtil.userPrefFormatDate(sessionInfo.mDateFormat,
									sessionInfo.mTimeZoneId, dateFormat);

						} else
						{
							dateStrVal = (String) hmDataMap.get(colId);
							if (dateStrVal != null && !"".equals(dateStrVal))
							{
								dateStrFormattedVal = dateStrVal;
								logger.ctdebug("CTRND00366", dateStrFormattedVal);
								try
								{
									dateFormat = formatter.parse(dateStrFormattedVal);

									formatedDate = globalPreferencesUtil.userPrefFormatDate(sessionInfo.mDateFormat,
											sessionInfo.mTimeZoneId, dateFormat);
									logger.ctdebug("CTRND00367", dateFormat);
								} catch (ParseException e)
								{
									logger.ctdebug("CTRND00368", e, dateStrFormattedVal);
									formatedDate = dateStrFormattedVal;
								}
							} else
							{
								formatedDate = "";
							}
						}

						hmDisplayDataMap.put(colId, formatedDate);

					} else if (lUtil.isTimeField(viewDef.getViewId(), colId))
					{
						dateStrVal = (String) hmDataMap.get(colId);
						if (dateStrVal != null && !"".equals(dateStrVal))
						{
							dateStrFormattedVal = dateStrVal;
							logger.ctdebug("CTRND00366", dateStrFormattedVal);
							formatedDate = globalPreferencesUtil.formatUserPrefDateTime(DateFormatterManager.getJavaDateFormat(sessionInfo.mDateFormat) 
									+" "+sessionInfo.timeFormat,
									dateStrFormattedVal);
							logger.ctdebug("CTRND00367", formatedDate);
						} else
						{
							formatedDate = "";
						}

						hmDisplayDataMap.put(colId, formatedDate);
					} else if (lUtil.isNumberField(viewDef.getViewId(), colId))
					{
						// This is an amount column. Ensure that the amount is
						// formatted to 2 decimal places at the minimum
						hmDisplayDataMap.put(colId, (hmDataMap.get(colId) != null) ? hmDataMap.get(colId)
								: new Float(0));
					} else
					{

						hmDisplayDataMap.put(colId, (hmDataMap.get(colId) != null) ? hmDataMap.get(colId) : "");

					}
				}
				simpleExportData.addExportData(hmDisplayDataMap);
			}
			logger.ctdebug("CTRND00369", simpleExportData.getExportData());
			logger.ctdebug("CTRND00370", simpleExportData.getColumnHeaders());
			simpleExportData.setReportId(viewDef.getViewId());

			boolean isSystemView = viewDef.isPreDefinedView();

			if (isSystemView)
			{

				simpleExportData.setReportHeader(MessageManager.getMessage(bundleKey, viewDef.getViewName(), langCode,
						true));
			} else
			{

				simpleExportData.setReportHeader(viewDef.getViewName()); // To Change the Header
			}

		} catch (ProcessingErrorException e)
		{
			logger.cterror("CTRND00371", e);
		}

		if (pdfFilePath == null || "".equals(pdfFilePath))
		{
			logger.cterror("CTRND00372");

			return simpleExportData;

		}
		try
		{ // code cleanup try block included
			String pdfFullPath = pdfFilePath + "/" + pdfFileName + ".pdf";

			String rawString = (String) inputParams.get("HTMLDATA");//Export changes by Nithish
			byte[] rawBytes = rawString.getBytes("iso-8859-1");//By default, encoding will be in iso-8859-1
			String svgString = new String(rawBytes,"UTF-8");// Here the bytes in iso-8859-1 format will be encoded in UTF-8

			String str = null;

			String chartcssContent = read(iportalPath + "/css/custom.css");

			chartcssContent = chartcssContent.replaceAll("../images", iportalPath + "/images");
			/**
			 * buf=buf.replaceAll("chartContainer","chartContainerpdf"); buf=buf.replaceAll("legend","legendpdf");
			 * buf=buf.replaceAll("rMargin","rMarginpdf"); buf=buf.replaceAll("bMargin","bMarginpdf");
			 */
			svgString = svgString.replaceAll("â?¹","\u20B9");
			svgString = svgString.replaceAll("â","");
			//svgString = svgString.replaceAll("visibility=\"\" ", " ");

			InputStream in = null;

			// try { // code cleanup try block commented here.
			int height = 1050;// extractstyleHeight(buf);
			int width = 1430;// extractstyleWidth(buf);

			// converting svgstring into image file
			/**
			 * if(height < 550 || height > 550){ height = 1050; }
			 * 
			 * if(width < 550 || width > 550){ width = 1030; }
			 */

			Document document = new Document();
			Rectangle area = new Rectangle(width + 80, height - 50);
			document.setPageSize(area);
			document.setMargins(10, 10, 10, 10);
			String reqID = new Log4jMDCInitializer().getCurrentRequestId();
			SVGConverter converter = new SVGConverter();
			try
			{
				PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFullPath));
				document.open();
				// document.add(new Paragraph("SVG Example111"));

				PdfContentByte cb = writer.getDirectContent();
				PdfTemplate template = cb.createTemplate(width + 80, height);
				//Graphics2D g2 = template.createGraphics(width + 80, height);
				//PrintTranscoder prm = new PrintTranscoder();

				//BufferedImage bi = new BufferedImage(width + 80, height, BufferedImage.TYPE_INT_ARGB);
				//Graphics g = bi.createGraphics();
				// Changes made by Nithish.G For SL Starts
				BufferedWriter bufferedSvgWriter = new BufferedWriter(new OutputStreamWriter
						(new FileOutputStream(new File(pdfImagePath + File.separator + reqID + ".svg")),"UTF8"));
				bufferedSvgWriter.write(svgString);
				bufferedSvgWriter.close();
				converter.renderAsPng((pdfImagePath + File.separator + reqID + ".svg").replace('/', '\\'),"image/png",width+100);
				// Changes made by Nithish.G For SL Ends

				PageFormat pg = new PageFormat();
				Paper pp = new Paper();
				pp.setSize(width, height);
				pp.setImageableArea(0, 0, width + 80, height);
				pg.setPaper(pp);
				//prm.print(g2, pg, 0);
				//prm.print(g, pg, 0);
				//Image i = ImageIO.read(new File(pdfImagePath + File.separator + reqID + ".png"));
				
				com.lowagie.text.Image image = com.lowagie.text.Image.getInstance((pdfImagePath + File.separator + reqID + ".png"));
				//document.add((Element) new Phrase("\n\n\n\n\n\n\n\n\n\n"));
				document.add(image);
				//document.add((Element) new Phrase("\n\n\n\n\n\n\n\n\n\n"));
				document.newPage();
				
		} catch (DocumentException e)
			{
				/** System.err.println(e); */
			} catch (IOException e)
			{
				/** System.err.println(e); */
			}
			document.close();

		} catch (Exception e)
		{
			e.printStackTrace();
				
			return simpleExportData;
		}
		/**
		 * HashMap exportDataMap = new HashMap(); exportDataMap.put("GRAPH_FILE_NAME", pdfFileName);
		 * exportDataMap.put("GRAPH_FILE_PATH", pdfFullPath); simpleExportData.addExportAdditionalData(exportDataMap);
		 */
		return simpleExportData;

	}

	/**
	 * to read the file
	 * 
	 * @param file
	 * @return String
	 * @exception FileNotFoundException,IOException
	 */
	private String read(String file)
	{

		StringBuffer strContent = new StringBuffer();

		URL chartcss = null;

		BufferedReader in = null;

		try
		{
			chartcss = new URL(file);
			in = new BufferedReader(new InputStreamReader(chartcss.openStream()));

			int ch;

			while ((ch = in.read()) != -1)
				strContent.append((char) ch);

			/**
			 * To close the FileInputStream, use void close() method of FileInputStream class.
			 * 
			 * close method also throws IOException.
			 */
			in.close();

		} catch (FileNotFoundException e)
		{
			logger.cterror("CTRND00373", e, file);
		} catch (IOException ioe)
		{
			logger.cterror("CTRND00374", ioe, file);
		} finally
		{
			try
			{
				if (in != null)
					in.close();
			} catch (Exception exObj)
			{
				logger.cterror("CTRND00374", exObj, file);
			}
		}

		return strContent.toString();

	}

	/**
	 * private int extractstyleHeight(String svg) {
	 * 
	 * int height = 0;
	 * 
	 * String result = "";
	 * 
	 * Pattern regex = Pattern .compile("\\<((svg)|(SVG))(.*?)((height)|(HEIGHT))(.*?)\\d\""); Matcher m =
	 * regex.matcher(svg);
	 * 
	 * while (m.find()) { result = m.group();
	 * 
	 * Matcher m2 = Pattern.compile(" ((HEIGHT)|(height))(.*?)\\d\"").matcher( result);
	 * 
	 * if (m2.find()) { String s = m2.group().trim(); Matcher matcher = Pattern.compile("\\d+").matcher(s);
	 * matcher.find(); height = Integer.valueOf(matcher.group()); } break; } return height;
	 * 
	 * }
	 * 
	 * private int extractstyleWidth(String svg) {
	 * 
	 * int width = 0;
	 * 
	 * String result = "";
	 * 
	 * Pattern regex = Pattern .compile("\\<((svg)|(SVG))(.*?)((width)|(WIDTH))(.*?)\\d\""); Matcher m =
	 * regex.matcher(svg);
	 * 
	 * while (m.find()) { result = m.group(); Matcher m2 = Pattern.compile(" ((WIDTH)|(width))(.*?)\\d\"").matcher(
	 * result);
	 * 
	 * if (m2.find()) { String s = m2.group().trim(); Matcher matcher = Pattern.compile("\\d+").matcher(s);
	 * matcher.find(); width = Integer.valueOf(matcher.group()); } break; } return width; }
	 */
	/**
	 * to execute portlet action
	 * 
	 * @param action
	 * @param sessionInfo
	 * @param actionMap
	 * @param requestParams
	 * @param request
	 * @return ReplyObject
	 * @throws OrbiActionException
	 * @see com.intellectdesign.canvas.action.PortletAction#executePortletActionUsing(java.lang.String,
	 *      com.intellectdesign.canvas.login.sessions.SessionInfo, com.intellectdesign.canvas.web.config.ActionMap, java.util.Map,
	 *      javax.servlet.http.HttpServletRequest)
	 */
	@Override
	public ReplyObject executePortletActionUsing(String action, SessionInfo sessionInfo, ActionMap actionMap,
			Map requestParams, HttpServletRequest request) throws OrbiActionException
	{
		return null;
	}

	private static Map<String, String> headerTypeMap = new HashMap<String, String>();
	static
	{
		headerTypeMap.put(ViewDefinitionConstants.DATA_TYPE_NUMBER, "N");
		headerTypeMap.put(ViewDefinitionConstants.DATA_TYPE_DATE, "D");
		headerTypeMap.put(ViewDefinitionConstants.DATA_TYPE_TIMESTAMP, "D");
		headerTypeMap.put(ViewDefinitionConstants.DATA_TYPE_NUMBER_EQ_CCY, "N");
		headerTypeMap.put("", "");
		headerTypeMap.put(null, "");
	}
}
