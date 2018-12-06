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
 */

package com.intellectdesign.canvas.servlets;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.intellectdesign.canvas.action.PortletAction;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.constants.common.JSPIOConstants;
import com.intellectdesign.canvas.data.conversion.util.HashMapToJSONConverter;
import com.intellectdesign.canvas.exceptions.common.OnlineException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.formdefinition.FormDefinitionConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.login.sessions.SessionManager;
import com.intellectdesign.canvas.web.config.ActionMap;
import com.intellectdesign.canvas.web.config.ActionMapRegistry;
import com.oreilly.servlet.multipart.FilePart;
import com.oreilly.servlet.multipart.MultipartParser;
import com.oreilly.servlet.multipart.Part;

/**
 * This class is expected to receive the request in multipart/form-data.The multiparser class which parses the request
 * and reads the file in form of bytes.Based on properties this class expects the path to upload the file and maximum
 * file size which will not upload the files beyond the file size.
 * 
 * @version 1.0
 */

public class PanelFileUploadServlet extends HttpServlet
{

	private static final long serialVersionUID = 2472882378836694623L;
	ServletContext sc = null;
	SessionManager mSessionMan = null;

	public void init(ServletConfig config) throws ServletException
	{
		super.init(config);
		sc = config.getServletContext();
		mSessionMan = SessionManager.getInstance();
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException,
			FileNotFoundException, IOException
	{
		doPost(request, response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException,
			FileNotFoundException, IOException
	{

		LOGGER.ctinfo("CTRND00288");
		response.setContentType("text/html");
		// Set to expire far in the past.
		response.setHeader("Expires", "Sat, 6 May 1995 12:00:00 GMT");
		// Set standard HTTP/1.1 no-cache header s.
		response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
		// Set standard HTTP/1.0 no-cache header.
		response.setHeader("Pragma", "no-cache");

		SessionInfo Session = null;
		String isValidSession = null;
		String usernumber = null;
		String strGCIF = null;
		String SessionID = null;
		String status = null;
		String product = null;
		String subproduct = null;
		String functionCode = null;
		String screenCode = null;
		String formId = request.getParameter("Form-Id");
		String itemId = request.getParameter("Item-Id");
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		HashMap<String, Object> dataMap = new HashMap<String, Object>();

		/**
		 * Invoking the validate session method and retreiving the user no to append the uploaded filename with user no
		 */

		isValidSession = mSessionMan.validateSession(request);
		if (!"success".equals(isValidSession))
		{
			LOGGER.ctdebug("CTRND00181");
			// Redirecting to logout url page if the session is null
			
			boolean hybridRequest =request.getParameter("isHybrid") != null && request.getParameter("isHybrid").equals("H") ?true:false;
			if(hybridRequest) {
			return;
			}
			forwardToLogoutPage(request, response);
		}

		Session = mSessionMan.getUserSessionInfo(request);
		try
		{

			LOGGER.ctdebug("CTRND00182", SessionID);
			request.setAttribute(FrameworkConstants.SESSIONID, SessionID);
			request.setAttribute(FrameworkConstants.SESSION, Session);
			request.setAttribute(FormDefinitionConstants.FORM_ID, formId);
			request.setAttribute(FormDefinitionConstants.ITEM_ID, itemId);

			usernumber = Session.userNo;
			strGCIF = Session.sCustNo;
			SessionID = Session.sessionId;
			int fileAllocatedSize = getMaxAllowedFileSize();
			String fileSizeValidationStatus = validateFileSize(request, fileAllocatedSize);
			if (fileSizeValidationStatus != null)
			{
				response.flushBuffer();
				response.getWriter().write(fileSizeValidationStatus);
				return;
			}
			List<HashMap<String, Object>> fileDetails = getFileDetails(request, response, fileAllocatedSize,
					usernumber, strGCIF);
			request.setAttribute(FormDefinitionConstants.FILE_DETAILS, fileDetails);
			PortletAction action = null;
			String actionClass = null;

			ActionMapRegistry actionMapRegistry = ActionMapRegistry.getDefaultInstance();

			ActionMap actionMap = null;
			product = request.getParameter(FrameworkConstants.PRODUCT_NAME);
			if (product == null)
				LOGGER.ctdebug("CTRND00183", FrameworkConstants.PRODUCT_NAME);

			subproduct = request.getParameter(FrameworkConstants.SUB_PRODUCT_NAME);
			if (subproduct == null)
				LOGGER.ctdebug("CTRND00184", FrameworkConstants.SUB_PRODUCT_NAME);

			functionCode = request.getParameter(JSPIOConstants.INPUT_FUNCTION_CODE);
			if (functionCode == null)
				LOGGER.ctdebug("CTRND00185", JSPIOConstants.INPUT_FUNCTION_CODE);

			screenCode = request.getParameter(FrameworkConstants.PAGE_CODE_TYPE);
			if (screenCode == null)
				LOGGER.ctdebug("CTRND00186", FrameworkConstants.PAGE_CODE_TYPE);

			actionMap = (ActionMap) actionMapRegistry.lookup(screenCode, product, subproduct, functionCode);

			if (actionMap != null)
			{
				actionClass = (actionMap.getActionClass() == null) ? "com.intellectdesign.iportal.ws.framework.PortletAction"
						: actionMap.getActionClass();
			}

			action = (PortletAction) Class.forName(actionClass).newInstance();
			try
			{
				status = action.executePortletAction(Session, actionMap, request);
			} catch (Exception ex)
			{
				throw new ProcessingErrorException(ex.getMessage());
			}

		} catch (ProcessingErrorException ex)
		{
			LOGGER.cterror("CTRND00187", ex);
			resultMap.put("success", "false");
			dataMap.put("response", "Exception");
			dataMap.put("error", "Exception occured while uploading the file.");
			resultMap.put("response", dataMap);
			status = HashMapToJSONConverter.convertHashMapToJSONFormat(resultMap);
		} catch (OnlineException ex)
		{
			LOGGER.cterror("CTRND00188", ex);
			resultMap.put("success", "false");
			dataMap.put("response", "Exception");
			dataMap.put("error", "Exception occured while uploading the file.");
			resultMap.put("response", dataMap);
			status = HashMapToJSONConverter.convertHashMapToJSONFormat(resultMap);
		} catch (FileNotFoundException e)
		{
			LOGGER.cterror("CTRND00189", e);
			resultMap.put("success", "false");
			dataMap.put("response", "File Not Found");
			dataMap.put("error", "File Not Found.");
			resultMap.put("response", dataMap);
			status = HashMapToJSONConverter.convertHashMapToJSONFormat(resultMap);
		} catch (IOException e)
		{
			LOGGER.cterror("CTRND00190", e);
			ConfigurationManager configMgr = ConfigurationManager.getInstance();
			String userFileSize = configMgr.getCompPrefDescriptor().getMaximumFileSize();
			if (userFileSize == "" || userFileSize.equals(""))
			{
				userFileSize = "10";
			}
			resultMap.put("success", "false");
			dataMap.put("error", "FileSizeExceeds");
			dataMap.put("size", userFileSize + "MB");
			dataMap.put("attachmentRefNumber", "");
			resultMap.put("response", dataMap);
			status = HashMapToJSONConverter.convertHashMapToJSONFormat(resultMap);
		} catch (Exception e)
		{
			LOGGER.cterror("CTRND00191", e);
			resultMap.put("success", "false");
			dataMap.put("response", "Exception");
			dataMap.put("error", "Exception occured while uploading the file.");
			resultMap.put("data", dataMap);
			status = HashMapToJSONConverter.convertHashMapToJSONFormat(resultMap);
		}

		LOGGER.ctinfo("CTRND00291");
		/**
		 * Converting the given map to a jsonstring
		 */
		response.flushBuffer();
		response.getWriter().write(status);
		return;

	}
	/**
	 * Forwading to logout page if session is invalid
	 * 
	 * @param request
	 * @param response
	 */
	private void forwardToLogoutPage(HttpServletRequest request, HttpServletResponse response)
	{
		try
		{
			LOGGER.ctdebug("Forwarding to Logout Page...");
			mSessionMan.routeToLogoutPage(request, response);
		} catch (Exception ex)
		{
			LOGGER.cterror(
					"An exception while auditing a processing error exception during userlogout in PortalLoginServlet",
					ex);
		}
	}

	/**
	 * Retrieves the image stream from the request.
	 * 
	 * @param request
	 * @return
	 * @throws IOException
	 * @throws ProcessingErrorException 
	 */
	private List<HashMap<String, Object>> getFileDetails(HttpServletRequest request, HttpServletResponse response,
			int fileAllocatedSize, String usernumber, String strGCIF) throws IOException, ProcessingErrorException
	{

		ArrayList<HashMap<String, Object>> multiPartFileDetails = new ArrayList<HashMap<String, Object>>();
		MultipartParser mp = new MultipartParser(request, fileAllocatedSize);
		Part part=null;
		ByteArrayOutputStream bOut;

		/**
		 * Multiparsers readNextPart method to find the params and file part from the request
		 * */

		HashMap<String, Object> fileContentMap = null;
		HashMap<String, Object> fileBytes = null;
		String attachmentRefNumber = null;
		FilePart filePart = null;
		while ((part = mp.readNextPart()) != null)
		{

			// Checking if the part is file
			if (part.isFile())
			{

				filePart = (FilePart) part;

				String fileName = filePart.getFileName();
				if (fileName != null)
				{
					String fileExt = "";
					int k = fileName.lastIndexOf(".");
					if (k != -1)
					{
						fileExt = fileName.substring(k);
					}

					bOut = new ByteArrayOutputStream();
					try
					{
						/**
						 * Get the file contents as ByteArrayOutputStream and set in vector. It will be write in a file
						 * in app layer.
						 * */
						attachmentRefNumber = java.util.UUID.randomUUID().toString();
						String randomeName = attachmentRefNumber + "_" + usernumber;
						String fileToRename = fileName.substring(0, fileName.lastIndexOf(".")) + "_" + randomeName
								+ fileExt;
						long size = filePart.writeTo(bOut);
						bOut.flush();
						byte[] fileContentByteArray = bOut.toByteArray();

						long allocatedSize = fileAllocatedSize;
						if (size < allocatedSize)
						{
							fileContentMap = new HashMap<String, Object>();

							/**
							 * Generating pseudo random number generator with user no to append the file name with this
							 * generated no to avoid the same file upload conflicts
							 */
						

							/**
							 * Constructing the file content map.
							 * */
							fileBytes = new HashMap<String, Object>();
							fileBytes.put("BYTES", fileContentByteArray);
							fileContentMap.put("FILE_CONTENT", fileBytes); // File
							// content

							fileContentMap.put(JSPIOConstants.INPUT_USER_NO, usernumber); // UserNo
							fileContentMap.put(JSPIOConstants.INPUT_GCIF, strGCIF); // GCIFNo
							fileContentMap.put("INPUT_ACTION", "FILEATTACH_ACTION"); // Input
																						// Action
							fileContentMap.put("ATTACHMENT_FILE_SIZE", Long.toString(size)); // File Size
							fileContentMap.put("ATTACHMENT_REF_NUM", attachmentRefNumber); // Attachment
																							// Refnumber
							fileContentMap.put("ATTACHMENT_FILE_NAME", fileName); // Original File Name
							fileContentMap.put("ATTACHMENT_REF_FILE_NAME", fileToRename); // New File Name

						}

					} catch (Exception e)
					{
						LOGGER.cterror("CTRND00192", e);
						if(e.getLocalizedMessage().equals("unexpected end of part")){
							throw new ProcessingErrorException(e.getMessage());
						}

					} finally
					{
						/**
						 * Closing the byte array output stream.
						 * */
						if(bOut!=null){
						bOut.close();
						}
					}

				}
				multiPartFileDetails.add(fileContentMap);

			}
		}
		return multiPartFileDetails;
	}

	/**
	 * Fetch the file upload size
	 * 
	 * @return max file upload size
	 */
	private int getMaxAllowedFileSize()
	{
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		String userFilesSize = configMgr.getCompPrefDescriptor().getMaximumFileSize();
		LOGGER.ctdebug("CTRND00193", userFilesSize);
		int fileSize = 0;
		try
		{
			/*
			 * Converting the file size form double to int due ti which multiparser file accepts the filesize in
			 * integerFrameworkConstants
			 */
			fileSize = (int) (1024 * 1024 * (Double.parseDouble(userFilesSize)));
		} catch (NumberFormatException e)
		{
			LOGGER.cterror("CTRND00194");
			fileSize = 10485760;
		}
		return fileSize;
	}

	/**
	 * Validating the the uploaded file size. if it returns null, the file size withothin the limit, otherwise return
	 * the error status
	 * 
	 * @param request
	 * @return
	 */
	private String validateFileSize(HttpServletRequest request, long fileAllocatedSize)
	{
		/**
		 * If the requests content length exceeds the max file size ,the appropriate response will be triggered to the
		 * client
		 */
		String status = null;
		if (request.getContentLength() > fileAllocatedSize)
		{
			ConfigurationManager configMgr = ConfigurationManager.getInstance();
			String userFileSize = configMgr.getCompPrefDescriptor().getMaximumFileSize();
			if (userFileSize == "" || userFileSize.equals(""))
			{
				userFileSize = "10";
			}
			HashMap<String, Object> resultMap = new HashMap<String, Object>();
			HashMap<String, Object> dataMap = new HashMap<String, Object>();
			resultMap.put("success", "false");
			dataMap.put("error", "FileSizeExceeds");
			dataMap.put("size", userFileSize + "MB");
			dataMap.put("attachmentRefNumber", "");
			resultMap.put("response", dataMap);
			/**
			 * Converting the given map to a jsonstring
			 */
			status = HashMapToJSONConverter.convertHashMapToJSONFormat(resultMap);
			LOGGER.ctdebug("CTRND00195", status);
		}
		return status;
	}

	private static final Logger LOGGER = Logger.getLogger(PanelFileUploadServlet.class);
}
