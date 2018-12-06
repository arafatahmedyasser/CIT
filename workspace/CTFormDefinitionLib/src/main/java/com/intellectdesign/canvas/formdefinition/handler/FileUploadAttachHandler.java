/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.*/

package com.intellectdesign.canvas.formdefinition.handler;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.constants.common.JSPIOConstants;
import com.intellectdesign.canvas.constants.util.TIConstants;
import com.intellectdesign.canvas.constants.util.TRConstants;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.formdefinition.FormDefinitionConstants;
import com.intellectdesign.canvas.formdefinition.FormDefinitionException;
import com.intellectdesign.canvas.formdefinition.FormDefinitionInstruction;
import com.intellectdesign.canvas.formdefinition.utility.FileUploadData;
import com.intellectdesign.canvas.handler.SimpleRequestHandler;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This class is responsible for checking the upload file mime types and 
 * then uploading. On successful upload, it logs the file upload status using {@link FileUploadData}   
 * 
 * @version 1.0
 */
public class FileUploadAttachHandler extends SimpleRequestHandler
{

	private static final Logger logger = Logger.getLogger(FileUploadAttachHandler.class);
	private static int VER_NO_POS = 16;
	private static int TXN_STATUS_POS = 15;
	private static String HASH_MAP_POSITION = "26";

	/**
	 * This method checkes the upload file mime type; if valid, logs the file info 
	 * 
	 * @see com.intellectdesign.canvas.handler.SimpleRequestHandler#processRequest(java.lang.Object)
	 * @param input
	 */
	@Override
	public ReplyObject processRequest(Vector inputVector) throws ProcessingErrorException
	{
		HashMap fileParams = null;
		HashMap<String, String> passParams = null;
		HashMap returnMap = null;
		Map paramsMap = getAugmentedCachedHashMap(inputVector);
		ExtReplyObject replyObject = null;
		String action = null;
		String strAttachmentRefNo = null;
		FileUploadData fileAttachData = null;
		String strGCIF = (String) inputVector.get(2);
		String srtUserNo = (String) inputVector.get(3);
		logger.ctdebug("CTFDF00001", strGCIF, srtUserNo);
		replyObject = new ExtReplyObject();
		replyObject.headerMap = new HashMap();
		HashMap<String, Object> resultMap = null;
		try
		{

			logger.ctdebug("CTFDF00002");
			List<HashMap<String, Object>> fileDetails = (List) paramsMap.get(FormDefinitionConstants.FILE_DETAILS);
			action = (String) paramsMap.get(JSPIOConstants.INPUT_ACTION);
			logger.ctdebug("CTFDF00003", action);

			fileAttachData = new FileUploadData();

			/**
			 * File Attach details insertion called through 'FILEATTACH_ACTION' action
			 */

			if ("FILE_ATTACH_ACTION".equals(action))
			{
				if (fileDetails != null && fileDetails.size() > 0)
				{
					for (int i = 0; i < fileDetails.size(); i++)
					{
						fileParams = fileDetails.get(i);
						/**
						 * Write the file content (byte[]) in to the file.
						 * */
						// Retreiving the Attachment Reference Number in the InputVector
						strAttachmentRefNo = (String) fileParams.get("ATTACHMENT_REF_NUM");
						BufferedOutputStream fileWriter = null;
						String tempPath = "";
						try
						{
							ConfigurationManager configMgr = ConfigurationManager.getInstance();
							tempPath = configMgr.getCompPrefDescriptor().getFileUploadTempFolderPath() + File.separator
									+ fileParams.get("ATTACHMENT_REF_FILE_NAME");
							File dir = new File(configMgr.getCompPrefDescriptor().getFileUploadTempFolderPath());
							if (!dir.isDirectory())
							{
								dir.mkdirs();
								logger.ctdebug("CTFDF00004");
							}
							fileWriter = new BufferedOutputStream(new FileOutputStream(tempPath));
							fileWriter.write((byte[]) ((HashMap) fileParams.get("FILE_CONTENT")).get("BYTES"));
							fileWriter.flush();
						} catch (Exception e)
						{
							logger.cterror("CTFDF00005", e);
							throw new ProcessingErrorException(e);
						} finally
						{
							/**
							 * Closing the byte array output stream.
							 * */
							if (fileWriter != null)
							{
								fileWriter.close();
							}
						}
						
						//Setting the File to be not executable to avoid any unintended execution
						File aFile = new File(tempPath);
						aFile.setExecutable(false);

						/**
						 * Validating the mime type of the uploaded file. If it is not valid, returing the error
						 * message.
						 * */
						List validMimeTypes = processGetMimeTypesFor((HashMap) paramsMap);
						resultMap = new HashMap<String, Object>();
						resultMap.put("originalFileName", fileParams.get("ATTACHMENT_FILE_NAME"));
						resultMap.put("enryptedFileName", fileParams.get("ATTACHMENT_REF_FILE_NAME"));
						resultMap.put("attachmentRefNumber", fileParams.get("ATTACHMENT_REF_NUM"));
						resultMap.put("FileSize", fileParams.get("ATTACHMENT_FILE_SIZE"));
						resultMap.put("Supported file types", validMimeTypes);

						try
						{
							eu.medsea.mimeutil.MimeUtil
									.registerMimeDetector("eu.medsea.mimeutil.detector.MagicMimeMimeDetector");
							eu.medsea.mimeutil.MimeUtil
									.registerMimeDetector("eu.medsea.mimeutil.detector.ExtensionMimeDetector");
							eu.medsea.mimeutil.MimeUtil
									.registerMimeDetector("eu.medsea.mimeutil.detector.OpendesktopMimeDetector");
							Collection mimeTypes = eu.medsea.mimeutil.MimeUtil.getMimeTypes(tempPath);
							boolean isValid = false;
							if (mimeTypes != null && !mimeTypes.isEmpty())
							{
								Iterator it = mimeTypes.iterator();
								while (it.hasNext() && !isValid)
								{
									isValid = validMimeTypes.contains(it.next());
								}
							}
							if (!isValid)
							{
								/**
								 * Deleting the uploaded file since it is not valid file.
								 * */
								File tmpFile = new File(tempPath);
								if (tmpFile.isFile())
								{
									tmpFile.delete();
								}

								resultMap = new HashMap<String, Object>();
								resultMap.put("success", "false");
								resultMap.put("error", "File type not supported");
								replyObject.headerMap.put("FileData", resultMap);
								return replyObject;
							} else
							{
								resultMap.put("success", "true");
								replyObject.headerMap.put("FileData", resultMap);
							}
						} catch (SecurityException e)
						{
							/**
							 * Uploaded file type is not valid and it is not supported.
							 * */
							logger.cterror("CTFDF00005", e);

							resultMap = new HashMap<String, Object>();
							resultMap.put("success", "false");
							resultMap.put("error", "SecurityException occured while uploading the file.");
							replyObject.headerMap.put("FileData", resultMap);
							return replyObject;
						} catch (NullPointerException e)
						{
							/**
							 * Uploaded file type is not valid and it is not supported.
							 * */
							logger.cterror("CTFDF00005", e);

							resultMap = new HashMap<String, Object>();
							resultMap.put("success", "false");
							resultMap.put("error", "Exception occured while uploading the file.");
							replyObject.headerMap.put("FileData", resultMap);
							return replyObject;
						}

						// Retreiving the Attachment Reference File Name(Encrypted)
						String strRefFileName = (String) fileParams.get("ATTACHMENT_REF_FILE_NAME");
						// Retreiving the Attachment File Name
						String strFileName = (String) fileParams.get("ATTACHMENT_FILE_NAME");
						// Retreiving the Attachment File Size
						String strFileSize = (String) fileParams.get("ATTACHMENT_FILE_SIZE");

						passParams = new HashMap<String, String>();
						// Putting the file attibute information on map which will
						// be used by the updateFileStatus method later.
						passParams.put("ATTACHMENT_REF_NUM", strAttachmentRefNo);
						passParams.put("ATTACHMENT_FILE_NAME", strFileName);
						passParams.put("ATTACHMENT_REF_FILE_NAME", strRefFileName);
						passParams.put("ATTACHMENT_FILE_SIZE", strFileSize);
						passParams.put("OD_GCIF", strGCIF);
						passParams.put("OD_MAKER_ID", srtUserNo);

						logger.ctdebug("CTFDF00006");
						/**
						 * This method connect to DataBase through IBatics and perform the DB Operation to update the
						 * file imformation which expect the hashmap parameter. The return type will be an hashmap.
						 * 
						 * @Param passParams
						 */
						returnMap = fileAttachData.updateFileStatus(passParams);
						logger.ctdebug("CTFDF00007", returnMap);

					}
				}
			} else
			{
				logger.ctdebug("CTFDF00008", action);
			}

		} catch (Exception e)
		{
			logger.cterror("CTFDF00009", e);
			String tempPath = "";
			try
			{
				if (fileParams != null)
				{
					ConfigurationManager configMgr = ConfigurationManager.getInstance();
					tempPath = configMgr.getCompPrefDescriptor().getFileUploadTempFolderPath() + File.separator
							+ fileParams.get("ATTACHMENT_REF_FILE_NAME");
				}
				File tmpFile = new File(tempPath);
				if (tmpFile.isFile())
				{
					tmpFile.delete();
				}
			} catch (Exception e1)
			{
				logger.cterror("CTFDF00009", e1);
			}
			throw new ProcessingErrorException(e);
		}
		logger.ctdebug("CTFDF00010", replyObject);
		return replyObject;

	}

	/**
	 * This method gets the cached HashMap from InputVector. 
	 * Same as getJSPHashMap method except that other transaction related data is 
	 * also populated in the return HashMap.
	 * 
	 * @param inputVector - Vector object containing TI framework defined fields in positions ranging from 0 to 28+
	 * 
	 * @return Map - Cached HashMap with additional data from Vector
	 */
	protected static Map getAugmentedCachedHashMap(Vector inputVector)
	{
		HashMap map = getFieldsHashMapFromVector(inputVector);
		map.put(JSPIOConstants.INPUT_REFERENCE_NO, inputVector.get(TIConstants.REFERENCE_NO_POS));
		map.put(TRConstants.VER_NO, inputVector.get(VER_NO_POS));
		map.put(TIConstants.TXN_STATUS, inputVector.get(TXN_STATUS_POS));

		map.put(TIConstants.CHANNEL_ID, inputVector.get(10));

		return map;
	}

	/**
	 * This refactored method gets the jspfields hashmap from vector either from the 26th index in the vector, 
	 * if not get from the last but one the position from the vector
	 * 
	 * @param inputVector - Vector object containing TI framework defined fields in positions ranging from 0 to 28+
	 * @return Map - hashmap present in the vector
	 */
	private static HashMap getFieldsHashMapFromVector(Vector inputVector)
	{
		HashMap map = new HashMap();
		Object cachedHashMapObj = inputVector.get(Integer.parseInt(HASH_MAP_POSITION) + 1);
		if (cachedHashMapObj instanceof HashMap)
			map = (HashMap) cachedHashMapObj;
		else
		{
			cachedHashMapObj = inputVector.get(inputVector.size() + TIConstants.REL_CACHEDMAP_INDEX_IN_VECTOR);
			if (cachedHashMapObj instanceof HashMap)
				map = (HashMap) cachedHashMapObj;
		}
		return map;
	}

	/**
	 * This method finds the valid file formats for upload as per form item definition configuration and 
	 * provides the corresponding list of valid mime types to verify the uploaded file mime types 
	 * 
	 * @param paramsMap - Hashmap of the cached client parameters
	 * @return MimeTypes -  List of supported mime types for validation
	 */

	private List processGetMimeTypesFor(HashMap paramsMap)
	{
		logger.ctinfo("CTFDF00011");
		List uploadConfigFileFormatsList = null;
		List<String> formList = null;
		List uploadFileFormatsList = new ArrayList();
		HashMap formDefnMap = null;
		String formId = (String) paramsMap.get("Form-Id");
		String itemId = (String) paramsMap.get("Item-Id");
		try
		{
			formList = new ArrayList<String>();
			formList.add(formId);
			FormDefinitionInstruction formInstr = new FormDefinitionInstruction();
			formDefnMap = (HashMap) formInstr.getFormMetaDataForExport(formList);
			uploadConfigFileFormatsList = (List) ((HashMap) formDefnMap.get(formId + "|||" + itemId))
					.get("SUPPORTED_MIME_TYPES");
			if (uploadConfigFileFormatsList != null && uploadConfigFileFormatsList.size() > 0)
			{
				for (int i = 0; i < uploadConfigFileFormatsList.size(); i++)
				{
					uploadFileFormatsList.add(((HashMap) uploadConfigFileFormatsList.get(i)).get("MIME_TYPE"));
				}
			}

		} catch (FormDefinitionException formDefException)
		{
			logger.cterror("CTFDF00012", formDefException);
		}
		logger.ctinfo("CTFDF00011");
		return uploadFileFormatsList;
	}

}
