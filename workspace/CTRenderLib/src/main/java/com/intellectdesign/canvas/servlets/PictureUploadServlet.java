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
package com.intellectdesign.canvas.servlets;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.intellectdesign.canvas.action.PortletAction;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.constants.common.JSPIOConstants;
import com.intellectdesign.canvas.data.conversion.util.HashMapToJSONConverter;
import com.intellectdesign.canvas.deviceband.DeviceCategory;
import com.intellectdesign.canvas.exceptions.common.OnlineException;
import com.intellectdesign.canvas.formdefinition.FileUploadConstants;
import com.intellectdesign.canvas.formdefinition.FormDefinitionConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.login.sessions.SessionManager;
import com.intellectdesign.canvas.properties.MessageManager;
import com.intellectdesign.canvas.utils.StringUtils;
import com.intellectdesign.canvas.web.config.ActionMap;
import com.intellectdesign.canvas.web.config.ActionMapRegistry;
import com.oreilly.servlet.multipart.FilePart;
import com.oreilly.servlet.multipart.MultipartParser;
import com.oreilly.servlet.multipart.Part;

/**
 * A servlet class which is used for supporting uploading user image pictures *
 */
public class PictureUploadServlet extends HttpServlet
{

	private static final long serialVersionUID = -2379202075071472012L;

	/**
	 * This init method used for initialize the session information ,servlet configuration.
	 * 
	 * @param config
	 * @throws ServletException
	 * @see javax.servlet.GenericServlet#init(javax.servlet.ServletConfig)
	 */
	public void init(ServletConfig config) throws ServletException
	{
		super.init(config);

	}

	/**
	 * This init method used to call do post
	 * 
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 * @see javax.servlet.http.HttpServlet#doPost(javax.servlet.http.HttpServletRequest,
	 *      javax.servlet.http.HttpServletResponse)
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		processRequest(request, response);
	}

	/**
	 * his init method used to call do get
	 * 
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 * @see javax.servlet.http.HttpServlet#doGet(javax.servlet.http.HttpServletRequest,
	 *      javax.servlet.http.HttpServletResponse)
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		processRequest(request, response);
	}

	/**
	 * This method used for uploading process. To get the userImagesPath from orbionedirect.properties, after that image
	 * renamed with login usernumber and it will be written inside the user imagepath .
	 * 
	 * @param request HttpServletRequest
	 * @param response HttpServletResponse
	 * @throws ServletException , IOException
	 * @exception OnlineException
	 */
	public void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException
	{
		LOGGER.ctinfo("CTRND00288");
		SessionInfo sessionInfo = null;
		String isValidSession = null;
		SessionManager mSessionMan = SessionManager.getInstance(); /* crating instance of session manager */
		isValidSession = mSessionMan.validateSession(request);
		if (!"success".equals(isValidSession))
		{
			LOGGER.ctdebug("CTRND00196");
			String hybridVal = StringUtils.ensureExists(request.getParameter("isHybrid"));
			boolean hybridRequest = "H".equals(hybridVal);
			// Redirecting to logout url page if the session is invalid
			if (hybridRequest)
			{
				return;
			}
			forwardToLogoutPage(request, response);
		}

		sessionInfo = mSessionMan.getUserSessionInfo(request);
		try
		{
			String imageProcessAction = StringUtils.ensureExists(request.getParameter("imgHandle"), "GET_USER_IMAGE");
			String SessionID = sessionInfo.sessionId;
			String strLang = sessionInfo.mLanguage;
			LOGGER.ctdebug("CTRND00198", SessionID);
			request.setAttribute(FileUploadConstants.SESSIONID, SessionID);
			request.setAttribute(FileUploadConstants.SESSION, sessionInfo);
			// By default set the response type to text/html.
			response.setContentType("text/html");
			response.setHeader("Cache-Control", "no-cache");
			String actionClass = null;
			PortletAction action = null;
			ActionMapRegistry actionMapRegistry = ActionMapRegistry.getDefaultInstance();

			ActionMap actionMap = null;

			String product = null;
			String subproduct = null;
			String functionCode = null;
			String screenCode = null;
			String lastModified = null;
			product = request.getParameter(FrameworkConstants.PRODUCT_NAME);
			if (product == null)
				LOGGER.ctdebug("CTRND00199", FrameworkConstants.PRODUCT_NAME);

			subproduct = request.getParameter(FrameworkConstants.SUB_PRODUCT_NAME);
			if (subproduct == null)
				LOGGER.ctdebug("CTRND00200", FrameworkConstants.SUB_PRODUCT_NAME);

			functionCode = request.getParameter(JSPIOConstants.INPUT_FUNCTION_CODE);
			if (functionCode == null)
				LOGGER.ctdebug("CTRND00201", JSPIOConstants.INPUT_FUNCTION_CODE);

			screenCode = request.getParameter(FrameworkConstants.PAGE_CODE_TYPE);
			if (screenCode == null)
				LOGGER.ctdebug("CTRND00202", FrameworkConstants.PAGE_CODE_TYPE);
			// Getting the lastModified parameter for user image validation
			lastModified = request.getParameter("lastModified");

			try
			{
				actionMap = (ActionMap) actionMapRegistry.lookup(screenCode, product, subproduct, functionCode);
			} catch (Throwable exception)
			{
				LOGGER.cterror("CTRND00203", exception);
				String errMsg = MessageManager.getMessage(null, "LBL_ACTIONMAP_RETRIEVAL_ERROR", strLang, true);
				response.flushBuffer();
				response.getWriter().write(errMsg);
				return;
			}

			if (actionMap != null)
			{
				actionClass = (actionMap.getActionClass() == null) ? "com.intellectdesign.canvas.action.PortletAction"
						: actionMap.getActionClass();
			}

			action = (PortletAction) Class.forName(actionClass).newInstance();

			request.setAttribute(FormDefinitionConstants.IMAGE_PROCESS_ACTION, imageProcessAction);
			request.setAttribute("lastModified", lastModified);
			// Now check for the action
			if ("GET_USER_IMAGE".equals(imageProcessAction))
			{
				retrieveUserImage(request, response, sessionInfo, action, actionMap);
			} else if ("STORE_USER_IMAGE".equals(imageProcessAction))
			{

				storeUserImage(request, response, sessionInfo, action, actionMap);
			} else
			{
				// Unsupported action. So return an error response.
				LOGGER.cterror("CTRND00204");
				String errMsg = MessageManager.getMessage(null, "LBL_INVALID_IMAGE_HANDLE_ACTION", strLang, true);
				response.flushBuffer();
				response.getWriter().write(errMsg);
			}
		} catch (OnlineException el)
		{
			LOGGER.cterror("CTRND00205", el);
		} catch (Exception e)
		{
			LOGGER.cterror("CTRND00206", e);
		}
		LOGGER.ctinfo("CTRND00291");

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
			SessionManager sessMgr = SessionManager.getInstance();
			LOGGER.ctdebug("CTRND00491");
			sessMgr.routeToLogoutPage(request, response);
		} catch (Exception ex)
		{
			LOGGER.cterror("CTRND00490", ex);
		}
	}

	/**
	 * used to retrieve User Image
	 * 
	 * @param request
	 * @param response
	 * @param sessInfo
	 * @param action
	 * @param actionMap
	 * @throws OnlineException
	 */
	private void retrieveUserImage(HttpServletRequest request, HttpServletResponse response, SessionInfo sessInfo,
			PortletAction action, ActionMap actionMap) throws OnlineException
	{
		String strLang = sessInfo.mLanguage;
		try
		{
			action.executePortletAction(sessInfo, actionMap, request);
		} catch (Exception ex)
		{
			LOGGER.cterror("CTRND00207", ex);
		}
		try
		{
			String result = (String) request.getAttribute("RESULT");
			if ("SUCCESS".equals(result))
			{
				// If retrieval success then check for the device type for showing image.
				if (DeviceCategory.MOBILE.getCode().equals(sessInfo.deviceType)
						|| DeviceCategory.TABLET.getCode().equals(sessInfo.deviceType))
				{
					String jsonObject = null;
					String imageDataString = (String) request.getAttribute("IMAGE_DATA");
					String status = (String) request.getAttribute("STATUS");
					String lastModified = (String) request.getAttribute("LAST_MODIFIED");
					String serverSyncTime = (String) request.getAttribute("SERVER_SYNCTIME");
					HashMap resultMap = new HashMap();
					HashMap dataMap = new HashMap();
					// Set the proper content type for the file extension
					response.setContentType("application/json");
					response.setHeader("Expires", "0");
					response.setHeader("Cache-Control", "private, must-revalidate");
					response.setHeader("Pragma", "private");

					resultMap.put("success", "true");
					dataMap.put("imageData", imageDataString);
					dataMap.put("lastModified", lastModified);
					dataMap.put("STATUS", status);
					dataMap.put("SERVER_SYNCTIME", serverSyncTime);
					resultMap.put("response", dataMap);
					/**
					 * Converting the given map to a jsonstring
					 */
					jsonObject = HashMapToJSONConverter.convertHashMapToJSONFormat(resultMap);
					response.flushBuffer();
					response.getWriter().write(jsonObject);
					return;
				} else
				{
					byte[] imageData = (byte[]) request.getAttribute("IMAGE_DATA");
					String contentType = (String) request.getAttribute("contentType");
					// Set the proper content type
					response.setContentType(contentType);
					response.setHeader("Expires", "0");
					response.setHeader("Cache-Control", "private, must-revalidate");
					response.setHeader("Pragma", "private");
					response.getOutputStream().write(imageData);
					response.getOutputStream().flush();
				}
			} else if ("FAILURE".equals(result))
			{
				LOGGER.cterror("CTRND00488");
				String errMsg = MessageManager.getMessage(null, "LBL_IMAGE_RETRIEVE_ERROR", strLang, true);
				response.flushBuffer();
				response.getWriter().write(errMsg);
			} else
			{
				LOGGER.cterror("CTRND00489");
				String errMsg = MessageManager.getMessage(null, "LBL_INVALID_IMAGE_PROCESS_ACTION", strLang, true);
				response.flushBuffer();
				response.getWriter().write(errMsg);
			}
		} catch (Exception ex)
		{
			LOGGER.cterror("CTRND00209", ex);
			throw new OnlineException(ex);
		}
	}

	/**
	 * Invoked from doPost if the action is equivalent to storing the user image
	 * 
	 * @param request
	 * @param response
	 * @param sessInfo
	 * @param action
	 * @param actionMap
	 * @throws IOException
	 * @throws OnlineException
	 */
	private void storeUserImage(HttpServletRequest request, HttpServletResponse response, SessionInfo sessInfo,
			PortletAction action, ActionMap actionMap) throws IOException, OnlineException
	{
		// String strGCIF = sessInfo.sCustNo;
		String strLang = sessInfo.mLanguage;
		// String userNumber = sessInfo.userNo;
		HashMap resultMap = new HashMap();
		HashMap dataMap = new HashMap();
		resultMap.put("data", dataMap);
		try
		{
			ConfigurationManager configMgr = ConfigurationManager.getInstance();

			long contentLength = Long.parseLong(request.getHeader("Content-Length"));
			// Basic validation to be done here.
			long allocatedSize = Long.parseLong(configMgr.getCompPrefDescriptor().getUserImageSize());

			if (contentLength > allocatedSize)
			{
				// Validation failed. The user image size is greater than that which can be supported. So reject the
				// same and thrown an error.
				resultMap.put("success", false);
				// dataMap.put("response", resourceBundle.getString("LBL_PICTURE_SIZE_EXCEEDS"));
				dataMap.put("response", MessageManager.getMessage(null, "LBL_PICTURE_SIZE_EXCEEDS", strLang, true));
				LOGGER.cterror("CTRND00210");
			} else
			{
				// Send the request to the server to persist the image
				byte[] imageStream = getImageStream(request);
				request.setAttribute("FILE_STREAM", imageStream);
				action.executePortletAction(sessInfo, actionMap, request);
				String result = (String) request.getAttribute("RESULT");

				if ("SUCCESS".equals(result))
				{
					resultMap.put("success", true);
					dataMap.put("response",
							MessageManager.getMessage(null, "LBL_PICTURE_UPDATED_SUCCESFULLY", strLang, true));
					String jsonString = HashMapToJSONConverter.convertHashMapToJSONFormat(resultMap);
					LOGGER.ctdebug("CTRND00212", jsonString);
				} else if ("FAILURE".equals(result))
				{
					Boolean isVaildExtn = (Boolean) request.getAttribute("VALID_EXTENSION");
					if (!isVaildExtn)
					{
						resultMap.put("success", false);
						dataMap.put("response",
								MessageManager.getMessage(null, "LBL_PICTURE_INVALIDEXTENSION", strLang, true));
						LOGGER.cterror("CTRND00211");
					} else
					{
						resultMap.put("success", false);
						dataMap.put("response", MessageManager.getMessage(null, "LBL_PICTURE_ERROR", strLang, true));
						LOGGER.cterror("CTRND00213");
					}
				} else
				{
					resultMap.put("success", false);
					resultMap.put("response",
							MessageManager.getMessage(null, "LBL_INVALID_IMAGE_PROCESS_ACTION", strLang, true));
					LOGGER.cterror("CTRND00483");
				}

			}
		} catch (OnlineException e)
		{
			resultMap.put("success", false);
			dataMap.put("response", MessageManager.getMessage(null, "LBL_PICTURE_ERROR", strLang, true));
			LOGGER.cterror("CTRND00213", e);
		} catch (IOException e)
		{
			resultMap.put("success", false);
			dataMap.put("response", MessageManager.getMessage(null, "LBL_PICTURE_SIZE_EXCEEDS", strLang, true));
			LOGGER.cterror("CTRND00213", e);
		} catch (Exception e)
		{
			resultMap.put("success", false);
			dataMap.put("response", MessageManager.getMessage(null, "LBL_PICTURE_ERROR", strLang, true));
			LOGGER.cterror("CTRND00213", e);
		} finally
		{
			String jsonString = HashMapToJSONConverter.convertHashMapToJSONFormat(resultMap);
			response.flushBuffer();
			response.getWriter().write(jsonString);
		}
	}

	/**
	 * Retrieves the image stream from the request.
	 * 
	 * @param request
	 * @return byte[]
	 * @throws IOException
	 */
	private byte[] getImageStream(HttpServletRequest request) throws IOException
	{
		MultipartParser mp = new MultipartParser(request, 10 * 1024 * 1024); // 10MB
		Part part;
		byte[] imageStream = null;
		FilePart filePart = null;
		while ((part = mp.readNextPart()) != null)
		{
			if (part.isFile())
			{
				// it's a file part
				filePart = (FilePart) part;
				break;
			}
		}
		if (filePart != null)
		{
			ByteArrayOutputStream outputStream = new ByteArrayOutputStream(1024);
			filePart.writeTo(outputStream);
			imageStream = outputStream.toByteArray();
			request.setAttribute("USER_PROVIDED_FILE_NAME", filePart.getFileName());
		}
		return imageStream;
	}

	private static final Logger LOGGER = Logger.getLogger(PictureUploadServlet.class);
}
