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

package com.intellectdesign.canvas.formdefinition.utility;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This class retrives the uploaded file for the reference the unique reference number provided as parameter 
 * to read the data in the file uploaded.
 * 
 * @version 1.0
 */
public class FileUploadRetriever
{
	private static final Logger LOGGER = Logger.getLogger(FileUploadRetriever.class);

	/**
	 * This method retrieves the uploaded files for the info attachmentRefNo, userNo and GCIF 
	 * passed as parameters. 
	 * 
	 * The method first chethe parameterscks the status of the file in DB using and then retrieves the file 
	 * from Upload Temp Location in the server. 
	 * 
	 * <p>If the file info in DB or the file object in Temp folder does not exist, 
	 * the method throws the appropriate ProcessingErrorException to be captured by the invoking file.
	 * 
	 * @param attachmentRefNo - List of string Reference Number of the files uploaded 
	 * @param userNo - String value of the User No
	 * @param GCIF - String value of the GCIF
	 * @return UploadedFiles - Hashmap containing the ReferenceNumber and the File associated with it
	 * 
	 * @throws ProcessingErrorException
	 * */
	public HashMap<String, FileInfo> getUploadedFiles(List<String> attachmentRefNo, String userNo, String GCIF)
			throws ProcessingErrorException
	{
		LOGGER.ctinfo("CTFDF00038");
		LOGGER.ctdebug("CTFDF00039", attachmentRefNo);
		File fileReturn = null;
		String filesPath = null;
		HashMap fileDetailsMap = null;
		FileInfo filedetails = null;
		HashMap<String, FileInfo> fileMap = null;
		fileDetailsMap = new HashMap();
		fileMap = new HashMap<String, FileInfo>();
		FileDetailsDAO fileDetailsDAO = null;
		ConfigurationManager configMgr = null;

		try
		{
			configMgr = ConfigurationManager.getInstance();
			/**
			 * Reading the value for the property FW_Upload_Temp_Folder from Orbionedirect.properties to get the
			 * filepath to upload
			 */
			filesPath = configMgr.getCompPrefDescriptor().getFileUploadTempFolderPath();
			fileDetailsDAO = new FileDetailsDAO();
			if (attachmentRefNo.size() > 0)
			{
				for (int i = 0; i < attachmentRefNo.size(); i++)
				{
					if (attachmentRefNo.get(i) != null)
					{
						if (userNo != null && !userNo.trim().equals(""))
						{
							if (GCIF != null && !GCIF.trim().equals(""))
							{
								/**
								 * FileDetailsDAO fetchFileDetails(attachmentRefNo,userNo, GCIF) method It connect to
								 * DataBase through IBatics and DB Operation done to retrive the file details.The reply
								 * is retrieved in the format of HashMap.
								 */
								fileDetailsMap = fileDetailsDAO.fetchFileDetails(attachmentRefNo.get(i), userNo, GCIF);
								LOGGER.ctdebug("CTFDF00040", fileDetailsMap);
								// Checking for the returned fileDetailsMap is empty or
								// not
								if (!fileDetailsMap.isEmpty())
								{

									// Retreving the attachment filename,filesize and
									// encryptedfilename from fileDetailsMap.
									if (fileDetailsMap.get("ATTACHMENT_FILE_NAME") != null
											&& fileDetailsMap.get("ATTACHMENT_REF_FILE_NAME") != null
											&& fileDetailsMap.get("ATTACHMENT_FILE_SIZE") != null)
									{
										// Checking for the file using encryptedfilename
										// on the servers's file uploadpath
										fileReturn = new File(filesPath + File.separator
												+ fileDetailsMap.get("ATTACHMENT_REF_FILE_NAME"));
										/**
										 * Checking for the file using encrypted file name ,if exists creating the
										 * FileInfo pojo instance to set the file attributes
										 */
										if (fileReturn.exists() && fileReturn.isFile())
										{
											filedetails = new FileInfo();
											filedetails.setFilename(fileDetailsMap.get("ATTACHMENT_FILE_NAME")
													.toString());
											filedetails.setFilesize(fileDetailsMap.get("ATTACHMENT_FILE_SIZE")
													.toString());
											filedetails.setEncryptedfilename(fileDetailsMap.get(
													"ATTACHMENT_REF_FILE_NAME").toString());
											filedetails.setFileobj(fileReturn);
											filedetails.setAttachmentuploadeddate(fileDetailsMap.get(
													"ATTACHMENT_UPLOADED_DATE").toString());
											fileMap.put(attachmentRefNo.get(i), filedetails);
										}
									}
								}
							}
						}
					}
				}
			}

		} catch (Exception ex)
		{
			LOGGER.cterror("CTFDF00041", ex);
			throw new ProcessingErrorException(ex.getMessage());
		}
		LOGGER.ctdebug("CTFDF00042", fileMap);
		LOGGER.ctinfo("CTFDF00043");
		return fileMap;
	}

	/**
	 * This method deletes the uploaded files info from the DB and the files from the Temp Upload location.
	 * 
	 * <p>If the file info does not exist, the method throws the appropriate ProcessingErrorException 
	 * with the message as File Not Present
	 * 
	 *  
	 * @param attachmentRefNo - String value of Reference No of the uploaded file
	 * @param userNo - String value of the UserNo
	 * @param GCIF - String value of the GCIF
	 * @return deletedUploadFiles - Hashmap of Reference No and the deleted upload files 
	 * 
	 * @throws ProcessingErrorException
	 * */
	public HashMap<String, List> deleteUploadedFiles(List<String> attachmentRefNo, String userNo, String GCIF)
			throws ProcessingErrorException
	{
		HashMap<String, FileInfo> resultFileMap = null;
		HashMap<String, List> fileDetailsMap = null;
		List fileDetailsList = null;
		LOGGER.ctinfo("CTFDF00044");
		LOGGER.ctdebug("CTFDF00045", attachmentRefNo);
		try
		{
			resultFileMap = getUploadedFiles(attachmentRefNo, userNo, GCIF);
			fileDetailsMap = new HashMap<String, List>();
			if (resultFileMap != null && !resultFileMap.isEmpty())
			{
				Set<String> keySet = null;
				FileDetailsDAO fileDetailsDAO = null;
				String key = null;
				File file = null;
				FileInfo filedetails = null;
				keySet = resultFileMap.keySet();
				fileDetailsList = new ArrayList<HashMap>();
				Iterator<String> keyIterator = keySet.iterator();
				fileDetailsDAO = new FileDetailsDAO();
				while (keyIterator.hasNext())
				{
					key = keyIterator.next();
					filedetails = resultFileMap.get(key);
					fileDetailsList = fileDetailsDAO.deleteAttachFiles(key, userNo, GCIF);
					file = filedetails.getFileobj();
					if (file.exists() && file.isFile())
					{
						file.delete();
						LOGGER.ctdebug("CTFDF00046", filedetails.getEncryptedfilename());
					} else
					{
						LOGGER.ctdebug("CTFDF00047", filedetails.getEncryptedfilename());
					}
					fileDetailsMap.put(key, fileDetailsList);
					LOGGER.ctdebug("CTFDF00048", fileDetailsList);
				}
			}
			LOGGER.ctdebug("CTFDF00049", resultFileMap);
		} catch (Exception ex)
		{
			LOGGER.cterror("CTFDF00050", ex);
			throw new ProcessingErrorException(ex.getMessage());
		}
		LOGGER.ctinfo("CTFDF00051");
		return fileDetailsMap;
	}
}
