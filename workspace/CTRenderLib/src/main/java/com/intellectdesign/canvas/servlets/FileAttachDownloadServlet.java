/**
    COPYRIGHT NOTICE

    Copyright 2011 Polaris Software Lab Limited. All rights reserved.

    These materials are confidential and proprietary to 
    Polaris Software Lab Limited and no part of these materials should
    be reproduced, published, transmitted or distributed in any form or
    by any means, electronic, mechanical, photocopying, recording or 
    otherwise, or stored in any information storage or retrieval system
    of any nature nor should the materials be disclosed to third parties
    or used in any other manner for which this is not authorized, without
    the prior express written authorization of Polaris Software Lab Limited.
 */
/**
 * <pre>
 * ----------------------------------------------------------------------------------------------------------------
 * CHANGE CODE 	             	AUTHOR 				DESCRIPTION 										DATE
 * ----------------------------------------------------------------------------------------------------------------
 * CHG0001_OT0138_INFO_RPT_FW   Murali R			Resource name updated                               10 Oct 2012    																	
 * ----------------------------------------------------------------------------------------------------------------
 * </pre>
 */
package com.intellectdesign.canvas.servlets;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.List;
import java.util.ResourceBundle;
import java.util.Vector;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.data.conversion.util.HashMapToJSONConverter;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.login.sessions.SessionManager;

/**
 * @author koijam.balesh Servlet that can be used for file attachement download / report download.
 * 
 */
public class FileAttachDownloadServlet extends HttpServlet
{

	SessionInfo Session = null;
	SessionManager lSessMan = null;
	String SessionID = null;

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		doPost(request, response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		logger.ctdebug("CTREP00627", HashMapToJSONConverter.convertHashMapToJSONFormat(request.getParameterMap()));
		String strGCIF = "-1";
		String strUserNo = "-1";
		boolean status = false;
		String strLang = null;
		try
		{

			lSessMan = SessionManager.getInstance();
			String strAction = request.getParameter("INPUT_ACTION");
			String downloadFileInServer = request.getParameter("DOWNLOAD_FILENAME");
			String fileNameToClient = request.getParameter("CLIENT_DOWNLOAD_FILENAME");
			String fileType = request.getParameter("FILE_TYPE");
			try
			{
				if (!"success".equals(lSessMan.validateSession(request)))
				{
					routeToLoginPage(request, response);
					return;
				}
				Session = lSessMan.getUserSessionInfo(request);
				strGCIF = Session.sCustNo;
				strUserNo = Session.userNo;
				strLang = Session.mLanguage;
				dispResLoader = ResourceBundle.getBundle("ReportingFW_" + strLang); // CHG0001_OT0138_INFO_RPT_FW

				if (Session == null)
				{
					routeToLoginPage(request, response);
					return;
				}
			} catch (Exception ex)
			{
				logger.cterror("CTREP00628", ex);
				throw new ProcessingErrorException(ex.getMessage());
			}

			SessionID = java.util.UUID.randomUUID().toString();
			if ((strAction != null && strAction.equalsIgnoreCase("FILEATTACH_DOWNLOAD_ACTION"))
					&& (downloadFileInServer != null && downloadFileInServer.trim().length() > 0)
					&& (fileNameToClient != null && fileNameToClient.trim().length() > 0)
					&& (fileType != null && fileType.trim().length() > 0))
			{
				ConfigurationManager config = ConfigurationManager.getInstance();
				String upload_Path = config.getInformationReportingDescriptor().getReportArchievedPath();
				String fileInServer = upload_Path + File.separator + strGCIF + File.separator + strUserNo
						+ File.separator + downloadFileInServer;
				logger.ctdebug("CTREP00629", fileInServer);
				BufferedInputStream fileReader = null;
				OutputStream outWriter = null;
				File inFile = new File(fileInServer);
				fileReader = new BufferedInputStream(new FileInputStream(inFile));
				outWriter = response.getOutputStream();
				byte abyte0[] = new byte[8192];
				int readCount = -1;
				logger.ctdebug("CTREP00630", fileNameToClient);
				fileNameToClient = fileNameToClient.replaceAll(" ", "_");
				logger.ctdebug("CTREP00631", fileNameToClient);
				response.setContentType("application/x-download");
				response.setHeader("Content-disposition", "attachment;filename=" + fileNameToClient);
				response.setHeader("Content-length", "" + inFile.length());
				while ((readCount = fileReader.read(abyte0, 0, 4096)) != -1)
				{
					outWriter.write(abyte0, 0, readCount);
				}
				fileReader.close();
				outWriter.flush();
				outWriter.close();
				status = true;

				Vector inputVector = new Vector();
				inputVector.add(0, request.getAttribute("SESSIONID"));
				inputVector.add(1, strGCIF);
				logger.ctdebug("CTREP00632", status);
			} else
			{
				logger.ctdebug("CTREP00633", status);
			}

		} catch (Exception ex)
		{
			try
			{
				PrintWriter outWriter = response.getWriter();
				outWriter.write(dispResLoader.getString("ERR_MSG_DOWNLOAD"));
				outWriter.flush();
				outWriter.close();
			} catch (IOException ioExp)
			{
				logger.cterror("CTREP00634", ioExp);
			} catch (Exception exp)
			{
				logger.cterror("CTREP00634", exp);
			}

			request.setAttribute("errmsg", ex.getMessage());
			logger.cterror("CTREP00634", ex);
		}
	}

	protected List<String> getDateFieldList(String action)
	{
		return null;
	}

	protected List<String> getDateFieldList(String action, String functionCode)
	{
		return null;
	}

	protected void routeToLoginPage(HttpServletRequest request, HttpServletResponse response) throws IOException,
			ServletException
	{

		SessionManager sessionMngr = SessionManager.getInstance();
		request.setAttribute("ERROR_MESSAGE", "Invalid session!!");
		sessionMngr.routeToLoginPage(request, response);

	}

	private transient Logger logger = Logger.getLogger(FileAttachDownloadServlet.class);
	private static final long serialVersionUID = 1L;
	private static ResourceBundle dispResLoader = null;
}
