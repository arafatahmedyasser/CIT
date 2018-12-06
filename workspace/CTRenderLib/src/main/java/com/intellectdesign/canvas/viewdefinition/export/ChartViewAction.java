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

package com.intellectdesign.canvas.viewdefinition.export;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URL;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.tidy.Tidy;
import org.xhtmlrenderer.pdf.ITextRenderer;

import com.intellectdesign.canvas.action.PortletAction;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ExportConfigurationDescriptor;
import com.intellectdesign.canvas.datahandler.RequestParamsHandler;
import com.intellectdesign.canvas.exceptions.action.OrbiActionException;
import com.intellectdesign.canvas.exportdata.IExportDataProvider;
import com.intellectdesign.canvas.exportdata.IExportDataValueObject;
import com.intellectdesign.canvas.exportdata.SimpleExportDataValueObject;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.login.sessions.SessionManager;
import com.intellectdesign.canvas.web.config.ActionMap;

/**
 * Class for Chart view action which extends PortletAction and implements IExportData Provider
 * 
 * @version 1.0
 * 
 */
public class ChartViewAction extends PortletAction implements IExportDataProvider
{

	private static final Logger logger = Logger.getLogger(ChartViewAction.class);
	private static final String ORG_PDF_FILE_PATH = "ORG_PDF_FILE_PATH";
	private static final String IPORTAL_REFERENCE = "IPORTAL_REFERENCE";

	/**
	 * to get the export data
	 * 
	 * @param request
	 * @param actionMap
	 * @return IExportDataValueObject
	 * @see com.intellectdesign.canvas.exportdata.IExportDataProvider#getExportData(javax.servlet.http.HttpServletRequest,
	 *      com.intellectdesign.canvas.web.config.ActionMap)
	 */
	public IExportDataValueObject getExportData(HttpServletRequest request, ActionMap actionMap)
	{

		SessionManager lSessionManager = SessionManager.getInstance();
		SessionInfo sessionInfo = null;

		if (!"success".equals(lSessionManager.validateSession(request)))
		{
			logger.cterror("CTRND00332");
			return null;

		}

		sessionInfo = lSessionManager.getUserSessionInfo(request);

		if (sessionInfo == null)
		{
			logger.cterror("CTRND00332");
			return null;
		}
		SimpleExportDataValueObject simpleExportData = new SimpleExportDataValueObject();

		Map inputParams = new RequestParamsHandler().getParameterSet(request);
		logger.ctdebug("CTRND00333", inputParams);
		String pdfFileName = "ORGView_" + sessionInfo.userNo + new Date().getTime();
		logger.ctdebug("CTRND00334", pdfFileName);
		ConfigurationManager confMgr = ConfigurationManager.getInstance();
		ExportConfigurationDescriptor exportDescriptor = confMgr.getExportDescriptor();
		String pdfFilePath = exportDescriptor.getOrgPDFPath();
		logger.ctdebug("CTRND00335", pdfFilePath);

		String iportalPath = exportDescriptor.getContextPath();

		if (pdfFilePath == null || "".equals(pdfFilePath))
		{
			logger.cterror("CTRND00336");
			return simpleExportData;
		}

		String pdfFullPath = pdfFilePath + "/" + pdfFileName + ".pdf";
		logger.ctdebug("CTRND00337", pdfFullPath);
		String buf = (String) inputParams.get("HTMLDATA");
		logger.ctdebug("CTRND00338", buf);
		String str = null;
		String tempfolderPath = exportDescriptor.getXmlFolderPath();
		String chartcssContent = read(tempfolderPath + "/TempORG/org.css");
		logger.ctdebug("CTRND00339", chartcssContent);
		chartcssContent = chartcssContent.replaceAll("images", "file:///"+tempfolderPath + "/TempORG/images");
		logger.ctdebug("CTRND00340", chartcssContent);
		buf = buf.replaceAll("chartContainer", "chartContainerpdf");
		buf = buf.replaceAll("legend", "legendpdf");
		buf = buf.replaceAll("rMargin", "rMarginpdf");
		buf = buf.replaceAll("bMargin", "bMarginpdf");
		buf = buf.replaceAll("&nbsp;", " ");

		logger.ctdebug("CTRND00341", buf);

		InputStream in = null;
		OutputStream outpdf = null;

		Tidy tidy = new Tidy();
		try
		{
			tidy.setXHTML(true);
			tidy.setShowWarnings(false);
			tidy.setIndentContent(false);
			tidy.setQuoteAmpersand(true);
			tidy.setQuiet(false);
			tidy.setQuoteNbsp(true);
			tidy.setRawOut(false);
			tidy.setHideComments(true);
			tidy.setForceOutput(true);
			tidy.setPrintBodyOnly(true);
			tidy.setDropEmptyParas(true);

			in = new ByteArrayInputStream(buf.getBytes());
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			tidy.parse(in, out);
			str = new String(out.toByteArray());

			logger.ctdebug("CTRND00342", tidy);
			logger.ctdebug("CTRND00343", str);
			int height = extractstyleHeight(buf) + 130;
			int width = extractstyleWidth(buf) + 130;

			if (height < 550)
			{
				height = 550;
			}

			if (width < 550)
			{
				width = 550;
			}

			String finalcontent = "<html><head><style language='text/css'>" + chartcssContent
					+ "@page rotated { size: " + width + "px " + height
					+ "px;} body { page : rotated }</style></head><body><div>" + str + "</div></body></html>";

			logger.ctdebug("CTRND00344", finalcontent);

			DocumentBuilderFactory docfac = DocumentBuilderFactory.newInstance();
			DocumentBuilder builder = docfac.newDocumentBuilder();
			Document doc = builder.parse(new ByteArrayInputStream(finalcontent.getBytes()));
			logger.ctdebug("CTRND00345", doc);
			ITextRenderer renderer = new ITextRenderer();
			renderer.setDocument(doc, null);
			outpdf = new java.io.FileOutputStream(new File(pdfFullPath));
			logger.ctdebug("CTRND00346", outpdf);
			renderer.layout();

			renderer.createPDF(outpdf);
			renderer.finishPDF();

			// document = PDDocument.load(in,true);
			/**
			 * PDDocument document = null;
			 * 
			 * PDFParser parser = new PDFParser(new BufferedInputStream(in),null, true); parser.parse();
			 * document=parser.getPDDocument(); String imageFormat = "jpg"; int startPage = 1; int endPage =
			 * Integer.MAX_VALUE; String password = ""; String outputPrefix = pdfFilePath + "/"+pdfFileName;
			 * 
			 * 
			 * 
			 * PDFImageWriter imageWriter = new PDFImageWriter();
			 * imageWriter.writeImage(document,imageFormat,password,startPage,endPage,outputPrefix);
			 */

		} catch (Exception e)
		{
			logger.cterror("CTRND00347", e);
			return simpleExportData;
		} finally
		{
			try
			{
				if (outpdf != null)
					outpdf.close();

			} catch (Exception exObj)
			{
				logger.cterror("CTRND00348", exObj);
			}
		}

		HashMap exportDataMap = new HashMap();
		exportDataMap.put("ORG_FILE_NAME", pdfFileName);
		exportDataMap.put("ORG_FILE_PATH", pdfFullPath);
		simpleExportData.addExportAdditionalData(exportDataMap);

		return simpleExportData;

	}

	/**
	 * to read the string
	 * 
	 * @param file
	 * @return String
	 */
	private String read(String file)
	{

		StringBuffer strContent = new StringBuffer();
		//URL chartcss = null;

		BufferedReader in = null;

		try
		{
			File chartcss = new File(file);
			//in = new BufferedReader(new InputStreamReader(chartcss.openStream()));
			in = new BufferedReader(new FileReader(chartcss));

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
			logger.cterror("CTRND00349", file);
		} catch (IOException ioe)
		{
			logger.cterror("CTRND00350", ioe, file);
		} finally
		{
			try
			{
				if (in != null)
					in.close();
			} catch (Exception exObj)
			{
				logger.cterror("CTRND00348", exObj);
			}
		}

		return strContent.toString();
	}

	private int extractstyleHeight(String css)
	{

		int top = 0;

		String result = "";

		Pattern regex = Pattern.compile("\\<((div)|(DIV))(.*?)bottomMargin(.*?)\\>");
		Matcher m = regex.matcher(css);

		while (m.find())
		{
			result = m.group();

			Matcher m2 = Pattern.compile("((TOP)|(top))(.*?)((PX)|(px))").matcher(result);

			if (m2.find())
			{
				String s = m2.group().trim();
				Matcher matcher = Pattern.compile("\\d+").matcher(s);
				matcher.find();
				top = Integer.valueOf(matcher.group());
			}
			break;
		}
		return top;

	}

	private int extractstyleWidth(String css)
	{

		int left = 0;

		String result = "";

		Pattern regex = Pattern.compile("\\<((div)|(DIV))(.*?)rightMargin(.*?)\\>");
		Matcher m = regex.matcher(css);

		while (m.find())
		{
			result = m.group();

			Matcher m1 = Pattern.compile("((LEFT)|(left))(.*?)((PX)|(px))").matcher(result);

			if (m1.find())
			{
				String s = m1.group().trim();
				Matcher matcher = Pattern.compile("\\d+").matcher(s);
				matcher.find();
				left = Integer.valueOf(matcher.group());
			}
			break;
		}
		return left;

	}

	@Override
	public ReplyObject executePortletActionUsing(String action, SessionInfo sessionInfo, ActionMap actionMap,
			Map requestParams, HttpServletRequest request) throws OrbiActionException
	{
		return null;
	}

}
